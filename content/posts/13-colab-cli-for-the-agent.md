---
title: "폰에서 도는 에이전트에게 GPU를 빌려 주다: Colab CLI로 Claude Code와 Colab 잇기"
slug: "colab-cli-for-the-agent"
date: 2026-09-29
weight: 13
series: ["스마트폰으로 서버 만들기"]
categories: ["인프라", "폰 홈서버"]
tags: ["Colab", "Claude Code", "GPU", "OAuth", "Agent Skills", "proot"]
description: "이 폰은 서버 일은 하지만 AI 모델을 돌릴 힘은 없다. 폰에서 도는 Claude Code가 필요할 때 Colab GPU를 직접 빌려 쓰도록 공식 Colab CLI를 붙였다. MCP가 아니라 CLI를 고른 이유, 브라우저 없는 로그인, 에이전트에게 규칙을 알려 주는 스킬, 그리고 T4까지의 검증을 적는다."
---
이 폰의 램은 3.7GiB이고, CPU는 2016년 것이다. 블로그와 문서 서버, 코드 편집기는 돌리지만 AI 모델을 학습하거나 크게 돌릴 힘은 없다.

한편 이 폰에서는 Claude Code가 돌고 있다([11편](11-agent-session-outside-proot.md)). 에이전트가 무거운 계산을 직접 클라우드 GPU에 맡길 수 있다면, 폰은 지휘만 하면 된다. 이 글은 Google Colab을 에이전트의 도구로 붙인 기록이다.

---

## 1. MCP 서버냐, CLI냐

2026년 9월 기준으로 에이전트가 Colab을 쓰는 길은 네 가지였다.

| 방법 | 방식 | 이 폰에서 |
|---|---|---|
| Colab MCP 서버 (공식, 2026년 3월) | 로컬에 웹소켓 서버를 열고, 브라우저의 Colab 탭이 그리로 접속한다 | 맞지 않는다 |
| **Colab CLI** (공식, 2026년 6월, Apache-2.0) | 터미널에서 런타임을 만들고, 코드를 보내 실행하고, 파일을 주고받는다 | **채택** |
| Colab Enterprise | Google Cloud 결제 프로젝트 위의 유료 서비스 | 개인 서버에는 과하다 |
| 노트북 안에 웹 서버·터널을 띄우는 비공식 도구 | Colab 런타임을 원격 서버처럼 쓴다 | 이용 규칙과 부딪힌다 |

MCP 서버가 맞지 않는 이유는 소스에 있다. `colab_mcp/websocket_server.py`의 서버는 `host="localhost"`, `port=0`(임의 포트)으로 뜨고, 토큰을 가진 브라우저 탭이 그 주소로 접속한다. **에이전트와 브라우저가 같은 컴퓨터에 있어야** 한다. 이 폰은 화면 없이 다른 기기에서 원격으로 쓴다. PC 브라우저의 `localhost`는 폰이 아니다.

비공식 도구는 Colab FAQ의 금지 목록에 걸린다. 모든 사용자에게 "원격 프록시 연결"이 금지이고, 무료 요금제에서는 "SSH 셸 같은 원격 제어"도 예고 없이 끊길 수 있는 항목이다.

CLI는 에이전트를 염두에 두고 만들어졌다. 패키지 안에 에이전트용 설명서(`SKILL.md`)가 들어 있다.

## 2. 설치: Termux가 아니라 proot 우분투라서 쉬웠다

