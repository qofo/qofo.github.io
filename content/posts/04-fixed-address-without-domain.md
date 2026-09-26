---
title: "도메인 없이 고정 주소 갖기: Cloudflare, DuckDNS, ngrok 실전 비교"
slug: "fixed-address-without-domain"
date: 2026-09-17
lastmod: 2026-09-18
weight: 4
series: ["스마트폰으로 서버 만들기"]
categories: ["인프라", "폰 홈서버"]
tags: ["ngrok", "Cloudflare Tunnel", "DuckDNS", "DDNS", "CGNAT", "Networking"]
description: "결론부터 쓰면 ngrok의 무료 고정 도메인을 채택했다. 개인 도메인을 사지 않고, 공유기를 건드리지 않고, 폰이 어느 망에 붙어 있든 같은 주소로 열리는 방식은 이것뿐이었다."
legacy_id: "04_permanent_tunneling_and_domain_strategy"
---
결론부터 쓰면 ngrok의 무료 고정 도메인을 채택했다. 개인 도메인을 사지 않고, 공유기를 건드리지 않고, 폰이 어느 망에 붙어 있든 같은 주소로 열리는 방식은 이것뿐이었다.

[2편](02-stdlib-python-blog.md)에서 쓴 Cloudflare Quick Tunnel은 주소가 무작위로 발급되고 재시작할 때마다 바뀐다. 블로그라면 어제 공유한 링크가 오늘도 열려야 한다. 아래 세 가지를 차례로 구현했고 두 번 실패했다.

---

## 시도 1: Cloudflare Named Tunnel — 도메인 소유권의 벽

Quick Tunnel과 달리 Named Tunnel은 고정된 이름을 갖는다. 연결까지는 문제가 없었지만 공개 주소를 붙이는 마지막 단계에서 막혔다.

CLI 로그인(`cloudflared tunnel login`)은 폰에서 불편하다. 브라우저 승인이 늦으면 세션이 만료되고, 성공해도 `cert.pem`이 폰의 다운로드 폴더에 떨어져 proot 안으로 옮겨야 한다. 대시보드에서 터널을 만들고 토큰만 받아 오는 방식이 낫다.

```bash
cloudflared tunnel run --token eyJh...
```

연결 품질은 좋았다. 사전 점검을 모두 통과하고 인천(`icn01`) 엣지에 QUIC으로 붙었다.

```
INF  SUMMARY: Environment is healthy. cloudflared will use 'quic' as primary protocol.
INF  Registered tunnel connection location=icn01 protocol=quic
```

막힌 지점은 Public Hostname이다. 터널에 공개 주소를 연결하려면 **Cloudflare 네임서버로 위임된 본인 소유의 도메인**이 있어야 한다. `*.duckdns.org`나 `*.ts.net` 같은 무료 서브도메인은 네임서버 권한을 넘겨받을 수 없어 등록 자체가 불가능하다. "도메인을 사지 않는다"는 조건과 정면으로 충돌한다.

> **정리하지 않은 설정이 남았다.** ngrok으로 갈아탄 뒤에도 Cloudflare 대시보드의 터널 설정에는 `blog.daringly-marrow-penny.ngrok-free.dev`라는 호스트네임이 남아 있었다. 소유하지 않은 ngrok 도메인을 Cloudflare 터널의 목적지로 지정한 셈이라 동작할 수 없는 설정이다. 며칠 뒤 로그를 훑다가 발견했다. 쓰지 않기로 한 서비스는 설정까지 지워야 한다.

## 시도 2: DuckDNS + 포트포워딩 — 도메인은 공유기까지만 안내한다

무료 DDNS인 DuckDNS로 서브도메인을 만들어 집 공인 IP에 연결했다. 외부에서 접속하자 폰의 블로그가 아니라 **윈도우 IIS 기본 페이지**가 응답했다.

```
$ curl -I http://<내-서브도메인>.duckdns.org
HTTP/1.1 200 OK
Server: Microsoft-IIS/10.0
```

