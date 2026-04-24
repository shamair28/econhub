(function () {
  var btn     = document.getElementById('next-btn');
  var titleEl = document.getElementById('next-btn-title');
  if (!btn) return;

  // Strip trailing slash and .html extension so both
  // /1ME3/ch1  and  /1ME3/1ME3-ch1  (and /1ME3/1ME3-ch1.html) are handled
  var path = window.location.pathname
    .replace(/\/$/, '')
    .replace(/\.html?$/i, '');

  var nextNum, nextHref;

  // Pattern A: clean redirect URL  →  /1ME3/ch1
  var cleanMatch = path.match(/^(.*\/)ch(\d+)$/i);
  if (cleanMatch) {
    nextNum  = parseInt(cleanMatch[2], 10) + 1;
    nextHref = window.location.origin + cleanMatch[1] + 'ch' + nextNum;
  }

  // Pattern B: rewrite target URL  →  /1ME3/1ME3-ch1
  // Extract the directory and chapter number, then build the clean URL
  if (!nextHref) {
    var fileMatch = path.match(/^(.*\/)[^/]*-ch(\d+)$/i);
    if (fileMatch) {
      nextNum  = parseInt(fileMatch[2], 10) + 1;
      nextHref = window.location.origin + fileMatch[1] + 'ch' + nextNum;
    }
  }

  if (nextHref) {
    btn.href = nextHref;
    titleEl.textContent = 'Chapter ' + nextNum;
  }
  // If neither pattern matched the button stays visible at href="#"
})();
