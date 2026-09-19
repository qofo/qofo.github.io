(function () {
  'use strict';

  // Links shared before the move to Hugo pointed at /#post=<file id> or /#dashboard
  var legacy = document.getElementById('legacy-links');
  if (legacy && location.hash.length > 1) {
    try {
      var map = JSON.parse(legacy.textContent);
      var key = location.hash.slice(1).replace(/^post=/, '');
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        location.replace(map[key]);
        return;
      }
    } catch (e) { /* stay on the home page */ }
  }

  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var root = document.documentElement;
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });
  }

  if (navigator.clipboard) {
    document.querySelectorAll('.markdown-body .highlight, .markdown-body pre:not(.chroma)').forEach(function (block) {
      if (block.closest('.highlight') && block.tagName === 'PRE') return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        var code = block.querySelector('code') || block;
        navigator.clipboard.writeText(code.innerText).then(function () {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      });
      block.appendChild(btn);
    });
  }
})();