원인은 폰이 아니라 공유기였다. DuckDNS는 집 공인 IP를 정확히 가리키고 있었지만, 그 IP의 80번 포트는 예전에 데스크톱 PC로 포트포워딩되어 있었다. **도메인은 집 현관까지만 안내하고, 그 안에서 어느 방으로 갈지는 공유기가 정한다.**

폰 전용으로 8080 포트를 추가로 열면 접속은 된다. 그래도 조건을 만족하지 못한다.

- 공유기 관리자 권한이 필요하다.
- 폰을 들고 나가면 끝이다. 카페 와이파이나 LTE에서는 열 포트가 없다.
- HTTPS 인증서를 직접 발급하고 갱신해야 한다.

## 시도 3: ngrok 무료 고정 도메인 — 채택

ngrok은 무료 계정에도 바뀌지 않는 고정 도메인 하나를 준다. 설정은 토큰 한 줄이다.

```yaml
# /root/.config/ngrok/ngrok.yml
version: "3"
agent:
    authtoken: <발급받은 토큰>
```

```bash
/usr/local/bin/ngrok http 8080 \
    --url https://daringly-marrow-penny.ngrok-free.dev \
    --pooling-enabled \
    --log stdout
```

세 조건을 모두 만족한다. 도메인 구입 0원, 공유기 설정 0, 망이 바뀌어도 같은 주소다.

### `--pooling-enabled`가 필요한 이유

재시작을 빠르게 반복하면 이 오류가 난다.

```
failed to start tunnel: The endpoint 'https://daringly-marrow-penny.ngrok-free.dev'
is already online. ... ERR_NGROK_334
```

엣지가 이전 세션을 정리하기 전에 새 에이전트가 같은 주소를 요구해서 거절당한 것이다. `--pooling-enabled`를 붙이면 두 세션이 잠시 공존하며 넘겨받으므로 재시작이 끊기지 않는다. 감시 데몬이 프로세스를 다시 띄우는 구조에서는 사실상 필수 옵션이다.

### 무료 플랜의 대가: 브라우저 경고 페이지

ngrok 무료 플랜은 브라우저로 들어온 방문자에게 경고 페이지를 먼저 보여 준다. 같은 주소를 두 방식으로 요청하면 차이가 분명하다.

```bash
$ curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://daringly-marrow-penny.ngrok-free.dev/
200 39813        # 블로그 본문

$ curl -s -A "Mozilla/5.0 (Linux; Android 14) ... Chrome/140.0" ... 
200 2902         # "You are about to visit ..." 경고 페이지 (ERR_NGROK_6024)
```

링크를 받은 사람은 버튼을 한 번 더 눌러야 글을 본다. `curl`이나 API 호출은 걸리지 않는다. 없애려면 유료 플랜을 쓰거나 도메인을 사서 Cloudflare Named Tunnel로 돌아가야 한다. 지금은 "공짜로 고정 주소"의 대가로 받아들이고 있다.

## 세 방식 비교

| | Cloudflare Named Tunnel | DuckDNS + 포트포워딩 | ngrok 무료 고정 도메인 |
|:---|:---|:---|:---|
| 개인 도메인 | **필요** | 불필요 | 불필요 |
| 공유기 설정 | 불필요 | **필요** | 불필요 |
| HTTPS | 자동 | 직접 발급·갱신 | 자동 |
| 집 밖에서 | 정상 | **불가** | 정상 |
| 방문자 경험 | 깨끗함 | 깨끗함 | **경고 페이지 1회** |
| 난이도 | 중 (도메인 위임) | 중 (공유기 권한) | 하 |

도메인을 이미 갖고 있다면 Cloudflare가 가장 깔끔하다. 아무것도 없이 오늘 고정 주소가 필요하다면 ngrok이다.

---

주소 문제는 여기서 끝났다. 남은 과제는 사람이 손대지 않아도 이 프로세스들이 계속 살아 있게 만드는 것이다. 다음 편에서 부팅 자동 실행과 감시 데몬을 구성한다.

→ [5편. Termux:Boot와 감시 데몬으로 무인 운영 구성하기](05-termux-boot-supervisor.md)
