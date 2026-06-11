// ---------------- P-Day (Mondays) ----------------
// Phase 2 of the expansion plan: chores and minigames until 6 PM, then normal
// proselyting. Minigames follow one contract: MG = {update(dt), draw(), key(k), tap(mx,my)}
// plugged into the mode state machine as mode === 'minigame'. Rewards feed energy/spirit.
function isPday(d) { return (d - 1) % 7 === 0 && d > 1; }   // every Monday after the first
let pdayDone = { laundry: false, letters: false, ball: false, fish: false };
let crispUntil = 0;            // perfect laundry = crisp shirts: better sleep all week
let fishLog = { count: 0, best: '' };
let pendingLetter = null;      // { day, frags: [indices] } — Mom replies Thursday
let MG = null;                 // active minigame
let mgResult = null;           // results card lines

const PDAY_ACTS = [
  { key:'laundry', t:'Laundromat rush',      d:'The required chore. Sort fast — crisp shirts bless the whole week.', min:45, chore:true },
  { key:'letters', t:'Write home',           d:'Four lines to Mom. Her reply arrives Thursday.',                     min:60 },
  { key:'ball',    t:'Church-ball',          d:'2-on-2 in the cultural hall vs. the district elders.',               min:90 },
  { key:'fish',    t:'Fish the park pond',   d:'Five casts. Marge swears Gerald stocked it years ago.',              min:90 },
];
function enterPday() { mode = 'pday'; blip(550,.07); }
function pdayChoose(i) {
  if (i === PDAY_ACTS.length) {                       // head out early
    mode = 'play'; blip(440,.06); return;
  }
  const a = PDAY_ACTS[i]; if (!a || pdayDone[a.key]) return;
  if (!pdayDone.laundry && !a.chore) { blip(180,.08); return; }   // chore comes first
  blip(520,.06);
  if (a.key === 'laundry') startLaundry();
  else if (a.key === 'letters') startLetters();
  else if (a.key === 'ball') startBall();
  else if (a.key === 'fish') startFishing();
}
function finishActivity(key, minutes, lines) {
  pdayDone[key] = true; tc(minutes);
  if (time >= 1080) lines.push('', 'The chapel bell tolls six — P-Day is over, sharp as always.');
  mgResult = lines; MG = null; mode = 'mgresult'; blip(660,.07);
}
function closeResult() {
  mgResult = null;
  if (time >= 1080) { mode = 'play'; }                // 6 PM sharp: back in ties
  else mode = 'pday';
}

// ---------- results / hub rendering ----------
function drawPdayHub() {
  panel(140, 70, 680, 484, '#9ce');
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9ce'; ctx.font = 'bold 20px monospace';
  ctx.fillText('P-DAY — ' + clock(), 480, 108);
  ctx.fillStyle = '#ddd'; ctx.font = '13px monospace';
  ctx.fillText(pdayDone.laundry ? 'The day is yours until 6:00 PM.' : 'Chores first, Elder. The laundry bag is judging you.', 480, 132);
  optBoxes = [];
  PDAY_ACTS.forEach((a, i) => {
    const y = 150 + i * 72;
    const done = pdayDone[a.key], locked = !pdayDone.laundry && !a.chore;
    ctx.fillStyle = done ? 'rgba(40,70,40,0.5)' : locked ? 'rgba(40,40,50,0.5)' : 'rgba(60,60,90,0.6)';
    ctx.fillRect(200, y, 560, 58);
    ctx.strokeStyle = done ? '#5a5' : '#778'; ctx.strokeRect(200.5, y+0.5, 560, 58);
    ctx.fillStyle = done ? '#8c8' : locked ? '#667' : '#ffee99'; ctx.font = 'bold 15px monospace';
    ctx.fillText(`${i+1}. ${a.t}` + (done ? '  ✓' : locked ? '  (after chores)' : `  (~${a.min} min)`), 480, y + 24);
    ctx.fillStyle = locked ? '#556' : '#aac'; ctx.font = '13px monospace';
    ctx.fillText(a.d, 480, y + 44);
    if (!done && !locked) optBoxes.push({ x:200, y, w:560, h:58, idx:i });
  });
  const y = 150 + PDAY_ACTS.length * 72;
  ctx.fillStyle = 'rgba(90,70,50,0.6)'; ctx.fillRect(200, y, 560, 44);
  ctx.strokeStyle = '#a96'; ctx.strokeRect(200.5, y+0.5, 560, 44);
  ctx.fillStyle = '#fc9'; ctx.font = 'bold 15px monospace';
  ctx.fillText(`${PDAY_ACTS.length+1}. Put the ties back on and head out`, 480, y + 27);
  optBoxes.push({ x:200, y, w:560, h:44, idx:PDAY_ACTS.length });
  ctx.fillStyle = '#999'; ctx.font = 'italic 13px monospace';
  ctx.fillText('[ 1–5 or tap • P-Day ends at 6:00 PM sharp ]', 480, 540);
  ctx.textAlign = 'left';
}

