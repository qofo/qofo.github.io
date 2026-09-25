---
title: "터미널을 닫아도 작업은 이어진다: proot 밖 tmux에 에이전트 세션 두기"
slug: "agent-session-outside-proot"
date: 2026-09-25
weight: 11
series: ["스마트폰으로 서버 만들기"]
tags: ["tmux", "PRoot", "Termux", "SSH", "Session", "Claude Code"]
description: "1편에 적은 목표는 리눅스를 올리고 AI 코딩 에이전트를 붙여 24시간 돌리는 것이었다. 6편에서 블로그와 터널은 터미널과 무관하게 돌게 됐다. 그런데 정작 그 코드를 고치는 에이전트 세션은 그대로였다."
---
[1편](01-ubuntu-on-galaxy-note-fe.md)에 적은 목표는 리눅스를 올리고 AI 코딩 에이전트를 붙여 24시간 돌리는 것이었다. [6편](06-supervisor-postmortem.md)에서 블로그와 터널은 터미널과 무관하게 돌게 됐다. 그런데 정작 그 코드를 고치는 에이전트 세션은 그대로였다. SSH 터미널을 닫으면 하던 일이 통째로 사라진다.

이 글은 그 세션을 터미널 바깥으로 꺼내 명령 하나(`claude-session`)로 만든 기록이다.

---

## 1. 데몬의 해법을 그대로 쓸 수 없다

[6편](06-supervisor-postmortem.md)에서 감시 데몬을 살린 것은 `setsid`였다. 새 세션을 만들어 제어 터미널을 떼어 내면 Ctrl+C도 로그아웃 신호도 닿지 못한다. 출력이 필요 없는 프로세스에는 이것으로 충분하다.

대화형 세션에는 조건이 하나 더 붙는다. **다시 붙을 수 있어야 한다.** `setsid`로 떼어 낸 프로세스는 살아는 있지만 화면이 없다. 진행 상황을 볼 수도, 다음 지시를 넣을 수도 없다. 필요한 것은 터미널을 붙였다 뗐다 하는 장치, 곧 터미널 멀티플렉서다.

## 2. 어느 층에 설치하느냐가 수명을 정한다

멀티플렉서를 우분투 안에 설치하면 아무 소용이 없다.

```
Android 9
└─ Termux                      ← sshd(8022). 여기서 만든 tmux 서버는 로그인과 무관하다
   └─ proot-distro: Ubuntu     ← 여기서 만든 tmux 서버는 로그인 셸과 함께 죽는다
      └─ 에이전트 세션
```

[3편 4절](03-proot-constraints.md)에서 정리한 `--kill-on-exit` 때문이다. proot는 로그인 셸이 끝날 때 그 세션에서 태어난 프로세스를 전부 함께 종료한다. tmux 서버도 예외가 아니다. 세션을 지켜 줄 장치가 세션과 함께 죽는다.

그래서 tmux는 Termux 쪽에 설치했다. 우분투 안에는 tmux가 없고, `which tmux`가 가리키는 것도 Termux 바이너리다. [3편 6절](03-proot-constraints.md)에서 정리한 PATH 혼재 그대로다.

```bash
$ which tmux
/data/data/com.termux/files/usr/bin/tmux
$ ls /usr/bin/tmux
ls: cannot access '/usr/bin/tmux': No such file or directory
```

설치도 proot 밖에서 했다. Termux의 `apt-get`을 proot 안에서 돌리면 경로 해석이 꼬일 수 있다. [5편](05-termux-boot-supervisor.md)에서 쓴 `termux-job-scheduler`를 일회성 작업으로 다시 썼다. 예약한 스크립트는 proot 밖에서 실행되므로 Termux의 패키지 관리자가 제자리에서 돈다.

```
The following NEW packages will be installed:
  tmux
Get:1 https://termux.librehat.com/apt/termux-main stable/main aarch64 tmux aarch64 3.7c [386 kB]
```

## 3. 잘못된 자리에서 시작하는 것을 막는다

스크립트는 주석까지 스물여섯 줄이다. 주석 일부를 줄여 옮기면 이렇다.

