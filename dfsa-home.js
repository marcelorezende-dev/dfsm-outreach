/* ============================================================================
   DFSA — floating "Home" button
   Drop <script src="dfsa-home.js"></script> (optionally data-home="…/DFSA.html")
   before </body> on any page that should offer a way back to the DFSA hub.
   Skips pages that already carry a .topnav home bar.
   ============================================================================ */
(function () {
  if (document.querySelector('.topnav') || document.querySelector('.dfsa-topbar') || document.getElementById('dfsaHomeBtn')) return;
  var s = document.currentScript;
  var home = (s && s.getAttribute('data-home')) || 'DFSA.html';

  var a = document.createElement('a');
  a.id = 'dfsaHomeBtn';
  a.href = home;
  a.setAttribute('aria-label', 'Back to DFSA home');
  a.innerHTML =
    '<span class="dh-mark">DFSA<span class="dh-dot">.</span></span>' +
    '<span class="dh-sep"></span>' +
    '<span class="dh-home">\u2302 Home</span>';

  var css = document.createElement('style');
  css.textContent =
    '#dfsaHomeBtn{position:fixed;left:18px;bottom:18px;z-index:99999;display:inline-flex;align-items:center;gap:10px;' +
    'text-decoration:none;padding:9px 16px 9px 14px;border-radius:999px;' +
    'background:rgba(28,22,14,.92);box-shadow:0 8px 26px rgba(36,31,27,.34);backdrop-filter:blur(6px);' +
    'font-family:Poppins,system-ui,-apple-system,"Segoe UI",sans-serif;transition:transform .15s ease,box-shadow .15s ease;}' +
    '#dfsaHomeBtn:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(36,31,27,.42);}' +
    '#dfsaHomeBtn .dh-mark{font-weight:800;font-size:16px;letter-spacing:.02em;color:#F5F2E8;line-height:1;}' +
    '#dfsaHomeBtn .dh-dot{color:#F8B133;}' +
    '#dfsaHomeBtn .dh-sep{width:1px;height:16px;background:rgba(245,242,232,.28);}' +
    '#dfsaHomeBtn .dh-home{font-weight:600;font-size:12.5px;color:#E8C13C;letter-spacing:.01em;}' +
    '@media print{#dfsaHomeBtn{display:none;}}';
  document.head.appendChild(css);
  (document.body || document.documentElement).appendChild(a);
})();
