# qofo.log

읽은 것, 만든 것, 고친 것을 기록하는 개인 블로그 [qofo.log](https://qofo.github.io/blog/)의 원고 저장소다. 사이트의 첫 화면 [qofo.github.io](https://qofo.github.io/)에는 CV가 있다. CV와 블로그는 서로 링크하지 않는다.

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
| 12 | [알림으로는 배터리를 지킬 수 없었다: 스마트 플러그로 충전기 켜고 끄기](https://qofo.github.io/posts/smart-plug-charging/) |

### MML 장별 상세 해설

Deisenroth, Faisal, Ong의 *Mathematics for Machine Learning* 2~12장을 장마다 한 편씩 풀어 쓴 해설이다. 장마다 손계산 예제, 핵심 유도, 말로 설명하기, 연습문제 풀이, 요약이 있다. 13편은 2~7장 교재 연습문제 75개의 단계별 전체 풀이다. 교재에 장 끝 문제가 없는 8~12장은 교재를 따라 문제를 만들어 14편(문제)과 15편(답과 풀이)으로 나눴다. 16편과 17편은 과목당 60분에 맞춘 실전 모의고사(기본 계산 위주의 A형, 영어 지문·증명 위주의 B형)와 그 풀이다. 18편은 시험 직전에 볼 공식·조건·증명 뼈대를 한 편에 모은 최종 정리다. 원고는 `content/posts/mml/`에 있다.

| 편 | 제목 |
|---|---|
| 1 | [MML 장별 상세 해설: 목차와 공부 순서](https://qofo.github.io/posts/mml-guide/) |
| 2 | [MML 2장 선형대수: 연립방정식, 기저와 랭크, 선형사상](https://qofo.github.io/posts/mml-ch02-linear-algebra/) |
| 3 | [MML 3장 해석기하: 노름, 내적, 직교사영](https://qofo.github.io/posts/mml-ch03-analytic-geometry/) |
| 4 | [MML 4장 행렬분해: 고유값, 대각화, SVD](https://qofo.github.io/posts/mml-ch04-matrix-decompositions/) |
| 5 | [MML 5장 벡터 미적분: 기울기, 야코비안, 역전파](https://qofo.github.io/posts/mml-ch05-vector-calculus/) |
| 6 | [MML 6장 확률과 분포: 베이즈 정리, 가우시안, 지수족](https://qofo.github.io/posts/mml-ch06-probability/) |
| 7 | [MML 7장 연속최적화: 경사하강법, 라그랑주 승수, 볼록 최적화](https://qofo.github.io/posts/mml-ch07-continuous-optimization/) |
| 8 | [MML 8장 모델과 데이터: 경험적 위험, MLE와 MAP, 모델 선택](https://qofo.github.io/posts/mml-ch08-models-and-data/) |
| 9 | [MML 9장 선형회귀: 정규방정식, MAP, 베이즈 선형회귀](https://qofo.github.io/posts/mml-ch09-linear-regression/) |
| 10 | [MML 10장 PCA: 분산 최대화, 재구성 오차, 확률적 PCA](https://qofo.github.io/posts/mml-ch10-pca/) |
| 11 | [MML 11장 GMM: 가우시안 혼합 모델과 EM 알고리즘](https://qofo.github.io/posts/mml-ch11-gmm-em/) |
| 12 | [MML 12장 SVM: 마진, 쌍대 문제, 커널](https://qofo.github.io/posts/mml-ch12-svm/) |
| 13 | [MML 교재 연습문제 전체 풀이: 2~7장 75문제](https://qofo.github.io/posts/mml-exercise-solutions/) |
| 14 | [MML 8~12장 연습문제: 교재를 따라 만든 43문제와 OX 퀴즈](https://qofo.github.io/posts/mml-ch08-12-exercises/) |
| 15 | [MML 8~12장 연습문제 풀이: 답과 단계별 풀이](https://qofo.github.io/posts/mml-ch08-12-solutions/) |
| 16 | [MML 실전 모의고사: 기초수학·기초 AI 60분 세트](https://qofo.github.io/posts/mml-mock-exams/) |
| 17 | [MML 실전 모의고사 풀이: 답과 단계별 풀이](https://qofo.github.io/posts/mml-mock-exam-solutions/) |
| 18 | [MML 시험 직전 최종 정리: 공식, 조건, 증명 뼈대](https://qofo.github.io/posts/mml-final-review/) |

## 구조

[Hugo](https://gohugo.io/) 사이트이고, 테마는 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) (MIT)다. 서브모듈이나 Hugo 모듈이 아니라 `themes/PaperMod/`에 파일째 넣어 두었다. 폰에서 빌드하므로 빌드 시점에 네트워크를 타지 않는 편이 낫고, `git clone` 한 번으로 빌드가 되기 때문이다.

| 경로 | 내용 |
|---|---|
| `content/_index.md`, `data/cv.yaml`, `layouts/home.html` | 첫 화면의 CV. 제목·설명·이름 아래 소개 문단은 `content/_index.md`, 학력·논문·경력 같은 항목은 `data/cv.yaml`, 화면 배치는 `layouts/home.html`과 `assets/css/extended/cv.css`다. 블로그의 메뉴(☰), 로고, 검색, 바닥글은 이 페이지에 나오지 않는다 |
| `content/posts/_index.md` | 블로그 첫 화면(`/blog/`). 소개, 연재 목록, 글 목록이 있는 페이지로, 예전에는 사이트 첫 화면이었다. 블로그의 로고, 이동 경로의 "홈", 바닥글의 블로그 이름은 모두 이 페이지로 간다 |
| `content/posts/` | 글 원본. 파일 이름은 `NN-<slug>.md`, 주소는 `/posts/<slug>/`. 연재 하나를 하위 폴더에 모으기도 한다(`content/posts/mml/`). 폴더는 주소에 들어가지 않는다 |
| `content-phone/` | 폰 빌드에만 들어가는 페이지. 지금은 실시간 대시보드 하나다 |
| `themes/PaperMod/` | 테마 원본. 직접 고치지 않는다 |
| `layouts/`, `assets/` | 테마 위에 얹는 것들. 대시보드, 텔레메트리, 한국어 폰트, 링크·표·코드 블록·수식·mermaid 렌더 훅, 글 머리의 연재 상자, 글 끝의 링크 복사·글쓴이 카드·함께 읽을 글, 읽기 진행 막대와 넓은 화면의 옆 목차(`assets/js/post.js`), `/` 검색 단축키(`assets/js/site.js`), 공유 미리보기 카드 |
| `assets/fonts/` | 공유 미리보기 카드를 그릴 때만 쓰는 Pretendard Bold. [SIL OFL 1.1](assets/fonts/OFL.txt)이고, 방문자에게는 보내지 않는다 |
| `hugo.toml` | GitHub Pages 빌드 설정 |
| `config/phone/hugo.toml` | 폰 빌드에서 덮어쓰는 설정 (`hugo --environment phone`) |

테마에 손대는 대신 `layouts/`와 `assets/css/extended/`에서 덮어쓴다. 테마 파일을 통째로 복사해 온 것은 열 개이고, 모두 고친 곳이 몇 군데뿐이다. 파일 안에 `CHANGED FROM THE THEME` 주석으로 표시해 두었다.

| 복사해 온 파일 | 고친 곳 |
|---|---|
| `layouts/_partials/head.html` | canonical 주소를 `.Permalink` 대신 Pages 주소로, 첫 화면(CV)의 `<title>`은 그 페이지의 제목(이름)만, CV에는 블로그의 RSS·검색 색인 링크를 넣지 않음 |
| `layouts/list.html` | 목록 요약을 본문 앞부분 대신 글의 `description`으로, 최신 글이 먼저 오도록 날짜순, 목록 항목 아래에 태그, 테마가 홈에만 주던 소개와 글 목록을 블로그 첫 화면(`layout: blog`)에 |
| `layouts/_partials/header.html` | 로고 앞에 메뉴 버튼(☰), 가로 메뉴 대신 검색 아이콘, 헤더 뒤에 메뉴 서랍(`site_drawer.html`), 로고는 블로그 첫 화면으로. CV에서는 넷 다 빼고 테마 전환 버튼만 |
| `layouts/_partials/breadcrumbs.html` | 이동 경로의 "홈"을 사이트 첫 화면(CV) 대신 블로그 첫 화면으로 |
| `layouts/_partials/templates/opengraph.html` | 공유 미리보기의 사이트 이름(`og:site_name`, 블로그 이름)을 CV에서는 뺌 |
| `layouts/rss.xml` | 첫 화면의 제목이 CV 주인의 이름이 되어도 `/index.xml`(블로그 전체 글 RSS)의 이름은 예전처럼 블로그 이름으로 |
| `layouts/_partials/templates/schema_json.html` | 검색엔진용 이동 경로(BreadcrumbList)를 주소를 잘라 찾는 대신 상위 페이지에서 만듦. 글 목록 주소(`/blog/`)와 원고 폴더(`posts/`)가 달라 첫 단계가 빠지던 것을 고침. 첫 화면은 블로그(Organization) 대신 사람(Person)으로 |
| `layouts/_partials/post_nav_links.html` | 이전·다음 글을 편 번호(weight) 대신 날짜순으로 |
| `layouts/_partials/post_canonical.html` | 글 머리 끝에 연재 상자(`series_box.html`) 호출 한 줄. 테마에는 머리와 본문 사이에 끼울 자리가 따로 없다 |
| `layouts/_partials/templates/_funcs/get-page-images.html` | 글에 이미지가 없으면 생성한 공유 카드(`og_card.html`)를 돌려준다. og:image, 트위터 카드, JSON-LD가 모두 이것을 쓴다 |

테마를 올릴 때는 `themes/PaperMod/`를 새 버전으로 교체한 뒤, 위 파일들을 다시 복사하고 표시된 곳만 다시 적용한다. 지금 들어 있는 버전은 PaperMod `d376885`(2026-08-02)다.

주소는 이렇게 나뉜다.

| 주소 | 페이지 |
|---|---|
| `/` | CV |
| `/blog/` | 블로그 첫 화면(소개, 연재, 글 목록). 2쪽부터는 `/blog/page/2/` |
| `/posts/<slug>/` | 글. 블로그가 첫 화면에 있던 때와 같은 주소다 |
| `/posts/` | 예전 글 목록 주소. `/blog/`로 넘겨 준다 |

글 주소는 `hugo.toml`의 `permalinks`가 정하고, 목록 주소는 `content/posts/_index.md`의 `url`이 정한다. 그래서 블로그 첫 화면을 옮겨도 이미 공유된 글 링크는 그대로 열린다. 전체 글 RSS도 예전처럼 `/index.xml`이다.

CV에는 블로그로 가는 링크를 두지 않는다. 메뉴, 로고, 검색, 바닥글이 빠지고, `/` 단축키도 CV에서는 검색으로 가지 않는다. 반대로 블로그의 링크(로고, 이동 경로의 "홈", 바닥글)도 CV가 아니라 블로그 첫 화면으로 간다. 폰에 있던 옛 블로그의 공유 링크 `/#post=…`는 사이트 첫 화면에 떨어지므로, 폰 사본의 CV에만 글 주소로 넘겨 주는 표가 남아 있다(GitHub Pages는 Hugo로 시작해 그런 링크가 없다).

`main`에는 원본만 있다. Pages가 서비스하는 빌드 결과는 `gh-pages` 브랜치에 있다.

같은 원본을 두 곳에서 서비스한다.

- **GitHub Pages**: 폰에서 빌드한 결과를 `gh-pages` 브랜치에 올린다. 폰이 꺼져도 글은 열린다.
- **폰**: 같은 커밋을 폰용 설정으로 빌드해 폰의 서버가 보낸다.

두 빌드는 폰의 배포 스크립트 하나(`publish_blog.sh publish`, [`qofo/phone-homeserver`](https://github.com/qofo/phone-homeserver))가 같은 커밋과 같은 Hugo로 만들고, `main`과 `gh-pages`를 함께 push한다.

실시간 대시보드는 **폰 사본에만** 있다. 공개 사이트를 여는 사람마다 폰을 호출하게 되는 구조가 맞지 않아서, GitHub Pages 쪽에서는 대시보드와 블로그 첫 화면의 수치 표시를 뺐다. 검색엔진용 canonical 주소는 두 사본 모두 Pages로 고정했다.

글을 게시한 뒤 다른 날에 내용을 고쳤으면 front matter에 `lastmod: YYYY-MM-DD`를 적는다. 글 머리에 "(수정 날짜)"로 표시된다. 날짜를 git에서 가져오지 않는 까닭은, Hugo로 옮기면서 모든 파일을 한 번씩 건드렸기 때문이다. 오타나 링크를 고친 정도라면 적지 않는다.

글끼리는 `[2편](02-stdlib-python-blog.md)`처럼 파일 이름으로 링크한다. 이렇게 쓰면 GitHub에서 파일을 읽을 때도 링크가 열린다. Hugo는 빌드할 때 이 링크를 실제 주소로 바꾸고, 대상 글이 없으면 빌드를 실패시킨다.

## 글 쓰기

```bash
hugo new posts/<slug>.md   # archetypes/posts.md의 틀로 초안(draft)을 만든다
```

- **카테고리**는 `categories: ["상위", "하위"]` 두 단계다. 메뉴(☰)의 카테고리 트리는 글에 적힌 값으로 빌드할 때 만들어지므로, 새 주제는 글에 새 카테고리를 적는 것으로 생긴다. 글 주소는 `/posts/<slug>/`이고 카테고리가 들어가지 않아서, 분류를 바꿔도 링크는 깨지지 않는다.
- **연재**에 속하는 글만 `series`와 `weight`(편 번호)를 적고, 파일 이름을 `NN-<slug>.md`로 한다. 연재 밖의 글은 `<slug>.md`이고 둘 다 적지 않는다. 목록과 이전·다음 글은 날짜순이다.
- 게시한 뒤 다른 날에 내용을 고쳤으면 `lastmod: YYYY-MM-DD`를 적는다(아래).
- **수식**은 `$...$`(문장 안)와 `$$...$$`(따로 한 줄)로 쓴다. 빌드할 때 Hugo에 들어 있는 KaTeX가 HTML로 바꾸므로(`layouts/_markup/render-passthrough.html`), 방문자의 브라우저는 수식 스크립트를 돌리지 않고 스타일시트만 받는다. KaTeX가 읽지 못하는 수식은 빌드를 실패시킨다. 본문에 달러 기호를 그대로 쓰려면 `\$`로 적는다. 표 안의 수식에서는 `|`가 칸을 나누므로 `\vert`나 `\mid`로 쓴다.
- ` ```mermaid ` 코드 블록은 다이어그램이 된다. 그 블록이 있는 글에서만 브라우저가 mermaid.js를 받아 그린다.
- **굵은 글씨**가 괄호·따옴표·수식으로 끝나고 바로 한글이 붙으면(`**자유변수(free variable)**라`) 굵게 되지 않고 `**`가 그대로 보인다. 그 사이에 `\ `를 넣는다(`**자유변수(free variable)**\ 라`). `hugo.toml`의 cjk 설정 덕분에 보이지 않는 공백이 된다.

## CV 고치기

`data/cv.yaml`을 고친다. 절(`sections`)마다 항목(`entries`)이 있고, 항목에는 제목(`title`), 날짜(`date`), 한 줄 설명(`sub`), 글머리 기호 목록(`items`), 링크 버튼(`links`)을 적는다. 논문은 영문 제목(`titleEn`)과 저자 줄(`authors`, 본인 이름은 `**굵게**`)을 더 적을 수 있다. 어학·자격처럼 한 줄짜리 항목만 있는 절은 `compact: true`와 `rows`로 쓴다. 고친 날에는 맨 위의 `updated`도 바꾼다. 이름 아래 소개 문단은 `content/_index.md`의 본문이다.

이 페이지는 공개된다. 전화번호, 생년월일, 주소, 사진은 넣지 않는다.

## 로컬 빌드

```bash
hugo server                       # 미리보기 (http://localhost:1313/)
hugo --minify                     # Pages와 같은 빌드 → public/
hugo --minify --environment phone # 폰용 빌드
```

폰은 Ubuntu 26.04의 apt 패키지인 Hugo 0.154.5 extended로 빌드한다. 다른 곳에서 빌드할 때도 이 버전에 맞춘다.

## 라이선스

글은 [CC BY 4.0](LICENSE)이다. 출처를 밝히면 자유롭게 공유하고 바꿀 수 있다.
