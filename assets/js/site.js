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
