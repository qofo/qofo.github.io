---
title: "알림으로는 배터리를 지킬 수 없었다: 스마트 플러그로 충전기 켜고 끄기"
slug: "smart-plug-charging"
date: 2026-09-27
lastmod: 2026-09-29
weight: 12
series: ["스마트폰으로 서버 만들기"]
categories: ["인프라", "폰 홈서버"]
tags: ["Tapo", "Smart Plug", "Battery", "python-kasa", "KLAP", "Termux"]
description: "이 폰에서 가장 비싼 소모품은 배터리다. 충전기를 빼고 꽂으라는 알림은 밤에 아무도 보지 않았고, 폰은 방전돼 꺼졌다. 충전기를 스마트 플러그에 물리고 폰이 직접 켜고 끄게 했다."
---
이 폰에서 가장 비싼 소모품은 배터리다. 안드로이드 9에는 충전 상한 설정이 없어서, 꽂아 두면 하루 종일 100%에 머문다. 2017년에 나온 배터리가 그렇게 지내면 1~2년 안에 부푼다.

그래서 9월 20일부터 폰은 15분마다 배터리를 읽었다. 충전 중 80%가 넘으면 "충전기를 빼세요", 방전 중 30% 아래로 내려가면 "충전기를 꽂으세요"라는 알림을 띄웠다. 9월 22일에는 30% 알림에 진동도 붙였다. 둘 다 사람이 움직여 주기를 기다리는 방식이다.

이 글은 그 사람 손을 스마트 플러그로 바꾼 기록이다. 비밀번호는 맞는데 플러그가 대답하지 않는 문제를 푸는 데 대부분의 시간이 들었다.

---

## 1. 알림은 밤에 아무도 보지 않는다

9월 25일 밤, 폰은 충전기 없이 밤을 넘겼다. 배터리 기록이다.

| 시각 (KST) | 잔량 | 앞 기록과의 간격 |
|---|---|---|
| 25일 23:08 | 63% | |
| 26일 00:02 | 46% | 54분 |
| 01:56 | 36% | 1시간 54분 |
| 03:28 | 27% | 1시간 32분 |
| 05:56 | 15% | 2시간 28분 |
| 06:37 | 11% | 41분 |
| 09:45 | 0% | 3시간 8분 |

30% 아래의 첫 기록은 새벽 3시 28분이다. 알림은 그때 울렸을 것이고, 그 시각에 깨어 있는 사람은 없었다. 09:45에 0%를 찍은 뒤 폰은 꺼졌다. 다운타임 기록이 그 시간을 남겼다.

```
[2026-09-26 02:31:36 UTC] [DOWNTIME] Service was unavailable for 6393s (unexpected_shutdown_or_reboot, from 2026-09-26 00:45:03 UTC to 2026-09-26 02:31:36 UTC)
```

1시간 46분이다. 기준값을 30%에서 올려도 소용이 없었을 이유도 표에 있다. 15분 주기 작업인데 간격이 1~3시간으로 벌어졌다. [5편](05-termux-boot-supervisor.md)에서 다룬 Doze다. 화면이 꺼진 채 배터리로 돌면 안드로이드가 예약 작업을 몰아서 늦게 돌린다. 그동안 배터리는 한 시간에 5%쯤 빠졌다(01:56에 36%, 05:56에 15%). 점검 한 번이 늦으면 15% 가까이가 그 사이에 사라진다.

필요한 것은 더 시끄러운 알림이 아니라, 사람이 자는 동안에도 충전기를 켜고 끄는 손이었다.

## 2. 충전기 위쪽에서 전원을 끊는다

