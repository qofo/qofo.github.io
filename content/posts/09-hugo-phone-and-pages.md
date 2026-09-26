---
title: "원본 하나, 서버 둘: Hugo로 옮겨 폰과 GitHub Pages에 동시에 배포하기"
slug: "hugo-phone-and-pages"
date: 2026-09-19
lastmod: 2026-09-20
weight: 9
series: ["스마트폰으로 서버 만들기"]
tags: ["Hugo", "GitHub Pages", "CORS", "ngrok", "Static Site", "Python"]
description: "2편에서 만든 블로그는 파이썬 파일 하나가 전부였다. 글 목록을 파싱하고, HTML을 문자열로 들고 있다가 내보내고, 마크다운은 브라우저가 marked로 그렸다. 이 구조에는 약점이 하나 있다. 폰이 꺼지면 글도 사라진다."
---
[2편](02-stdlib-python-blog.md)에서 만든 블로그는 파이썬 파일 하나가 전부였다. 글 목록을 파싱하고, HTML을 문자열로 들고 있다가 내보내고, 마크다운은 브라우저가 marked로 그렸다. 이 구조에는 약점이 하나 있다. **폰이 꺼지면 글도 사라진다.** [7편](07-hung-ngrok-health-checks.md)의 재부팅 장애 때 방문자가 본 것은 글이 아니라 ngrok의 오류 페이지였다.

이 글은 블로그를 Hugo 정적 사이트로 옮기고, 같은 원본을 폰과 GitHub Pages 두 곳에서 서비스하게 만든 기록이다. 계획과 달라진 곳이 세 군데 있었다. 그중 둘은 실제로 붙여 보기 전까지 드러나지 않았다.

---

## 목표와 제약

GitHub Pages는 정적 파일만 서비스한다. 반면 이 블로그의 대시보드는 폰의 CPU 코어별 사용률과 배터리를 실시간으로 보여 주고, 그 수치는 폰에서만 나온다. 그래서 목표를 "똑같은 사이트 두 벌"이 아니라 이렇게 잡았다.

- **글은 두 곳에서 똑같이 열린다.** 폰이 꺼져도 Pages에서는 열린다.
- **수치는 어느 쪽에서 열어도 폰에서 온다.** 폰이 꺼져 있으면 "응답 없음"으로 표시된다. (이 결정은 뒤에 바꿨다. 4절 끝의 덧붙임을 보라.)

```
             qofo.github.io 저장소 (main: 원본)
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
 hugo --environment phone            hugo (기본 설정)
         │                                 │
 /root/blog_builds/<시각>              gh-pages 브랜치
         │                                 │
 serve_blog.py ── ngrok                GitHub Pages
   └ /api/metrics ◀──── 대시보드가 교차 출처로 호출 ────┘
```

두 빌드의 차이는 설정 파일 한 장(`config/phone/hugo.toml`)에 모았다.

| 항목 | GitHub Pages | 폰 |
|:---|:---|:---|
| 대시보드 API | ngrok 주소의 `/api/metrics` (교차 출처) | `/api/metrics` (같은 출처) |
| 폴링 간격 (홈 / 대시보드) | 30초 / 5초 | 10초 / 3초 |
| `robots.txt` | 허용 | 전체 차단 |
| canonical | Pages 주소 | Pages 주소 |

검색엔진에는 Pages 사본만 원본으로 알린다. 폰 사본은 ngrok 경고 페이지 뒤에 있고, 주소도 언제든 바뀔 수 있다. 페이지 안의 링크는 모두 `/posts/…` 같은 루트 기준 경로로 만들었다. 그래서 폰 사본은 ngrok 주소, LAN 주소, Tailscale 주소 중 어느 것으로 열어도 동작한다.

## 1. 글 옮기기: 인용 블록 머리말을 front matter로

기존 글은 메타데이터를 인용 블록에 적었다. 옛 서버가 이 블록을 정규식으로 읽어 목록 카드를 만들었다.

```markdown
# 2편. 파이썬 표준 라이브러리만으로 만든 블로그, 그리고 첫 외부 공개

> **작성일**: 2026년 9월 17일
> **개정**: 2026년 9월 18일
> **시리즈**: 스마트폰으로 서버 만들기 (2편)
> **태그**: `Python`, `http.server`, `Cloudflare Tunnel`, ...
```

