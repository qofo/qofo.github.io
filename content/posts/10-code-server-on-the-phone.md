---
title: "터미널 말고 편집기: 폰에 VS Code를 올리고 tailnet 안에서만 열기"
slug: "code-server-on-the-phone"
date: 2026-09-20
weight: 10
series: ["스마트폰으로 서버 만들기"]
tags: ["code-server", "VS Code", "Tailscale", "TLS", "Name Constraints", "PRoot"]
description: "이 폰은 지금까지 SSH 터미널로만 다뤘다. nano로 파일을 고치고, git 명령을 손으로 치고, 결과는 curl로 확인했다. 글이 열 편이 되고 스크립트가 여섯 개가 되자 이 방식이 버거워졌다."
---
이 폰은 지금까지 SSH 터미널로만 다뤘다. `nano`로 파일을 고치고, git 명령을 손으로 치고, 결과는 `curl`로 확인했다. 글이 열 편이 되고 스크립트가 여섯 개가 되자 이 방식이 버거워졌다. 파일을 넘나들며 고치고, 검색하고, 변경 사항을 한눈에 보는 일은 편집기의 몫이다.

그래서 VS Code를 폰에 붙이려다 막혔고, 결국 브라우저로 여는 편집기(code-server)를 tailnet 안에만 열었다. 이 글은 그 기록이다.

---

## 1. Remote-SSH가 멈춘 곳

VS Code의 Remote-SSH로 폰에 접속하면 연결이 끊긴다. 폰에 남은 로그는 이렇다.

```
error This machine does not meet Visual Studio Code Server's prerequisites, expected either...
  - find libstdc++.so or ldconfig for GNU environments
  - find /lib/ld-musl-aarch64.so.1, which is required to run the Visual Studio Code Server in musl environments
```

VS Code Server는 리눅스 바이너리를 원격 기기에 설치해서 돌린다. 그 바이너리는 glibc나 musl 위에서 동작한다. 그런데 SSH가 닿는 곳은 우분투가 아니라 **Termux**다. Termux는 안드로이드 위에서 도는 앱이고, 안드로이드의 C 라이브러리는 bionic이다. glibc도 musl도 아니다.

[3편](03-proot-constraints.md)에서 정리한 구조를 떠올리면 층이 하나 더 있다. 우분투는 Termux 안의 proot 컨테이너다.

```
Android 9 (bionic libc)
└─ Termux            ← sshd(8022)가 여는 곳. VS Code Server가 여기서 멈춘다
   └─ proot-distro: Ubuntu 26.04   ← glibc 2.43, libstdc++ 있음
```

해결책은 둘이다.

1. proot 우분투 안에 sshd를 하나 더 띄워서 Remote-SSH가 우분투로 들어가게 한다.
2. 우분투 안에서 **code-server**를 돌리고, 브라우저로 접속한다.

2번을 택했다. 클라이언트에 아무것도 설치하지 않아도 되고, 노트북이든 다른 폰이든 브라우저만 있으면 열린다. code-server 배포판은 자체 node 런타임을 포함한 glibc 빌드라서 우분투 안에서 그대로 돈다. 1번이 되는지는 시험하지 않았다.

설치는 공식 릴리스를 내려받아 체크섬을 확인하는 것으로 끝났다.

```bash
curl -fsSLO https://github.com/coder/code-server/releases/download/v4.137.0/code-server-4.137.0-linux-arm64.tar.gz
echo "0fba7602...a90462  code-server-4.137.0-linux-arm64.tar.gz" | sha256sum -c -
```

## 2. 편집기는 문서 뷰어보다 위험하다

[8편](08-tailnet-only-docs-server.md)에서 만든 문서 뷰어는 허용 목록에 적힌 마크다운만 읽어 주는 서버였다. code-server는 다르다. **폰의 모든 파일을 열고, 터미널을 띄우고, 그 터미널에서 무엇이든 실행할 수 있다.** 비밀번호 하나가 곧 폰 전체다.

그래서 접근 경로를 문서 뷰어와 같은 기준으로 정했다.