루팅하지 않은 안드로이드 9에서는 충전 회로를 건드릴 방법이 없다. 대신 충전기에 들어가는 전원을 끊으면 된다. TP-Link의 Tapo P100 스마트 플러그를 샀다. [python-kasa](https://github.com/python-kasa/python-kasa)라는 파이썬 라이브러리가 이 플러그를 클라우드를 거치지 않고 공유기 안에서 직접 제어한다.

계정을 넣기 전에 먼저 플러그가 보이는지 확인했다. python-kasa의 탐색은 UDP 브로드캐스트를 쓰고 계정이 필요 없다. 주소는 예시로 바꿨다.

```
{"ip": "192.168.0.42", "model": "P100(EU)", "type": "SMART.TAPOPLUG", "encrypt": "KLAP", "http_port": 80}
```

KLAP은 Tapo 기기가 쓰는 로컬 인증 방식이다. 연결을 시작하기 전에 두 가지를 정했다.

**설치할 층.** [11편](11-agent-session-outside-proot.md)에서 tmux는 proot 밖, Termux 쪽에 설치했다. 로그인 셸과 함께 죽으면 안 되기 때문이었다. 이번에는 반대로 proot 안이다. Termux의 python3는 플랫폼이 `android-24-arm64_v8a`인데, python-kasa가 쓰는 `cryptography`는 이 플랫폼용 휠을 내지 않는다. 폰에서 Rust로 컴파일하는 대신, glibc가 있는 우분투 쪽에 `apt`로 python3를 깔고 venv를 만들었다. 부르는 쪽인 배터리 감시는 알림 때문에 Termux 쪽에 남는다.

```bash
apt-get install -y python3 python3-venv
python3 -m venv /root/.local/share/tapo-venv
/root/.local/share/tapo-venv/bin/pip install python-kasa==0.10.2
```

**계정.** 로컬 제어에도 Tapo 계정의 이메일과 비밀번호가 필요하다. 이 폰에 평문으로 남는다는 뜻이다. 어느 저장소에도 속하지 않는 `/root/.config/tapo/credentials`에 두고 권한을 600으로 막았다. Tapo 앱에서는 "타사 호환성(Third-Party Compatibility)"을 켰다. 최신 펌웨어는 이것이 꺼져 있으면 로컬 제어를 거부한다고 [Home Assistant 문서](https://www.home-assistant.io/integrations/tplink/)에 적혀 있다.

## 3. 비밀번호는 맞는데 대답이 없다

첫 연결은 시간 초과로 끝났다. 디버그 로그를 켜니 절반은 성공한 상태였다.

```
kasa.transports.klaptransport handshake1 hashes match with expected credentials
kasa.httpclient Posting to http://192.168.0.42/app/handshake2
kasa.protocols.smartprotocol Unable to query the device: 192.168.0.42, not retrying: ('Unable to query the device: 192.168.0.42: ', TimeoutError())
```

KLAP은 핸드셰이크를 두 번 한다. 첫 번째 응답에서 서버가 보낸 해시가 내 계정으로 계산한 값과 맞았다(`hashes match`). 그러니 계정은 맞다. 멈춘 곳은 두 번째 요청이다.

한 층 내려가 `curl`로 첫 핸드셰이크 주소를 세 번 불렀다.

```
handshake1: HTTP 000 10.002625s 0B
handshake1: HTTP 200 0.025529s 48B
handshake1: HTTP 200 0.027627s 48B
```

첫 요청은 10초 동안 대답이 없었고, 바로 이어진 두 요청은 25ms 만에 돌아왔다. 두 핸드셰이크를 직접 계산해 여덟 번 보내 보니 두 번째 핸드셰이크가 정확히 절반만 성공했다.

```
0: handshake1 0.02s, handshake2 TimeoutError 5.16s
1: handshake1 0.04s, handshake2 HTTP 200 0.05s
2: handshake1 0.04s, handshake2 TimeoutError 5.85s
3: handshake1 0.04s, handshake2 TimeoutError 5.95s
4: handshake1 0.04s, handshake2 HTTP 200 0.04s
5: handshake1 0.05s, handshake2 TimeoutError 5.86s
6: handshake1 0.04s, handshake2 HTTP 200 0.03s
7: handshake1 0.03s, handshake2 HTTP 200 0.03s
```

성공하면 30~50ms, 실패하면 끝까지 대답이 없다. 두 요청 사이에 0.5초, 1.5초를 쉬어 봐도 달라지지 않았다. 대신 걸린 시간에 1.03초, 3.03초 같은 값이 섞여 나왔다. TCP가 첫 SYN을 잃고 다시 보내는 간격이다. 서버가 느린 게 아니라 패킷이 사라지고 있었다.

그래서 폰에서 공유기와 플러그에 핑을 60번씩 보냈다.

```
== 공유기
60 packets transmitted, 59 received, 1% packet loss
== 플러그
60 packets transmitted, 51 received, 15% packet loss
```

같은 폰, 같은 와이파이인데 플러그까지만 15%를 잃는다. 플러그가 보고한 신호 세기는 −52dBm으로 좋은 편이다. 신호가 약해서가 아니라는 것까지는 알지만, 원인은 확인하지 못했다. 플러그의 무선 절전 때문이라고 짐작할 뿐이다. 확실한 것은 이 플러그와의 대화에서 어떤 요청이든 사라질 수 있다는 점이다.

## 4. 요청을 줄이고, 전체를 다시 시도한다

패킷이 사라지는 것 말고도 먼저 의심한 것이 있었다. 연결 재사용이다. python-kasa는 HTTP 연결을 유지해 두었다가 다음 요청에 다시 쓴다. 플러그가 그 연결을 몰래 닫아서 두 번째 핸드셰이크가 대답을 못 받는다고 보고, 요청마다 새 연결을 쓰게 했다.

그러자 이번에는 두 번째 핸드셰이크가 400으로 돌아왔다. 첫 핸드셰이크가 준 세션 쿠키가 돌아가지 않았다는 뜻이다. 연결 방식을 바꾸려고 aiohttp 세션을 직접 만들어 넘겼는데, aiohttp의 기본 쿠키 저장소는 도메인이 아니라 IP 주소에서 온 쿠키를 버린다. python-kasa는 자기 세션을 만들 때 `unsafe=True`로 이를 허용하지만, 세션을 대신 넘기면 그 설정도 대신 넣어야 한다.

쿠키를 고친 뒤 처음의 의심을 따로 확인했다. 세션 쿠키를 python-kasa와 같은 방식으로 보내면서, 연결을 유지하는 쪽과 매번 새로 여는 쪽을 번갈아 여덟 번씩 보냈다.

```
kept-alive     : hs2 ok 6/8, hs2 lost 0, hs1 lost 2, other []
fresh connection: hs2 ok 4/8, hs2 lost 1, hs1 lost 3, other []
```

연결 재사용은 원인이 아니었다. 실패는 양쪽 모두 패킷 손실이었고, 새 연결을 여는 쪽이 오히려 더 잃었다. 새 연결과 쿠키 설정은 모두 걷어 내고 python-kasa의 세션을 그대로 쓰기로 했다.

효과가 있었던 것은 요청 수였다. `Device.connect()`는 기기가 가진 기능 목록을 전부 묻고 시작하므로 요청이 여러 개다. 요청 하나하나가 15% 확률로 사라질 수 있으니 요청이 많을수록 불리하다. 이 함수로는 상태 읽기 다섯 번 중 세 번 성공했다. 꼭 필요한 것만 남겼다. 핸드셰이크 두 번과 질의 한 번이다.

```python
async def exchange(host, creds, request):
    """One KLAP session: handshake1, handshake2, then the request, and nothing else."""
    config = DeviceConfig(
        host=host, credentials=creds, timeout=TIMEOUT,
        connection_type=DeviceConnectionParameters(
            DeviceFamily.SmartTapoPlug, DeviceEncryptionType.Klap, login_version=2, http_port=80))
    protocol = SmartProtocol(transport=KlapTransportV2(config=config))
    try:
        return await protocol.query(request, retry_count=0)
    finally:
        await protocol.close()
```

요청마다 12초 타임아웃을 두고, 실패하면 세션 전체를 새로 최대 네 번 시도한다. 상태를 여덟 번 읽었다.

```
run 0: on=False try 2, 12.4s
run 1: on=False try 2, 13.0s
run 2: on=False try 2, 13.0s
run 3: on=False try 1, 0.1s
run 4: on=False try 2, 12.9s
run 5: on=False try 1, 0.1s
run 6: on=False try 1, 1.3s
run 7: on=False try 1, 0.1s
8/8 succeeded
```

전부 성공했다. 첫 시도에 0.1초 만에 끝나거나, 첫 시도가 12초 타임아웃에 걸리고 두 번째에 끝난다. 15분마다 도는 작업이라 이 정도면 충분하다. 이것을 `status`, `on`, `off` 세 명령을 받는 [`tapo_plug.py`](https://github.com/qofo/phone-homeserver/blob/main/tapo_plug.py)로 묶었다. 플러그의 주소가 바뀌면 브로드캐스트로 다시 찾아 저장한다.

## 5. 플러그의 대답 대신 폰의 상태를 믿는다

켜고 끄는 명령은 한 가지 문제가 더 있었다. 명령이 이미 실행된 뒤에 대답만 사라진다. 배터리를 35%로 가장한 시험용 사본을 돌렸을 때의 기록이다.

```
2026-09-27 15:07:55 KST plug on: error: no answer from the plug at 192.168.0.42 (KasaException), phone now Charging
```

도구는 플러그가 대답하지 않았다고 했는데, 폰은 이미 충전 중이다. 켜는 명령은 들어갔고 그 뒤의 대답과 확인 요청이 모두 사라졌다. 플러그의 말을 믿으면 성공을 실패로 기록하고, 필요 없는 알림을 띄우게 된다.

그래서 성공의 기준을 폰으로 옮겼다. 배터리 감시 스크립트는 명령을 보낸 뒤 30초 동안 폰 자신의 충전 상태를 확인한다.

```sh
case "$status" in
    Charging|Full) [ "$pct" -ge "$HIGH" ] && want=off ;;
    *) [ "$pct" -le "$PLUG_ON" ] && want=on ;;
esac
if [ -n "$want" ] && [ -r "$PLUG_CREDENTIALS" ] && [ -x "$ROOTFS$PLUG_TOOL" ]; then
    reply=$("$PREFIX/bin/proot-distro" login ubuntu -- "$PLUG_TOOL" "$want" 2>&1 | tail -n 1)
    waited=0
    now=$(read_node status)
    while [ "$waited" -lt 30 ]; do
        now=$(read_node status)
        case "$want:$now" in
            off:Discharging|"off:Not charging"|on:Charging|on:Full) plug_ok=1; break ;;
        esac
        sleep 3
        waited=$((waited + 3))
    done
```

`Discharging`이나 `Charging`으로 바뀌었으면 성공이다. 바뀌지 않았을 때만 예전 알림(80% "빼세요", 30% "꽂으세요"와 진동)으로 돌아간다. 알림은 이제 플러그가 실패했다는 신호다.

기준값은 끄는 쪽 80%, 켜는 쪽 40%다. 켜는 쪽을 30%가 아니라 40%로 둔 이유는 1절의 표에 있다. 밤에는 점검이 세 시간 늦을 수 있고 그동안 15%가 빠진다. Tapo 앱에는 매일 저녁 플러그를 켜는 예약도 걸어 두었다. 자동 제어가 어떤 이유로든 멈춰도 밤에는 충전이 된다.

마지막으로 잠금을 넣었다. 1절의 날 로그에는 같은 초에 두 줄씩 찍힌 기록이 세 번 있다(00:02:05, 06:37:51, 09:45:06). 작업이 두 번 시작된 것이다. 알림은 두 번 떠도 그만이지만, 두 실행이 동시에 플러그를 바꾸면 서로의 결과를 자기 것으로 기록한다. 이제 먼저 시작한 실행만 진행한다.

## 6. 검증

**플러그와 폰.** 배터리 100%에서 끄기, 켜기, 끄기를 차례로 보냈다. 매번 폰의 상태가 곧바로 따라 바뀌었다. 전류가 음수면 배터리에서 나가는 중이다.

```
off -> plug=off (exit 0); phone status 'Discharging' after 0s, pct=100, mA=-255
on -> plug=on (exit 0); phone status 'Charging' after 0s, pct=100, mA=390
off -> plug=off (exit 0); phone status 'Discharging' after 0s, pct=100, mA=-319
```

**Termux 쪽에서 부르기.** 감시 스크립트는 proot 밖 예약 작업으로 돈다. 같은 자리에서 일회성 작업으로 `proot-distro login`을 거쳐 상태를 읽었더니 16초 만에 `off`가 돌아왔다.

**켜는 경로.** 잔량 읽는 줄을 `pct=35`로 바꾸고 기록 파일의 위치만 옮긴 사본을 예약 작업으로 돌렸다. 5절의 기록대로 플러그가 켜지고 폰이 충전을 시작했다.

**끄는 경로.** 실제 스크립트를 98% 충전 중에 돌렸다. 이번에도 대답은 사라졌지만, 폰이 배터리로 넘어간 것을 확인하고 성공으로 기록했다.

```
2026-09-27 15:09:43 KST pct=98 status=Charging temp=34.7 mA=538 mV=4282
2026-09-27 15:10:48 KST plug off: phone now Discharging (plug said: error: no answer from the plug at 192.168.0.42 (KasaException))
```

실제 배터리가 40%까지 내려가 플러그가 켜지는 장면은 아직 보지 못했다. 켜는 경로는 가짜 35%로만 시험했다.

## 7. 한계

- **80%에서 정확히 멈추지 않는다.** 점검이 15분마다라서 그 사이에 더 찬다. 이날 충전 기록은 14:16에 83%, 14:31에 94%였다. 15분에 11%가 찬다면 80%에서 끄려 해도 90% 언저리까지 갈 수 있다. 그래도 하루 종일 100%에 머무는 것과는 다르다.
- **계정이 폰에 평문으로 있다.** 로컬 제어의 조건이다. Tapo 비밀번호는 다른 서비스와 겹치지 않게 하는 수밖에 없다.
- **펌웨어가 바뀌면 멈출 수 있다.** 로컬 제어는 제조사가 열어 둔 만큼만 된다. 그때를 위해 저녁 예약과 알림을 남겨 두었다.
- **라이브러리의 안쪽을 쓴다.** 요청을 줄이려고 `Device` 대신 `SmartProtocol`과 `KlapTransportV2`를 직접 쓴다. 공개 API보다 바뀌기 쉬우므로 python-kasa를 0.10.2로 고정했다.

## 정리

1. **사람에게 부탁하는 자동화는 사람이 잠든 시간에 끝난다.** 알림을 더 시끄럽게 만드는 대신 사람의 손을 기계로 바꿨다.
2. **신호가 좋아도 패킷은 사라진다.** −52dBm인 플러그가 15%를 잃었다. 재 보기 전에는 알 수 없었다.
3. **의심은 고치기 전에 확인한다.** 연결 재사용을 의심해 먼저 고쳤다가 쿠키 문제를 새로 만들었고, 나중에 비교해 보니 재사용은 원인이 아니었다. 효과가 있었던 것은 요청 수를 줄인 것이다.
4. **대답이 없다고 일이 안 된 것은 아니다.** 결과는 가장 확실한 곳에서 확인한다. 여기서는 폰의 충전 상태다.

코드는 [`tapo_plug.py`](https://github.com/qofo/phone-homeserver/blob/main/tapo_plug.py)와 [`termux/battery-watch.sh`](https://github.com/qofo/phone-homeserver/blob/main/termux/battery-watch.sh)에 있고, 설정 순서는 [운영 가이드 6.1절](https://github.com/qofo/phone-homeserver/blob/main/docs/06-operations.ko.md#알림-대신-스마트-플러그)에 정리했다.

## 덧붙임: 이튿날의 기록 (9월 28일)

하루를 돌려 보니 이 글의 설계에서 두 곳이 틀렸다.

**첫날 밤은 계획대로였다.** 21:56에 52%로 배터리로 돌던 폰이, Tapo 앱의 22:00 켜기 예약으로 충전을 시작했다. 22:46에 스크립트가 플러그를 껐다. 7절에서 예상한 대로 80%가 아니라 91%에서 멈췄다(22:26에 76%, 다음 점검인 22:45에 91%).

**이튿날 아침, 40% 켜기가 돌지 않았다.** 06:35에 52%를 읽은 다음 기록이 12:03이다.

```
2026-09-28 06:35:00 KST pct=52 status=Discharging temp=27.4 mA=-98 mV=3825
2026-09-28 12:03:01 KST pct=25 status=Charging temp=28.1 mA=0 mV=3738
```

5시간 28분 동안 점검이 한 번도 없었다. 1절에서 본 Doze가 이번에는 켜는 쪽을 막았다. 그 사이 배터리는 25%까지 내려갔고, 12:03에는 이미 충전 중이었다. 그 전에 누가 플러그를 켰는지는 기록에 남아 있지 않다. 15분마다 도는 예약 작업은 밤에는 시계 노릇을 하지 못한다.

그런데 같은 밤, proot 안의 감시 데몬은 멈추지 않았다. 감시 데몬은 10초마다 하트비트를 남기고, 하트비트가 20초 넘게 비면 다운타임으로 기록한다([7편](07-hung-ngrok-health-checks.md)). 두 밤 모두 그런 기록이 없다. 적어도 이 폰에서 안드로이드가 미룬 것은 예약 작업이었고, 이미 돌고 있는 프로세스는 아니었다. 그래서 배터리 점검을 **5분마다 도는 반복**으로 바꾸고, 예약 작업은 그 반복이 죽었을 때 다시 띄우는 일만 하게 했다. 22:39에 설치했고, 첫 두 점검이 22:39:10과 22:44:10에 찍혔다.

**플러그가 아홉 시간 동안 제어를 거부했다.** 13:03부터 끄는 명령이 매번 실패했고, 폰은 13:43부터 100%에 머물렀다. 처음 기록은 "대답이 없다"였지만, 직접 확인하니 플러그는 대답하고 있었다. 첫 핸드셰이크에 403으로, 로컬 제어를 거부한다는 답이었다. 도구가 그 이유를 적게 고친 뒤의 기록이다.

```
2026-09-28 20:04:47 KST plug off FAILED: error: the plug refused local control (403 to handshake1): in the Tapo app, turn Third-Party Compatibility off, wait ten seconds, and turn it on again, phone still Full after 30s
```

펌웨어는 전날과 같은 1.2.5였다. 원인은 끝내 모른다. Tapo 앱에서 타사 호환성을 껐다가 다시 켜자, 다음 점검에서 바로 풀렸다.

```
2026-09-28 22:04:52 KST plug off: phone now Discharging (plug said: off)
```

그동안 사람은 이 일을 몰랐다. 예전 알림은 오후 1시에 "충전기를 빼세요"를 한 번 띄웠을 뿐, 이유는 말하지 않았다. 이제는 플러그가 거부하면 곧바로 "타사 호환성을 껐다 켜 주세요"라는 알림을 띄운다. 플러그가 아예 대답하지 않을 때는 패킷 손실일 수 있으니 3번 연속일 때만 띄우고, 다시 대답하면 알림을 지운다.

**플러그의 "자동 끄기"는 켜지 않았다.** 켜진 뒤 정해진 시간이 지나면 플러그가 스스로 꺼지게 하면, 폰이 끄지 못해도 충전이 멈춘다. 오늘 같은 날 100%에 몇 시간씩 머무는 일은 막을 수 있다. 하지만 켜는 예약은 하루 한 번뿐이다. 거부가 있는 날 자동 끄기까지 켜져 있으면, 충전기는 꺼진 채 남고 폰은 결국 방전된다. 서버에는 몇 시간 100%에 있는 것보다 꺼지는 쪽이 더 나쁘다.

반복으로 밤을 넘긴 기록은 아직 없다. 40%에서 실제로 켜지는지는 다음 밤의 로그로 확인한다.

## 덧붙임: 사흘째의 기록 (9월 29일)

**반복은 밤을 넘겼다.** 22:30부터 07:20까지 기록이 114개 남았고, 가장 긴 간격이 5분이었다. 예약 작업을 반복으로 바꾼 것은 효과가 있었다. 07:15에 40%에 닿자 스크립트는 제때 플러그를 켜려 했다.

**그런데 플러그가 다시 거부했다.** 전날과 같은 403이다.

```
2026-09-29 07:15:28 KST plug on FAILED: error: the plug refused local control (403 to handshake1): in the Tapo app, turn Third-Party Compatibility off, wait ten seconds, and turn it on again, phone still Discharging after 30s
```

12:16까지 5분마다 55번을 시도했고 모두 같은 답이었다. 09:42 점검에서 30%가 되어 "충전기를 꽂으세요" 알림이 진동과 함께 나갔다. 22:00 켜기 예약은 너무 멀었다. 12:15에 배터리는 14%였다. 이 속도면 오후 늦게 꺼질 참이었다.

이번에도 해결은 같았다. Tapo 앱에서 타사 호환성을 껐다 켜자 플러그가 다시 대답했고, 기다리지 않고 바로 켰다.

```
2026-09-29 12:15:34 KST pct=14 status=Discharging temp=29.7 mA=-175 mV=3685
2026-09-29 12:21:12 KST pct=13 status=Charging temp=30.6 mA=978 mV=3846
2026-09-29 12:21:17 KST plug answers again
2026-09-29 13:26:22 KST pct=82 status=Charging temp=34.7 mA=1164 mV=4247
2026-09-29 13:26:57 KST plug off: phone now Discharging (plug said: off)
```

그 뒤 80% 끄기는 사람 손 없이 동작했다. 거부는 이틀 동안 두 번 있었고, 두 번 다 같은 방법으로 풀렸다. 원인은 여전히 모른다.

**켜기 예약을 하나 더 넣었다.** 이날의 빈틈은 설계에 있었다. 켜는 안전망이 22:00 한 번뿐이라, 아침에 거부가 시작되면 밤까지 기댈 곳이 없다. 그래서 08:00 켜기 예약을 더했다. 자동 제어가 정상인 날에는 80%에서 스크립트가 끄므로 손해가 없다.

예약은 앱이 아니라 폰에서 넣었다. 플러그는 로컬 API로 예약 목록을 읽고(`get_schedule_rules`) 더할 수 있다(`add_schedule_rule`). 22:00 규칙을 읽어 시각만 480분(08:00)으로 바꾼 규칙을 보냈다. 그런데 이 플러그답게 대답이 오다가 끊겼다(`TimeoutError`). 추가 요청은 다시 보내면 규칙이 두 번 들어갈 수 있으므로, 재시도 대신 목록을 다시 읽었다.

```
S1 22:00 on enabled week_day 127 repeat
S2 08:00 on enabled week_day 127 repeat
```

규칙은 한 번만 들어가 있었다. 대답을 잃는 장치에 상태를 바꾸는 요청을 보낼 때는, 성공 여부를 대답이 아니라 장치의 상태로 확인한다. 5절에서 충전 여부를 폰의 상태로 확인한 것과 같은 원칙이다.
