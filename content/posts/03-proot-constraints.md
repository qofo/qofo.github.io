---
title: "스마트폰 리눅스의 진짜 제약: 가짜 root, 없는 systemd, 그리고 가짜 /proc"
slug: "proot-constraints"
date: 2026-09-17
lastmod: 2026-09-18
weight: 3
series: ["스마트폰으로 서버 만들기"]
categories: ["인프라", "폰 홈서버"]
tags: ["PRoot", "Termux", "Android", "Linux", "systemd", "procfs", "Architecture"]
description: "PRoot 환경의 Ubuntu는 겉보기에 표준 리눅스와 같다. apt-get이 돌고, whoami는 root를 출력하고, /etc/os-release는 Ubuntu 26.04.1 LTS라고 답한다. 그래서 일반 서버처럼 다루게 되고, 그러다 벽에 부딪힌다."
legacy_id: "03_android_proot_server_architecture_and_gotchas"
---
PRoot 환경의 Ubuntu는 겉보기에 표준 리눅스와 같다. `apt-get`이 돌고, `whoami`는 `root`를 출력하고, `/etc/os-release`는 Ubuntu 26.04.1 LTS라고 답한다. 그래서 일반 서버처럼 다루게 되고, 그러다 벽에 부딪힌다.

이 글은 그 제약의 목록이다. 이후 편에서 벌어지는 사고는 대부분 여기 적힌 항목을 잊어서 생겼다.

---

## 1. PRoot 아키텍처: ptrace 기반 시스템 콜 경로 변환

일반적인 컨테이너는 커널 기능(namespace, cgroup)을 통해 프로세스를 격리한다. 반면 비루팅 안드로이드 환경에서는 커널 레벨의 격리 기능을 직접 제어할 수 없다. `proot`는 디버거가 사용하는 `ptrace(2)` 시스템 콜을 활용하여 프로세스를 추적하고, 프로그램이 호출하는 파일 경로 관련 시스템 콜을 **유저 공간에서 실시간으로 치환**한다.

```
프로그램: open("/etc/passwd")
                │
                ▼  proot가 ptrace로 가로챔
       경로 치환: /data/data/com.termux/files/usr/var/lib/proot-distro/
                  containers/ubuntu/rootfs/etc/passwd
                │
                ▼
          안드로이드 커널
```

이 구조로 인해 두 가지 주요 특성이 나타난다.

- **I/O 성능 오버헤드**: 모든 파일 시스템 접근과 프로세스 생성이 유저 공간의 ptrace 트레이서를 거친다. 단일 대용량 파일 I/O는 영향이 적으나, `npm install`처럼 다수의 소용량 파일을 연속 생성하는 작업에서는 지연이 크게 증가한다.
- **프로세스 추적 흔적(TracerPid)**: `ps` 명령어 실행 시 Ubuntu 내부 프로세스의 상위 프로세스로 `proot`가 식별되며, `/proc/<pid>/status` 파일의 `TracerPid` 필드에 proot 프로세스의 PID가 기록된다. 프로세스가 proot 세션 내부에서 구동 중인지 여부를 판별할 때 이 값을 참조할 수 있다.

## 2. 가짜 root 권한과 Android 앱 샌드박스 제약

proot 환경 내부에서 `id` 명령어를 실행하면 `uid=0(root)`으로 표시되나, 실제로는 Android 애플리케이션 보안 컨텍스트 내에서 동작한다.

```
$ id
uid=0(root) gid=0(root) groups=0(root),3003(aid_inet),9997(aid_everybody),
    20283(aid_u0_a283_cache),50283(aid_all_a283)
```

그룹 목록에 포함된 `aid_u0_a283`은 해당 프로세스가 커널 관점에서 **Termux 앱 샌드박스**에 종속되어 있음을 의미한다. 따라서 패키지 설치(`apt-get`) 등 유저 공간 파일 수정은 가능하나 커널 권한이 요구되는 작업은 차단된다.

