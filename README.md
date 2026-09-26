# qofo.log

읽은 것, 만든 것, 고친 것을 기록하는 개인 블로그 [qofo.log](https://qofo.github.io/)의 원고 저장소다.

## 연재

### 스마트폰으로 서버 만들기

쓰지 않던 갤럭시 노트 FE(Android 9)에 우분투를 올려 블로그를 24시간 공개하면서 겪은 일을 기록한 연재다. 설치와 외부 공개에서 시작해, 장애를 분석하고 감시 구조를 다시 설계하는 데까지 이어진다. 코드와 운영 문서는 [`qofo/phone-homeserver`](https://github.com/qofo/phone-homeserver)에 있다.

| 편 | 제목 |
|---|---|
| 1 | [서랍 속 갤럭시 노트 FE에 우분투를 올리기까지](https://qofo.github.io/posts/ubuntu-on-galaxy-note-fe/) |
| 2 | [파이썬 표준 라이브러리만으로 만든 블로그, 그리고 첫 외부 공개](https://qofo.github.io/posts/stdlib-python-blog/) |
| 3 | [스마트폰 리눅스의 진짜 제약: 가짜 root, 없는 systemd, 그리고 가짜 /proc](https://qofo.github.io/posts/proot-constraints/) |
| 4 | [도메인 없이 고정 주소 갖기: Cloudflare, DuckDNS, ngrok 실전 비교](https://qofo.github.io/posts/fixed-address-without-domain/) |
| 5 | [Termux:Boot와 감시 데몬으로 무인 운영 구성하기](https://qofo.github.io/posts/termux-boot-supervisor/) |
| 6 | [감시 데몬이 지키지 못한 것: 원인 분석과 재설계](https://qofo.github.io/posts/supervisor-postmortem/) |
| 7 | [살아 있지만 일하지 않는 프로세스: 재부팅 후 멈춘 ngrok과 능동 헬스체크](https://qofo.github.io/posts/hung-ngrok-health-checks/) |
| 8 | [Tailscale 안에서만 열리는 문서 서버: 방화벽 없는 폰에서 접근 제어하기](https://qofo.github.io/posts/tailnet-only-docs-server/) |
| 9 | [원본 하나, 서버 둘: Hugo로 옮겨 폰과 GitHub Pages에 동시에 배포하기](https://qofo.github.io/posts/hugo-phone-and-pages/) |
| 10 | [터미널 말고 편집기: 폰에 VS Code를 올리고 tailnet 안에서만 열기](https://qofo.github.io/posts/code-server-on-the-phone/) |
| 11 | [터미널을 닫아도 작업은 이어진다: proot 밖 tmux에 에이전트 세션 두기](https://qofo.github.io/posts/agent-session-outside-proot/) |

## 구조

[Hugo](https://gohugo.io/) 사이트이고, 테마는 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) (MIT)다. 서브모듈이나 Hugo 모듈이 아니라 `themes/PaperMod/`에 파일째 넣어 두었다. 폰에서 빌드하므로 빌드 시점에 네트워크를 타지 않는 편이 낫고, `git clone` 한 번으로 빌드가 되기 때문이다.

| 경로 | 내용 |
|---|---|
| `content/posts/` | 글 원본. 파일 이름은 `NN-<slug>.md`, 주소는 `/posts/<slug>/` |
| `content-phone/` | 폰 빌드에만 들어가는 페이지. 지금은 실시간 대시보드 하나다 |
| `themes/PaperMod/` | 테마 원본. 직접 고치지 않는다 |
| `layouts/`, `assets/` | 테마 위에 얹는 것들. 대시보드, 텔레메트리, 한국어 폰트, 링크·표·코드 블록 렌더 훅, 글 머리의 연재 상자, 글 끝의 링크 복사·글쓴이 카드·함께 읽을 글, 읽기 진행 막대와 넓은 화면의 옆 목차(`assets/js/post.js`), `/` 검색 단축키(`assets/js/site.js`), 공유 미리보기 카드 |
| `assets/fonts/` | 공유 미리보기 카드를 그릴 때만 쓰는 Pretendard Bold. [SIL OFL 1.1](assets/fonts/OFL.txt)이고, 방문자에게는 보내지 않는다 |
| `hugo.toml` | GitHub Pages 빌드 설정 |
| `config/phone/hugo.toml` | 폰 빌드에서 덮어쓰는 설정 (`hugo --environment phone`) |

테마에 손대는 대신 `layouts/`와 `assets/css/extended/`에서 덮어쓴다. 테마 파일을 통째로 복사해 온 것은 여섯 개이고, 모두 고친 곳이 한두 군데뿐이다. 파일 안에 `CHANGED FROM THE THEME` 주석으로 표시해 두었다.

| 복사해 온 파일 | 고친 곳 |
|---|---|
| `layouts/_partials/head.html` | canonical 주소를 `.Permalink` 대신 Pages 주소로 |
| `layouts/list.html` | 목록 요약을 본문 앞부분 대신 글의 `description`으로, 최신 글이 먼저 오도록 날짜순, 목록 항목 아래에 태그 |
| `layouts/_partials/header.html` | 로고 앞에 메뉴 버튼(☰), 가로 메뉴 대신 검색 아이콘, 헤더 뒤에 메뉴 서랍(`site_drawer.html`) |
| `layouts/_partials/post_nav_links.html` | 이전·다음 글을 편 번호(weight) 대신 날짜순으로 |
| `layouts/_partials/post_canonical.html` | 글 머리 끝에 연재 상자(`series_box.html`) 호출 한 줄. 테마에는 머리와 본문 사이에 끼울 자리가 따로 없다 |
| `layouts/_partials/templates/_funcs/get-page-images.html` | 글에 이미지가 없으면 생성한 공유 카드(`og_card.html`)를 돌려준다. og:image, 트위터 카드, JSON-LD가 모두 이것을 쓴다 |

테마를 올릴 때는 `themes/PaperMod/`를 새 버전으로 교체한 뒤, 위 파일들을 다시 복사하고 표시된 곳만 다시 적용한다. 지금 들어 있는 버전은 PaperMod `d376885`(2026-08-02)다.

`main`에는 원본만 있다. Pages가 서비스하는 빌드 결과는 `gh-pages` 브랜치에 있다.

같은 원본을 두 곳에서 서비스한다.

- **GitHub Pages**: 폰에서 빌드한 결과를 `gh-pages` 브랜치에 올린다. 폰이 꺼져도 글은 열린다.
- **폰**: 같은 커밋을 폰용 설정으로 빌드해 폰의 서버가 보낸다.

두 빌드는 폰의 배포 스크립트 하나(`publish_blog.sh publish`, [`qofo/phone-homeserver`](https://github.com/qofo/phone-homeserver))가 같은 커밋과 같은 Hugo로 만들고, `main`과 `gh-pages`를 함께 push한다.

실시간 대시보드는 **폰 사본에만** 있다. 공개 사이트를 여는 사람마다 폰을 호출하게 되는 구조가 맞지 않아서, GitHub Pages 쪽에서는 대시보드와 홈의 수치 표시를 뺐다. 검색엔진용 canonical 주소는 두 사본 모두 Pages로 고정했다.

글을 게시한 뒤 다른 날에 내용을 고쳤으면 front matter에 `lastmod: YYYY-MM-DD`를 적는다. 글 머리에 "(수정 날짜)"로 표시된다. 날짜를 git에서 가져오지 않는 까닭은, Hugo로 옮기면서 모든 파일을 한 번씩 건드렸기 때문이다. 오타나 링크를 고친 정도라면 적지 않는다.

글끼리는 `[2편](02-stdlib-python-blog.md)`처럼 파일 이름으로 링크한다. 이렇게 쓰면 GitHub에서 파일을 읽을 때도 링크가 열린다. Hugo는 빌드할 때 이 링크를 실제 주소로 바꾸고, 대상 글이 없으면 빌드를 실패시킨다.

## 글 쓰기

```bash
hugo new posts/<slug>.md   # archetypes/posts.md의 틀로 초안(draft)을 만든다
```

- **카테고리**는 `categories: ["상위", "하위"]` 두 단계다. 메뉴(☰)의 카테고리 트리는 글에 적힌 값으로 빌드할 때 만들어지므로, 새 주제는 글에 새 카테고리를 적는 것으로 생긴다. 글 주소는 `/posts/<slug>/`이고 카테고리가 들어가지 않아서, 분류를 바꿔도 링크는 깨지지 않는다.
- **연재**에 속하는 글만 `series`와 `weight`(편 번호)를 적고, 파일 이름을 `NN-<slug>.md`로 한다. 연재 밖의 글은 `<slug>.md`이고 둘 다 적지 않는다. 목록과 이전·다음 글은 날짜순이다.
- 게시한 뒤 다른 날에 내용을 고쳤으면 `lastmod: YYYY-MM-DD`를 적는다(아래).

## 로컬 빌드

```bash
hugo server                       # 미리보기 (http://localhost:1313/)
hugo --minify                     # Pages와 같은 빌드 → public/
hugo --minify --environment phone # 폰용 빌드
```

폰은 Ubuntu 26.04의 apt 패키지인 Hugo 0.154.5 extended로 빌드한다. 다른 곳에서 빌드할 때도 이 버전에 맞춘다.

## 라이선스

글은 [CC BY 4.0](LICENSE)이다. 출처를 밝히면 자유롭게 공유하고 바꿀 수 있다.
