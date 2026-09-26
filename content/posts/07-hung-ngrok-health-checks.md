---
title: "살아 있지만 일하지 않는 프로세스: 재부팅 후 멈춘 ngrok과 능동 헬스체크"
slug: "hung-ngrok-health-checks"
date: 2026-09-19
weight: 7
series: ["스마트폰으로 서버 만들기"]
categories: ["인프라", "폰 홈서버"]
tags: ["ngrok", "Health Check", "Supervisor", "Reboot", "Downtime", "Postmortem"]
description: "6편에서 감시 데몬을 다시 만들고 \"재부팅까지 시험해야 한다\"고 정리했다. 그날 밤 폰을 재부팅했더니 블로그 주소에 ngrok의 ERRNGROK3200(엔드포인트 오프라인) 오류 페이지가 떴다."
legacy_id: "07_reboot_hung_ngrok_and_active_health_checks"
---
[6편](06-supervisor-postmortem.md)에서 감시 데몬을 다시 만들고 "재부팅까지 시험해야 한다"고 정리했다. 그날 밤 폰을 재부팅했더니 블로그 주소에 ngrok의 `ERR_NGROK_3200`(엔드포인트 오프라인) 오류 페이지가 떴다.

터널이 없다는 뜻이다. 그런데 감시 데몬은 아무것도 하지 않았다. 이 글은 **프로세스는 살아 있는데 일을 하지 않는** 장애의 분석과, 원인을 끝내 확정하지 못한 채 선택한 대응 기록이다.

---

## 로그로 본 23분

ngrok은 기동하면서 몇 줄의 로그를 남긴다. 정상적인 기동은 이렇다(같은 날 다른 재부팅에서 가져왔다).

```
14:10:25 msg="no configuration paths supplied"
14:10:25 msg="using configuration at default config path"
14:10:25 msg="open config file" err=<nil>
14:10:26 msg="FIPS 140 mode" enabled=false
14:10:26 msg="starting web service" obj=web          ← 로컬 관리 API(4040) 열림
14:10:27 msg="client session established"            ← ngrok 서버와 연결
14:10:27 msg="started tunnel" url=https://daringly-marrow-penny.ngrok-free.dev
```

설정을 읽고, 로컬 관리 API를 열고, 서버에 붙어 터널을 연다. 2초면 끝난다. 문제의 재부팅 직후 로그는 이랬다.

```
13:16:29 msg="no configuration paths supplied"
13:16:29 msg="using configuration at default config path"
13:16:29 msg="open config file" err=<nil>
13:16:30 msg="FIPS 140 mode" enabled=false
13:39:19 msg="no configuration paths supplied"       ← 23분 뒤, restart 명령으로 교체
```

`FIPS 140 mode` 다음 줄이 23분 동안 나오지 않았다. 관리 API를 열었다는 줄도, 서버에 붙었다는 줄도 없다. 프로세스는 죽지 않았다. 그 자리에서 멈춰 있었다.

같은 23분 동안 감시 데몬 로그는 비어 있다.

```
[2026-09-18 13:16:28] [DAEMON] Supervisor started (pid 13477)
[2026-09-18 13:16:28] [START] blog (pid 13508)
[2026-09-18 13:16:29] [START] ngrok (pid 13511)
[2026-09-18 13:39:19] [RESTART] Restart requested
```

## 감시 데몬이 본 것

당시의 판정 코드다.

```bash
supervise() {
    ...
    if child_alive "$pid"; then
        # 5분 넘게 살아 있으면 재시작 대기 시간을 초기화
        [ "$up" -ge 300 ] && DELAY[$name]=0
        return
    fi
    ...크래시 처리...
}
```

`child_alive`는 `/proc/<pid>/stat`을 읽어 프로세스가 존재하고 좀비가 아닌지만 확인한다. 멈춘 ngrok은 이 조건을 완벽하게 통과한다. 6편에서 `pgrep` 이름 매칭을 걷어내고 PID 추적으로 바꾼 것은 옳았지만, PID 추적이 답하는 질문은 "살아 있는가"뿐이다. "일하고 있는가"는 묻지 않았다.

상태 명령도 같은 한계가 있었다.

```bash
echo "ngrok Tunnel: [RUNNING] (PID $pid) - $NGROK_DOMAIN"
```

