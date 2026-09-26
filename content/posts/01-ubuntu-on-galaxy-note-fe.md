---
title: "서랍 속 갤럭시 노트 FE에 우분투를 올리기까지"
slug: "ubuntu-on-galaxy-note-fe"
date: 2026-09-17
lastmod: 2026-09-18
weight: 1
series: ["스마트폰으로 서버 만들기"]
categories: ["인프라", "폰 홈서버"]
tags: ["Termux", "proot-distro", "Ubuntu", "Android", "Antigravity", "agy", "Troubleshooting"]
description: "서랍에 있던 갤럭시 노트 FE(SM-N935L)로 서버를 만들기로 했다. 2017년 기기이고 안드로이드 9에서 업데이트가 멈췄지만, 8코어 CPU와 4GB RAM, 64GB 저장 공간이 들어 있다. 라즈베리파이 3보다 빠르고, 화면과 배터리가 달려 있고, 소비 전력은 5W 미만이다."
legacy_id: "01_agy_setup_and_troubleshooting"
---
서랍에 있던 갤럭시 노트 FE(SM-N935L)로 서버를 만들기로 했다. 2017년 기기이고 안드로이드 9에서 업데이트가 멈췄지만, 8코어 CPU와 4GB RAM, 64GB 저장 공간이 들어 있다. 라즈베리파이 3보다 빠르고, 화면과 배터리가 달려 있고, 소비 전력은 5W 미만이다.

목표는 리눅스를 올리고 AI 코딩 에이전트를 붙여 24시간 돌리는 것이다. 이 단계에서 발목을 잡은 것은 기기 성능이 아니라 **바이너리 호환성**이었다.

---

## 1차 시도: Termux 단독 환경 구축

Termux는 루팅 없이 안드로이드에서 구동되는 터미널 환경이다. `pkg install`을 통해 Python, Node.js, clang 등을 설치할 수 있으므로 추가 계층 없이 필요한 환경을 구성할 수 있다.

그러나 Node.js를 설치하고 실행하면 동적 링커 오류가 발생한다.

```bash
pkg install nodejs
npm install -g @google/gemini-cli
```

```
CANNOT LINK EXECUTABLE "node": cannot locate symbol "..." referenced by
"/data/data/com.termux/files/usr/bin/node"...
```

원인은 C 표준 라이브러리의 차이에 있다. Termux는 일반 리눅스의 glibc가 아닌 안드로이드의 **bionic libc**를 사용한다. 패키지 저장소와 기기에 설치된 라이브러리 버전이 불일치하면 링커 단계에서 심볼을 찾지 못해 실행에 실패한다.

전체 패키지와 라이브러리 버전을 최신으로 갱신하여 해결한다.

```bash
pkg update && pkg upgrade -y
node -v   # 정상 출력
```

라이브러리 버전을 맞추자 Node.js가 정상 구동됐고, Gemini CLI도 설치돼 동작했다.

## Termux 환경 내 agy 바이너리 실행 불가

다음으로 Google Antigravity CLI(`agy`)로 옮겼는데, Termux 환경에서는 실행되지 않았다. 설치 스크립트는 정상 완료되나 실행하면 무응답 상태에 빠지거나 링커 오류가 발생한다.

원인은 바이너리 구조와 안드로이드 링커 요구 조건의 불일치에 있다. 저장소 패키지와 달리 `agy`는 약 197MB 크기의 **단일 실행 파일**(바이너리)로 제공된다. 안드로이드 링커가 요구하는 ELF 헤더 조건을 충족하지 못하면 bionic 환경에서는 실행할 수 없다.

안드로이드용 ELF 헤더 변환 도구인 `termux-elf-cleaner`를 적용해도 문제는 해결되지 않는다.

```bash
pkg install termux-elf-cleaner
termux-elf-cleaner ~/.local/bin/agy
```

