---
title: "Termux:Boot와 감시 데몬으로 무인 운영 구성하기"
slug: "termux-boot-supervisor"
date: 2026-09-17
lastmod: 2026-09-18
weight: 5
series: ["스마트폰으로 서버 만들기"]
tags: ["Termux:Boot", "Supervisor", "Self-Healing", "Android", "PRoot", "Automation"]
description: "4편에서 고정 주소를 확보했다. 남은 요구사항은 무인 운영이다. 사람이 Termux 앱을 열지 않아도 서버가 떠 있어야 한다."
legacy_id: "05_headless_autostart_and_self_healing_daemon"
---
[4편](04-fixed-address-without-domain.md)에서 고정 주소를 확보했다. 남은 요구사항은 무인 운영이다. 사람이 Termux 앱을 열지 않아도 서버가 떠 있어야 한다.

폰은 일반 서버보다 프로세스가 죽을 이유가 많다.

- **재부팅**: 배터리가 닳거나 시스템 업데이트로 꺼졌다 켜진다.
- **LMK(Low Memory Killer)**: 메모리가 부족하면 안드로이드가 백그라운드 프로세스를 경고 없이 `SIGKILL`로 정리한다.
- **Doze**: 화면이 꺼지고 기기가 정지 상태면 CPU와 네트워크가 묶인다.

각각에 대응하는 계층을 세 개 만들었다. 이 글은 그 v1 구조의 기록이다. 결론을 먼저 밝히면 **이 구조는 하루를 버티지 못했다.** 원인은 마지막 절에 있고, 재설계는 [6편](06-supervisor-postmortem.md)에 있다.

---

## 1층: 부팅 자동 실행

Termux:Boot 앱은 안드로이드가 부팅을 마치면 `~/.termux/boot/` 안의 스크립트를 실행한다.

```bash
#!/data/data/com.termux/files/usr/bin/sh
# 화면이 꺼져도 CPU가 잠들지 않도록
termux-wake-lock

# 원격 접속용 SSH 서버 (8022 포트)
sshd

# 우분투로 들어가 감시 데몬 실행
if ! pgrep -f "serve_blog.py" >/dev/null; then
    nohup proot-distro login ubuntu -- /root/start_services.sh start-daemon \
        >~/boot_services.log 2>&1 &
fi
```

`termux-wake-lock`이 Doze 대응이다. 이것이 없으면 화면을 끈 지 몇 분 만에 CPU가 절전 상태로 들어가고 터널 연결이 끊긴다.

## 2층: 10초 주기 감시 데몬

`systemd`가 없으므로 프로세스 감시자를 직접 만들었다. 쉘 스크립트 한 편이다.

```bash
start_daemon() {
    echo "[DAEMON] Starting persistent background supervisor..." >> "$LOG_DIR/daemon.log"
    start_blog
    start_ngrok

    while true; do
        if ! pgrep -f "serve_blog.py" >/dev/null; then
            echo "[$(date '+%F %T')] [CRASH DETECTED] Restarting Blog Server..." >> "$LOG_DIR/daemon.log"
            start_blog
        fi

        if ! pgrep -f "ngrok http" >/dev/null; then
            echo "[$(date '+%F %T')] [CRASH DETECTED] Restarting ngrok Tunnel..." >> "$LOG_DIR/daemon.log"
            start_ngrok
        fi

        sleep 10
    done
}
```

`pgrep`으로 프로세스 존재 여부를 확인하고 없으면 다시 띄운다. 무한 루프가 도는 동안에는 proot 세션도 끝나지 않으므로, [3편](03-proot-constraints.md)에서 정리한 `--kill-on-exit` 문제도 함께 피한다고 판단했다.

## 3층: 진입 경로마다 자동 시작

| 계층 | 위치 | 트리거 |
|:---|:---|:---|
| 부팅 | `~/.termux/boot/start-server.sh` | 기기 재부팅 |
| Termux 로그인 | Termux `~/.bashrc` | Termux 앱 실행, SSH 접속 |
| 우분투 로그인 | `/root/.bashrc` | proot 우분투 진입 |

세 경로 모두 "서버가 안 떠 있으면 띄운다"를 실행한다. 어느 문으로 들어오든 서버가 살아난다는 뜻이다.

## 검증: 강제 종료 후 복구 확인

```bash
pkill -9 -f "serve_blog.py"
```

10초 안에 감지하고 다시 띄웠다.

```
[2026-09-17 13:39:55] [CRASH DETECTED] Restarting ngrok Tunnel...
```

외부 주소에서도 정상 응답했다. 이 로그를 근거로 자가 치유가 동작한다고 판단했다.

---

## 개정 노트: 이 구조의 결함 두 가지

다음 날 서버 상태를 점검한 결과는 이랬다.

```
Blog Server:  [STOPPED]
ngrok Tunnel: [STOPPED]
```

위 3층이 모두 설정된 상태에서 블로그와 터널이 모두 꺼져 있었다. 원인은 두 가지다.

**첫째, 3층 중 두 층이 서비스를 proot 세션 안에 묶었다.** 우분투 쪽 `.bashrc`로 띄운 서비스는 그 로그인 셸이 끝나면 `--kill-on-exit`에 함께 끌려간다. 감시 데몬 없이 떠 있다가 세션이 닫히면서 사라졌다.

**둘째, 위에 인용한 `[CRASH DETECTED]` 로그는 복구의 증거가 아니라 결함의 증상이었다.** 그 시각 ngrok이 죽은 이유는 크래시가 아니라 터미널에서 누른 Ctrl+C였다. 감시 데몬이 SSH 터미널의 프로세스 그룹 안에서 돌고 있어서, 터미널 신호가 자식 프로세스까지 전달됐다. 감시 데몬은 원인을 모른 채 10초마다 같은 프로세스를 다시 띄우고 있었다.

정리하면 **복구 장치를 만든 것과 복구되는 것을 확인한 것은 다르다.** `pkill` 한 번으로 통과한 테스트는 "프로세스가 죽는 경우"만 검증했다. "감시자 자신이 죽는 경우"와 "프로세스가 잘못된 세션에서 태어난 경우"는 검증하지 않았다.

→ [6편. 감시 데몬이 지키지 못한 것: 원인 분석과 재설계](06-supervisor-postmortem.md)
