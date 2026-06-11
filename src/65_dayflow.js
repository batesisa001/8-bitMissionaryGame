// ---------------- day flow ----------------
let dayLines = [];
function startDay() {
  mode = 'daystart';
  blip(660,.08);
  buildDayLines();
  saveGame();                    // autosave each morning
}
function startStudy() {
  // three of the six topics, rotating daily (offsets 0/2/4 are always distinct mod 6)
  studyChoices = [0, 1, 2].map(i => STUDY_TOPICS[(day - 1 + i * 2) % STUDY_TOPICS.length]);
  mode = 'study'; blip(550,.07);
}
function chooseStudy(i) {
  const t = studyChoices[i]; if (!t) return;
  studyBuff = t.all ? { all: t.all } : { lesson: t.lesson };
  addSpirit(2); blip(720,.07);
  mode = 'play';
}
function buildDayLines() {
  dayLines = [
    `DAY ${day} — ${dayName(day).toUpperCase()}${isPday(day) ? '  ★ P-DAY' : ''}`,
    ``,
  ];
  if (isPday(day)) {
    dayLines.push(
      `6:30 AM — Arise. Mondays do not believe in sleeping in.`,
      `7:00 AM — Studies, then the weekly apartment-cleaning truce.`,
      `10:00 AM — P-DAY. Chores first; then the day is yours until six.`,
      `6:00 PM — sharp: ties back on. The work doesn't take Mondays off.`);
    deliverLetter();
    return;
  }
  dayLines.push(
    `6:30 AM — Arise. Elder Sorensen does push-ups; you do "push-ups."`,
    `7:00 AM — Personal study: the Book of Mormon, marked to pieces.`,
    `8:00 AM — Companion study: planning for the people you're teaching.`,
  );
  if (isSunday(day)) {
    const attendees = houses.filter(h => h.churchCommit && !h.baptized && !h.dropped);
    dayLines.push(`10:00 AM — SACRAMENT MEETING.`);
    if (attendees.length) {
      for (const h of attendees) {
        if (Math.random()*100 < 55 + h.interest*0.4) {
          h.attended = true; bump('atChurch');
          dayLines.push(`   ★ ${RES[h.arch].name} CAME — and sat right next to you!`);
          h.interest += 10;
        } else {
          dayLines.push(`   ${RES[h.arch].name} didn't make it. (Follow up gently.)`);
        }
      }
    } else dayLines.push(`   No friends attended today. Keep inviting!`);
    dayLines.push(``, `1:00 PM — Out the door. Sunday afternoons are for visits.`);
  } else {
    dayLines.push(`10:00 AM — Out the door. Companions stay together — always.`);
  }
  deliverLetter();
  if (energy < 40) dayLines.push(``, `   (You're running on fumes. Teaching is harder when you're tired.)`);
  if (crispUntil > day) dayLines.push(``, `   (Crisp shirts. You feel unreasonably capable.)`);
  const appts = houses.filter(h => h.stage==='appt' && h.apptDay<=day || (h.stage==='investigator' && !h.dropped && h.taughtDay<day && h.lessons<5));
  if (appts.length) {
    dayLines.push(``, `TODAY'S APPOINTMENTS:`);
    for (const h of appts) dayLines.push(`   • ${RES[h.arch].name}${h.lessons?` — Lesson ${Math.min(h.lessons+1,5)}`:''}`);
  }
}
function deliverLetter() {
  if (pendingLetter && day >= pendingLetter.day) {
    for (const l of letterReplyLines()) dayLines.push(l);
    addSpirit(4);
    pendingLetter = null;
  }
}
function endDay() {
  mode = 'summary'; blip(330,.1);
}
function nextDay() {
  day++;
  time = isSunday(day) ? 780 : 600;
  addEnergy(crispUntil > day ? 68 : 55);   // sleep helps; crisp shirts help more
  pdayDone = { laundry: false, letters: false, ball: false, fish: false };
  studyBuff = null;
  walkTarget = null;
  resetDayStats();
  for (const p of peds) p.talkedDay = 0;
  Music.hymnIdx = (day - 1) % TOWN_TRACKS.length;   // a new hymn each morning
  Music.playTown();
  startDay();
}