헤더를 고치고 다시 받기를 네 번 반복했지만 결과는 같았다. 여기서 방향을 바꿨다. **바이너리를 환경에 맞추는 대신 환경을 바이너리에 맞추는 쪽**이 빠르다.

## proot-distro를 통한 Ubuntu 환경 구축

`proot-distro`는 루팅 없이 Termux 내부에서 표준 리눅스 배포판의 루트 파일 시스템(rootfs)을 격리 구동하는 도구다. 이 환경에서는 glibc 기반 바이너리를 수정 없이 그대로 실행할 수 있다.

```bash
pkg install proot-distro
proot-distro install ubuntu
proot-distro login ubuntu
```

설치 후 프롬프트가 `root@localhost:~#`로 전환되며, `cat /etc/os-release` 실행 시 Ubuntu 26.04.1 LTS 환경이 확인된다.

Ubuntu 환경에서는 glibc 기반의 `agy` 바이너리가 정상 구동된다.

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
echo 'export PATH="/root/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
agy
```

## 최소 rootfs의 CA 인증서 부재와 TLS 오류

`agy` 바이너리 실행은 정상적으로 이루어지나, Google OAuth 로그인 과정에서 TLS 인증서 검증 실패가 발생한다.

`proot-distro`로 설치된 Ubuntu는 90여 개 패키지만 포함된 최소 구성(minimal rootfs)이어서 공인 인증기관(CA) 번들이 누락되었거나 오래된 상태다. CLI가 Google 서버와 HTTPS 연결을 수립하는 과정에서 서버 인증서의 발급 기관을 검증하지 못해 중단된다.

CA 인증서 패키지를 갱신 및 재설치하여 해결한다.

```bash
apt-get update
apt-get install --reinstall ca-certificates
```

인증서를 재설치한 후 `agy`를 실행하면 Google OAuth 인증 URL이 정상 출력된다. 폰 브라우저로 그 주소를 열어 계정을 승인하면 로그인이 끝난다. 기록상 이 과정에만 13분이 걸렸다. 작은 화면에서 URL을 복사해 붙여넣는 작업이 대부분의 시간을 차지했다.

## 설치 및 설정 명령어 요약

```bash
# Termux 쪽
pkg update && pkg upgrade -y
pkg install proot-distro
proot-distro install ubuntu
proot-distro login ubuntu

# 우분투 쪽
apt-get update
apt-get install --reinstall ca-certificates
curl -fsSL https://antigravity.google/cli/install.sh | bash
export PATH="/root/.local/bin:$PATH"
agy
```

## 핵심 정리

**1. 모바일 리눅스의 핵심 장애 요인은 성능이 아니라 libc다.**
스마트폰 환경에서의 실행 실패 원인은 연산 성능 부족이 아니라 "바이너리와 환경 간의 동적 링크 불일치"다. 패키지 저장소가 관리하는 소프트웨어는 `pkg upgrade`로 라이브러리 정합성을 맞출 수 있으나, 외부에서 직접 내려받은 단일 바이너리는 bionic 환경에서 구동하기 어렵다.

**2. 바이너리 수정보다 실행 환경 전환이 효율적이다.**
바이너리의 ELF 헤더를 안드로이드 링커에 맞추어 수정하는 것보다, `proot-distro`로 표준 glibc 환경을 구축하는 편이 훨씬 빠르고 안정적이다.

**3. 최소 rootfs 환경에서는 CA 인증서부터 확인해야 한다.**
proot 기반 배포판 환경에서 HTTPS 통신 오류가 발생할 경우 우선 `ca-certificates` 패키지 설치 여부를 점검해야 한다.

다음 편에서는 Ubuntu 환경 위에 Python 표준 라이브러리 기반 블로그 서버를 구축하고 외부로 공개하는 과정을 다룬다.

→ [2편. 파이썬 표준 라이브러리만으로 만든 블로그, 그리고 첫 외부 공개](02-stdlib-python-blog.md)