- 커널 모듈 로드 및 실제 파일 시스템 마운트 불가
- iptables 규칙 조작 및 raw 소켓 생성 불가
- 1024번 미만 특권(privileged) 포트 바인딩 불가 (8080 등 비특권 포트 사용 필수)
- 타 애플리케이션의 샌드박스 파일 접근 불가

## 3. init 시스템 부재: systemd 미지원

proot 환경에서는 `systemd`가 동작하지 않으므로 `systemctl`, `service`, `journalctl` 등의 시스템 관리 도구를 사용할 수 없다. Android 시스템의 `init`이 PID 1을 점유하며, Ubuntu 환경은 해당 `init` 하위의 애플리케이션 프로세스 트리에 불과하다.

따라서 표준 데몬 서비스 등록 방식이 불가능하며, 프로세스 실행 및 생명주기 감시를 별도의 스크립트와 감시 데몬으로 직접 구현해야 한다. 상세한 프로세스 감시 구조는 [5편](05-termux-boot-supervisor.md)과 [6편](06-supervisor-postmortem.md)에서 다룬다.

## 4. 세션 종료 시 하위 프로세스 종료 제약 (--kill-on-exit)

`proot-distro login` 명령어는 기본적으로 `--kill-on-exit` 플래그를 포함하여 proot를 실행한다.

```
proot --kill-on-exit --link2symlink --sysvipc ... /bin/bash -l
```

`--kill-on-exit` 옵션은 진입 시 실행된 루트 명령(로그인 셸)이 종료될 때 **해당 세션 내부에서 생성된 모든 하위 프로세스를 함께 강제 종료**한다. 대화형 셸에서 `nohup ... &` 명령어로 백그라운드 서버를 구동하더라도, 로그인 세션을 종료(로그아웃)하는 순간 백그라운드 프로세스까지 함께 종료된다.

이 제약으로 인해 서버가 백그라운드에서 유지되지 않고 중단되는 문제가 발생한다. 이에 대한 구체적인 분석 및 해결책은 [6편](06-supervisor-postmortem.md)에서 설명한다.

## 5. procfs 가상화 한계: /proc/stat, /proc/uptime, /proc/loadavg의 정적 데이터

모니터링 대시보드에서 CPU 사용률이 0%로 고정되거나 가동 시간이 일정 값에서 멈추는 현상이 발생한다. 원인은 `proot-distro`가 제공하는 `/proc` 내 주요 지표 파일의 내용이 정적으로 고정되어 있기 때문이다.

```bash
$ md5sum /proc/stat /proc/uptime /proc/loadavg
6c8b9257...  /proc/stat
9f534337...  /proc/uptime
40248b64...  /proc/loadavg

$ sleep 3; md5sum /proc/stat /proc/uptime /proc/loadavg
6c8b9257...  /proc/stat      # 3초가 지나도 내용이 같다
9f534337...  /proc/uptime
40248b64...  /proc/loadavg
```

Android 8 이후 보안 정책 강화로 인해 일반 애플리케이션의 실제 `/proc/stat` 조회가 차단되었다. `proot-distro`는 프로그램 비정상 종료를 방지하기 위해 정적 더미 파일로 이를 에뮬레이션한다. 실제 Termux 환경에서도 접근이 제한된다.

```
ls: cannot access '/proc/stat': Permission denied
```

따라서 `top`이나 `uptime` 등 `/proc` 기반 유틸리티의 지표는 신뢰할 수 없다. 정확한 시스템 상태를 측정하려면 대체 경로 및 시스템 콜을 활용해야 한다.

| 알고 싶은 값 | 막힌 경로 | 대신 쓰는 것 |
|:---|:---|:---|
| 가동 시간 | `/proc/uptime` | `clock_gettime(CLOCK_BOOTTIME)` |
| 부하(load average) | `/proc/loadavg` | `sysinfo(2)` 시스템 콜 |
| 코어별 사용률 | `/proc/stat` | `/sys/devices/system/cpu/cpu*/cpuidle/state*/time` |