`pgrep`으로 PID를 찾으면 도메인까지 붙여서 `[RUNNING]`을 출력했다. 방문자는 오류 페이지를 보고 있는데, 상태 명령은 공개 주소와 함께 정상이라고 답하고 있었다.

## 첫 번째 가설: 부팅 직후의 네트워크

가장 그럴듯한 설명은 타이밍이었다. 안드로이드는 부팅 직후 Wi-Fi가 IP를 받고 DNS가 준비되기까지 시간이 걸린다. 그 사이에 기동한 ngrok이 네트워크 초기화 어딘가에서 영영 돌아오지 못했다는 가설이다. 실제로 재부팅 직전 로그에는 네트워크가 사라지면서 DNS 조회가 실패한 흔적이 있었다.

```
13:13:55 lvl=eror msg="failed to reconnect session"
         err="failed to dial ngrok server ...: lookup connect.ngrok-agent.com on 8.8.4.4:53: ..."
```

그래서 ngrok을 띄우기 전에 ngrok 서버 이름이 풀리는지 먼저 확인하도록 했다.

```bash
network_ready() {
    timeout 3 getent hosts connect.ngrok-agent.com >/dev/null 2>&1
}

spawn() {
    ...
    ngrok)
        if ! network_ready; then
            log "[WAIT] Network not ready for ngrok; delaying spawn by ${CHECK_INTERVAL}s"
            NEXT[ngrok]=$((SECONDS + CHECK_INTERVAL))
            return
        fi
        ...
```

## 두 번째 재부팅: 가설이 틀렸다

이 수정과 함께 아래에서 설명할 능동 헬스체크를 넣고 다시 재부팅했다. 감시 데몬 로그다.

```
[2026-09-18 13:52:49] [DAEMON] Supervisor started (pid 13080)
[2026-09-18 13:52:49] [START] blog (pid 13118)
[2026-09-18 13:52:49] [START] ngrok (pid 13150)
[2026-09-18 13:53:21] [WARN] ngrok failed health check (32 seconds up, failure 1/3)
[2026-09-18 13:53:32] [WARN] ngrok failed health check (43 seconds up, failure 2/3)
[2026-09-18 13:53:44] [WARN] ngrok failed health check (54 seconds up, failure 3/3)
[2026-09-18 13:53:44] [HUNG DETECTED] ngrok is unresponsive (pid 13150, up 54s); terminating...
[2026-09-18 13:53:57] [START] ngrok (pid 14180)
```

`[WAIT]` 줄이 없다. 네트워크 확인을 **통과했다**는 뜻이다. DNS가 풀리는 상태에서 기동했는데도 ngrok 로그는 또 같은 자리에서 멈췄다.

```
13:52:49 msg="open config file" err=<nil>
13:52:50 msg="FIPS 140 mode" enabled=false
13:53:57 msg="no configuration paths supplied"       ← 감시 데몬이 강제로 교체
13:53:58 msg="starting web service" obj=web
13:53:58 msg="client session established"
13:53:59 msg="started tunnel" url=https://daringly-marrow-penny.ngrok-free.dev
```

두 번째로 띄운 ngrok은 2초 만에 터널을 열었다. 부팅 직후 첫 기동만 멈추고, 1분 뒤의 두 번째 기동은 멀쩡하다. DNS가 풀리는데도 멈췄으니 "네트워크가 덜 준비됐다"는 가설로는 설명되지 않는다. 멈추는 지점도 걸린다. 로그 순서로 보면 로컬 관리 API를 열기 전, 그러니까 외부 서버에 붙는 단계보다 앞이다.

**원인은 아직 확정하지 못했다.** 네트워크 확인은 남겨 두었지만(해가 없고, 실제로 네트워크가 없을 때 헛된 기동을 막는다) 이 장애를 막은 것은 그것이 아니었다. 막은 것은 멈춘 프로세스를 54초 만에 알아본 헬스체크다.

---

## 능동 헬스체크 설계

원인을 모르는 장애는 예방할 수 없다. 대신 **증상을 감지하면 원인과 상관없이 복구**할 수 있다. 감시 데몬이 10초마다 각 서비스에 실제로 일을 시켜 보도록 바꿨다.

### 무엇을 물을 것인가