| 접근 경로 | 허용 | 확인한 방법 |
|:---|:---:|:---|
| 인터넷 (ngrok 공개 주소) | ✗ | ngrok은 8080만 전달한다. 편집기는 8443 |
| 같은 Wi-Fi의 기기 (LAN) | ✗ | LAN 주소로 연결 → `curl exit 7` (연결 거부) |
| 폰 안의 `127.0.0.1` | ✗ | 같은 결과. 바인딩 주소가 tailnet 주소뿐이다 |
| 내 Tailscale 기기 | ✓ | 비밀번호 로그인 뒤에만 |

로그인하지 않은 요청이 어디까지 가는지도 확인했다.

```
GET /                 → 302 /login
GET /proxy/8080/      → 302 /login      (폰 안의 포트를 중계하는 기능도 막힌다)
GET /healthz          → 200             (감시용으로 열어 둔 경로)
```

비밀번호는 code-server가 만든 무작위 24자를 그대로 쓴다. 틀린 비밀번호를 보내면 세션 쿠키 없이 로그인 페이지가 돌아오고, 맞으면 쿠키와 함께 편집기로 넘어간다. 무차별 대입은 code-server가 막는다. 설치된 코드에 그대로 적혀 있다.

```js
this.minuteLimiter = new limiter_1.RateLimiter({ tokensPerInterval: 2, interval: "minute" });
this.hourLimiter = new limiter_1.RateLimiter({ tokensPerInterval: 12, interval: "hour" });
```

## 3. HTTP로는 절반만 동작한다

처음에는 평문 HTTP로 열 생각이었다. 어차피 Tailscale이 WireGuard로 암호화하니 도청 걱정은 없다. 그런데 브라우저는 다른 기준을 본다. `https://`가 아닌 출처는 **보안 컨텍스트**가 아니고, 보안 컨텍스트가 아니면 서비스 워커를 등록할 수 없다.

VS Code의 웹뷰(마크다운 미리보기, 확장 소개 페이지 등)는 서비스 워커 위에서 돈다. 클립보드 API와 "앱으로 설치"(PWA)도 마찬가지다. code-server 문서가 HTTPS를 권하는 이유이기도 하다. 이 제약은 문서와 알려진 브라우저 동작에 따른 것이고, 폰에서 평문으로 띄워 웹뷰가 죽는 것까지 직접 확인하지는 않았다. 즉 평문 HTTP로 열면 **편집은 되지만 미리보기가 안 되는** 반쪽이 된다. 블로그 글을 쓰려고 만든 환경에서 마크다운 미리보기가 빠지는 것은 곤란하다.

HTTPS를 붙이는 방법은 세 가지였다.

| 방법 | 이 폰에서 |
|:---|:---|
| Tailscale이 발급하는 인증서(`tailscale cert`) | 불가. 이 폰에는 안드로이드 Tailscale **앱**만 있고 CLI가 없다 |
| 공인 도메인 + Let's Encrypt | 도메인이 없다. [4편](04-fixed-address-without-domain.md)에서 도메인을 사지 않기로 했다 |
| 폰에서 만든 인증서 | 가능. 대신 클라이언트가 그 인증서를 신뢰해야 한다 |

세 번째를 택했다. 그런데 자체 서명 인증서를 그냥 쓰고 경고를 넘기는 것으로는 부족하다. **인증서 오류가 있는 출처에서는 서비스 워커 등록이 거부된다.** 경고를 눌러 넘겨도 웹뷰는 여전히 죽는다. 결국 기기가 인증서를 진짜로 신뢰해야 한다.

### 루트 인증서를 기기에 넣는다는 것

기기에 루트 CA를 등록하는 것은 가벼운 일이 아니다. 그 CA의 키를 가진 사람은 그 기기에 대해 **아무 사이트나** 위조할 수 있다. 은행이든 메일이든 마찬가지다. 폰 안에 그런 키를 두는 셈이다.

X.509에는 이 범위를 줄이는 장치가 있다. **이름 제약(Name Constraints)**이다. CA 인증서에 "이 CA는 이 이름들만 보증할 수 있다"고 박아 두면, 검증하는 쪽이 그 밖의 이름을 거부한다.

```bash
openssl req -x509 -new -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \
  -keyout ca.key -out ca.crt -days 3650 -sha256 \
  -subj "/O=phone-homeserver/CN=code-server local CA" \
  -addext "basicConstraints=critical,CA:TRUE,pathlen:0" \
  -addext "keyUsage=critical,keyCertSign,cRLSign" \
  -addext "nameConstraints=critical,permitted;IP:100.64.0.0/255.192.0.0,\
permitted;IP:fd7a:115c:a1e0:0:0:0:0:0/ffff:ffff:ffff:0:0:0:0:0,permitted;DNS:ts.net"
```

