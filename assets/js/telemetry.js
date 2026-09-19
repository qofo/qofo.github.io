// Live numbers from the phone's /api/metrics, for the home pills and the dashboard.
// The same file runs on GitHub Pages (cross-origin, through ngrok) and on the phone (same origin).
(function () {
  'use strict';
  var script = document.currentScript;
  var URL_ = script.dataset.url;
  var BASE_MS = Math.max(2, Number(script.dataset.interval) || 10) * 1000;
  var MAX_MS = 60000;
  var TIMEOUT_MS = 8000;

  var crossOrigin = new URL(URL_, location.href).origin !== location.origin;
  // Without this header ngrok answers browsers with its warning page instead of the JSON.
  var headers = crossOrigin ? { 'ngrok-skip-browser-warning': '1' } : {};

  var timer = null;
  var delay = BASE_MS;
  var lastOk = null;
  var inFlight = false;

  function els(key) { return document.querySelectorAll('[data-m="' + key + '"]'); }
  function set(key, text) { els(key).forEach(function (el) { el.textContent = text; }); }
  function bar(key, pct, colorByLoad) {
    els(key).forEach(function (el) {
      el.style.width = Math.max(0, Math.min(100, pct)) + '%';
      if (colorByLoad) el.style.backgroundColor = loadColor(pct);
    });
  }
  function loadColor(pct) { return pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--accent)'; }
  function time(d) { return d.toTimeString().slice(0, 8); }

  var REASONS = {
    manual_restart: '수동 재시작', manual_stop: '수동 중지', restart: '재시작',
    'shutdown/reboot': '종료 또는 재부팅', unexpected_shutdown_or_reboot: '예기치 않은 종료 또는 재부팅',
    services_offline: '서비스 응답 없음', hung_blog: '블로그 서버 먹통 감지', hung_ngrok: 'ngrok 먹통 감지',
    crash_blog: '블로그 서버 비정상 종료', crash_ngrok: 'ngrok 비정상 종료'
  };

  function render(d) {
    var cpu = d.cpu.total_percent;
    var mem = d.memory;
    var batt = d.battery || {};

    // Home pills
    set('cpu', cpu + '%');
    set('ram', mem.ram_percent + '%');
    set('net', (d.network.rx_kbs + d.network.tx_kbs).toFixed(1) + ' KB/s');
    set('batt', batt.available ? batt.percentage + '%' : '--');
    set('uptime', d.system.uptime_str);

    // Dashboard
    set('cpuTotal', cpu + '%');
    bar('cpuBar', cpu, true);
    var cores = d.cpu.cores || [];
    if (cores.length) {
      var avg = Math.round(cores.reduce(function (a, c) { return a + c.freq_mhz; }, 0) / cores.length);
      set('cpuFreq', avg + ' MHz avg');
    }
    set('load', d.system.load_avg.join(', '));
    set('uptimeFull', d.system.uptime_str);

    set('ramPct', mem.ram_percent + '%');
    set('ramText', mem.ram_used_mb + ' / ' + mem.ram_total_mb + ' MB');
    bar('ramBar', mem.ram_percent, true);
    set('ramAvail', (mem.ram_total_mb - mem.ram_used_mb) + ' MB');
    set('swap', mem.swap_percent + '% (' + mem.swap_used_mb + ' MB)');

    set('rx', d.network.rx_kbs + ' KB/s');
    set('tx', d.network.tx_kbs + ' KB/s');
    set('storagePct', d.storage.percent + '%');
    set('storageFree', d.storage.free_gb + ' GB 가용');
    bar('storageBar', d.storage.percent, false);

    if (batt.available) {
      var charging = batt.status === 'CHARGING' || batt.status === 'FULL';
      set('battPct', batt.percentage + '%');
      set('battIcon', charging ? '⚡' : '🔋');
      set('battStatus', charging ? '충전 중' : '배터리로 동작 중');
      set('battPlugged', batt.plugged === 'UNPLUGGED' ? '전원 분리됨' : batt.plugged);
      set('battTemp', batt.temperature + ' °C');
      set('battHealth', batt.health);
    } else {
      set('battPct', '--');
      set('battStatus', batt.reason || '배터리 정보를 읽지 못했다');
    }

    renderCores('littleCores', cores.filter(function (c) { return c.type === 'little'; }));
    renderCores('bigCores', cores.filter(function (c) { return c.type === 'big'; }));

    var dt = d.downtime || {};
    if (dt.current_outage) {
      set('downtime', '지금 중단 중이다.');
    } else if (dt.last_downtime) {
      var l = dt.last_downtime;
      set('downtime', l.start + ' · ' + l.duration_seconds + '초 · ' + (REASONS[l.reason] || l.reason));
    } else {
      set('downtime', '기록 없음');
    }
  }

  function renderCores(key, cores) {
    els(key).forEach(function (grid) {
      var frag = document.createDocumentFragment();
      cores.forEach(function (c) {
        var pill = document.createElement('div');
        pill.className = 'core-pill';
        var head = document.createElement('div');
        head.className = 'core-header';
        var name = document.createElement('span');
        name.className = 'core-name';
        name.textContent = 'Core ' + c.id;
        var freq = document.createElement('span');
        freq.className = 'core-freq';
        freq.textContent = (c.freq_mhz > 0 ? c.freq_mhz + ' MHz' : 'Sleep') + ' · ' + c.usage_percent + '%';
        head.append(name, freq);
        var wrap = document.createElement('div');
        wrap.className = 'core-bar-wrap';
        var b = document.createElement('div');
        b.className = 'core-bar';
        b.style.width = Math.max(0, Math.min(100, c.usage_percent)) + '%';
        b.style.backgroundColor = loadColor(c.usage_percent);
        wrap.append(b);
        pill.append(head, wrap);
        frag.append(pill);
      });
      grid.replaceChildren(frag);
    });
  }

  function status(ok) {
    document.documentElement.classList.toggle('phone-offline', !ok);
    if (ok) {
      set('status', '실시간 수신 중 (' + time(lastOk) + ')');
    } else {
      set('status', '폰이 응답하지 않는다' + (lastOk ? ' (마지막 수신 ' + time(lastOk) + ')' : ''));
    }
  }

  function schedule() {
    clearTimeout(timer);
    timer = document.hidden ? null : setTimeout(poll, delay);
  }

  function poll() {
    if (inFlight) return;
    inFlight = true;
    var ctrl = new AbortController();
    var kill = setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    fetch(URL_, { headers: headers, cache: 'no-store', signal: ctrl.signal })
      .then(function (res) {
        var type = res.headers.get('content-type') || '';
        if (!res.ok || type.indexOf('application/json') === -1) throw new Error('bad response');
        return res.json();
      })
      .then(function (data) {
        lastOk = new Date();
        render(data);
        status(true);
        delay = BASE_MS;
      })
      .catch(function () {
        status(false);
        delay = Math.min(delay * 2, MAX_MS);
      })
      .finally(function () {
        clearTimeout(kill);
        inFlight = false;
        schedule();
      });
  }

  // Nothing to poll for while the tab is in the background
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearTimeout(timer);
      timer = null;
    } else {
      delay = BASE_MS;
      poll();
    }
  });

  poll();
})();