Colab CLI는 순수 파이썬이 아니다. `pydantic-core`, `pyzmq`, `pyarrow` 같은 네이티브 의존성이 딸려 온다. Termux에 직접 설치한 사람은 별도 wheel 저장소와 포크를 거쳐야 했다(저장소 이슈 #131의 설치 가이드).

이 폰의 파이썬은 proot 안 우분투의 것이다([3편](03-proot-constraints.md)). glibc 위의 aarch64 리눅스이므로 PyPI의 `manylinux` wheel을 그대로 쓸 수 있다. 설치 전에 컴파일 없이 되는지부터 확인했다.

```bash
python3 -m venv /tmp/dryrun
/tmp/dryrun/bin/pip install --dry-run --only-binary=:all: google-colab-cli
```

`--only-binary=:all:`은 완성된 wheel이 없는 패키지가 하나라도 있으면 실패한다. 모든 의존성이 해결됐고, 예를 들어 `pyarrow`는 `pyarrow-25.0.1-cp314-cp314-manylinux_2_28_aarch64.whl`이었다. 실제 설치는 다른 도구들처럼 전용 가상환경에 했다.

```bash
python3 -m venv /root/.local/share/colab-venv
/root/.local/share/colab-venv/bin/pip install --only-binary=:all: google-colab-cli
ln -sf /root/.local/share/colab-venv/bin/colab /root/.local/bin/colab
colab version    # Version: 0.7.4
```

## 3. 브라우저 없는 서버에서 로그인하기

**방식.** 0.6.0부터 로그인은 복사해 붙여넣는 방식이다. CLI가 주소를 출력하면 아무 기기의 브라우저에서 열어 승인하고, Google 페이지에 뜬 코드를 터미널에 붙여 넣는다. 소스(`auth.py`)의 주석이 이유를 적어 두었다. 예전 방식인 `localhost` 콜백은 원격·컨테이너 환경에서 실패하고, 코드를 화면에 띄우던 OOB 방식은 Google이 2022년에 막았다. 그래서 `gcloud`와 같은 착지 페이지를 쓴다. 이 폰처럼 화면 없는 기기에 맞는 방식이다.

**문서와 코드가 달랐다.** 동봉된 `SKILL.md`는 로그인 기본값을 `adc`(gcloud로 만든 자격 증명)라고 적고, 에이전트에게 ADC를 권한다. 설치된 0.7.4의 도움말은 다르게 말한다.

```
│ --auth                         <oauth2|adc>  Authentication strategy to use: │
│                                              'oauth2' (public                │
│                                              InstalledAppFlow), or 'adc'     │
│                                              (Application Default            │
│                                              Credentials).                   │
│                                              [default: oauth2]               │
```

기본값은 `oauth2`이고, OAuth 클라이언트 설정은 패키지 안에 들어 있다. gcloud는 필요 없다. 문서만 읽은 에이전트라면 이 폰에 gcloud부터 설치하려 들었을 것이다.

**권한은 전부 체크한다.** Google 동의 화면은 요청 권한을 하나씩 끄고 켤 수 있게 보여 준다. 일부만 승인하면 이 CLI는 토큰을 저장하지 못하고, 우회하더라도 한 시간마다 브라우저 로그인을 다시 요구한다(이슈 #116). 전부 승인한 뒤 확인한 결과다(이메일은 가리고, OAuth 클라이언트 ID 줄은 뺐다).

```
$ colab whoami
Auth provider: oauth2
Email:         <email>
Expires in:    59m
Scopes:
  - email
  - https://www.googleapis.com/auth/cloud-platform
  - https://www.googleapis.com/auth/colaboratory
  - https://www.googleapis.com/auth/drive.file
  - https://www.googleapis.com/auth/userinfo.email
  - https://www.googleapis.com/auth/userinfo.profile
  - openid
  - profile
```

**로그인은 사람이 한다.** 코드는 표준입력으로 받으므로 에이전트가 대신 넣을 수도 없지만, 기술적으로 가능하더라도 넣게 해서는 안 된다. 이 토큰의 범위에는 Colab뿐 아니라 Google Cloud 전체(`cloud-platform`)가 들어 있다. 토큰은 `~/.config/colab-cli/token.json`에 저장된다. 폰이 남의 손에 들어가면 이 권한도 같이 넘어간다. 그때는 Google 계정 보안 설정에서 이 연결을 끊는다.

## 4. 에이전트에게 규칙 알려 주기: 스킬

Claude Code는 `~/.claude/skills/<이름>/SKILL.md`를 읽는다. 머리말의 설명을 보고 필요할 때 본문을 불러온다. CLI가 동봉 문서를 출력해 주므로 그대로 옮겼다.

```bash
mkdir -p ~/.claude/skills/colab-operator
colab skill > ~/.claude/skills/colab-operator/SKILL.md
```

동봉 문서는 일반적인 사용법이다. 사고는 환경마다 다른 곳에서 난다. 그래서 끝에 이 폰의 규칙을 덧붙였다. 위 본문과 다를 때는 이쪽이 우선이라고 적었다.

- 로그인은 `oauth2`다. ADC와 gcloud를 권하지 않는다.
- 로그인은 사용자가 한다. 토큰이 없으면 멈추고 사용자에게 부탁한다.
- 토큰 파일은 읽지도, 출력하지도, 복사하지도 않는다.
- `colab new`와 `colab run` 전에는 묻는다. 둘 다 VM을 빌리고, 유료 혜택이 생기면 사용량 단위를 쓴다.
- 세션에는 항상 이름(`-s`)을 붙이고, 끝나면 `colab stop` 뒤 `colab sessions`로 남은 것이 없는지 확인한다.
- 무료 요금제에서는 `colab ssh`와 `colab console`을 쓰지 않는다(1절의 FAQ).
- 10분이 넘는 작업은 백그라운드로 돌리고 `colab status`와 `colab log`로 따라간다.
- 폰 쪽은 가볍게 둔다. 무거운 일은 VM에서 하고 결과만 받는다.

CLI를 올리면 `colab skill`로 다시 쓰고 이 절을 다시 붙인다.

## 5. 검증

**CPU 런타임.** 세션을 만들고, 코드를 두 번 나눠 보냈다. 두 번째 실행에서 첫 번째 실행의 변수 `x`가 살아 있는지 봤다.

```
[colab] Creating session 'smoke'...
[colab] Session READY.
python 3.13.15 x86_64
cpus 2
x*2 = 42
```

한 세션은 같은 커널을 계속 쓴다. 에이전트가 짧은 명령을 여러 번 보내도 상태가 이어진다는 뜻이다. VM에서 만든 파일을 `colab download`로 폰에 받았고, `colab stop` 뒤 `colab sessions`는 `No active sessions found on server.`를 돌려줬다. 그 사이 `colab usage`의 답은 이랬다.

```
Current balance: 0.00 compute units
Usage rate: 0.06/hr
Active assignments: 1
```

**T4 GPU.** `colab run`은 VM을 만들고, 로컬 스크립트를 실행하고, VM을 반납하는 일을 한 번에 한다. GPU를 확인하는 짧은 스크립트를 보냈다(경로는 줄였다).

```
[colab] Creating session 't4test'...
[colab] Session READY (t4test). Executing gpu_check.py...
python 3.13.15
nvidia-smi: Tesla T4, 15360 MiB, 11.06 W, 70.00 W
torch 2.11.0+cu128 cuda available: True
matmul 4096^2 x20: 0.87s, ~3.2 TFLOPS fp32
[colab] Stopping session 't4test'...
[colab] Session terminated.
```

무료 조건에서도 이날은 T4가 배정됐다. 늘 그렇지는 않다. 이슈 #73에는 무료 계정에서 T4 요청이 `412 Precondition Failed`로 거절된 기록이 있다. 행렬 곱 수치는 워밍업이 섞인 한 번의 측정이라 성능 값으로 쓰지 않는다.

이 출력에서 중요한 것은 `11.06 W, 70.00 W`다. **GPU의 소비 전력을 읽을 수 있다.** 다음 작업에서 쓸 숫자다.

## 6. 한계

- **무료 요금제는 보장이 없다.** GPU 배정도, 세션 길이도 그때그때 다르다.
- **요금제 혜택은 아직이다.** Google은 9월 22일 Google AI 요금제에 Colab 혜택을 넣었다고 발표하고, Colab을 쓸 수 있는 나라에 몇 주에 걸쳐 적용한다고 했다. 이 글을 쓰는 9월 29일에 잔액은 0.00이었다.
- **동봉 문서는 코드보다 늦다.** 3절의 기본값처럼, 에이전트가 읽는 문서도 틀릴 수 있다. 환경에 맞춘 규칙을 덧붙인 이유다.
- **넓은 권한의 토큰이 폰에 있다.** 3절에서 말한 대로다. 편의와 맞바꾼 위험이다.

## 정리

1. **에이전트와 브라우저가 한 기기에 없으면 CLI다.** MCP 서버는 같은 기기의 브라우저 탭을 전제로 했다.
2. **proot 우분투는 여기서도 값을 했다.** glibc 덕분에 표준 wheel로 컴파일 없이 설치됐다.
3. **문서보다 `--help`다.** 동봉 문서와 실제 기본값이 달랐다.
4. **계정 권한을 주는 일은 사람이 한다.** 에이전트는 로그인이 없으면 멈추고 부탁한다.

## 다음

이 폰에 GPU가 생긴 것은 아니다. 필요할 때 빌릴 수 있게 됐을 뿐이다. 그래서 거꾸로 묻게 된다. 이 낡은 폰에서 직접 AI 모델을 돌리면, 전기와 탄소로 따져 클라우드 GPU보다 얼마나 나쁜가?

2026년 7월의 한 연구는 최근 폰 두 대(iPhone 14, Pixel 8)로 재서 "폰 추론의 환경 영향 대부분은 기기를 만들 때 나온 탄소"라고 결론 냈다. 버려질 폰을 다시 쓰면 그 탄소는 새로 생기지 않는다. 다음 글부터는 이 폰과 Colab T4에서 같은 모델을 돌려 토큰당 에너지를 재 본다.