Hugo는 이 정보를 front matter로 받는다. 8편 모두 규칙이 같아서 변환 스크립트를 한 번 돌렸다.

```yaml
---
title: "파이썬 표준 라이브러리만으로 만든 블로그, 그리고 첫 외부 공개"
slug: "stdlib-python-blog"
date: 2026-09-17
lastmod: 2026-09-18
weight: 2
series: ["스마트폰으로 서버 만들기"]
tags: ["Python", "http.server", "Cloudflare Tunnel", ...]
legacy_id: "02_web_server_and_cloudflare_tunnel"
---
```

"2편"이라는 번호는 제목에서 빼고 `weight`로 옮겼다. 글 주소는 `/posts/<slug>/`다.

### 글 사이 링크

글 안에는 `[5편](#post=05_headless_autostart_and_self_healing_daemon)` 같은 링크가 21개 있었다. 옛 단일 페이지 앱의 해시 주소라서, Hugo 사이트에서도 GitHub 저장소 화면에서도 열리지 않는다.

Hugo의 표준 방법은 `relref` 단축 코드다. 하지만 이 문법은 GitHub에서 파일을 읽을 때 날것 그대로 보인다. 그래서 링크를 **파일 이름**으로 바꿨다. `[5편](05-termux-boot-supervisor.md)`은 GitHub의 파일 화면에서 그대로 열린다. Hugo 쪽에서는 링크 render hook이 이 링크를 실제 주소로 바꾼다.

```go-html-template
{{- $u := urls.Parse .Destination -}}
{{- $href := .Destination -}}
{{- if and (not $u.IsAbs) (strings.HasSuffix $u.Path ".md") -}}
  {{- with .PageInner.GetPage $u.Path -}}
    {{- $href = .RelPermalink -}}
  {{- else -}}
    {{- errorf "%s: link target %q does not exist" $.PageInner.File.Path $.Destination -}}
  {{- end -}}
{{- end -}}
```

대상 글이 없으면 `errorf`가 **빌드를 실패시킨다.** 깨진 링크가 배포되는 대신 배포가 멈춘다.

변환 뒤에는 원본과 본문을 비교했다. 머리말과 링크 주소만 빼고 비교했을 때 8편 모두 한 글자도 다르지 않았다.

### 이미 퍼진 옛 링크

어딘가에 공유된 `/#post=03_android_proot_...` 링크는 살려야 한다. 그런데 `#` 뒤의 조각은 브라우저가 서버로 보내지 않는다. 서버는 이 요청을 `/`로만 보기 때문에 리디렉트를 걸 수 없다.

그래서 front matter에 옛 ID(`legacy_id`)를 남겼다. 홈 페이지에는 빌드할 때 만든 "옛 ID → 새 주소" 표를 JSON으로 심었다. 홈의 스크립트는 해시가 표에 있으면 `location.replace`로 새 주소로 보낸다.

## 2. 테마: 외부 테마 대신 옛 화면을 옮겼다

(이 결정도 뒤에 바꿨다. 절 끝의 덧붙임을 보라.)

계획서는 Hugo 테마 PaperMod를 권했다. 실제로는 쓰지 않았다. 홈의 실시간 수치 표시와 대시보드는 PaperMod에 없어서, 결국 템플릿을 덮어써야 했다. 그렇다면 옛 단일 페이지 앱의 CSS 변수와 카드 디자인을 레이아웃 몇 장으로 옮기는 편이 짧았다. 외부 테마 서브모듈이 없으니 테마 버전이 Hugo 버전과 어긋날 걱정도 없다.

코드 강조는 브라우저의 highlight.js 대신 Hugo의 Chroma가 빌드할 때 처리한다. 어두운 테마와 밝은 테마의 스타일시트를 `hugo gen chromastyles`로 하나씩 만들어 이어 붙였더니, 밝은 테마에서 코드 글자가 거의 보이지 않았다.

```css
/* github-dark */ .chroma { color:#e6edf3; background-color:#0d1117; }
/* github      */ .chroma { background-color:#f7f7f7; }
```

밝은 스타일은 배경색만 바꾸고 글자색은 정하지 않는다. 그래서 어두운 쪽의 밝은 글자색(`#e6edf3`)이 밝은 배경 위에 그대로 남았다. 두 스타일이 서로 겹치지 않게 범위를 나눠서 해결했다. 하나는 `:root:not([data-theme="light"])` 아래에만, 다른 하나는 `[data-theme="light"]` 아래에만 적용된다.