// ============================================================
// MINIGAME 1 — LAUNDROMAT RUSH (the required chore)
// Sort the falling laundry: whites left, darks middle, DO-NOT-WASH right.
// ============================================================
function startLaundry() {
  const q = [];
  for (let i = 0; i < 18; i++) q.push(((Math.random() * 3) | 0));
  MG = {
    q, idx: 0, y: -34, sorted: 0, missed: 0, last: '', lastT: 0, ended: false,
    update(dt) {
      if (this.ended) return;
      if (this.idx >= this.q.length) { this.ended = true; laundryEnd(this); return; }
      this.y += dt * (0.10 + this.idx * 0.006);
      this.lastT = Math.max(0, this.lastT - dt);
      if (this.y > 444) this.resolve(-1);
    },
    resolve(k) {
      const want = this.q[this.idx];
      if (k === want) { this.sorted++; this.last = 'SORTED'; blip(740,.05); }
      else { this.missed++; this.last = (k === -1) ? 'Missed it!' : 'Wrong basket!'; blip(180,.08); }
      this.lastT = 550; this.idx++; this.y = -34;
    },
    key(k) {
      const m = { '1':0, 'arrowleft':0, '2':1, 'arrowdown':1, '3':2, 'arrowright':2 }[String(k).toLowerCase()];
      if (m !== undefined && !this.ended && this.idx < this.q.length && this.y > -20) this.resolve(m);
    },
    tap(mx) { this.key(String(Math.min(3, Math.max(1, Math.ceil(mx / 320))))); },
    draw() { drawLaundry(this); },
  };
  mode = 'minigame';
}
function laundryEnd(g) {
  const perfect = g.missed === 0;
  addEnergy(perfect ? 10 : 5);
  if (perfect) crispUntil = day + 7;
  finishActivity('laundry', 45, [
    `LAUNDROMAT RUSH — ${g.sorted}/${g.q.length} sorted${perfect ? '  ★ PERFECT' : ''}`, '',
    perfect ? 'Every white crisp, every dark dark, the suit untouched by water.'
            : 'Mostly sorted. One sock is now a color that has no name.',
    perfect ? '★ Crisp shirts all week — you\'ll sleep better through Sunday.'
            : '+5 energy. The dryers were warm, and so, briefly, was life.',
    '',
    'Elder Sorensen folds like a machine. You fold like a person.',
  ]);
}
const CLOTHES = [
  { n:'WHITES', main:'#f2f2f0', dark:'#cccccc' },
  { n:'DARKS',  main:'#2e3450', dark:'#1d2236' },
  { n:'DO NOT WASH', main:'#1a1a1e', dark:'#0e0e12' },
];
function drawLaundry(g) {
  ctx.fillStyle = '#1c2026'; ctx.fillRect(0, 0, 960, 624);
  // back wall of washers
  ctx.fillStyle = '#2a3038'; ctx.fillRect(0, 40, 960, 90);
  for (let i = 0; i < 8; i++) {
    const x = 40 + i * 120;
    ctx.fillStyle = '#cfd4da'; ctx.fillRect(x, 52, 76, 70);
    ctx.fillStyle = '#222831'; ctx.beginPath(); ctx.arc(x + 38, 92, 24, 0, 7); ctx.fill();
    ctx.fillStyle = (i * 37 + ((performance.now()/400)|0)) % 3 ? '#33415a' : '#4a5e82';
    ctx.beginPath(); ctx.arc(x + 38, 92, 18, 0, 7); ctx.fill();
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9ce'; ctx.font = 'bold 18px monospace';
  ctx.fillText('LAUNDROMAT RUSH', 480, 28);
  // conveyor
  ctx.fillStyle = '#3a3f48'; ctx.fillRect(412, 130, 136, 330);
  ctx.fillStyle = '#4a505c';
  const off = (performance.now() / 12) % 28;
  for (let y = 130 - 28 + off; y < 460; y += 28) if (y > 130) ctx.fillRect(416, y, 128, 4);
  // sort line
  ctx.strokeStyle = '#cc5544'; ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.moveTo(120, 444); ctx.lineTo(840, 444); ctx.stroke(); ctx.setLineDash([]);
  // falling item
  if (!g.ended && g.idx < g.q.length) drawClothesItem(g.q[g.idx], 480, g.y);
  // baskets
  const KEYS = ['1 / ←', '2 / ↓', '3 / →'];
  for (let i = 0; i < 3; i++) {
    const x = 180 + i * 300;
    ctx.fillStyle = '#6a5236'; ctx.fillRect(x - 80, 470, 160, 70);
    ctx.fillStyle = '#7e6342'; ctx.fillRect(x - 80, 470, 160, 12);
    ctx.fillStyle = '#2c2418'; ctx.fillRect(x - 70, 482, 140, 50);
    ctx.fillStyle = '#ffee99'; ctx.font = 'bold 14px monospace';
    ctx.fillText(CLOTHES[i].n, x, 562);
    ctx.fillStyle = '#8aa'; ctx.font = '12px monospace';
    ctx.fillText(KEYS[i] + ' / tap', x, 580);
  }
  // score
  ctx.fillStyle = '#ddd'; ctx.font = 'bold 15px monospace';
  ctx.fillText(`Sorted ${g.sorted}   Fumbled ${g.missed}   Bag: ${Math.max(0, g.q.length - g.idx)} left`, 480, 606);
  if (g.lastT > 0) {
    ctx.fillStyle = g.last === 'SORTED' ? '#8e8' : '#e88'; ctx.font = 'bold 17px monospace';
    ctx.fillText(g.last, 480, 414);
  }
  ctx.textAlign = 'left';
}
function drawClothesItem(kind, cx, cy) {
  const c = CLOTHES[kind];
  ctx.fillStyle = c.main;
  ctx.fillRect(cx - 20, cy, 40, 34);              // body
  ctx.fillRect(cx - 32, cy + 2, 12, 16);          // sleeves
  ctx.fillRect(cx + 20, cy + 2, 12, 16);
  ctx.fillStyle = c.dark; ctx.fillRect(cx - 8, cy, 16, 6);   // collar
  if (kind === 2) {                                // the suit: hanger + warning tag
    ctx.strokeStyle = '#999'; ctx.beginPath();
    ctx.moveTo(cx - 14, cy - 2); ctx.lineTo(cx, cy - 14); ctx.lineTo(cx + 14, cy - 2); ctx.stroke();
    ctx.fillStyle = '#cc4444'; ctx.fillRect(cx + 14, cy + 22, 30, 14);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('NO!', cx + 29, cy + 32);
  }
  if (kind === 0) { ctx.fillStyle = '#111'; ctx.fillRect(cx + 8, cy + 8, 6, 5); }  // the name tag rides along
}

// ============================================================
// MINIGAME 2 — LETTERS HOME
// Pick 4 of 8 lines; Mom's reply lands Thursday and reacts to what you wrote.
// ============================================================
const LETTER_FRAGS = [
  { t:'The work is hard, but it\'s the good kind of hard.',
    r:'You sound like your grandfather. He\'d be proud. I\'m proud.' },
  { t:'Elder Sorensen snores in what I believe is 6/8 time.',
    r:'Your sister wants a recording of the snoring. For science.' },
  { t:'We\'re teaching a man who lost his sister. Pray for Sam.',
    r:'We fasted for your Sam on Sunday. Tell him strangers are rooting for him.' },
  { t:'A dog named Biscuit has adopted us. The feeling is mutual.',
    r:'Your father says hello to Biscuit. Specifically and only Biscuit.' },
  { t:'I miss your Sunday potatoes more than I can put in writing.',
    r:'Recipe enclosed. It\'s just butter, sweetheart. It was always just butter.' },
  { t:'I read Alma 32 this week and thought about your garden.',
    r:'The tomatoes came in. Faith as a seed — you\'re planting things in people now.' },
  { t:'Funds made it to Saturday this month. We feasted upon rice.',
    r:'There\'s a little extra in your account. Don\'t tell your father. (It\'s half his.)' },
  { t:'I think I\'m becoming the person you hoped I\'d be.',
    r:'No — you\'re becoming the person YOU hoped you\'d be. We just get to watch.' },
];
function startLetters() {
  MG = {
    sel: [], update() {},
    key(k) {
      const i = '12345678'.indexOf(String(k));
      if (i >= 0) {
        const at = this.sel.indexOf(i);
        if (at >= 0) this.sel.splice(at, 1);
        else if (this.sel.length < 4) { this.sel.push(i); blip(620,.04); }
        return;
      }
      if ((k === 'Enter' || k === 'e') && this.sel.length === 4) lettersEnd(this);
    },
    tap(mx, my) {
      for (const b of this.boxes || []) if (mx>=b.x && mx<=b.x+b.w && my>=b.y && my<=b.y+b.h) { this.key(String(b.idx + 1)); return; }
      if (this.sel.length === 4 && my > 540) this.key('Enter');
    },
    draw() { drawLetters(this); },
  };
  mode = 'minigame';
}
function lettersEnd(g) {
  pendingLetter = { day: day + 3, frags: g.sel.slice() };
  addSpirit(6);
  finishActivity('letters', 60, [
    'LETTERS HOME — sealed and stamped', '',
    'Four lines, written and rewritten until they were true.',
    'You walk it to the blue mailbox like it\'s made of glass.',
    '',
    'Mom\'s reply should arrive Thursday. (+6 spirit)',
    'Elder Sorensen mails his in a pre-addressed envelope. Of course he does.',
  ]);
}
function drawLetters(g) {
  ctx.fillStyle = '#181820'; ctx.fillRect(0, 0, 960, 624);
  panel(100, 28, 760, 568, '#cb9');
  // paper
  ctx.fillStyle = '#efe8d8'; ctx.fillRect(130, 88, 700, 60);
  ctx.fillStyle = '#6a5a3a'; ctx.font = '15px monospace'; ctx.textAlign = 'center';
  ctx.fillText('Dear Mom,', 480, 112);
  ctx.font = 'italic 13px monospace';
  ctx.fillText(`(choose 4 of 8 lines — ${g.sel.length}/4 chosen)`, 480, 134);
  ctx.fillStyle = '#cb9'; ctx.font = 'bold 18px monospace';
  ctx.fillText('WRITE HOME — Monday, after lunch', 480, 64);
  g.boxes = [];
  LETTER_FRAGS.forEach((f, i) => {
    const y = 158 + i * 46;
    const on = g.sel.includes(i);
    ctx.fillStyle = on ? 'rgba(120,100,60,0.55)' : 'rgba(60,60,80,0.5)';
    ctx.fillRect(130, y, 700, 38);
    ctx.strokeStyle = on ? '#db5' : '#667'; ctx.strokeRect(130.5, y+0.5, 700, 38);
    ctx.fillStyle = on ? '#ffe9a8' : '#bcd'; ctx.font = '13px monospace';
    ctx.fillText(`${i + 1}. ${f.t}` + (on ? '  ✎' : ''), 480, y + 24);
    g.boxes.push({ x:130, y, w:700, h:38, idx:i });
  });
  ctx.fillStyle = g.sel.length === 4 ? '#ffee99' : '#777';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(g.sel.length === 4 ? '[ Enter / tap here — seal the envelope ]' : 'Pick four lines (tap or 1–8)…', 480, 572);
  ctx.textAlign = 'left';
}
function wrapLine(s, max) {
  const out = []; let line = '';
  for (const w of s.split(' ')) {
    const t = line ? line + ' ' + w : w;
    if (t.length > max && line) { out.push(line); line = w; } else line = t;
  }
  if (line) out.push(line);
  return out;
}
function letterReplyLines() {
  const out = ['', '✉  MAIL FROM HOME — Mom writes back:'];
  for (const i of pendingLetter.frags)
    for (const l of wrapLine('"' + LETTER_FRAGS[i].r + '"', 60)) out.push('   ' + l);
  const ps = stats.baptisms > 0
    ? 'P.S. A BAPTISM. Your father cried. He says he didn\'t. He did.'
    : stats.lessons > 0
      ? `P.S. ${stats.lessons} lessons so far — your letters live in the cookie tin now.`
      : 'P.S. Slow weeks count too. Someone watches you pass their window every day.';
  for (const l of wrapLine(ps, 60)) out.push('   ' + l);
  return out;
}

// ============================================================
// MINIGAME 3 — CHURCH-BALL (cultural hall, 2-on-2, first to 11 or the clock)
// Offense: stop the swinging bar near center to shoot. Defense: time the steal.
// ============================================================
function startBall() {
  MG = {
    us: 0, them: 0, clock: 90000, phase: 'msg', next: 'offense',
    msg: 'Elder Tubbs: "Cultural hall rules. Losers stack the chairs."', phT: 1800,
    bar: 0, dir: 1, spd: 0.0016, mark: 0, mdir: 1, defT: 0, ended: false,
    update(dt) {
      if (this.ended) return;
      this.clock -= dt;
      if (this.clock <= 0 || this.us >= 11 || this.them >= 11) { this.ended = true; ballEnd(this); return; }
      if (this.phase === 'msg') { this.phT -= dt; if (this.phT <= 0) { this.phase = this.next; this.defT = 3200; } return; }
      if (this.phase === 'offense') {
        this.bar += this.dir * this.spd * dt;
        if (this.bar > 1 || this.bar < 0) { this.dir *= -1; this.bar = Math.max(0, Math.min(1, this.bar)); }
      } else if (this.phase === 'defense') {
        this.mark += this.mdir * 0.0013 * dt;
        if (this.mark > 1 || this.mark < 0) { this.mdir *= -1; this.mark = Math.max(0, Math.min(1, this.mark)); }
        this.defT -= dt;
        if (this.defT <= 0) this.resolveDef(false, true);
      }
    },
    say(m, next, t) { this.msg = m; this.phase = 'msg'; this.next = next; this.phT = t || 1500; },
    key() {
      if (this.ended) return;
      if (this.phase === 'offense') {
        const q = 1 - 2 * Math.abs(this.bar - 0.5);
        if (Math.random() < 0.25 + 0.65 * q) {
          this.us += 2; this.spd += 0.00012; blip(880,.07);
          this.say(q > 0.9 ? 'SWISH. Elder Sorensen, deadpan: "Filthy."' : 'Bucket! ' + this.trash(), 'defense');
        } else { blip(220,.07); this.say('Rim out. ' + this.trash(), 'defense'); }
      } else if (this.phase === 'defense') {
        this.resolveDef(this.mark > 0.40 && this.mark < 0.60, false);
      }
    },
    resolveDef(stole, late) {
      if (stole) { blip(760,.06); this.say('STEAL! Clean pick at the top of the key.', 'offense'); }
      else if (Math.random() < 0.55) { this.them += 2; this.say((late?'Too slow — ':'') + 'Elder Tubbs banks it in off the STAGE. "Counts!"', 'offense'); }
      else this.say('They brick it into the folded ping-pong table. Your ball.', 'offense');
    },
    trash() {
      const m = ['Elder Tubbs: "Lucky."', 'Elder Vance: "Who taught HIM that?"',
                 '"Foul!" (There are no fouls. There have never been fouls.)',
                 'The whiteboard scoreboard is updated, grudgingly.'];
      return m[(Math.random() * m.length) | 0];
    },
    tap() { this.key(); },
    draw() { drawBall(this); },
  };
  mode = 'minigame';
}
function ballEnd(g) {
  const won = g.us > g.them;
  addEnergy(won ? 25 : 15); addSpirit(won ? 4 : 2);
  finishActivity('ball', 90, [
    `CHURCH-BALL — final: ELDERS ${g.us}, DISTRICT ${g.them}`, '',
    won ? 'Victory. The district elders stack chairs, muttering about "next Monday."'
        : 'Defeat. You stack the chairs while Elder Tubbs supervises, deeply content.',
    'Elder Sorensen, toweling off with his tie: "Best P-Day this transfer."',
    won ? '+25 energy, +4 spirit. The hall echoes like a cathedral of squeaky shoes.'
        : '+15 energy, +2 spirit. You\'ll get them next week.',
  ]);
}
function drawBallGuy(x, y, shirt, skin) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x - 9, y + 26, 18, 5);
  ctx.fillStyle = '#23232e'; ctx.fillRect(x - 6, y + 12, 5, 12); ctx.fillRect(x + 1, y + 12, 5, 12);
  ctx.fillStyle = shirt; ctx.fillRect(x - 9, y - 4, 18, 17);
  ctx.fillStyle = skin || '#e8b88a'; ctx.fillRect(x - 6, y - 16, 12, 11);
  ctx.fillStyle = '#3a2a18'; ctx.fillRect(x - 6, y - 18, 12, 4);
}
function drawBall(g) {
  // cultural hall: wood floor, stage, basket
  ctx.fillStyle = '#27211a'; ctx.fillRect(0, 0, 960, 624);
  ctx.fillStyle = '#b8854a'; ctx.fillRect(40, 120, 880, 420);
  ctx.fillStyle = '#a87840';
  for (let i = 0; i < 11; i++) ctx.fillRect(40, 120 + i * 38, 880, 2);
  ctx.strokeStyle = '#e8dcc8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(760, 330, 110, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();   // key arc
  ctx.strokeRect(760, 250, 160, 160);                                                    // the key
  // stage
  ctx.fillStyle = '#6a4434'; ctx.fillRect(40, 60, 880, 60);
  ctx.fillStyle = '#54362a'; ctx.fillRect(40, 108, 880, 12);
  ctx.fillStyle = '#3a2a4a'; for (let i = 0; i < 6; i++) ctx.fillRect(70 + i * 150, 66, 110, 40);  // curtain
  // hoop
  ctx.fillStyle = '#e8e8e8'; ctx.fillRect(894, 230, 10, 70);
  ctx.fillStyle = '#fff'; ctx.fillRect(880, 244, 14, 44);
  ctx.strokeStyle = '#e86a30'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(864, 290, 18, 7, 0, 0, 7); ctx.stroke();
  // players
  drawBallGuy(420, 360, '#f2f2f0');                       // you
  drawBallGuy(330, 300, '#f2f2f0');                       // Sorensen
  drawBallGuy(620, 330, '#8a4a4a', '#e0a880');            // Tubbs
  drawBallGuy(700, 420, '#4a5a8a', '#c8a070');            // Vance
  // ball
  const bx = g.phase === 'defense' ? 640 : 440, by = g.phase === 'defense' ? 350 : 372;
  ctx.fillStyle = '#d8702a'; ctx.beginPath();
  ctx.arc(bx, by + Math.sin(performance.now() / 130) * 5, 8, 0, 7); ctx.fill();
  // score & clock
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(10,10,20,0.85)'; ctx.fillRect(280, 18, 400, 34);
  ctx.fillStyle = '#ffee99'; ctx.font = 'bold 18px monospace';
  ctx.fillText(`ELDERS ${g.us} — ${g.them} DISTRICT    ${Math.ceil(Math.max(0, g.clock) / 1000)}s`, 480, 42);
  // message bubble
  if (g.phase === 'msg') {
    ctx.fillStyle = 'rgba(16,16,28,0.92)'; ctx.fillRect(180, 150, 600, 44);
    ctx.strokeStyle = '#9ce'; ctx.strokeRect(180.5, 150.5, 600, 44);
    ctx.fillStyle = '#dde'; ctx.font = '14px monospace';
    ctx.fillText(g.msg, 480, 178);
  }
  // action bar
  const barY = 560;
  if (g.phase === 'offense' || g.phase === 'defense') {
    ctx.fillStyle = 'rgba(10,10,20,0.85)'; ctx.fillRect(230, barY - 26, 500, 64);
    ctx.fillStyle = '#ccc'; ctx.font = 'bold 13px monospace';
    ctx.fillText(g.phase === 'offense' ? 'YOUR BALL — any key / tap to shoot (center = swish)' : 'DEFENSE — steal inside the bright zone!', 480, barY - 8);
    ctx.fillStyle = '#333'; ctx.fillRect(280, barY, 400, 18);
    if (g.phase === 'offense') {
      const gr = ctx.createLinearGradient(280, 0, 680, 0);
      gr.addColorStop(0, '#a33'); gr.addColorStop(0.5, '#3a3'); gr.addColorStop(1, '#a33');
      ctx.fillStyle = gr; ctx.fillRect(280, barY, 400, 18);
      ctx.fillStyle = '#fff'; ctx.fillRect(280 + g.bar * 392, barY - 3, 8, 24);
    } else {
      ctx.fillStyle = '#445'; ctx.fillRect(280, barY, 400, 18);
      ctx.fillStyle = '#7ac'; ctx.fillRect(280 + 0.40 * 400, barY, 0.20 * 400, 18);
      ctx.fillStyle = '#fff'; ctx.fillRect(280 + g.mark * 392, barY - 3, 8, 24);
    }
    ctx.strokeStyle = '#889'; ctx.strokeRect(280.5, barY + 0.5, 400, 18);
  }
  ctx.textAlign = 'left';
}

