(function () {
  'use strict';

  // Links shared before the move to Hugo pointed at /#post=<file id> or /#dashboard.
  // The map exists only on the home page, which is where those links land.
  // Theme switching and the code copy buttons come from PaperMod now.
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

  // The site menu (layouts/_partials/site_drawer.html). On a wide screen custom.css pins it
  // open and hides the button; below that the button slides it in over a dimmed page, and
  // the overlay, the close button or Escape put it away and hand focus back.
  var drawer = document.getElementById('site-drawer');
  var toggle = document.querySelector('.drawer-toggle');
  var overlay = document.querySelector('.drawer-overlay');
  if (drawer && toggle) {
    var setOpen = function (open) {
      drawer.classList.toggle('open', open);
      document.documentElement.classList.toggle('drawer-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (overlay) overlay.hidden = !open;
      if (open) {
        // Next frame: the drawer has only just stopped being visibility: hidden
        var first = drawer.querySelector('a, button');
        if (first) window.requestAnimationFrame(function () { first.focus(); });
      } else {
        toggle.focus();
      }
    };
    toggle.addEventListener('click', function () { setOpen(!drawer.classList.contains('open')); });
    var close = drawer.querySelector('.drawer-close');
    if (close) close.addEventListener('click', function () { setOpen(false); });
    if (overlay) overlay.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) setOpen(false);
    });

    // The drawer is rendered once for every page, so the current entry is marked here
    var here = location.pathname.replace(/index\.html$/, '');
    drawer.querySelectorAll('a[href]:not(.drawer-profile)').forEach(function (a) {
      var path = new URL(a.getAttribute('href'), location.href).pathname;
      if (path === here) a.setAttribute('aria-current', 'page');
    });
  }

  // "/" opens the search, as on minyeamer.github.io: on the search page it focuses the box,
  // anywhere else it goes there. Ignored while typing in a field or with a modifier held.
  var me = document.currentScript;
  var searchURL = me && me.getAttribute('data-search');
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
    var target = e.target;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    var box = document.getElementById('searchInput');
    if (box) {
      e.preventDefault();
      box.focus();
    } else if (searchURL) {
      e.preventDefault();
      location.href = searchURL;
    }
  });
})();
