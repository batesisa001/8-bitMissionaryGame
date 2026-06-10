// ---------------- interaction dispatch ----------------
function tryInteract() {
  // pedestrians first
  for (const p of peds) {
    if (Math.hypot(player.x - p.x, player.y - p.y) < 18 && p.talkedDay !== day) {
      p.talkedDay = day; blip(440,.07); addEnergy(-1); openDlg(pedTree(p), null, p); return;
    }
  }
  // church
  if (Math.hypot(player.x - church.dx, player.y - church.dy) < 18) { openDlg(churchTree()); return; }
  // doors
  for (const h of houses) {
    if (Math.hypot(player.x - h.dx, player.y - h.dy) < 16) { knock(h); return; }
  }
}
function knock(h) {
  blip(220,.09); blip(200,.09);
  tc(4); bump('doors'); h.visits++; addEnergy(-2);
  let tree;
  if (h.baptized) tree = TREES.baptizedMember(h);
  else if (h.rejectedUntil > day) tree = TREES.rejected(h);
  else if (h.arch === 'hostile' && h.rejectedUntil && h.rejectedUntil <= day && h.polite && h.stage !== 'friendly') tree = TREES.hostileSoft(h);
  else if (h.stage === 'investigator') {
    if (h.dropped || h.taughtDay === day) tree = TREES.investigatorWait(h);
    else { openLesson(h); return; }
  }
  else if (h.stage === 'appt') {
    if (day >= h.apptDay) { h.stage = 'investigator'; openLesson(h); return; }
    tree = TREES.investigatorWait(h);
  }
  else if (h.stage === 'friendly') tree = TREES[h.arch + 'Again'] ? TREES[h.arch + 'Again'](h) : TREES.friendly(h);
  else if (h.stage === 'nothome') {
    if (h.cardLeft && h.visits >= 2 && day >= 3) tree = TREES.nothomeBack(h);
    else tree = TREES.nothome(h);
  }
  else tree = TREES[h.arch](h);
  openDlg(tree, h);
  // seeker special: teach immediately after first contact
}
function openLesson(h) {
  if (h.lessons >= 5) {
    if (h.bapDate && h.attended) { doBaptism(h); return; }
    // finish line: needs church attendance or baptismal commitment
    const name = RES[h.arch].name.split(' ')[0];
    openDlg({ start:'a', nodes:{
      a: n(h, h.bapDate
        ? `${name} is ready — all five lessons taught and a date set. ${h.attended?'':'One thing left: come to church with us this Sunday, then it\'s official.'}`
        : `All five lessons taught. ${name} is close — you extend the baptismal invitation again, gently.`, [
        o(`(Invite, promise blessings, follow up.)`, 'b', ()=>{
          if (!h.bapDate && persuade(50,h)) { h.bapDate = true; bump('bapDates'); addSpirit(5); }
          if (!h.churchCommit) h.churchCommit = persuade(60,h);
        }),
      ]),
      b: n('narr', h.bapDate ? `The date stands. ${h.attended ? 'Everything is ready.' : 'Sunday first — then the font.'}` : `"Soon," ${name} says. "I can feel it getting closer." Keep visiting, keep inviting.`, [ o(`(Onward.)`, 'END') ]),
    }}, h);
    return;
  }
  addEnergy(-6);                 // a full lesson takes real focus
  Music.playLesson();
  openDlg(lessonTree(h), h);
}

// ---------------- baptism ----------------
let ceremonyText = [];
function doBaptism(h) {
  const name = RES[h.arch].name;
  h.baptized = true; h.stage = 'baptized'; bump('baptisms');
  addSpirit(15);
  ceremonyText = [
    `SATURDAY — THE BAPTISMAL SERVICE`, ``,
    `The font room at the chapel is full: the Halversons brought`,
    `funeral potatoes, Marge brought lemon bars, and half the ward`,
    `brought themselves.`, ``,
    `${name}, all in white, steps down into the water with`,
    `Elder Sorensen — they asked him to perform the ordinance,`,
    `and you couldn't be happier about it.`, ``,
    `The prayer. The immersion. The coming up.`, ``,
    `Afterward ${name.split(' ')[0]} hugs you both, dripping slightly,`,
    `and says: "Thank you for knocking twice."`, ``,
    `Tomorrow: confirmation in sacrament meeting, and the`,
    `gift of the Holy Ghost.`, ``,
    `★ ${name} was baptized and confirmed ★`,
  ];
  mode = 'ceremony';
  Music.play('fanfare');
}

