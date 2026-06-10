// ---------------- input ----------------
const keys = {};
let optBoxes = [];
addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true;
  handleKey(e.key);
});
addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
// mobile browsers suspend the AudioContext until a gesture lands — re-arm it on every tap/key
for (const evt of ['pointerdown', 'touchend', 'keydown'])
  addEventListener(evt, () => { if (AC && AC.state !== 'running') AC.resume(); }, true);
cvs.addEventListener('click', e => {
  if (!Music.timer) Music.init();
  const r = cvs.getBoundingClientRect();
  const mx = (e.clientX - r.left) * (cvs.width / r.width), my = (e.clientY - r.top) * (cvs.height / r.height);
  if (mode === 'dlg' || mode === 'study') {
    for (const b of optBoxes) if (mx>=b.x && mx<=b.x+b.w && my>=b.y && my<=b.y+b.h) {
      if (mode === 'study') chooseStudy(b.idx); else pickOption(b.idx);
      return;
    }
    if (mode === 'dlg') handleKey('Enter');
    return;
  }
  if (mode === 'play') { setWalkTarget(camx + mx / 2, camy + my / 2); return; }
  handleKey('Enter');
});

function handleKey(k) {
  if (!Music.timer) Music.init();
  if (k && k.toLowerCase() === 'm') { Music.toggle(); blip(700, .05); return; }
  if (k && k.toLowerCase() === 'n') { Music.nextHymn(); blip(880, .05); return; }
  if (mode === 'title') {
    if (k === 'Enter' || k === ' ') {
      if (savedGame() && loadGame()) Music.playTown();
      startDay(); return;
    }
    if (k.toLowerCase() === 'r') { clearSave(); blip(440,.07); startDay(); return; }
    return;
  }
  if (mode === 'daystart' && k === 'Enter') { startStudy(); return; }
  if (mode === 'study') {
    if (k >= '1' && k <= '3') chooseStudy(+k - 1);
    return;
  }
  if (mode === 'summary' && k === 'Enter') { nextDay(); return; }
  if (mode === 'ceremony' && k === 'Enter') { mode = 'play'; Music.playTown(); blip(880,.1); return; }
  if (mode === 'dlg') {
    const n = curNode();
    if (!n) return;
    const opts = liveOpts(n);
    if (opts.length && k >= '1' && k <= String(opts.length)) { pickOption(+k - 1); return; }
    if (!opts.length && (k === 'Enter' || k === ' ' || k.toLowerCase() === 'e')) {
      if (n.go) gotoNode(n.go); else closeDlg();
    }
    return;
  }
  if (mode === 'play' && (k.toLowerCase() === 'e' || k === ' ')) tryInteract();
}