허용 범위는 Tailscale이 쓰는 대역(`100.64.0.0/10`, `fd7a:115c:a1e0::/48`)과 `ts.net` 이름뿐이다. 실제로 그런지 인증서를 네 장 발급해서 검증해 봤다.

```
IP:<폰의 Tailscale 주소>      -> ok.crt: OK
DNS:phone.tail1234.ts.net     -> magic.crt: OK
IP:192.168.0.42               -> error lan.crt: verification failed
DNS:example.com               -> error evil.crt: verification failed
```

이 CA의 키가 새어 나가도 만들 수 있는 것은 내 tailnet 안의 이름뿐이다. LAN 주소조차 안 된다. 기기에 등록할 때의 위험이 그만큼 줄어든다.

서버 인증서는 이 CA로 397일짜리를 발급한다(공개 인증 기관의 상한이 398일이라 같은 기준을 맞췄다). 만료 30일 전에 감시 데몬이 다시 발급하고 재시작한다. CA는 10년짜리라 기기에 다시 등록할 일은 없다.

## 4. 감시 데몬을 한 벌 더 만들었다

[8편](08-tailnet-only-docs-server.md)에서 문서 뷰어의 감시 데몬을 블로그와 따로 만든 이유가 그대로 적용된다. 편집기가 멈추는 것과 블로그가 멈추는 것은 다른 사건이고, 한쪽을 고치다 다른 쪽을 멈추게 해서는 안 된다. 그래서 세 번째 감시 데몬(`code_server.sh`)과 세 번째 런처, 세 번째 감시 작업(4245)을 만들었다.

구조는 같지만 다른 점이 셋 있다.

**주소를 서버가 아니라 감시 데몬이 찾는다.** 문서 뷰어는 내가 쓴 파이썬이라 Tailscale 주소를 스스로 찾게 만들 수 있었다. code-server는 남의 프로그램이다. 그래서 감시 데몬이 커널에 주소를 물어(`SIOCGIFADDR`) 인자로 넘긴다.

```bash
code-server --bind-addr "$ip:8443" --auth password --cert "$SRV_CRT" --cert-key "$SRV_KEY" /root
```

주소가 아직 없으면 띄우지 않고 기다린다(`waiting`). 주소가 바뀌면 그 주소로 인증서를 다시 발급하고 재시작한다.

**헬스체크가 인증서까지 확인한다.** `/healthz`를 우리 CA로 검증하면서 호출한다. 응답이 200이 아니거나 인증서가 우리 것이 아니면 실패로 친다.

```bash
curl -s -o /dev/null -w '%{http_code}' --max-time 5 --cacert "$CA_CRT" "https://$1/healthz"
```

**유예 시간이 길다.** 문서 뷰어는 30초였지만 code-server는 90초로 뒀다. 기동에 시간이 더 걸린다. 실제 기록은 9초였다.

```
02:49:27 [supervisor] [START] code-server on https://<tailnet 주소>:8443/ (pid 18219)
17:49:36 info  HTTPS server listening on https://<tailnet 주소>:8443/
```

(감시 데몬은 KST로, code-server는 UTC로 기록한다. 같은 시각의 9초 차이다.)

## 5. 프로세스가 둘이어서 틀린 테스트

감시 데몬을 만들었으니 죽여 봐야 한다. 메인 프로세스를 `kill -9`로 죽이고, "새 PID가 뜨고 `/healthz`가 200이 되면 복구"로 판정하는 스크립트를 돌렸다. 결과는 **1초 만에 복구**였다.

말이 안 되는 숫자다. 기동에만 9초가 걸리는데 1초 만에 복구될 수 없다.

원인은 code-server의 프로세스 구조였다. 실행하면 프로세스가 둘 생긴다.

```
PID    PPID   COMMAND
20859  18168  .../lib/node .../code-server --bind-addr ...   ← 래퍼
20891  20859  .../lib/node .../out/node/entry                ← 실제 서버
```

