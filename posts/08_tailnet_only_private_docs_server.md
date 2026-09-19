# 8편. Tailscale 안에서만 열리는 문서 서버: 방화벽 없는 폰에서 접근 제어하기

> **작성일**: 2026년 9월 19일  
> **시리즈**: 스마트폰으로 서버 만들기 (8편)  
> **태그**: `Tailscale`, `Security`, `DNS Rebinding`, `CSP`, `DOMPurify`, `Python`

이 폰에서는 블로그 말고도 문서를 쓴다. 사이드 프로젝트 기획서, 기존 서비스 조사, 블로그 이전 계획 같은 것들이다. 이런 문서를 노트북이나 다른 폰의 브라우저로 읽고 싶었다. 조건은 하나다. **나만 봐야 한다.**

블로그에 올리는 방법은 쓸 수 없다. [4편](#post=04_permanent_tunneling_and_domain_strategy)에서 만든 ngrok 터널이 8080 포트를 인터넷 전체에 공개하고 있다. 그렇다고 새 서버를 `0.0.0.0`에 띄우면 같은 Wi-Fi의 모든 기기가 접근할 수 있다. 이 글은 Tailscale 사설망에서만 응답하는 문서 서버를 만든 기록이다.

---

## 위협 모델부터

누가 읽으면 안 되고, 누구는 읽어도 되는지부터 정했다.

| 접근 경로 | 허용 | 비고 |
|:---|:---|:---|
| 인터넷 (ngrok 공개 주소) | ✗ | ngrok은 8080만 전달한다 |
| 같은 Wi-Fi의 기기 (LAN) | ✗ | 카페나 공용 공유기라면 모르는 사람이다 |
| 폰 안의 다른 프로세스 (`127.0.0.1`) | ✗ | 굳이 열어 둘 이유가 없다 |
| 내 Tailscale 기기 | ✓ | WireGuard로 암호화된 사설망 |
| 내 브라우저에서 돌아가는 **남의 웹페이지** | ✗ | 놓치기 쉬운 경로다. 아래에서 다룬다 |

마지막 줄이 중요하다. 내가 Tailscale에 연결된 노트북으로 아무 웹사이트나 열었다고 하자. 그 페이지의 자바스크립트는 내 브라우저 안에서 돌기 때문에 **내 tailnet 주소에 요청을 보낼 수 있다.** 네트워크 경로만 막아서는 이 경로를 막지 못한다.

## 1층: 방화벽이 없으니 바인딩 주소가 방화벽이다

보통의 리눅스 서버라면 `0.0.0.0`에 띄우고 방화벽으로 Tailscale 인터페이스만 열 것이다. 여기서는 그럴 수 없다. `iptables`가 설치돼 있지 않고, 설치하더라도 [3편](#post=03_android_proot_server_architecture_and_gotchas)에서 본 것처럼 proot의 root는 가짜라서 커널 방화벽 규칙을 넣을 권한이 없다.

그래서 **소켓을 Tailscale 주소에만 바인딩**한다. 다른 인터페이스로 들어온 연결은 커널 단계에서 거부된다. 문제는 그 주소를 알아내는 방법이다.

- 최소 설치 Ubuntu라 `ip` 명령이 없고, 스크립트에서 흔히 읽는 `/proc/net/fib_trie`는 권한 거부로 읽히지 않는다.
- 안드로이드 VPN 인터페이스 이름은 부팅마다 `tun0`, `tun1`처럼 바뀐다.

외부 명령의 출력을 파싱하는 대신, 파이썬 표준 라이브러리로 인터페이스마다 커널에 주소를 직접 묻고(`SIOCGIFADDR` ioctl) Tailscale 대역(`100.64.0.0/10`)에 들어가는 것을 고른다.

```python
TAILNET_V4 = ipaddress.ip_network("100.64.0.0/10")

def find_tailnet_ip():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        for _, name in socket.if_nameindex():
            try:
                packed = fcntl.ioctl(sock.fileno(), 0x8915,  # SIOCGIFADDR
                                     struct.pack("256s", name.encode()[:15]))
            except OSError:
                continue
            ip = socket.inet_ntoa(packed[20:24])
            if ipaddress.ip_address(ip) in TAILNET_V4:
                return ip
    finally:
        sock.close()
    return None
```

바인딩 주소를 설정으로 바꿀 수 있게 하면, 언젠가 누군가(미래의 나 포함) `0.0.0.0`을 넣는다. 그래서 **허용되지 않은 주소면 아예 실행을 거부**한다.

```
$ PRIVATE_DOCS_BIND=0.0.0.0 python3 private_docs_server.py
refusing to bind to 0.0.0.0: only tailnet (100.64.0.0/10) or loopback addresses are allowed
$ echo $?
2
```

루프백을 허용한 것은 테스트용이다. 실제 운영은 자동 탐지(`auto`)만 쓴다.

### VPN은 꺼질 수 있다

Tailscale은 안드로이드 앱이고, 사람이 끄기도 하고 부팅 직후에는 아직 안 켜져 있기도 하다. 서버는 세 가지 상태를 파일에 적는다.

| 상태 | 뜻 | 서버의 행동 |
|:---|:---|:---|
| `waiting` | 아직 Tailscale 주소가 없음 | 5초마다 다시 찾는다. 소켓은 열지 않는다 |
| `listening 주소:8081` | 정상 | 30초마다 주소를 다시 확인한다 |
| `offline 주소:8081` | 바인딩한 뒤 VPN이 꺼짐 | 그대로 기다린다. 같은 주소로 돌아오면 다시 `listening` |

주소가 **바뀌면** 종료 코드 3으로 스스로 끝난다. 이미 바인딩한 소켓은 새 주소로 옮길 수 없으니, 감시 데몬이 즉시 다시 띄워 새 주소에 붙게 한다. 어떤 경우에도 "주소를 못 찾았으니 일단 `0.0.0.0`으로"라는 경로는 없다. **실패하면 닫힌 쪽으로 실패한다.**

## 2층: 접속자 IP 확인

바인딩만으로 충분해 보이지만, 요청마다 접속자 IP가 tailnet 대역인지 한 번 더 확인한다. 설정 실수로 바인딩이 넓어지더라도 여기서 막힌다. IPv6로 매핑된 IPv4 주소(`::ffff:100.x.y.z`)도 풀어서 비교한다.

```python
def _peer_ok(self):
    peer = ipaddress.ip_address(self.client_address[0].split("%")[0])
    if peer.version == 6 and peer.ipv4_mapped:
        peer = peer.ipv4_mapped
    return any(peer in net for net in ALLOWED_NETS)   # 100.64.0.0/10, fd7a:115c:a1e0::/48
```

## 3층: Host 헤더로 DNS 리바인딩 막기

위협 모델의 마지막 줄, "내 브라우저에서 도는 남의 웹페이지"다. 공격은 이렇게 흘러간다.

1. 공격자가 `evil.example`이라는 도메인을 만들고, 처음에는 자기 서버 IP를 응답하게 한다.
2. 내가 그 페이지를 연다. 자바스크립트가 로드된다.
3. 공격자가 DNS 응답을 **내 tailnet 주소**로 바꾼다(TTL을 아주 짧게 둔다).
4. 페이지의 자바스크립트가 `http://evil.example:8081/raw/idea-plan.md`를 요청한다. 브라우저 입장에서는 **같은 출처**이므로 응답을 읽을 수 있다.
5. 요청은 내 노트북에서 출발했으니 접속자 IP 검사를 통과한다.

접속자 IP는 진짜 내 기기이므로 2층으로는 막을 수 없다. 대신 이 요청의 `Host` 헤더는 `evil.example:8081`이다. 브라우저는 Host 헤더를 위조하게 두지 않는다. 그래서 Host 헤더가 **내 tailnet의 이름이나 주소일 때만** 응답한다.

```python
def _host_ok(self):
    host = (self.headers.get("Host") or "").strip()
    ...포트 떼기...
    try:
        addr = ipaddress.ip_address(name)
        return any(addr in net for net in ALLOWED_NETS)     # tailnet IP
    except ValueError:
        pass
    name = name.lower().rstrip(".")
    return bool(name) and (name.endswith(".ts.net")        # MagicDNS 전체 이름
                           or "." not in name)             # MagicDNS 짧은 이름
```

`localhost.evil.com`처럼 그럴듯한 이름은 점이 있고 `.ts.net`으로 끝나지 않으므로 거부된다. CORS 허용 헤더도 절대 보내지 않는다. 다른 출처의 페이지가 응답을 읽을 합법적인 통로도 만들지 않는 것이다.

거부한 요청은 로그에 남긴다. 반대로 **내가 문서를 읽은 기록은 남기지 않는다.** 이 서버의 로그에 남아야 할 것은 이상한 접근뿐이다.

```
[DENY] Host header outside the tailnet peer=100.x.y.z host='evil.example.com' path='/'
```

## 4층: 디렉터리가 아니라 목록

정적 파일 서버를 `/root`에 물리면 경로 조작 한 번에 SSH 키나 API 토큰이 나간다. 이 서버는 파일 시스템을 보여 주지 않는다. **허용 목록 파일**에 적힌 문서만 존재한다.

```
# private_docs.list — 여기 없는 파일은 URL을 알아도 열리지 않는다
idea.md
idea-plan.md
idea-research.md
HUGO_MIGRATION_PLAN.md
```

요청의 파일 이름은 목록을 조회하는 **키**로만 쓰이고 경로 조립에는 쓰이지 않는다. 그래서 인코딩을 어떻게 비틀어도 목록 밖으로 나갈 방법이 없다. 이름 규칙(`.md`로 끝남, 점으로 시작하지 않음)과 크기 제한(2MB)도 둔다. 목록은 요청마다 다시 읽으므로 한 줄 추가하면 재시작 없이 반영된다.

## 5층: 브라우저 안에서의 방어

문서에는 웹에서 조사한 내용이 섞여 있다. 복사한 문단에 HTML이 끼어 있을 수도 있다. 마크다운은 HTML을 그대로 통과시키므로 **내 문서가 내 브라우저에서 스크립트를 실행하는** 사고가 가능하다.

- 서버는 표준 라이브러리만 쓰고 마크다운을 해석하지 않는다. 원문을 `text/plain`으로 내주고, 브라우저에서 [marked](https://github.com/markedjs/marked)로 변환한 뒤 [DOMPurify](https://github.com/cure53/DOMPurify)로 정화한다.
- 두 라이브러리는 CDN에서 불러오지 않고 폰에 두었다. 내려받을 때 CDN이 공개한 SRI 해시(sha512)와 대조했다.
- 원격 이미지는 정화 단계에서 `src`를 지운다. 문서를 여는 순간 외부 서버에 요청이 나가면, 내가 언제 무엇을 읽는지가 그 서버에 기록된다.
- 모든 응답에 엄격한 보안 헤더를 붙인다.

```
Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self';
                         img-src 'self' data:; connect-src 'self'; base-uri 'none';
                         form-action 'none'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
X-Robots-Tag: noindex, nofollow
Cache-Control: no-store
```

`script-src 'self'`는 인라인 스크립트와 `eval`을 막는다. 정화가 뚫리더라도 문서에 끼어든 스크립트는 실행되지 않는다. 그 대가로 뷰어 코드도 인라인 스크립트와 인라인 스타일을 쓸 수 없다. 테스트에 "뷰어 코드가 CSP를 어기지 않는가"라는 항목을 따로 넣은 이유다.

---

## 공개 서비스와 떼어 놓기

처음에는 이 서버를 블로그의 감시 데몬(`start_services.sh`)에 한 줄 끼워 넣으려 했다. 그러다 멈췄다. 그 데몬은 공개 블로그를 지키는 코드다. 비공개 문서 기능을 고치다가 실수하면 블로그가 멈춘다. 두 기능은 수명도 다르다. 블로그는 늘 떠 있어야 하고, 문서 서버는 VPN이 꺼져 있으면 쉬어도 된다.

그래서 [6편](#post=06_audit_and_supervisor_rewrite)의 구조를 **통째로 한 벌 더** 만들었다.

| 구분 | 블로그 (공개) | 문서 서버 (비공개) |
|:---|:---|:---|
| 서버 | `serve_blog.py`, `0.0.0.0:8080` | `private_docs_server.py`, `100.x.y.z:8081` |
| 감시 데몬 | `start_services.sh` | `private_docs.sh` |
| Termux 쪽 런처 | `ensure-daemon.sh` | `ensure-private-docs.sh` |
| 15분 감시 작업 / 기동 요청 | 4241 / 4242 | 4243 / 4244 |
| 중지 표시 | `.services_disabled` | `.private_docs_disabled` |

감시 데몬의 뼈대(`flock` 단일 실행, 자식 PID 추적, 30초 유예 후 능동 헬스체크, 재시작 대기 10초→5분, 플래그 파일 재시작)는 같다. 다른 점은 둘이다.

- **VPN이 꺼져 쉬는 것은 정상이다.** `waiting`과 `offline` 상태는 건강한 것으로 친다. 대신 상태 파일이 90초 넘게 갱신되지 않으면 서버가 멈춘 것으로 본다.
- **종료 코드마다 대응이 다르다.** 3(주소 변경)은 즉시 다시 띄우고, 2(허용되지 않은 주소라 거부)는 5분 뒤에 재시도한다. 설정 오류로 1초마다 재시작하는 루프를 만들지 않는다.

---

## 검증

### 자동화 테스트 47개

서버를 루프백에 띄우고 실제 HTTP 요청으로 확인한다. 보안 검사는 테스트에서도 꺼지지 않는다. 허용 대역만 루프백으로 바꿔 끼운다.

| 분류 | 확인한 것 |
|:---|:---|
| 경로 조작 | `../`, `%2F` 인코딩, 이중 인코딩, NUL 바이트, 숨김 파일, 목록 밖 파일, 정적 파일 디렉터리 탈출 → 모두 404 |
| 메서드 | POST·PUT·DELETE·PATCH·OPTIONS → 405 |
| Host 헤더 | 외부 도메인, 사설 LAN IP, `localhost.evil.com` → 403 / tailnet IP, `*.ts.net`, 짧은 이름 → 200 |
| 접속자 IP | 허용 대역을 tailnet으로 되돌리면 루프백 접속자는 모든 경로에서 403 |
| 바인딩 | `0.0.0.0`, `::`, LAN IP, 공인 IP → 실행 거부(종료 코드 2) |
| 기타 | CORS 헤더 없음, 서버 헤더에 파이썬 버전 없음, 일반 열람은 로그에 안 남음, SIGTERM 시 상태 파일 정리 |

브라우저 쪽은 jsdom으로 뷰어를 실제로 돌려 35개 항목을 확인했다. `<script>`, `onerror`, `javascript:` 링크, `style` 속성, iframe, form, 원격 이미지가 섞인 문서를 넣고 전부 무해화되는지 본다. 여기에는 **대조군**을 넣었다. 정화하기 전의 marked 출력에 그 위험 요소들이 실제로 있는지를 먼저 확인한다. 대조군이 없으면 "marked가 애초에 script를 출력하지 않아서" 통과하는 테스트와 구분할 수 없다.

### 실제 배포에서 경로별로

테스트가 아닌 실제 서버에 경로별로 붙어 봤다. 주소는 예시 값으로 바꿨다.

```
Tailscale 주소 100.x.y.z:8081   /doc/idea-plan.md → 200
                                /raw/SERVER_ENVIRONMENT_SPEC.md → 404 (파일은 있지만 목록 밖)
                                Host: evil.example.com → 403
127.0.0.1:8081                  curl exit 7 (연결 거부)
192.168.0.42:8081 (LAN)         curl exit 7 (연결 거부)
```

소켓 상태로도 확인했다.

```
LISTEN 0.0.0.0     8080   ← 블로그 (ngrok이 공개)
LISTEN 100.x.y.z   8081   ← 문서 서버
```

### 200이 돌아와서 놀란 경우

마지막으로 ngrok 공개 주소로 같은 경로들을 찔렀는데, **전부 200**이 돌아왔다.

```
/doc/idea-plan.md   200
/raw/idea-plan.md   200
/api/docs           200
/private_docs.list  200
```

상태 코드만 보면 문서가 새는 것처럼 보인다. 그러나 응답 본문에 기획서의 문구는 한 번도 나오지 않았다. 해시를 비교하니 이유가 보였다.

```
$ curl -s $PUBLIC/ | md5sum
a440348577a653352c6d78901e3e8519  -
$ curl -s $PUBLIC/raw/idea-plan.md | md5sum
a440348577a653352c6d78901e3e8519  -
```

블로그는 단일 페이지 앱이라서, 모르는 경로에는 모두 메인 페이지를 200으로 돌려준다. **상태 코드만 보는 보안 점검은 이런 서버에서 틀린 결론을 낸다.** 본문을 확인하거나, 비밀이 있어야 할 자리에 표식 문자열을 두고 그 문자열이 나오는지를 봐야 한다.

같은 김에 블로그 쪽 API(`/api/post?id=`)도 봤다. 글 ID를 경로에 이어 붙이는 구조라 `../root/idea-plan`이 통하면 공개 주소로 기획서가 나간다. 다행히 `/`와 `..`이 들어간 ID는 400으로 거절하고 있었다. 이런 점검은 새 비밀을 폰에 들일 때마다 다시 해야 한다. 비밀이 없던 시절의 코드는 비밀을 지키도록 만들어지지 않았다.

### 감시 데몬 시험, 그리고 멈추지 않는 SIGSTOP

감시 데몬도 실제로 죽여 봤다. `kill -9`로 서버를 죽이면 17초 뒤 새 프로세스가 같은 주소에 붙었다. 그다음은 먹통 시험이었다. 서버를 `kill -STOP`으로 얼려 두면 헬스체크가 실패해야 한다. 그런데 2분이 넘도록 서버가 계속 200을 응답했다.

```
State:      S (sleeping)       ← 정지(T)가 아니다
TracerPid:  2173               ← proot
```

proot는 ptrace로 모든 프로세스를 추적한다. 추적당하는 프로세스에 온 신호는 먼저 추적자(proot)에게 보고되고, 추적자가 그 신호를 넘겨줄지 정한다. 결과로 보면 proot는 정지 신호를 넘겨주지 않았다. **proot 안에서는 SIGSTOP으로 먹통을 흉내 낼 수 없다.**

그래서 응답하지 않는 가짜 서버를 만들어 감시 데몬 사본에 물렸다. 소켓을 열고 `listen`만 한 채 `accept`를 하지 않는 서버다. 연결은 대기열에 쌓이지만 응답은 영원히 오지 않는다.

```
[21:27:43] [WARN] health check failed (up 30s, failure 1/3)
[21:27:56] [WARN] health check failed (up 44s, failure 2/3)
[21:28:10] [WARN] health check failed (up 58s, failure 3/3)
[21:28:10] [HUNG DETECTED] server is unresponsive (pid 4955); terminating
[21:28:21] [START] private docs server (pid 5432)
stub start mode=exit3
[21:28:31] [REBIND] Tailscale address changed; restarting now
...
stub start mode=exit2
[21:28:52] [REFUSED] server refused its bind address (code 2); retrying in 300s
```

먹통 감지, 주소 변경 시 즉시 재시작, 바인딩 거부 시 5분 대기가 모두 설계대로 동작했다. [7편](#post=07_reboot_hung_ngrok_and_active_health_checks)의 먹통 감지도 이렇게 시험할 수 있었으면 재부팅을 기다리지 않아도 됐을 것이다.

---

## 한계

- **HTTP다.** 전송 구간은 Tailscale(WireGuard)이 암호화하지만, 브라우저는 "안전하지 않음"으로 표시한다. 이 폰에는 안드로이드 Tailscale 앱만 있고 `tailscale serve`나 `tailscale cert`를 쓸 CLI가 없어서 인증서를 붙이지 않았다.
- **tailnet에 들어온 기기는 모두 읽을 수 있다.** 기기를 다른 사람과 공유하고 있다면 Tailscale의 접근 제어 정책(ACL)으로 이 포트에 접근할 기기를 좁혀야 한다.
- **자바스크립트가 필요하다.** 꺼져 있으면 원문(`/raw/`) 링크만 보인다.

## 정리

1. **방화벽이 없으면 바인딩 주소가 방화벽이다.** 그리고 그 주소를 못 찾으면 넓은 주소로 물러서지 말고 기다려야 한다.
2. **네트워크 경로만 막으면 브라우저 경로가 남는다.** 내 기기에서 도는 남의 자바스크립트는 내 사설망에 요청할 수 있다. Host 헤더 검사는 DNS 리바인딩에 대한 값싼 방어다.
3. **디렉터리를 공개하지 말고 목록을 공개한다.** 요청 값을 경로 조립에 쓰지 않으면 경로 조작 문제 자체가 사라진다.
4. **비공개 기능은 공개 서비스와 수명을 섞지 않는다.** 구조를 한 벌 더 만드는 비용이 공개 서비스를 멈추는 위험보다 싸다.
5. **200은 증거가 아니다.** 단일 페이지 앱 앞에서는 본문을 확인해야 한다.
6. **테스트 도구가 환경에서 동작하는지부터 의심한다.** proot 안에서는 SIGSTOP이 먹지 않았다. 도구가 조용히 실패하면 테스트는 거짓 안심을 준다.
