// ---------------- game state ----------------
let mode = 'title';          // title | daystart | study | play | dlg | summary | ceremony
let day = 1;
let time = 600;              // minutes since midnight (10:00 AM)
let spirit = 70;
let energy = 100;            // tired elders teach poorly; sleep (and P-Day) restores it
let unity = 60;              // companionship unity: built on purpose, spent by accident
let weather = 'clear';       // clear | rain | hot — rolled each morning
const stats = { doors:0, convos:0, cards:0, boms:0, appts:0, lessons:0, friends:0,
                atChurch:0, bapDates:0, baptisms:0, service:0 };
const dayStats = {};
function resetDayStats(){ for (const k in stats) dayStats[k] = stats[k]; }
resetDayStats();
function bump(k, n){ stats[k] += (n===undefined?1:n); }
function addSpirit(n){ spirit = Math.max(0, Math.min(100, spirit + n)); }
function addEnergy(n){ energy = Math.max(0, Math.min(100, energy + n)); }
function addUnity(n){ unity = Math.max(0, Math.min(100, unity + n)); }
function tc(m){ time += m; }                       // time cost in minutes

// ---------------- morning study ----------------
// One topic per morning; studying what you'll teach today makes the lesson land.
const STUDY_TOPICS = [
  { t:'The Restoration',            d:'Joseph Smith\'s first prayer. You underline "ask of God."',        lesson:1 },
  { t:'The Plan of Salvation',      d:'Where we came from, why we\'re here, where we go after.',          lesson:2 },
  { t:'The Gospel of Jesus Christ', d:'Faith, repentance, baptism, the Holy Ghost, enduring.',            lesson:3 },
  { t:'The Commandments',           d:'Blessings are predicated on laws. You make a list.',               lesson:4 },
  { t:'Laws and Ordinances',        d:'Covenants as handholds, not hurdles.',                             lesson:5 },
  { t:'Christlike Attributes',      d:'Charity, patience, humility. The chapter that reads you.',         all:3 },
];
let studyChoices = [];
let studyBuff = null;        // {lesson:n} -> +8 teaching that lesson today; {all:n} -> +n everywhere
function studyBonus(h) {
  if (!studyBuff) return 0;
  if (studyBuff.all) return studyBuff.all;
  return (h && !h.baptized && h.lessons + 1 === studyBuff.lesson) ? 8 : 0;
}
const DAYNAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
function dayName(d){ return DAYNAMES[(d-1)%7]; }
function isSunday(d){ return (d-1)%7 === 6; }
function clock(){
  let h = Math.floor(time/60), m = Math.floor(time%60);
  const ap = h >= 12 ? 'PM' : 'AM'; h = ((h+11)%12)+1;
  return h + ':' + String(m).padStart(2,'0') + ' ' + ap;
}

// ---------------- player & companion ----------------
const player = { x: 400, y: 322, fx: 0, fy: 1, frame: 0, moving: false };
const comp   = { x: 388, y: 322, fx: 0, fy: 1, frame: 0 };
const trail = [];

// ---------------- town map ----------------
// base tiles: 0 grass 1 road 2 sidewalk 3 path 4 flowers
const MW = 80, MH = 52, WORLDW = MW*T, WORLDH = MH*T;
const HROADS = [12, 26, 40], VROADS = [19, 39, 59];
const map = [];
for (let y = 0; y < MH; y++) { map[y] = []; for (let x = 0; x < MW; x++) map[y][x] = 0; }
for (const r of HROADS) for (let x = 0; x < MW; x++) {
  map[r][x] = map[r+1][x] = 1;
  if (map[r-1][x] === 0) map[r-1][x] = 2;
  if (map[r+2][x] === 0) map[r+2][x] = 2;
}
for (const c of VROADS) for (let y = 0; y < MH; y++) {
  if (map[y][c] !== 1) map[y][c] = 1;
  if (map[y][c+1] !== 1) map[y][c+1] = 1;
  if (map[y][c-1] === 0) map[y][c-1] = 2;
  if (map[y][c+2] === 0) map[y][c+2] = 2;
}
// the park pond (south-west block)
for (let y = 31; y <= 36; y++) for (let x = 4; x <= 13; x++) {
  const dx = (x-8.5)/4.5, dy = (y-33.5)/2.8;
  if (dx*dx + dy*dy < 1) map[y][x] = 5;
}
// scattered flowers on grass
for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++)
  if (map[y][x] === 0 && ((x*31 + y*57) % 97) < 3) map[y][x] = 4;