래퍼만 죽였으니 실제 서버는 부모를 잃은 채 계속 응답하고 있었다. 내 판정 코드는 "가장 오래된 프로세스"를 서버로 보고 있었는데, 래퍼가 사라지자 그 자리를 자식이 차지했다. 새 PID가 보이고 200이 오니 복구로 판정한 것이다. **고아를 복구로 오해한 셈이다.**

감시 데몬은 제 일을 하고 있었다. 2초 뒤 로그에 이렇게 남았다.

```
[CRASH DETECTED] code-server exited (code 137, up 417s); restarting in 0s
[START] code-server on https://<tailnet 주소>:8443/ (pid 20859)
```

자식이 살아 있으면 새 서버가 같은 주소에 바인딩하지 못한다. 그래서 감시 데몬은 종료를 감지하면 남은 프로세스를 패턴으로 모두 정리한 뒤 새로 띄운다.

```bash
PATTERN='^/root/\.local/lib/code-server[^/ ]*/lib/node '
```

판정 기준을 고쳐서 이번에는 안쪽 서버를 죽여 봤다. 래퍼도 종료 코드 0으로 끝났고, 감시 데몬이 6초 만에 감지해 15초 대기 뒤 새로 띄웠다. **32초 만에 다시 서비스**했다. 운영 명령 `restart`는 13초였다.

교훈은 [6편](06-supervisor-postmortem.md)의 반복이다. 복구를 재는 기준이 "프로세스가 있는가"면, 살아 있는 잔해가 복구로 보인다.

## 6. 한도를 읽었더니 그것도 가짜였다

VS Code는 파일이 바뀌면 자동으로 다시 읽는다. 리눅스에서는 inotify로 경로마다 감시를 건다. `/root`에는 폴더가 3447개 있고, 대부분은 캐시와 설치 파일이다.

```
전체            3447
.local          1237   ← code-server 자신과 확장
.gemini          835   ← 예전에 쓰던 에이전트의 기록
.npm             443
.claude          298
qofo.github.io   219   ← 블로그
blog_builds      175
```

한도를 확인했다.

```
$ cat /proc/sys/fs/inotify/max_user_watches
4096
```

3447개는 4096에 아슬아슬하다. 올려 보기로 했다. [3편](03-proot-constraints.md)에서 proot의 root는 가짜라고 정리했으니 거부당할 줄 알았는데, 성공했다.

```
$ sysctl -w fs.inotify.max_user_watches=8192
fs.inotify.max_user_watches = 8192
```

성공한 것이 오히려 이상했다. 커널 설정을 앱 권한으로 바꿀 수 있을 리가 없다. 마운트 정보를 봤다.

```
$ grep inotify /proc/self/mountinfo
... /proc/sys/fs/inotify/max_user_watches rw,relatime - bind
    .../containers/ubuntu/sysdata/sysctl_inotify_max_user_watches rw,relatime
```

이 경로는 커널의 파일이 아니었다. proot-distro가 **일반 파일을 bind mount로 덮어 둔 것**이다. 읽으면 4096이 나오고, 쓰면 그 파일만 바뀐다. 커널은 이 숫자를 모른다. 3편에서 `/proc/stat`과 `/proc/uptime`이 가짜였던 것과 같은 일이 `/proc/sys` 아래에서도 일어나고 있었다.

그러면 진짜 한도는 얼마인가. 읽을 방법이 없으니 **실패할 때까지 걸어 보는** 수밖에 없다. inotify 인스턴스 하나에 `/root`의 경로를 계속 추가했다.

```python
libc = ctypes.CDLL(None, use_errno=True)
fd = libc.inotify_init1(os.O_NONBLOCK)
for path in paths:
    if libc.inotify_add_watch(fd, path.encode(), IN_ATTRIB) < 0:
        print("stopped after", added, os.strerror(ctypes.get_errno()))
        break
```

```
stopped after 5862 watches: ENOSPC (No space left on device)
```

두 번 재서 같은 값이 나왔다. 다른 프로세스가 이미 쓰고 있는 몫이 있으니 실제 한도는 5862보다 크다. 표시값 4096은 진짜 한도보다 오히려 **작았다.** 값을 믿고 겁먹을 일도, 값을 고쳐 안심할 일도 아니었다.

남은 판단은 단순해졌다. 여유가 있더라도 캐시와 설치 파일까지 감시할 이유는 없다. 제외 목록을 넣었다.