> **덧붙임 (2026-09-20)**: 직접 옮긴 화면이 마음에 들지 않아 결국 **PaperMod로 갈아탔다.** 이 절의 판단은 "실시간 수치를 넣으려면 템플릿을 덮어써야 한다"였는데, 이는 덮어쓰기를 테마를 포기할 이유로 본 것이었다. PaperMod는 덮어쓸 자리를 미리 열어 둔다. `extend_head.html`, `extend_footer.html`, `extend_post_content.html`은 비어 있는 채로 불리고, `assets/css/extended/*.css`는 테마 스타일시트 뒤에 그대로 이어 붙는다. 홈의 수치 표시는 `home_info.html`을, 목록의 "N편" 표시는 `post_meta.html`을 각각 같은 이름으로 다시 쓰면 된다. 대시보드 레이아웃과 링크 렌더 훅은 손댈 필요도 없었다. 결과적으로 테마 파일을 통째로 복사해 온 것은 두 개, 고친 줄은 각각 한 줄이다. canonical을 `.Permalink` 대신 Pages 주소로 두는 `head.html`과, 목록 요약을 본문 앞부분 대신 글의 `description`으로 두는 `list.html`이다. 코드 강조도 PaperMod가 자기 Chroma 스타일시트를 들고 있어서, 위에서 직접 나눈 스타일시트는 지웠다. `noClasses = false`는 그대로 둬야 한다.
>
> 테마를 고를 때 걸린 것은 디자인이 아니라 빌드 환경이었다. [hugo-theme-stack](https://github.com/CaiJimmy/hugo-theme-stack)은 `theme.toml`이 Hugo 0.157 이상을 요구하는데, 폰의 apt Hugo는 0.154.5다. [Congo](https://github.com/jpanther/congo)는 이 폰에서 5분을 넘겨도 빌드가 끝나지 않아 중단했다. PaperMod는 같은 글 열 편을 약 2초에 빌드했다. 테마는 서브모듈이나 Hugo 모듈이 아니라 `themes/PaperMod/`에 파일째 넣었다. 빌드하는 쪽이 폰이라, 빌드가 네트워크를 타지 않는 편이 낫다.

## 3. 폰 서버: 렌더러에서 정적 파일 서버로

`serve_blog.py`는 1743줄에서 641줄이 됐다. 그중 1157줄이 파이썬 문자열 안에 든 HTML·CSS·JS였다. 남은 역할은 둘이다. Hugo가 만든 파일을 보내는 일과 `/api/metrics`다.

### 디렉터리를 공개하는 코드

[8편](08-tailnet-only-docs-server.md)에서는 "디렉터리가 아니라 목록을 공개한다"고 정리했다. 정적 사이트는 그럴 수 없다. 빌드하면 페이지가 100개 가까이 나오고, 빌드할 때마다 바뀐다. 그래서 경로를 조립하되, 조립한 결과를 검사한다.

```python
root = os.path.realpath(SITE_DIR)
parts = [p for p in path.split("/") if p]
if any(p.startswith(".") for p in parts):          # .., .build-info 같은 숨김 파일
    return "missing", None
candidate = os.path.realpath(os.path.join(root, *parts))
if not (candidate == root or candidate.startswith(root + os.sep)):
    return "missing", None                          # 심볼릭 링크 탈출 포함
if os.path.isdir(candidate) and not path.endswith("/"):
    # 요청 문자열이 아니라 조각에서 다시 만든다: "//host"가 Location에 들어가지 않게
    return "redirect", "/" + "/".join(parts) + "/"
```

퍼센트 인코딩을 풀 때 잘못된 UTF-8(`%ff`)은 예외로 잡아 404로 보낸다. 제어 문자(`%00`)와 역슬래시가 든 경로도 404다.

### 대조군이 드러낸 두 번째 방어

블랙박스 테스트 35개를 만들었다. 경로 조작 10가지, 리디렉트, 한글 경로, 캐시 헤더, ETag, CORS, 빌드 교체를 확인한다. 그리고 8편처럼 **대조군**을 돌렸다. 경로 검사 세 곳을 끄고, 리디렉트 주소를 요청 문자열 그대로 쓰게 바꾼 사본을 만들었다. 여기에 같은 테스트를 돌리면 실패가 나와야 한다.

```
[FAIL] /../secret.txt → 404, 비밀 노출 없음 — 200
[FAIL] /%2e%2e/secret.txt → 404, 비밀 노출 없음 — 200
[FAIL] /posts/..%2f..%2fsecret.txt → 404, 비밀 노출 없음 — 200
[FAIL] /posts/%2e%2e/%2e%2e/secret.txt → 404, 비밀 노출 없음 — 200
[FAIL] /escape/secret.txt → 404, 비밀 노출 없음 — 200
[FAIL] /.build-info → 404, 비밀 노출 없음 — 200
29/35 passed
```

경로 검사는 제 역할을 했다. 그런데 하나가 예상 밖이었다. 리디렉트를 바꿨는데도 `//posts/a` 테스트가 통과했다. 원인은 표준 라이브러리에 있었다. 이 폰의 Python 3.14 `http.server`는 요청을 파싱할 때 앞쪽의 겹친 슬래시를 이미 하나로 줄인다.

```python
if self.path.startswith('//'):
    self.path = '/' + self.path.lstrip('/')  # Reduce to a single /
```

내 코드의 방어는 두 번째 겹이었던 셈이다. 그대로 두었다. 대신 테스트가 확인하는 것은 "`//posts/a`는 안전하다"는 결과이고, 내 코드가 그 일을 하는지는 확인하지 못한다는 점을 기록해 두었다.

### 빌드가 없을 때는 200

폰에 빌드가 아예 없으면 무엇을 돌려줘야 할까. 처음에는 503이 자연스러워 보였다. 하지만 감시 데몬은 `/`가 세 번 연속(약 30초) 200이 아니면 서버가 먹통이라고 보고 재시작한다. 빌드가 없는 문제는 재시작으로 고쳐지지 않으니 재시작 루프만 남는다. [7편](07-hung-ngrok-health-checks.md)에서 정리한 "헬스체크는 고칠 수 있는 범위만 재야 한다"와 같은 이야기다. 그래서 이 경우 `/`는 200으로 "GitHub Pages에서 읽을 수 있다"는 안내를 보내고, 로그에 경고를 한 번 남긴다.

### 교체는 원자적으로

빌드는 매번 새 디렉터리(`/root/blog_builds/<UTC 시각>`)에 만든다. 서버가 읽는 `/root/blog_public`은 그 디렉터리를 가리키는 심볼릭 링크이고, 새 링크를 만든 뒤 `rename`으로 덮어써서 바꾼다.

```bash
ln -sfn "$out" "$LIVE.tmp"
mv -T "$LIVE.tmp" "$LIVE"      # rename(2): 옛 빌드 아니면 새 빌드, 중간은 없다
```

서버는 요청마다 링크를 다시 따라가므로 재시작하지 않아도 된다. 빌드가 실패하면 링크를 건드리지 않는다. 이 동작은 곧바로 실전에서 확인됐다. Hugo 설정에 `timeZone = "Asia/Seoul"`을 넣었더니 폰의 빌드가 이렇게 멈췄다.

```
ERROR failed to init config: invalid timeZone for language "ko": unknown time zone Asia/Seoul
ERROR: hugo build failed; the live site is unchanged
```

이 폰의 Ubuntu는 최소 설치라서 tzdata가 없다. 글의 날짜에는 시각이 없으므로 UTC로 읽어도 같은 날짜가 나온다. 그래서 설정을 뺐다. 그동안 서비스 중인 사이트는 바뀌지 않았다.

전환 자체는 감시 데몬의 `restart` 한 번이었다. 다운타임 기록에는 12초가 남았다.

## 4. Pages에서 대시보드 살리기: OPTIONS에 501을 돌려주던 서버

Pages에서 연 대시보드는 다른 출처인 ngrok 주소로 `/api/metrics`를 요청한다. 옛 서버는 이미 `Access-Control-Allow-Origin: *`를 보내고 있었으니 문제없어 보였다. 브라우저 요청을 curl로 흉내 내 보니 첫 번째 문제가 나왔다.

```
브라우저 User-Agent, 헤더 없음           → 200 text/html (2902 bytes)          ← ngrok 경고 페이지
브라우저 User-Agent + skip 헤더          → 200 application/json (1970 bytes)
```

ngrok 무료 플랜은 브라우저에서 온 요청에 피싱 방지용 경고 페이지를 먼저 보여 준다. 사람이 "Visit"를 누르면 쿠키가 생겨 7일 동안 다시 뜨지 않는다. 하지만 다른 출처의 페이지가 보내는 fetch는 그 쿠키를 갖고 있지 않다. 그래서 JSON 대신 경고 HTML을 받는다. ngrok 문서가 안내하는 우회법은 `ngrok-skip-browser-warning` 헤더를 붙이는 것이다.

여기서 두 번째 문제가 생긴다. 이 헤더는 CORS가 허용하는 기본 헤더가 아니다. 그래서 브라우저는 본 요청 전에 **preflight**(`OPTIONS`)를 먼저 보내 서버에 허락을 구한다. 이 요청도 흉내 내 봤다.

```
$ curl -X OPTIONS -A "<브라우저 UA>" -H 'Origin: https://qofo.github.io' \
       -H 'Access-Control-Request-Headers: ngrok-skip-browser-warning' .../api/metrics
HTTP/2 501
content-type: text/html;charset=utf-8
```

ngrok은 OPTIONS를 막지 않고 폰까지 통과시켰다. 501은 파이썬 `BaseHTTPRequestHandler`가 `do_OPTIONS`가 없을 때 내는 응답이다. 전날 계획을 세우며 확인한 것은 `Origin` 헤더를 붙인 GET의 응답 헤더뿐이었다. curl은 preflight를 보내지 않으니 그 확인은 통과했다. **curl로 통과한 CORS가 브라우저에서 통과한다는 보장은 없다.**

서버에 preflight 응답을 추가했다.

```python
METRICS_CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "ngrok-skip-browser-warning",
    "Access-Control-Max-Age": "7200",
}

def do_OPTIONS(self):
    self.send_response(204)
    if urllib.parse.urlsplit(self.path).path == "/api/metrics":
        for k, v in METRICS_CORS.items():
            self.send_header(k, v)
    ...
```

배포 후 같은 요청의 결과는 이렇다.

```
HTTP/2 204
access-control-allow-headers: ngrok-skip-browser-warning
access-control-allow-methods: GET, HEAD, OPTIONS
access-control-allow-origin: *
access-control-max-age: 7200
```

브라우저 쪽 스크립트도 경고 페이지를 전제로 짰다. 응답이 200이어도 `Content-Type`이 JSON이 아니면 실패로 본다. 경고 HTML을 파싱하려다 이상한 값을 그리는 대신 "폰이 응답하지 않는다"를 표시한다. 헤더는 요청이 다른 출처로 갈 때만 붙인다. 폰 사본은 같은 출처라서 preflight 자체가 생기지 않는다.

> **덧붙임 (2026-09-20)**: 결국 이 구조를 되돌렸다. 공개 사이트를 여는 사람마다 내 폰을 호출하게 되는 것이 맞지 않다고 판단해서, **Pages 사본에서는 대시보드와 홈의 수치 표시를 뺐다.** 대시보드는 폰 사본에만 있고, 같은 출처라서 preflight도 필요 없다. 서버의 OPTIONS 응답과 CORS 헤더는 남겨 두었다. 지우면 시험이 지키던 동작도 함께 사라지고, 나중에 다른 곳에서 수치를 쓸 여지도 없어진다. Hugo 쪽에서는 대시보드 원본을 `content-phone/`으로 옮기고, 폰 빌드에서만 그 폴더를 콘텐츠로 마운트한다. Pages 빌드에는 페이지도, 텔레메트리 스크립트도 아예 만들어지지 않는다.

### 요청 수를 아끼는 이유

옛 대시보드는 2초마다 수치를 요청했다. 폰 사본만 있을 때는 방문자가 적어서 괜찮았다. Pages에 올리면 방문자가 늘 수 있고, 그 요청은 모두 ngrok을 지난다. ngrok 문서에 따르면 무료 플랜의 HTTP 요청 한도는 **월 20,000건**이다. 그래서 다음처럼 바꿨다.

- 간격을 늘렸다. Pages는 홈 30초, 대시보드 5초다.
- 탭이 가려지면(`visibilitychange`) 요청을 멈춘다.
- 요청이 실패하면 간격을 두 배씩 늘려 최대 60초까지 둔다.
- preflight 결과는 `Access-Control-Max-Age`로 캐시하게 해서 매 요청마다 반복되지 않게 했다.

## 5. Pages 배포: GitHub Actions 대신 gh-pages 브랜치

계획은 GitHub Actions였다. `main`에 push하면 GitHub가 빌드해서 배포하는, 가장 흔한 구성이다. 워크플로 파일까지 커밋한 뒤 push하기 전에 이 폰의 git이 쓰는 토큰 권한을 확인했다.

```
X-OAuth-Scopes: repo
```

GitHub 문서에서 워크플로 파일을 추가하거나 고치는 권한은 `workflow`다. 이 토큰에는 그 권한이 없으니 워크플로 파일을 올릴 수 없다. 거절될 push를 시험해 보지는 않고 여기서 멈췄다. 따로 로그인된 `gh` CLI의 토큰도 확인했다. Pages 설정을 바꾸려 하자 거부됐다.

```
gh: Resource not accessible by personal access token (HTTP 403)
```

토큰 권한을 바꾸는 방법도 있었다. 하지만 이 작업에 Actions가 꼭 필요한지부터 따져 봤다. 폰에서 Hugo 빌드는 1초가 걸리지 않는다(`Total in 674 ms`). 또 폰에서 두 사본을 모두 빌드하면 **같은 커밋을 같은 Hugo 바이너리로** 만든다는 장점도 생긴다. 그래서 Pages용 빌드도 폰에서 만들어 `gh-pages` 브랜치로 올리기로 했다.

작업 트리를 건드리지 않으려고 git의 저수준 명령으로 커밋한다. 임시 index 파일에 빌드 결과를 담고, `write-tree`로 트리를 만든 뒤, `commit-tree`로 `gh-pages` 위에 커밋을 얹는다.

```bash
(cd "$out" && GIT_DIR="$SRC/.git" GIT_WORK_TREE="$out" GIT_INDEX_FILE="$idx" git add -A)
tree=$(GIT_INDEX_FILE="$idx" git -C "$SRC" write-tree)
# 빌드 결과가 직전과 같으면 새 커밋을 만들지 않는다
commit=$(git -C "$SRC" commit-tree "$tree" -p "$parent" -m "Build $rev: ...")
git -C "$SRC" update-ref refs/heads/gh-pages "$commit"
```

빌드 결과에는 `.nojekyll`을 넣어 GitHub가 Jekyll로 다시 처리하지 않게 했다. 발행 명령은 이렇게 하나다.

```
$ publish_blog.sh publish
[pages] 0c53395 builds the same site as gh-pages 78d1d11; no new commit
[phone] 0c53395 -> /root/blog_builds/20260919-163529 (8 posts), live now
[phone] http://127.0.0.1:8080/ -> HTTP 200, serving the Hugo build
[push]  origin main gh-pages
```

첫 줄의 "no new commit"은 직전에 `publish_blog.sh pages`로 같은 커밋을 이미 빌드해 두었기 때문이다. 트리가 같으면 커밋을 만들지 않으니, 글을 고치지 않은 발행은 `gh-pages` 이력을 늘리지 않는다.

작업 트리가 깨끗하지 않으면 시작하지 않는다. 커밋하지 않은 변경이 한쪽에만 들어가는 일을 막기 위해서다. `main`과 `gh-pages`는 `git push --atomic`으로 함께 올라가거나 함께 실패한다.

### 설정을 바꿨는데 배포되지 않았다

Pages의 소스를 API로 `gh-pages` 브랜치로 바꾸고 `main`까지 push했다. 그런데 `qofo.github.io`는 여전히 예전 시험용 페이지를 보여 줬다. 빌드 기록을 보니 빌드는 한 번뿐이었다.

```
2026-09-19T14:52:44Z built d8bc9f5     ← 저장소를 처음 만들 때의 init 커밋
```

`gh-pages`는 소스를 바꾸기 전에 push했고, 소스를 바꾼 뒤 push한 것은 이제 소스가 아닌 `main`이었다. 소스를 바꾸는 것만으로는 빌드가 시작되지 않았다. 빌드를 API(`POST /repos/.../pages/builds`)로 직접 요청하자 `queued`가 돌아왔고, 곧 `built 78d1d11`이 됐다.

그 뒤에도 첫 화면은 한동안 옛 페이지였다. 응답 헤더를 보면 CDN 캐시였다.

```
cache-control: max-age=600
x-cache: HIT
```

주소에 쿼리 문자열을 붙여 캐시를 피하자 새 사이트가 나왔다.

처음에는 소스를 바꾼 첫 전환에서만 겪는 일이라고 생각했다. 실제로 그다음 글을 올렸을 때는 push하고 몇 초 만에 빌드가 돌았다. 그런데 그 뒤 글을 하나 더 올렸을 때는 8분을 기다려도 빌드가 시작되지 않았고, 다시 API로 요청해야 했다. **push가 빌드를 부르는 것은 보장되지 않는다.** 그래서 발행 스크립트가 push한 뒤 1분 동안 빌드가 시작되는지 지켜보고, 시작되지 않으면 직접 요청한 다음 결과까지 확인하도록 고쳤다.

---

## 검증

| 대상 | 방법 | 결과 |
|:---|:---|:---|
| `serve_blog.py` | 블랙박스 테스트 | 35/35. 검사를 끈 사본에서는 6개 실패 |
| 브라우저 스크립트 | jsdom에서 실제 빌드 HTML 실행 | 27/27 |
| 폰 사본 | 모든 내부 링크 크롤링 | 89개 URL, 깨진 링크 0 |
| Pages 사본 | 같은 크롤링 | 89개 URL, 깨진 링크 0 |
| 대시보드 preflight | ngrok 주소로 OPTIONS | 501 → 204 |
| 전환 중단 시간 | 감시 데몬의 다운타임 기록 | 12초 |

jsdom 시험에서는 `fetch`를 가짜로 바꿔 끼우고 다음을 확인했다.

- Pages 사본은 ngrok 주소로 요청하고 헤더를 붙인다. 폰 사본은 상대 경로로 요청하고 헤더를 붙이지 않는다.
- 경고 HTML을 받으면 "폰이 응답하지 않는다"로 바뀌고, 탭이 다시 보이면 즉시 재시도해 복구된다.
- `#post=03_…`로 들어오면 새 주소로 이동한다.

이 시험은 `npm i jsdom`이 필요해서 저장소에는 넣지 않았다.

## 한계

- **Pages에서도 수치는 폰이 있어야 나온다.** 폰이나 터널이 멈추면 글은 열리지만 대시보드는 "응답 없음"이다. 의도한 동작이지만, 이 표시가 사실상 서버 감시 역할도 한다.
- **요청 한도는 빠듯했다.** 대시보드 탭 하나를 5초 간격으로 열어 두면 시간당 720건이고, 월 20,000건은 그런 탭 하나가 약 28시간 버티는 양이다. 방문자가 늘면 이 한도가 먼저 바닥난다. 위 덧붙임대로 Pages에서 대시보드를 빼면서 이 부담은 사라졌다. 폰 주소로 직접 들어와 대시보드를 여는 경우에만 남는다.
- **GitHub 웹에서 고친 글은 바로 반영되지 않는다.** 빌드가 폰에 있으므로, 폰에서 `publish`를 실행해야 한다. 토큰에 `workflow` 권한을 주면 Actions로 옮길 수 있다.

## 정리

1. **원본은 하나, 빌드는 둘.** 두 사본의 차이는 설정 파일 한 장에 모은다. 링크는 루트 기준 경로로 만들어 어느 주소로 열어도 동작하게 한다.
2. **curl로 통과한 CORS는 증거가 아니다.** 비표준 헤더 하나가 preflight를 부르고, curl은 그것을 보내지 않는다.
3. **교체는 원자적으로, 실패는 이전 상태로.** 심볼릭 링크를 rename으로 바꾸면 "반쯤 배포된" 상태가 없다. 빌드가 실패한 날에도 사이트는 그대로였다.
4. **도구의 권한은 계획의 일부다.** Actions 계획은 코드가 아니라 토큰 권한에서 막혔다. push하기 전에 확인했기에 되돌릴 일이 없었다.
5. **설정을 바꿨다고 배포된 것은 아니다.** Pages 소스를 바꿔도 빌드는 시작되지 않았고, CDN은 옛 페이지를 10분 동안 들고 있었다. 결과는 실제 주소에서 확인한다.
6. **대조군은 내 코드 밖의 방어도 드러낸다.** 방어가 두 겹이면, 한 겹을 꺼도 테스트는 통과할 수 있다.