특히 코어별 CPU 사용률은 `/sys` 하위의 cpuidle 누적 시간을 활용하여 계산한다. 일정 시간 간격으로 유휴(idle) 시간의 변화량을 측정하여 실제 연산 점유율을 도출하는 방식이다.

```
사용률 = 1 - (유휴 시간 증가분 / 실제 흐른 시간)
```

이 방식을 적용하면 각 코어별 실제 연산 부하를 실시간으로 측정할 수 있다.

## 6. 실행 환경의 PATH 혼재: Termux 바이너리와 Ubuntu rootfs

Ubuntu rootfs 내부에는 Python이 설치되어 있지 않음에도 `python3` 명령어가 실행된다.

```bash
$ which -a python3
/data/data/com.termux/files/usr/bin/python3
```

이는 `proot-distro`가 호스트(Termux)의 디렉터리를 바인드 마운트하고 `PATH` 환경 변수 말미에 Termux 바이너리 경로(`/data/data/com.termux/files/usr/bin`)를 자동으로 추가하기 때문이다.

따라서 Python(3.14), Node.js, curl, clang 등 주요 개발 도구는 Ubuntu 패키지가 아닌 Termux 바이너리로 구동된다. Ubuntu rootfs 자체는 90여 개 패키지의 최소 구성으로 유지되므로, 명령 실행 시 어느 환경의 바이너리가 호출되는지 확인해야 한다.

## 7. Android OS 리소스 관리 정책에 의한 프로세스 종료 위험

Android OS는 모바일 배터리와 자원 관리를 위해 백그라운드 프로세스를 적극적으로 제한한다.

- **LMK(Low Memory Killer)**: 가용 메모리가 부족해지면 시스템 안정성을 위해 백그라운드 프로세스에 사전 경고 없이 `SIGKILL`을 전송하여 강제 종료한다.
- **Doze 모드**: 화면이 꺼지고 기기가 정지 상태를 유지하면 절전 모드로 진입하여 타이머 실행 및 네트워크 연결을 제한한다. 이는 `termux-wake-lock` 명령어로 방지해야 한다.
- **발열 제어(Thermal Throttling)**: 패시브 쿨링(팬리스) 구조 특성상 고부하가 수 분간 지속되면 AP 클럭이 강제로 하향 조정된다. 병렬 빌드 시 과도한 스레드 할당(`make -j8` 등)은 메모리 고갈과 과열을 유발하므로 `-j2` 수준으로 제한하는 편이 낫다.

메모리 압박 상황에서는 설정된 2GB 크기의 zRAM 스왑이 완충 역할을 수행한다. 물리 RAM 3.7GB 중 절반가량을 점유한 상태에서도 스왑 공간을 활용하여 프로세스 중단을 방지한다.

## 정리: 스마트폰 서버는 쓸 만한가

| 항목 | 갤럭시 노트 FE | 일반 미니 PC |
|:---|:---|:---|
| 소비 전력 | 5W 미만 | 30W 이상 |
| 소음 | 없음 (팬리스) | 팬 소음 |
| 정전 대비 | 배터리 내장 | UPS 별도 |
| 네트워크 | 와이파이 + LTE 이중화 | 유선 1개 |
| 권한 | 앱 샌드박스 수준 | 완전한 root |
| 관측 도구 | `top`·`uptime` 무의미 | 전부 정상 |

소비 전력, 무소음, 내장 배터리는 확실한 이점이다. 다만 "배터리가 곧 UPS"라는 말에는 조건이 붙는다. **충전기에 꽂혀 있어야** 성립한다. 충전이 끊기면 시간당 약 2.6%씩 줄어 하루 만에 꺼진다. 가장 정교한 자동 복구 장치보다 케이블 하나가 중요할 때가 있다.

→ [4편. 도메인 없이 고정 주소 갖기: Cloudflare, DuckDNS, ngrok 실전 비교](04-fixed-address-without-domain.md)