// ---------------- residents / archetypes ----------------
const RES = {
  seeker:    { name:'Sam Whitfield',    skin:'#e8b88a', hair:'#5a3a1a', shirt:'#5577aa' },
  busy:      { name:'Brianna Lopez',    skin:'#d49a6a', hair:'#1a1a1a', shirt:'#cc6677' },
  skeptic:   { name:'Greg Marsh',       skin:'#e8c89a', hair:'#888888', shirt:'#446644' },
  christian: { name:'Dorothy Jenkins',  skin:'#f0c8a0', hair:'#dddddd', shirt:'#9966aa' },
  lessactive:{ name:'Frank Olsen',      skin:'#e8b88a', hair:'#aa8855', shirt:'#776655' },
  hostile:   { name:'Randall Pike',     skin:'#e0a880', hair:'#332211', shirt:'#883333' },
  elderly:   { name:'Marge Ipson',      skin:'#f0d0b0', hair:'#eeeeee', shirt:'#88aacc' },
  member:    { name:'The Halversons',   skin:'#e8b88a', hair:'#664422', shirt:'#ddaa44' },
  newmove:   { name:'The Patel Family', skin:'#b07a4a', hair:'#111111', shirt:'#dd8833' },
  nothome:   { name:'Tanner Residence', skin:'#e8b88a', hair:'#553311', shirt:'#557788' },
  student:   { name:'Maya Chen',        skin:'#e8c098', hair:'#221111', shirt:'#33aaaa' },
  veteran:   { name:'Walt Garrison',    skin:'#e0b890', hair:'#cccccc', shirt:'#5a6a4a' },
  teen:      { name:'The Reeves Family',skin:'#e8c098', hair:'#aa7733', shirt:'#444455' },
  newlyweds: { name:'Tyler & Jess Nguyen', skin:'#e0b080', hair:'#1a1a1a', shirt:'#66aa88' },
  spanish:   { name:'La Familia Morales',  skin:'#c8915a', hair:'#222222', shirt:'#cc7744' },
  faithcrisis:{name:'Naomi Pratt',      skin:'#ecc8a0', hair:'#883322', shirt:'#778899' },
  jw:        { name:'Bill & Tom (Jehovah\'s Witnesses)', skin:'#e8b88a', hair:'#555566', shirt:'#33334a' },
  eternal:   { name:'Charlie Bingham',  skin:'#e8b890', hair:'#999988', shirt:'#aa8855' },
  farmer:    { name:'Hal Dunphy',       skin:'#d8a070', hair:'#776644', shirt:'#7a5a3a' },
  musician:  { name:'Rev Tatum',        skin:'#a8754a', hair:'#111122', shirt:'#552266' },
  partyhouse:{ name:'Marcus Rios',      skin:'#cf9a66', hair:'#221a11', shirt:'#3a7a5a' },
  bishop:    { name:'Bishop & Sister Diaz', skin:'#c88a5a', hair:'#332222', shirt:'#445577' },
  scientist: { name:'Dr. Adaeze Okafor',skin:'#8a5a3a', hair:'#101010', shirt:'#aa4466' },
  critic:    { name:'Devin Sharp',      skin:'#e8c098', hair:'#443322', shirt:'#666677' },
};
const INIT_INT = { eternal:60, elderly:40, member:70, bishop:70, critic:20, hostile:10, newlyweds:42, spanish:45, veteran:35 };
const HOUSE_DEFS = [
  // north row
  {tx:2, ty:5, arch:'seeker',    c:'#b05a4a'}, {tx:8, ty:5, arch:'busy',      c:'#7a8a5a'},
  {tx:13,ty:5, arch:'skeptic',   c:'#5a7a9a'}, {tx:23,ty:5, arch:'christian', c:'#9a7aa0'},
  {tx:29,ty:5, arch:'lessactive',c:'#a08a5a'}, {tx:43,ty:5, arch:'hostile',   c:'#6a6a72'},
  {tx:49,ty:5, arch:'veteran',   c:'#6a7a5a'}, {tx:63,ty:5, arch:'teen',      c:'#7a6a8a'},
  {tx:69,ty:5, arch:'newlyweds', c:'#5a9a8a'}, {tx:74,ty:5, arch:'spanish',   c:'#c08a4a'},
  // second row (church block)
  {tx:2, ty:17,arch:'elderly',   c:'#a87a8a'}, {tx:8, ty:17,arch:'member',    c:'#c09a4a'},
  {tx:23,ty:17,arch:'bishop',    c:'#8a9ab0'}, {tx:43,ty:17,arch:'student',   c:'#4a8a6a'},
  {tx:49,ty:17,arch:'faithcrisis',c:'#9a8a9a'},{tx:54,ty:17,arch:'jw',        c:'#5a5a7a'},
  {tx:63,ty:17,arch:'eternal',   c:'#b09a6a'}, {tx:69,ty:17,arch:'nothome',   c:'#6a8a8a'},
  // third row (park is west of these)
  {tx:23,ty:31,arch:'critic',    c:'#7a7a8a'}, {tx:29,ty:31,arch:'musician',  c:'#7a4a8a'},
  {tx:34,ty:31,arch:'partyhouse',c:'#4a6a4a'}, {tx:43,ty:31,arch:'scientist', c:'#aa5a6a'},
  // south row (edge of town)
  {tx:8, ty:45,arch:'newmove',   c:'#b06a3a'}, {tx:74,ty:45,arch:'farmer',    c:'#8a6a3a'},
];
const houses = HOUSE_DEFS.map((d,i) => ({
  i, arch: d.arch, color: d.c,
  x: d.tx*T, y: d.ty*T, w: 46, h: 38,
  dx: d.tx*T + 19, dy: d.ty*T + 38,         // door rect
  stage: d.arch === 'nothome' ? 'nothome' : 'fresh',
  interest: INIT_INT[d.arch] || 30, lessons: 0, churchCommit: false, attended: false,
  bom: false, apptDay: 0, rejectedUntil: 0, polite: false, referred: false,
  taughtDay: 0, bapDate: false, baptized: false, dropped: false, cardLeft: false,
  served: false, visits: 0, dinnerDay: 0,
}));
const church = { x: 31*T, y: 16*T, w: 58, h: 44, dx: 31*T+25, dy: 16*T+44 };

