// ---------------- input ----------------
const keys = {};
let optBoxes = [];
addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Tab'].includes(e.key)) e.preventDefault();
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
  if (mode === 'pday') {
    for (const b of optBoxes) if (mx>=b.x && mx<=b.x+b.w && my>=b.y && my<=b.y+b.h) { pdayChoose(b.idx); return; }
    return;
  }
  if (mode === 'goals') {
    for (const b of optBoxes) if (mx>=b.x && mx<=b.x+b.w && my>=b.y && my<=b.y+b.h) { toggleGoal(b.idx); return; }
    if (goalPicks.length === 2) confirmGoals();
    return;
  }
  if (mode === 'areabook') { mode = 'play'; return; }
  if (mode === 'minigame') { if (MG && MG.tap) MG.tap(mx, my); return; }
  if (mode === 'mgresult') { closeResult(); return; }
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
  if (mode === 'daystart' && k === 'Enter') { isPday(day) ? enterPday() : startStudy(); return; }
  if (mode === 'study') {
    if (k >= '1' && k <= '3') chooseStudy(+k - 1);
    return;
  }
  if (mode === 'pday') {
    if (k >= '1' && k <= String(PDAY_ACTS.length + 1)) pdayChoose(+k - 1);
    return;
  }
  if (mode === 'minigame') { if (MG && MG.key) MG.key(k); return; }
  if (mode === 'mgresult' && (k === 'Enter' || k === ' ')) { closeResult(); return; }
  if (k === 'Tab' || (k === 'Escape' && mode === 'areabook')) {
    if (mode === 'play') { mode = 'areabook'; blip(560,.05); }
    else if (mode === 'areabook') { mode = 'play'; blip(440,.05); }
    return;
  }
  if (mode === 'areabook') {
    if (k === 'ArrowUp') abSel = Math.max(0, abSel - 1);
    else if (k === 'ArrowDown') abSel = abSel + 1;
    else if (k.toLowerCase() === 'f') abCycleMember();
    else if (k === 'Enter') mode = 'play';
    return;
  }
  if (mode === 'goals') {
    if (k >= '1' && k <= '4') toggleGoal(+k - 1);
    else if (k === 'Enter') confirmGoals();
    return;
  }
  if (mode === 'summary' && k === 'Enter') {
    if (goalsPending()) { startGoals(); return; }
    nextDay(); return;
  }
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

