# 2편. 파이썬 표준 라이브러리만으로 만든 블로그, 그리고 첫 외부 공개

> **작성일**: 2026년 9월 17일  
> **개정**: 2026년 9월 18일  
> **시리즈**: 스마트폰으로 서버 만들기 (2편)  
> **태그**: `Python`, `http.server`, `Cloudflare Tunnel`, `Termux`, `Networking`, `Markdown`

[1편](#post=01_agy_setup_and_troubleshooting)에서 폰 안에 Ubuntu를 올리고 AI 에이전트를 붙였다. 다음 문제는 가독성이었다. 작업 기록을 마크다운으로 남겼는데, 터미널에서 `cat`으로 읽으면 표는 어긋나고 코드 블록은 백틱이 그대로 보인다.

그래서 폰에서 바로 구동할 수 있는 경량 웹 뷰어를 만들었다. 설계 목표는 두 가지다.
- **추가 의존성 설치가 없을 것**
- **모바일 브라우저에서 정상적으로 렌더링될 것**

---

## 무의존성 경량 웹 서버 구현

외부 프레임워크 대신 Python 표준 라이브러리만을 사용하여 웹 서버를 구현했다. RAM 4GB 환경의 스마트폰에서 수백 개의 패키지를 설치하는 것은 리소스 소모가 크며, 특히 proot 환경에서는 다수의 소용량 파일을 생성하는 작업(`npm install` 등)의 I/O 속도가 크게 저하되기 때문이다.

```python
import http.server
import socketserver

PORT = 8080
POSTS_DIR = "/posts"
```

서버의 역할은 세 가지 엔드포인트로 한정된다.

- `/`: 화면 UI를 구성하는 단일 HTML 문서를 반환한다.
- `/api/posts`: `/posts/*.md` 파일들을 탐색하여 제목, 날짜, 태그, 요약 목록을 JSON 형식으로 반환한다.
- `/api/post?id=...`: 요청된 마크다운 원문 텍스트를 그대로 반환한다.

마크다운의 HTML 변환은 클라이언트 브라우저에서 처리하도록 설계했다. 서버는 원문 텍스트만 전달하고, 화면에서 `marked.js`가 렌더링을 수행하며 `highlight.js`가 코드 구문 강조를 처리한다. 이를 통해 스마트폰 CPU의 부하를 최소화하고 파일 수정 사항을 새로고침만으로 즉시 반영할 수 있다.

글 목록 역시 별도 데이터베이스 없이 파일 시스템 기반으로 관리한다. `/posts/` 디렉터리에 `.md` 파일을 추가하면 서버 재시작 없이 즉시 블로그에 반영된다.

```bash
python3 /root/serve_blog.py
# Blog & Dashboard server running on http://0.0.0.0:8080
```

폰 브라우저에서 `http://localhost:8080`, 같은 Wi-Fi의 PC에서 `http://192.168.0.42:8080`으로 접속된다. 여기까지 10분이 걸렸다.

## 외부 접속 불가: 사설 IP의 한계

`192.168.0.42`는 공유기가 내부 기기에 할당한 사설 IP다. 동일 Wi-Fi 대역을 벗어나면 이 주소로는 접속할 수 없다. 스마트폰이 LTE 망에 연결되면 통신사의 CGNAT(Carrier-Grade NAT) 환경에 배치되므로 공인 IP조차 할당받지 못한다.

따라서 외부에서 내부로 들어오는 인바운드 연결을 생성할 수 없다. 공유기 포트포워딩은 로컬 Wi-Fi 환경에서만 유효하며, 통신사 망에서는 개방할 수 있는 포트가 존재하지 않는다.

이 문제는 아웃바운드 터널링(Reverse Tunneling)으로 해결할 수 있다. 외부에서 내부로 직접 접속하는 대신, 스마트폰이 외부 중계 서버(엣지)로 먼저 아웃바운드 연결을 맺어 두는 방식이다.

```
[방문자] ──HTTPS──> [터널 서비스 엣지] <──바깥으로 맺은 연결── [내 폰]
                                                                  │
                                                        localhost:8080
```

방문자가 중계 서비스로 접속하면 미리 수립된 터널을 통해 스마트폰의 `localhost:8080`으로 트래픽이 전달된다.

## Cloudflare Quick Tunnel을 통한 외부 공개

Cloudflare Quick Tunnel은 계정 생성, 도메인 등록, 설정 파일 작성 없이 즉시 터널을 개설할 수 있는 도구다.

```bash
curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 \
  -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared

cloudflared tunnel --url http://localhost:8080
```

스마트폰 CPU는 ARM 64비트 아키텍처이므로 `linux-arm64` 빌드를 내려받아야 한다. x86_64 바이너리는 실행되지 않는다.

실행하자마자 임의의 도메인(`https://four-processes-launches-tapes.trycloudflare.com` 형태)이 발급됐다. 로그를 보면 인천(`icn01`) 엣지에 QUIC으로 붙었다. 폰에 띄운 페이지가 공인 HTTPS 인증서를 달고 외부에 공개된 상태다.

```
2026-09-17T12:28:02Z INF Registered tunnel connection location=icn01 protocol=quic
```

## Quick Tunnel의 특성과 구조적 한계

Quick Tunnel은 공유기 포트포워딩이나 인증서 발급 과정 없이 즉시 외부 접속 환경을 구성할 수 있으며, LTE 망 전환 시에도 연결이 유지된다.

그러나 안정적인 서비스 운영 관점에서는 두 가지 한계가 존재한다.

- **임의 도메인 재발급**: `*.trycloudflare.com` 형태의 주소는 무작위로 생성되며, 터널을 재시작할 때마다 완전히 새로운 주소가 발급된다. 프로세스가 재기동되면 기존 접속 링크가 무효화되므로 고정 도메인이 필요한 환경에는 적합하지 않다.
- **단일 스레드 블로킹**: 초기 구현에 사용한 `socketserver.TCPServer`는 동시 요청을 처리하지 못하고 요청을 한 번에 하나씩 직렬로 처리한다. 특정 클라이언트의 응답 처리가 지연되면 다른 모든 요청이 차단되는 구조다. 이 문제는 이후 [6편](#post=06_audit_and_supervisor_rewrite)에서 멀티스레드 기반 서버로 재설계하여 해결한다.

---

스마트폰 내부에서 웹 서버를 띄우는 작업보다 **외부에서 안정적으로 접근할 수 있는 고정 주소를 확보하는 작업**이 핵심 과제다. 다음 편에서는 본격적인 주소 고정 작업에 앞서 일반 리눅스 서버와 모바일 PRoot 환경 간의 구조적 차이 및 제약 사항을 정리한다.

→ [3편. 스마트폰 리눅스의 진짜 제약: 가짜 root, 없는 systemd, 그리고 가짜 /proc](#post=03_android_proot_server_architecture_and_gotchas)
