(function () {
  'use strict';

  // Links shared before the move to Hugo pointed at /#post=<file id> or /#dashboard.
  // Theme switching and the code copy buttons come from PaperMod now.
  var legacy = document.getElementById('legacy-links');
  if (!legacy || location.hash.length < 2) return;
  try {
    var map = JSON.parse(legacy.textContent);
    var key = location.hash.slice(1).replace(/^post=/, '');
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      location.replace(map[key]);
    }
  } catch (e) { /* stay on the home page */ }
})();