// trees — deterministic scatter on open grass, away from buildings
const trees = [];
for (let i = 0; i < 600 && trees.length < 56; i++) {
  const x = ((i*73) % (MW-2) + 1) * T + ((i*37) % 8);
  const y = ((i*131) % (MH-3) + 2) * T + ((i*29) % 8);
  if (map[Math.floor(y/T)][Math.floor(x/T)] !== 0) continue;
  let bad = Math.hypot(x - player.x, y - player.y) < 36;
  for (const h of houses) if (x > h.x-16 && x < h.x+h.w+16 && y > h.y-12 && y < h.y+h.h+24) { bad = true; break; }
  if (x > church.x-16 && x < church.x+church.w+16 && y > church.y-32 && y < church.y+church.h+24) bad = true;
  if (!bad) trees.push({x, y});
}
// park grove around the pond
[[28,355],[150,348],[36,440],[160,432],[100,456],[190,395],[14,392]].forEach(([x,y])=>trees.push({x,y}));

// pedestrians for street contacting
const peds = [
  { kind:'dogwalker', name:'Pat (and Biscuit)', x:60,  y:11.6*T, ax:'x', min:30,  max:210, v:0.25, dir:1, skin:'#e8b88a', hair:'#aa6633', shirt:'#7799bb', talkedDay:0 },
  { kind:'jogger',    name:'A jogger',          x:330, y:14.6*T, ax:'x', min:270, max:700, v:0.55, dir:-1, skin:'#c8a070', hair:'#222222', shirt:'#dd5555', talkedDay:0 },
  { kind:'commuter',  name:'A commuter',        x:18.6*T, y:230, ax:'y', min:180, max:300, v:0.3, dir:1, skin:'#e8c89a', hair:'#444444', shirt:'#556677', talkedDay:0 },
  { kind:'mailcarrier', name:'Ines the mail carrier', x:120, y:25.6*T, ax:'x', min:40, max:560, v:0.3, dir:1, skin:'#c08a5a', hair:'#222222', shirt:'#4466aa', talkedDay:0 },
  { kind:'skater',    name:'A kid on a skateboard', x:400, y:39.6*T, ax:'x', min:280, max:900, v:0.85, dir:1, skin:'#e8c098', hair:'#cc8833', shirt:'#88cc44', talkedDay:0 },
  { kind:'stroller',  name:'A mom with a stroller', x:58.6*T, y:400, ax:'y', min:340, max:580, v:0.2, dir:1, skin:'#d8a878', hair:'#332222', shirt:'#cc88aa', talkedDay:0 },
];

