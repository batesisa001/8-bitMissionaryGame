// ---------------- dialogue engine ----------------
let D = null;   // {nodes, cur, h, npc, title}
function openDlg(tree, h, npc) {
  D = { nodes: tree.nodes, cur: null, h: h || null, npc: npc || null };
  mode = 'dlg';
  gotoNode(tree.start);
}
function curNode(){ return D && D.nodes[D.cur]; }
function liveOpts(n){ return (n.opts||[]).filter(o => !o.cond || o.cond()); }
function gotoNode(id) {
  if (id === 'END' || !D.nodes[id]) { closeDlg(); return; }
  D.cur = id; tc(1.5);
  const n = D.nodes[id];
  if (n.fx) n.fx();
  if (D.h) D.h.interest = Math.max(0, Math.min(100, D.h.interest));
}
function pickOption(i) {
  const n = curNode(); if (!n) return;
  const opts = liveOpts(n); const o = opts[i]; if (!o) return;
  blip(520, .06);
  if (o.fx) o.fx();
  gotoNode(o.go);
}
function closeDlg() {
  const h = D && D.h;
  D = null; mode = 'play';
  if (LESSON_NAMES.has(Music.name)) Music.playTown();
  if (h && h.pendingBaptism) { h.pendingBaptism = false; doBaptism(h); return; }
  if (h && h.teachNow) { h.teachNow = false; openLesson(h); return; }
  if (time >= 1260) endDay();
}
// node + option helpers
function n(who, text, a, b) {
  const node = { who, text };
  if (Array.isArray(a)) node.opts = a; else node.go = a;
  if (typeof b === 'function') node.fx = b;
  if (Array.isArray(a) && typeof b === 'function') node.fx = b;
  return node;
}
function o(t, go, fx, cond) { return { t, go, fx, cond }; }
function persuade(base, h) {
  const sc = (spirit - 50) * 0.5 + (h ? (h.interest - 50) * 0.5 : 0)
    + (energy < 25 ? -12 : energy < 50 ? -6 : 0)   // tired elders ramble
    + studyBonus(h);                                // this morning's study, when it applies
  return Math.random() * 100 < base + sc;
}
const ME = 'Elder Young', CO = 'Elder Sorensen';

