// ---------------- save / load ----------------
// Autosaves every morning (startDay). Continue from the title screen; R starts over.
const SAVE_KEY = 'cts_save_v1';
const HOUSE_STATIC = new Set(['i', 'arch', 'color', 'x', 'y', 'w', 'h', 'dx', 'dy']);
function saveGame() {
  try {
    const data = {
      v: 1, day, spirit, energy, hymnIdx: Music.hymnIdx,
      crispUntil, fish: Object.assign({}, fishLog), letter: pendingLetter,
      stats: Object.assign({}, stats),
      houses: houses.map(h => {
        const o = {};
        for (const k in h) {
          const v = h[k];
          if (!HOUSE_STATIC.has(k) && (typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean')) o[k] = v;
        }
        return o;
      }),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {}
}
function savedGame() {
  try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); return d && d.v === 1 ? d : null; }
  catch (e) { return null; }
}
function loadGame() {
  const d = savedGame(); if (!d) return false;
  day = d.day; spirit = d.spirit; energy = d.energy === undefined ? 100 : d.energy;
  crispUntil = d.crispUntil || 0;
  fishLog = d.fish || { count: 0, best: '' };
  pendingLetter = d.letter || null;
  Object.assign(stats, d.stats);
  d.houses.forEach((o, i) => { if (houses[i]) Object.assign(houses[i], o); });
  time = isSunday(day) ? 780 : 600;
  resetDayStats();
  Music.hymnIdx = (d.hymnIdx || 0) % TOWN_TRACKS.length;
  return true;
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