| 서비스 | 질문 | 방법 |
|:---|:---|:---|
| 블로그 | 페이지를 내주는가 | `curl http://localhost:8080/` → HTTP 200 |
| ngrok | 터널이 등록돼 있는가 | `curl http://127.0.0.1:4040/api/tunnels` 응답에 공개 도메인이 있는가 |

```bash
blog_up() {
    [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 http://localhost:8080/)" = "200" ]
}

ngrok_up() {
    curl -s --max-time 2 http://127.0.0.1:4040/api/tunnels 2>/dev/null | grep -q "$NGROK_DOMAIN"
}
```

ngrok은 공개 주소가 아니라 **로컬 관리 API**로 확인한다. 공개 주소로 확인하면 폰의 인터넷, ngrok 엣지 서버, 무료 플랜 경고 페이지까지 한꺼번에 재게 된다. 실패해도 무엇이 고장인지 알 수 없고, 폰 쪽 프로세스를 죽여서 고칠 수 없는 원인(엣지 장애 등)에도 재시작을 반복하게 된다. 관리 API는 ngrok 에이전트 자신의 상태만 말해 준다. 이번 장애에서 멈춘 ngrok은 4040 포트조차 열지 못했으니 이 질문만으로 충분히 잡힌다.

### 언제, 몇 번 실패하면 죽일 것인가

```bash
if child_alive "$pid"; then
    if [ "$up" -ge 30 ]; then                       # 기동 후 30초는 봐준다
        case "$name" in
            blog)  blog_up  && healthy=1 ;;
            ngrok) ngrok_up && healthy=1 ;;
        esac
        if [ "$healthy" -eq 1 ]; then
            FAILED_HEALTH[$name]=0
        else
            FAILED_HEALTH[$name]=$(( ${FAILED_HEALTH[$name]:-0} + 1 ))
            if [ "${FAILED_HEALTH[$name]}" -ge 3 ]; then   # 연속 3회(약 30초)
                log "[HUNG DETECTED] ..."
                kill "$pid"; sleep 2
                child_alive "$pid" && kill -9 "$pid"
                ...크래시와 같은 재시작 대기(10초 → 최대 5분)...
            fi
        fi
    fi
    return
fi
```

- **30초 유예.** 정상 기동은 2초면 끝나지만, 느린 네트워크에서 서버 연결이 늦어지는 것까지 먹통으로 판정하면 멀쩡한 프로세스를 죽이게 된다.
- **연속 3회.** 순간적인 지연 한 번으로 서비스를 교체하지 않는다. 한 번이라도 성공하면 카운터가 0으로 돌아간다.
- **TERM 후 KILL.** 멈춘 프로세스는 종료 신호도 처리하지 못할 수 있다. 2초 기다린 뒤 강제 종료한다.
- **크래시와 같은 백오프.** 먹통이 반복되면 재시작 간격이 10초, 20초, 40초로 늘어난다. 고칠 수 없는 원인으로 재시작만 반복하는 루프를 막는다.

두 번째 재부팅에서 멈춘 ngrok은 기동 54초 만에 먹통으로 판정됐고, 13초 뒤 새 프로세스로 교체됐다. 23분이 1분 남짓이 됐다.

### 상태 명령도 같은 질문을 하게

```bash
if ngrok_up; then
    echo "ngrok Tunnel: [RUNNING] (PID $pid) - $NGROK_DOMAIN (online)"
else
    echo "ngrok Tunnel: [RUNNING] (PID $pid) - WARNING: tunnel offline/unresponsive"
fi
```

이제 `status`는 PID만 보지 않고 헬스체크와 같은 관리 API의 답으로 `online`과 `WARNING`을 구분한다. 6편에서 "관측 값이 가짜면 없느니만 못하다"고 썼다. 공개 주소를 붙여 `[RUNNING]`을 찍던 상태 명령이 바로 그런 가짜 관측이었다.

---

## 다운타임을 숫자로

"재부팅하면 금방 돌아온다"는 말은 숫자가 없으면 검증할 수 없다. 감시 데몬에 다운타임 기록을 붙였다.

- 블로그와 ngrok이 **둘 다** 헬스체크를 통과한 루프마다 현재 시각을 하트비트 파일에 쓴다.
- 감시 데몬이 새로 뜰 때 하트비트가 20초 넘게 오래됐으면, **마지막 하트비트 시각**을 중단 시작으로 본다. 폰이 꺼져 있던 동안에는 아무것도 기록할 수 없으니 역산하는 것이다.
- 두 서비스가 다시 정상이 되면 중단 시간과 사유를 `downtime.log`에 남긴다.
- `stop`, `restart`, 크래시, 먹통 감지는 그 시점에 바로 중단 시작을 기록한다.

