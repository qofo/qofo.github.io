# 서랍 속 폰으로 서버 운영하기

쓰지 않던 갤럭시 노트 FE(Android 9)에 우분투를 올려 블로그를 24시간 공개하면서 겪은 일을 기술 블로그 형식으로 기록한 연재다. 설치와 외부 공개에서 시작해, 장애를 분석하고 감시 구조를 다시 설계하는 데까지 이어진다.

코드와 운영 문서는 [`qofo/phone-homeserver`](https://github.com/qofo/phone-homeserver)에 있다.

## 목차

| 편 | 제목 |
|---|---|
| 1 | [서랍 속 갤럭시 노트 FE에 우분투를 올리기까지](posts/01_agy_setup_and_troubleshooting.md) |
| 2 | [파이썬 표준 라이브러리만으로 만든 블로그, 그리고 첫 외부 공개](posts/02_web_server_and_cloudflare_tunnel.md) |
| 3 | [스마트폰 리눅스의 진짜 제약: 가짜 root, 없는 systemd, 그리고 가짜 /proc](posts/03_android_proot_server_architecture_and_gotchas.md) |
| 4 | [도메인 없이 고정 주소 갖기: Cloudflare, DuckDNS, ngrok 실전 비교](posts/04_permanent_tunneling_and_domain_strategy.md) |
| 5 | [Termux:Boot와 감시 데몬으로 무인 운영 구성하기](posts/05_headless_autostart_and_self_healing_daemon.md) |
| 6 | [감시 데몬이 지키지 못한 것: 원인 분석과 재설계](posts/06_audit_and_supervisor_rewrite.md) |
| 7 | [살아 있지만 일하지 않는 프로세스: 재부팅 후 멈춘 ngrok과 능동 헬스체크](posts/07_reboot_hung_ngrok_and_active_health_checks.md) |
| 8 | [Tailscale 안에서만 열리는 문서 서버: 방화벽 없는 폰에서 접근 제어하기](posts/08_tailnet_only_private_docs_server.md) |

## 메모

- 글 안의 `#post=…` 링크는 폰 서버의 자체 뷰어용 주소라서 GitHub에서는 열리지 않는다. Hugo로 옮기면서 상대 링크로 바꿀 예정이다.
- 글에 나오는 IP와 호스트명은 공개 전에 예시 값으로 바꿨다.

## 라이선스

글은 [CC BY 4.0](LICENSE)이다. 출처를 밝히면 자유롭게 공유하고 바꿀 수 있다.