// ---------------- tap-to-walk ----------------
let walkTarget = null, walkStuck = 0;
function doorRoute(b, doorX, doorY) {
  // doors face down; if we're beside or above the building, swing around it first
  const wps = [];
  if (player.y < doorY - 6 && player.x > b.x - 10 && player.x < b.x + b.w + 10) {
    const sideX = (player.x < b.x + b.w / 2) ? b.x - 9 : b.x + b.w + 9;
    wps.push({ x: sideX, y: doorY + 10 });
  }
  wps.push({ x: doorX, y: doorY + 6 });
  return wps;
}
function setWalkTarget(wx, wy) {
  walkStuck = 0;
  // tapping a door, the chapel, or a passer-by walks there and interacts on arrival
  for (const p of peds) if (Math.hypot(wx - p.x, wy - p.y) < 14 && p.talkedDay !== day) {
    walkTarget = { wps: [], interact: true, ped: p }; return;
  }
  if (wx > church.x - 6 && wx < church.x + church.w + 6 && wy > church.y - 6 && wy < church.y + church.h + 12) {
    walkTarget = { wps: doorRoute(church, church.dx + 5, church.dy), interact: true }; return;
  }
  for (const h of houses) if (wx > h.x - 5 && wx < h.x + h.w + 5 && wy > h.y - 5 && wy < h.y + h.h + 12) {
    walkTarget = { wps: doorRoute(h, h.dx + 4, h.dy), interact: true }; return;
  }
  walkTarget = { wps: [{ x: wx, y: wy }], interact: false };
}

// ---------------- update ----------------
let last = performance.now();
function update(dt) {
  if (mode === 'minigame') { if (MG && MG.update) MG.update(dt); return; }
  if (mode !== 'play') return;
  time += (dt / 1000) * 0.55;   // ~0.55 in-game minutes per real second
  if (time >= 1260) { endDay(); return; }
  const sp = 1.45;
  let vx = 0, vy = 0, fromKeys = false;
  if (keys['arrowup']||keys['w']) vy = -1;
  if (keys['arrowdown']||keys['s']) vy = 1;
  if (keys['arrowleft']||keys['a']) vx = -1;
  if (keys['arrowright']||keys['d']) vx = 1;
  if (vx || vy) { fromKeys = true; walkTarget = null; }
  else if (walkTarget) {
    const wt = walkTarget;
    const t = wt.ped ? { x: wt.ped.x, y: wt.ped.y + 8 } : wt.wps[0];   // pedestrians keep moving
    const dx = t.x - player.x, dy = t.y - player.y;
    const dist = Math.hypot(dx, dy);
    const last = wt.ped || wt.wps.length <= 1;
    if (dist < (last && wt.interact ? 6 : last ? 3 : 6)) {
      if (last) { walkTarget = null; if (wt.interact) tryInteract(); }
      else wt.wps.shift();
    } else { vx = dx / dist; vy = dy / dist; }
  }
  player.moving = !!(vx||vy);
  if (player.moving) {
    if (fromKeys && vx && vy){ vx*=0.707; vy*=0.707; }
    const ox = player.x, oy = player.y;
    const nx = player.x + vx*sp, ny = player.y + vy*sp;
    if (!collides(nx, player.y)) player.x = nx;
    if (!collides(player.x, ny)) player.y = ny;
    if (walkTarget) {                                             // give up if pinned on a wall
      walkStuck = (Math.hypot(player.x - ox, player.y - oy) < 0.2) ? walkStuck + dt : 0;
      if (walkStuck > 600) walkTarget = null;
    }
    player.fx = Math.abs(vx)>Math.abs(vy)?Math.sign(vx):0;
    player.fy = Math.abs(vy)>=Math.abs(vx)?Math.sign(vy):0;
    player.frame += dt*0.012;
    trail.push({x:player.x,y:player.y});
    if (trail.length > 14) trail.shift();
  }
  const tgt = trail[0] || comp;
  comp.x += (tgt.x - comp.x)*0.15; comp.y += (tgt.y - comp.y)*0.15;
  comp.frame = player.frame; comp.fx = player.fx; comp.fy = player.fy;
  // pedestrians
  for (const p of peds) {
    const v = p.v;
    if (p.ax==='x') { p.x += v*p.dir; if (p.x<p.min||p.x>p.max) p.dir*=-1; }
    else { p.y += v*p.dir; if (p.y<p.min||p.y>p.max) p.dir*=-1; }
  }
}
function collides(x, y) {
  if (x < 6 || x > WORLDW-6 || y < 8 || y > WORLDH-4) return true;
  const tw = map[Math.floor(y/T)];
  if (tw && (tw[Math.floor((x-4)/T)] === 5 || tw[Math.floor((x+4)/T)] === 5)) return true;
  const r = { x: x-4, y: y-2, w: 8, h: 5 };
  for (const h of houses) if (rect(r, {x:h.x, y:h.y, w:h.w, h:h.h-4})) return true;
  if (rect(r, {x:church.x, y:church.y, w:church.w, h:church.h-4})) return true;
  for (const t of trees) if (rect(r, {x:t.x-5, y:t.y-2, w:10, h:6})) return true;
  return false;
}
function rect(a,b){ return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; }