```json
"files.watcherExclude": {
  "/root/.local/**": true,
  "/root/.cache/**": true,
  "/root/.npm/**": true,
  "/root/.gemini/**": true,
  "/root/.claude/**": true,
  "/root/blog_builds/**": true
}
```

제외하고 남는 폴더는 30개다. 앞으로 `/root` 아래에 큰 폴더를 만들면 여기에 한 줄 추가한다.

## 7. 검증

| 대상 | 방법 | 결과 |
|:---|:---|:---|
| 바인딩 | `127.0.0.1:8443`, LAN 주소:8443 | 연결 거부 (curl exit 7) |
| 인증서 | 우리 CA 없이 접속 | curl exit 60 (인증서 불신) |
| 이름 제약 | LAN IP·외부 도메인용 인증서 발급 후 검증 | 모두 verification failed |
| 로그인 | 틀린 비밀번호 / 맞는 비밀번호 | 쿠키 없음 / 워크벤치 200 |
| 로그인 전 접근 | `/`, `/proxy/8080/` | 302 `/login` |
| WebSocket | 로그인+같은 출처 / 로그인 없음 / 다른 출처 | 101 / 401 / 403 |
| 복구 | 래퍼 `kill -9` / 안쪽 서버 `kill -9` / `restart` | 2초 감지 / 32초 / 13초 |
| 메모리 | 대기 중 두 프로세스 합계 | 약 150MB (가용 메모리 2GB) |

편집기의 WebSocket은 브라우저 없이도 확인할 수 있었다. 로그인해서 쿠키를 받고, 그 쿠키와 `Origin` 헤더를 붙여 업그레이드 요청을 보내면 된다. 다른 출처를 적으면 403이 돌아온다. 이것이 [8편](08-tailnet-only-docs-server.md)에서 다룬 DNS 리바인딩에 대한 방어다. 인증서가 IP 주소로만 발급돼 있어서, 공격자의 도메인 이름으로는 TLS부터 성립하지 않는다는 점이 한 겹 더 있다.

## 8. 한계

- **CA를 등록하지 않은 기기에서는 반쪽이다.** 경고를 넘기면 편집은 되지만 마크다운 미리보기와 클립보드 API는 동작하지 않는다. 기기마다 한 번 등록하는 수고가 필요하다.
- **확장은 Open VSX에서만 받는다.** code-server는 Microsoft 마켓을 쓸 수 없다. Pylance, 원격 개발 확장, Copilot은 설치되지 않는다.
- **Tailscale을 실제로 껐다 켜는 시험은 아직 못 했다.** 대기와 재바인딩 코드는 문서 뷰어와 같은 방식이지만, 같은 방식이라는 것이 같은 결과를 보증하지는 않는다.
- **설치 직후 폰이 한 번 예기치 않게 재부팅됐다.** code-server를 처음 실행하고 약 1분 뒤였다. 안드로이드가 부팅 사유를 알려 주지 않아(`sys.boot.reason`은 비어 있고 `/sys/fs/pstore`는 권한 거부) 원인을 확정하지 못했다. 관련이 있는지도 알 수 없다. 블로그와 터널, 문서 뷰어는 168초 만에 스스로 복구됐다.

## 정리

1. **SSH가 닿는 곳이 내가 생각한 곳이 아닐 수 있다.** 같은 기기 안에 libc가 다른 층이 둘 있었다. 오류 메시지는 "glibc를 찾을 수 없다"였고, 답은 "거기는 우분투가 아니다"였다.
2. **HTTPS는 암호화만의 문제가 아니다.** 브라우저의 기능 절반이 보안 컨텍스트를 전제로 한다. 사설망 안이라도 평문이면 기능이 빠진다.
3. **루트 CA를 만들 때는 이름 제약을 건다.** 내 기기에 넣는 열쇠의 범위를 줄이는 값싼 방법이다.
4. **복구 판정을 프로세스 존재로 하지 않는다.** 래퍼와 서버가 나뉜 프로그램에서는 잔해가 복구처럼 보인다.
5. **설정값을 읽었다고 사실을 안 것이 아니다.** 한도는 가짜 파일이었고, `sysctl`은 성공했다고 답했다. 진짜 숫자는 직접 부딪혀 보고서야 나왔다.