```sh
#!/data/data/com.termux/files/usr/bin/sh
PREFIX=/data/data/com.termux/files/usr
TMUX_BIN=$PREFIX/bin/tmux
SESSION=claude

# Termux는 로그인 셸에서만 이 값을 설정한다(profile.d/tmux.sh). 세션을 만드는 셸과
# 나중에 다시 붙는 셸이 같은 소켓을 찾도록 값을 고정한다.
export TMUX_TMPDIR=${TMUX_TMPDIR:-$PREFIX/var/run}

if [ "$(awk '/^TracerPid/{print $2}' /proc/$$/status)" != "0" ]; then
    echo "claude-session: run this from the Termux shell, not inside proot ('exit' first)." >&2
    exit 1
fi

if "$TMUX_BIN" has-session -t "$SESSION" 2>/dev/null; then
    exec "$TMUX_BIN" attach-session -t "$SESSION"
fi

exec "$TMUX_BIN" new-session -s "$SESSION" \
    "$PREFIX/bin/proot-distro login ubuntu -- /bin/bash -lc 'cd /root && claude --continue; exec bash -l'"
```

가드에 쓴 `TracerPid`는 [3편 1절](03-proot-constraints.md)에서 "proot 안인지 판별하는 값"으로 정리해 둔 것이다. 그 관찰을 그대로 옮겼다. 잘못된 자리에서 실행하면 거절한다.

```
$ /root/termux/claude-session.sh
claude-session: run this from the Termux shell, not inside proot ('exit' first).
exit=1
```

Termux의 `~/.bashrc`에는 별칭 한 줄을 넣어 두었다. 쓰는 방법은 이렇다.

```
SSH 접속 → (proot에 들어가기 전) Termux 셸에서:  claude-session
  → tmux 안에서 에이전트가 직전 대화를 이어받는다
  → 터미널을 그냥 닫아도, Ctrl-b d 로 빠져나가도 계속 실행된다
다시 접속해서 claude-session → 같은 세션에 다시 붙는다
```

## 4. 소켓 자리가 두 번 어긋난다

tmux 클라이언트는 소켓 파일로 서버를 찾는다. 이 자리가 두 번 어긋났다.

**첫째, `TMUX_TMPDIR`은 로그인 셸에서만 설정된다.**

```bash
$ cat $PREFIX/etc/profile.d/tmux.sh
export TMUX_TMPDIR=/data/data/com.termux/files/usr/var/run
```

`profile.d`는 로그인 셸이 읽는다. 작업 예약으로 띄운 셸에는 이 값이 없어서 tmux가 `TMPDIR` 아래를 쓴다. 첫 프로브에서 세션은 만들어졌는데 소켓이 엉뚱한 곳에 생긴 것이 그 때문이다.

```
runner TracerPid=0 uid=10283
new-session exit=0
claudetest: 1 windows (created Sat Sep 19 03:36:04 2026)
socket: ls: cannot access '/data/data/com.termux/files/usr/tmp/tmux-10283/default': No such file or directory
```

나중에 로그인 셸에서 다시 붙으려 하면 `var/run` 쪽을 보므로 세션을 찾지 못한다. 스크립트에서 값을 고정해 막았다. `${TMUX_TMPDIR:-...}`로 두어, 로그인 셸에서 이미 설정돼 있으면 그 값을 따른다.

**둘째, 소켓 디렉터리 이름에 uid가 들어간다.** 이름은 `tmux-<uid>`인데, 이 폰에는 uid가 두 개다. Termux 쪽은 앱 uid이고, proot 안은 [3편 2절](03-proot-constraints.md)의 가짜 root라 0이다. 같은 `TMUX_TMPDIR`을 줘도 우분투 안에서는 없는 디렉터리를 본다.

```bash
# 우분투(proot) 안에서
$ TMUX_TMPDIR=/data/data/com.termux/files/usr/var/run tmux list-sessions
error connecting to /data/data/com.termux/files/usr/var/run/tmux-0/default (No such file or directory)

$ ls -d /data/data/com.termux/files/usr/var/run/tmux-*
/data/data/com.termux/files/usr/var/run/tmux-0
/data/data/com.termux/files/usr/var/run/tmux-10283
```