세 번째 재부팅의 기록이다.

```
[DOWNTIME] Service was unavailable for 162s (unexpected_shutdown_or_reboot,
           from 2026-09-18 14:07:55 UTC to 2026-09-18 14:10:37 UTC)
```

162초를 로그로 쪼개 보면 이렇다.

| 시각 (UTC) | 사건 | 출처 |
|:---|:---|:---|
| 14:07:55 | 마지막 하트비트 (재부팅 직전) | 하트비트 파일 |
| 14:10:23 | Termux 쪽 런처가 감시 데몬 기동 요청 | Termux `boot_services.log` |
| 14:10:24 | 감시 데몬 기동 | `daemon.log` |
| 14:10:27 | 터널 개통 | `ngrok.log` |
| 14:10:37 | 복구 기록 (다음 감시 루프) | `downtime.log` |

162초 중 **148초는 폰이 꺼졌다 켜져서 런처가 불리기까지의 시간**이다. 서비스 쪽은 3초 만에 터널을 열었고, 기록이 10초 늦은 것은 감시 루프 주기 때문이다. 재부팅 다운타임을 줄이고 싶다면 고칠 곳은 서비스가 아니라 폰의 부팅이다.

감시 루프 주기(10초)보다 정밀한 값이 필요할 때를 위해 바깥에서 0.5초 간격으로 주소를 찌르는 측정 스크립트(`measure_downtime.py`)도 따로 만들었다. 재부팅이나 재시작 직전에 켜 두면 끊긴 순간과 돌아온 순간을 잰다.

### 덤: 같은 초에 두 번 불린 런처

두 번째 재부팅 때 Termux 쪽 런처 기록이다.

```
[2026-09-18 22:52:48 KST] launching supervisor
[2026-09-18 22:52:48 KST] launching supervisor
```

런처를 부르는 쪽은 여럿이다(부팅 스크립트, Termux 로그인 훅, 15분 감시 작업). 부팅 직후 그중 둘이 같은 초에 런처를 불렀고, 둘 다 "감시 데몬 없음"을 확인한 뒤 데몬을 띄웠다. 그래도 `daemon.log`의 `Supervisor started`는 한 줄뿐이다. 6편에서 넣은 `flock` 단일 실행 보장이 두 번째 인스턴스를 조용히 물렸다. 경쟁 조건은 "설마 동시에"가 아니라 부팅 직후처럼 모두가 한꺼번에 깨어나는 순간에 실제로 일어난다.

---

## 남은 의문

세 번의 재부팅 중 두 번, 부팅 직후 첫 기동한 ngrok이 `FIPS 140 mode` 다음 단계로 넘어가지 못했다. 세 번째 재부팅에서는 멀쩡했다. 이유는 아직 모른다. 다음에 재현되면 멈춘 프로세스의 스레드 상태와 열려 있는 파일·소켓부터 떠 둘 생각이다. 원인을 찾으면 예방으로 바꾸고, 못 찾더라도 지금의 감지·복구는 원인과 무관하게 동작한다.

## 정리

1. **살아 있는 것과 일하는 것은 다르다.** PID 확인은 "죽었는가"에만 답한다. 헬스체크는 서비스가 실제로 하는 일을 시켜 봐야 한다.
2. **원인을 모르면 증상을 감지한다.** 네트워크 가설에 기댄 예방은 두 번째 재부팅에서 빗나갔다. 증상 감지는 가설이 틀려도 동작했다.
3. **헬스체크는 고칠 수 있는 범위만 재야 한다.** ngrok을 공개 주소가 아니라 로컬 관리 API로 확인한 이유다. 재시작으로 고칠 수 없는 실패까지 재면 재시작 루프만 남는다.
4. **상태 표시는 헬스체크와 같은 질문을 해야 한다.** 다른 질문을 하는 상태 명령은 장애 중에도 정상이라고 답한다.
5. **다운타임은 재야 줄일 수 있다.** 재부팅 중단 162초의 91%는 서비스가 아니라 폰의 재부팅 자체였다.
