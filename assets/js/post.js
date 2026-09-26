(function () {
  'use strict';

  // Each part stands alone, so a post without a table of contents (or a browser without
  // IntersectionObserver) still gets the rest.
  shareButtons();
  seriesBox();
  readingProgress();
  sideToc();

  // --- Copy-link and native share ------------------------------------------------------
  // The address is the canonical GitHub Pages one from data-url, never location.href: a
  // page read over the tailnet (http://100.x.y.z:8080/...) is not something to hand out.
  function shareButtons() {
    var box = document.querySelector('.post-share');
    if (!box) return;
    var url = box.getAttribute('data-url');
    var title = box.getAttribute('data-title');
    var copyButton = box.querySelector('[data-action="copy"]');
    var shareButton = box.querySelector('[data-action="share"]');

    copyButton.addEventListener('click', function () {
      copyText(url).then(function () {
        flash(copyButton, '복사 완료!');
      }, function () {
        window.prompt('이 주소를 복사하세요', url);
      });
    });

    // The share sheet (KakaoTalk and the rest) needs HTTPS, so the tailnet copy over plain
    // HTTP never shows this button; the copy button still works there.
    if (navigator.share) {
      shareButton.hidden = false;
      shareButton.addEventListener('click', function () {
        navigator.share({ title: title, url: url }).catch(function () { /* dismissed */ });
      });
    }
    box.hidden = false;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // No Clipboard API on plain HTTP: fall back to a selected, off-screen textarea
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var copied = false;
      try { copied = document.execCommand('copy'); } catch (e) { /* unsupported */ }
      document.body.removeChild(area);
      if (copied) { resolve(); } else { reject(); }
    });
  }

  function flash(button, text) {
    var original = button.textContent;
    button.textContent = text;
    button.disabled = true;
    setTimeout(function () {
      button.textContent = original;
      button.disabled = false;
    }, 1500);
  }

  // --- Series box ----------------------------------------------------------------------
  // Closed by default; a reader who opens it keeps it open on the next part too.
  function seriesBox() {
    var box = document.querySelector('.series-box');
    if (!box) return;
    var key = 'series-box-open';
    try {
      if (localStorage.getItem(key) === '1') box.open = true;
    } catch (e) { /* storage blocked: stay closed */ }
    box.addEventListener('toggle', function () {
      try { localStorage.setItem(key, box.open ? '1' : '0'); } catch (e) { /* ignore */ }
    });
  }

  // --- Reading progress ----------------------------------------------------------------
  // A thin bar across the top of the window, as on minyeamer.github.io: how far through
  // the article body the reader is, not the whole page with its footer.
  function readingProgress() {
    var body = document.querySelector('.post-content');
    if (!body) return;
    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var pending = false;
    function update() {
      pending = false;
      var rect = body.getBoundingClientRect();
      var travel = rect.height - window.innerHeight;
      var done = travel > 0 ? -rect.top / travel : (rect.top < 0 ? 1 : 0);
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, done)) + ')';
    }
    function schedule() {
      if (!pending) {
        pending = true;
        window.requestAnimationFrame(update);
      }
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }

  // --- Table of contents beside the article on wide screens ----------------------------
  // custom.css moves the theme's <details class="toc"> into the right margin at the same
  // width; here it is opened there and closed again below it, and the section being read
  // is marked as the reader scrolls.
  function sideToc() {
    var toc = document.querySelector('.post-single .toc');
    if (!toc) return;

    var wide = window.matchMedia('(min-width: 1340px)');
    var closedByTheme = !toc.open;
    function place() {
      if (wide.matches) {
        toc.open = true;
      } else if (closedByTheme) {
        toc.open = false;
      }
    }
    place();
    if (wide.addEventListener) { wide.addEventListener('change', place); }

    if (!('IntersectionObserver' in window)) return;
    var links = {};
    toc.querySelectorAll('a[href^="#"]').forEach(function (a) {
      links[decodeURIComponent(a.getAttribute('href').slice(1))] = a;
    });
    var headings = Array.prototype.filter.call(
      document.querySelectorAll('.post-content h2[id], .post-content h3[id]'),
      function (h) { return links[h.id]; });
    if (!headings.length) return;

    var current = null;
    function mark(id) {
      if (current) { current.classList.remove('active'); }
      current = links[id] || null;
      if (current) { current.classList.add('active'); }
    }
    // A heading counts as "being read" once it passes the upper fifth of the window
    var observer = new IntersectionObserver(function () {
      var passed = headings.filter(function (h) {
        return h.getBoundingClientRect().top < window.innerHeight * 0.2;
      });
      mark(passed.length ? passed[passed.length - 1].id : headings[0].id);
    }, { rootMargin: '0px 0px -80% 0px' });
    headings.forEach(function (h) { observer.observe(h); });
  }
})();