안에서 이 세션을 들여다보려면 `-S`로 소켓 경로를 직접 대야 한다. 가짜 root는 파일 권한만이 아니라 uid로 이름 붙는 모든 경로에 흔적을 남긴다.

## 5. 검증

만들 당시 Termux 쪽 tmux 서버에서 확인한 값이다.

| 확인 | 값 | 뜻 |
|:---|:---|:---|
| `TracerPid` | 0 | proot 밖에서 돈다 |
| `ppid` | 1 | 부모가 init이다. 나를 띄운 셸과 무관하다 |
| `sid` | 자기 자신 | 자기 세션의 리더다 |
| `tty_nr` | 0 | 제어 터미널이 없다 |

그 안에서 proot 로그인과 작업이 계속 유지되는 것도 함께 봤다.

정리하다가 하나 더 나왔다. 테스트용 tmux 서버를 `kill`했더니 그 안의 proot와 `sleep`이 고아로 남았다.

```
테스트 tmux 서버(3738) 종료
 3741 .../proot --kill-on-exit --link2symlink ...      ← 아직 살아 있다
```

proot가 SIGHUP을 무시하기 때문이다. [6편](06-supervisor-postmortem.md)에서 프로세스가 **어디에서 태어나는지**를 배웠다면, 여기서는 **죽일 때도 한 겹씩 확인해야 한다**는 것을 배웠다. 남은 프로세스를 따로 종료하고서야 정리가 끝났다.

당시 확인하지 못한 것도 있다. 붙었다 떼는 동작은 실제 터미널이 없어 시험하지 못했고, 글에 "될 것"이라고 적을 수는 없었다. 답은 나흘 뒤에 나왔다. 오늘 세션 목록은 이렇다.

```
$ tmux -S .../tmux-10283/default list-sessions -F '#{session_name} attached=#{session_attached} created=#{t:session_created}'
claude attached=0 created=Mon Sep 21 20:23:34 2026
```

9월 21일 저녁에 만든 세션이 붙은 클라이언트 없이(`attached=0`) 나흘째 살아 있다. 만든 터미널은 이미 없다. `claude-session`을 다시 실행하면 이 세션으로 돌아간다.

## 6. 한계

- **재부팅하면 사라진다.** tmux 서버도 프로세스다. [5편](05-termux-boot-supervisor.md)·[6편](06-supervisor-postmortem.md)의 3층 자동 시작이 되살리는 것은 서비스뿐이고, 에이전트 세션은 사람이 다시 만들어야 한다. 지금 세션도 9월 21일 재부팅 뒤에 새로 만든 것이다.
- **같은 대화를 두 곳에서 열면 안 된다.** 스크립트는 직전 대화를 이어받게 실행한다. tmux 안과 밖에서 동시에 열면 한 기록에 두 프로세스가 쓴다. 그래서 세션이 이미 있으면 새로 만들지 않고 붙기만 한다.
- **[10편](10-code-server-on-the-phone.md) 이후로 경로가 하나 더 생겼다.** 브라우저로 여는 편집기의 터미널은 code-server 프로세스가 들고 있고, code-server는 Termux 쪽 런처가 띄운 감독자의 자식이다. 그래서 브라우저를 닫아도 그 터미널은 남는다. 이 글도 그 터미널에서 썼다. 다만 code-server를 재시작하면 함께 사라진다. tmux 세션은 편집기와 무관하게 남는다.

## 정리

1. **데몬을 터미널에서 떼는 것과, 사람이 쓰는 세션을 떼는 것은 다른 문제다.** 앞은 터미널을 버리면 되고, 뒤는 터미널을 다시 붙일 수 있어야 한다.
2. **도구를 어느 층에 설치하는지가 그 도구의 수명을 정한다.** 같은 tmux라도 proot 안에 깔면 로그인 셸과 함께 죽는다.
3. **가짜 root는 uid로 이름 붙는 모든 경로에 흔적을 남긴다.** 소켓 디렉터리가 그 예다.
4. **죽일 때도 한 겹씩 확인한다.** 부모를 죽였다고 안쪽이 따라 죽지는 않는다.