// ============================================================
// MINIGAME 4 — THE POND (five casts; tap when the bobber dips)
// ============================================================
function startFishing() {
  MG = {
    casts: 5, phase: 'ready', t: 0, biteAt: 0, caught: [], ended: false,
    msg: 'Five casts. Marge swears Gerald stocked this pond himself.',
    update(dt) {
      if (this.ended) return;
      if (this.phase === 'wait') {
        this.t += dt;
        if (this.t >= this.biteAt) { this.phase = 'bite'; this.t = 0; blip(980,.06); }
      } else if (this.phase === 'bite') {
        this.t += dt;
        if (this.t > 520) { this.phase = 'ready'; this.casts--; this.msg = 'It got away. The pond ripples, smugly.'; this.checkEnd(); }
      }
    },
    key() {
      if (this.ended) return;
      if (this.phase === 'ready' && this.casts > 0) {
        this.phase = 'wait'; this.t = 0; this.biteAt = 900 + Math.random() * 2800;
        this.msg = 'The bobber settles. Patience, Elder…'; blip(440,.05);
      } else if (this.phase === 'wait') {
        this.phase = 'ready'; this.casts--; this.msg = 'Too eager — you yank up an empty hook.'; blip(200,.07); this.checkEnd();
      } else if (this.phase === 'bite') {
        const r = Math.random();
        const geraldHere = !fishLog.best.includes('Gerald') && !this.caught.some(c => c.includes('GERALD'));
        const f = (r < 0.06 && geraldHere) ? '★ OLD GERALD, the legendary carp'
                : r < 0.20 ? 'an old boot (somehow)'
                : r < 0.55 ? 'a largemouth bass' : 'a bluegill';
        this.caught.push(f); this.phase = 'ready'; this.casts--;
        this.msg = 'Caught ' + f + '!'; blip(700,.08); this.checkEnd();
      }
    },
    checkEnd() { if (this.casts <= 0 && !this.ended) { this.ended = true; fishEnd(this); } },
    tap() { this.key(); },
    draw() { drawFishing(this); },
  };
  mode = 'minigame';
}
function fishEnd(g) {
  const fish = g.caught.filter(c => !c.includes('boot'));
  addEnergy(Math.min(22, 12 + fish.length * 3));
  fishLog.count += fish.length;
  const gerald = g.caught.some(c => c.includes('GERALD'));
  if (gerald) fishLog.best = 'Old Gerald, the legendary carp';
  else if (fish.length && !fishLog.best) fishLog.best = fish[0].replace('a largemouth', 'largemouth').replace('a bluegill', 'bluegill');
  const cameo = houses.find(x => x.arch === 'farmer' && (x.served || x.stage !== 'fresh'))
    ? 'Hal Dunphy fishes the far bank on Mondays. He nods at your cast. High praise.'
    : 'A kid who looks a lot like Dakota Reeves skips rocks at the far end. Peace holds.';
  finishActivity('fish', 90, [
    `THE POND — ${fish.length} caught, ${g.caught.length - fish.length} boot(s)`, '',
    ...(g.caught.length ? g.caught.map(c => '   ' + c) : ['   The fish observed an unbroken Sabbath. On a Monday.']),
    '',
    gerald ? '★ OLD GERALD HIMSELF. You release him, as is right. Marge will weep.' : cameo,
    `(+energy — turns out sitting quietly by water is the point.)`,
  ]);
}
function drawFishing(g) {
  // park: grass, pond, sky handled by tint
  ctx.fillStyle = '#41763a'; ctx.fillRect(0, 0, 960, 624);
  for (let i = 0; i < 90; i++) {
    const x = (i * 167) % 960, y = (i * 211) % 624;
    ctx.fillStyle = i % 3 ? '#4a8040' : '#3c6e36'; ctx.fillRect(x, y, 5, 5);
  }
  // pond
  ctx.fillStyle = '#3a6ea8';
  ctx.beginPath(); ctx.ellipse(430, 330, 320, 175, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#4a7eb8';
  ctx.beginPath(); ctx.ellipse(430, 330, 300, 158, 0, 0, 7); ctx.fill();
  const tnow = performance.now();
  ctx.fillStyle = '#5a8ec8';
  for (let i = 0; i < 12; i++) {
    const x = 200 + (i * 53) % 460, y = 230 + (i * 97) % 200;
    ctx.fillRect(x + Math.sin(tnow / 900 + i) * 6, y, 26, 3);
  }
  // reeds
  ctx.fillStyle = '#2e5a28';
  for (let i = 0; i < 7; i++) { const x = 130 + i * 16; ctx.fillRect(x, 420 - (i % 3) * 8, 4, 38); }
  // the elders on the bank
  drawBallGuy(740, 430, '#f2f2f0');
  drawBallGuy(800, 444, '#f2f2f0');
  ctx.strokeStyle = '#7a5a30'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(733, 414); ctx.lineTo(620, 360); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(793, 428); ctx.lineTo(680, 380); ctx.stroke();
  // bobber
  if (g.phase !== 'ready' || g.casts === 5) {
    const bob = g.phase === 'bite' ? 8 : Math.sin(tnow / 500) * 2.5;
    const bx = 560, by = 352 + bob;
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(620, 360); ctx.lineTo(bx, by - 4); ctx.stroke();
    ctx.fillStyle = '#dd3333'; ctx.beginPath(); ctx.arc(bx, by, 7, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#f0f0f0'; ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI); ctx.fill();
    if (g.phase === 'bite') {
      ctx.fillStyle = '#ffee66'; ctx.font = 'bold 26px monospace'; ctx.textAlign = 'center';
      ctx.fillText('!', bx, by - 18);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.ellipse(bx, by + 4, 14 + (g.t / 40), 5 + (g.t / 110), 0, 0, 7); ctx.stroke();
    }
  }
  // UI
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(10,10,20,0.85)'; ctx.fillRect(240, 18, 480, 34);
  ctx.fillStyle = '#9ce'; ctx.font = 'bold 16px monospace';
  ctx.fillText(`THE POND — casts left: ${g.casts}   caught: ${g.caught.length}`, 480, 41);
  ctx.fillStyle = 'rgba(10,10,20,0.85)'; ctx.fillRect(160, 560, 640, 40);
  ctx.fillStyle = '#dde'; ctx.font = '14px monospace';
  ctx.fillText(g.msg, 480, 585);
  ctx.fillStyle = '#8aa'; ctx.font = '12px monospace';
  ctx.fillText(g.phase === 'bite' ? 'NOW! (any key / tap)' : g.phase === 'wait' ? 'wait for the dip…' : 'any key / tap to cast', 480, 555);
  ctx.textAlign = 'left';
}
