(function () {
  var path  = window.location.pathname.replace(/\/$/, '');
  var match = path.match(/^(.*\/ch)(\d+)$/i);
  var btn     = document.getElementById('next-btn');
  var titleEl = document.getElementById('next-btn-title');
  if (!btn) return;

  if (match) {
    var nextNum = parseInt(match[2], 10) + 1;
    btn.href = window.location.origin + match[1] + nextNum;
    titleEl.textContent = 'Chapter ' + nextNum;
  } else {
    // Fallback for local file:// preview
    // Derive next chapter number from the filename (e.g. Chapter2 → Chapter3)
    var fileMatch = window.location.pathname.match(/[Cc]hapter(\d+)/);
    if (fileMatch) {
      var nextNum = parseInt(fileMatch[1], 10) + 1;
      btn.href = 'ECON-1ME3-Chapter' + nextNum + '-Lesson-Rendered.html';
      titleEl.textContent = 'Chapter ' + nextNum;
    }
    // If neither pattern matches, the button stays visible with href="#"
  }
})();
