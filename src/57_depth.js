// ---------------- Phase 3: depth ----------------
// Concerns, fellowshipping, retention, the area book (Tab), weekly goals,
// the unity meter, and weather. Relationships, managed — never scored.

// ---------- concerns ----------
// Each progressing friend carries one concrete obstacle. Concerns block a
// commitment (church or baptism) until worked through — in a dedicated visit,
// or with the right ward member's help.
const CONCERNS = {
  grief: { short:'Grief', blocks:'bap', lesson:2, memberKey:'diaz',
    label:'"Why would God let it happen?"', scripture:'Alma 7:11–12',
    reveal: nm => `${nm} stops you at the door as you leave. "Can I ask the hard one? If God's really there... why didn't He stop it?" The question has clearly been waiting a long time for somewhere safe to land.`,
    open: nm => `${nm} has the look of someone who rehearsed this. "I keep circling it. The plan, the kingdoms, the reunions — it's beautiful. But He could have stopped it, and He didn't, and I don't know what to do with that."`,
    notYet: nm => `"Not until I've made peace with the why," ${nm} says quietly. "I won't make promises to a God I'm still angry at. Help me with that first."`,
    resolved: nm => `Something in ${nm}'s shoulders lets go. "A God who weeps too. Who descended below it all — so He'd know how to find us down here." A long breath. "Okay. I can pray to THAT God."`,
    progress: nm => `${nm} listens, nods slowly. "I'm not there. But that's the first answer that didn't sound like a brochure." The door stays open a little longer than usual.` },
  sabbath: { short:'Sundays', blocks:'church', lesson:2, memberKey:'halverson',
    label:'Sundays are already spoken for', scripture:'Isaiah 58:13–14',
    reveal: nm => `${nm} winces when church comes up. "Here's my problem, elders. Sundays are the one day the rest of my life happens. Work, kids, the whole catch-up. There's no room."`,
    open: nm => `"Walk me through it," ${nm} says, pulling out an actual calendar. "Show me where church FITS. Because I look at this and I see a wall."`,
    notYet: nm => `"You've seen my Sundays," ${nm} says. "Until that changes, I can't promise a pew."`,
    resolved: nm => `${nm} stares at the calendar, then slowly moves one thing, then another. "Huh. It's not a wall. It's a door with stuff stacked in front of it." A beat. "Ten o'clock, you said?"`,
    progress: nm => `${nm} doesn't move anything yet — but takes a photo of the calendar "to think about it." Movement. Slow, real movement.` },
  tithing: { short:'Tithing', blocks:'bap', lesson:4, memberKey:'olsen',
    label:'The math doesn\'t work', scripture:'Malachi 3:10',
    reveal: nm => `${nm} goes quiet at tithing. "Ten percent. Elders, I've SEEN our budget. There is no ten percent. There's barely a hundred percent."`,
    open: nm => `There's a spreadsheet open on the table. "I want to believe the windows-of-heaven thing," ${nm} says. "But faith doesn't pay the gas bill. Convince me this isn't just... math with extra steps."`,
    notYet: nm => `"I can't covenant what I can't see fitting," ${nm} says. "The tithing thing first. Then we talk dates."`,
    resolved: nm => `${nm} closes the laptop. "You know what got me? Not the windows of heaven. It's that you two live on nothing and you're the least worried people I know." A pause. "First. Not leftover. I'll try it."`,
    progress: nm => `${nm} reopens the spreadsheet and adds a row labeled "maybe." It's not faith yet. It's a row labeled maybe, and that's something.` },
  doubt: { short:'Doubts', blocks:'bap', lesson:3, memberKey:'pemberton',
    label:'Wants certainty before covenant', scripture:'Alma 32:21, 27',
    reveal: nm => `"Real talk," ${nm} says. "I like all of this. But I keep waiting to be SURE — capital S — and it hasn't come. What if it never does?"`,
    open: nm => `${nm} has questions lined up like dominoes. "Everyone says 'just believe.' I don't have a 'just.' I have a brain that wants receipts. Is there room in your church for someone like me?"`,
    notYet: nm => `"Baptism feels like signing something I haven't finished reading," ${nm} says. "I need my doubts to shrink first — or at least to learn to live with them honestly."`,
    resolved: nm => `"An EXPERIMENT," ${nm} says, tasting the word. "Plant it, water it, see if it grows. Nobody ever told me doubt was allowed inside faith. That changes the whole equation." It does. It always has.`,
    progress: nm => `${nm} writes down Alma 32:21 — "ye have faith when ye hope for things which are not seen, which are TRUE" — and underlines 'hope.' "Okay. Continuing the experiment."` },
  peers: { short:'Peers', blocks:'church', lesson:2, memberKey:'ym',
    label:'"What will everyone think?"', scripture:'Romans 1:16',
    reveal: nm => `${nm} glances toward the noise of the house behind. "If I walk into a church on Sunday... the guys will have OPINIONS. Loud ones. Forever."`,
    open: nm => `"It's dumb," ${nm} says, "but it's real. Showing up alone to a building full of strangers, and showing up at home to a couch full of comedians. I'd be the punchline twice."`,
    notYet: nm => `"Church means walking in alone," ${nm} says. "I'm not there yet."`,
    resolved: nm => `${nm} laughs at something you said, and then stops laughing and means it. "Okay. If I don't have to walk in alone — I'll walk in." Nobody worth keeping mocks a man for showing up somewhere kind.`,
    progress: nm => `"Maybe the early meeting," ${nm} bargains. "When it's mostly grandmas." Progress comes in all sizes.` },
  coffee: { short:'Word of Wisdom', blocks:'bap', lesson:4, memberKey:'sisterH',
    label:'The coffee thing is real', scripture:'D&C 89:18–21',
    reveal: nm => `${nm} raises the mug, deadpan. "We discussed this. Me and coffee have history. I wasn't joking as much as you hoped."`,
    open: nm => `Three mugs sit in the sink like evidence. "I've tried twice this week," ${nm} admits. "Tuesday was fine. Wednesday I alphabetized the spice rack at 6 AM out of spite. Help."`,
    notYet: nm => `"Ask me after I've gone a full week," ${nm} says, eyeing the mug. "I keep covenants I can actually keep."`,
    resolved: nm => `${nm} turns the mug upside down in the dish rack with great ceremony. "Day five. The headache's gone and I'm insufferably proud of myself." As is right.`,
    progress: nm => `"Half-caf," ${nm} reports. "Don't look at me like that — it's a JOURNEY."` },
};
const ARCH_CONCERN = {
  seeker:'grief', veteran:'grief', elderly:'grief',
  student:'doubt', critic:'doubt', scientist:'doubt',
  busy:'sabbath', farmer:'sabbath', musician:'sabbath', nothome:'sabbath',
  newlyweds:'tithing', partyhouse:'peers', teen:'peers',
};
function assignConcern(h) {
  if (h.concernKey) return;
  h.concernKey = ARCH_CONCERN[h.arch] || ['coffee','tithing','sabbath'][h.i % 3];
  h.concernActive = true; h.concernRevealed = false;
}
function concernOf(h) { return h.concernKey ? CONCERNS[h.concernKey] : null; }
function concernBlocks(h, what) {
  const C = concernOf(h);
  return !!(C && h.concernActive && C.blocks === what);
}

// the dedicated concern visit — knock again after today's lesson
function concernTree(h) {
  const C = concernOf(h), name = RES[h.arch].name.split(' ')[0];
  const attempt = base => () => {
    h.concernTriedDay = day; tc(20); bump('convos');
    if (persuade(base, h)) { h.concernActive = false; h.interest += 10; addSpirit(4); h.cOut = 'resolved'; }
    else { h.interest += 4; addSpirit(1); h.cOut = 'progress'; }
  };
  return { start:'a', nodes: {
    a: n(h, C.open(name), [
      o(`Listen all the way to the end. Then testify — simply, from your own life.`, 'res', attempt(62)),
      o(`Open the scriptures together: ${C.scripture}.`, 'res', attempt(56)),
      o(`"Can we introduce you to someone in the ward who's walked this exact road?"`, 'member', ()=>{ h.concernTriedDay = day; }),
      o(`Steer back to the lesson schedule. (Avoid it.)`, 'avoid', ()=>{ h.concernTriedDay = day; h.interest -= 5; addSpirit(-2); }),
    ]),
    res: n(h, null, [ o(`(Some visits matter more than lessons.)`, 'END') ], function(){ this.text = h.cOut === 'resolved' ? C.resolved(name) : C.progress(name); }),
    member: n('narr', (() => {
      const m = WARD.find(w => w.key === C.memberKey && wardAvail(w)) || WARD.find(wardAvail);
      return `You know exactly who. ${m.name} — ${m.tag}. "Expect company by Thursday," you tell ${name}. "Good company."\n\n(${m.name} is now fellowshipping ${name}. Watch the mornings.)`;
    })(), [ o(`(The ward does what elders can't.)`, 'END', ()=>{
      const m = WARD.find(w => w.key === C.memberKey && wardAvail(w)) || WARD.find(wardAvail);
      h.member = m.key; h.memberDays = 0; addSpirit(2);
    }) ]),
    avoid: n(CO, `Elder Sorensen is quiet on the sidewalk, then: "That thing they told us? That was the whole visit, Elder. The lesson was the small print." (You'll come back to it. You have to.)`, [ o(`(He's right. Again.)`, 'END') ]),
  }};
}

// ---------- the ward (fellowshipping roster) ----------
const WARD = [
  { key:'halverson', name:'Bro. Halverson',              fits:['seeker','farmer','busy','newmove'],      tag:'feeds everyone; survived soccer Sundays' },
  { key:'sisterH',   name:'Sis. Halverson',              fits:['busy','newlyweds','elderly','coffeeish'],tag:'casserole diplomacy; quit coffee in \'09' },
  { key:'diaz',      name:'Bishop Diaz',                 fits:['veteran','seeker','faithcrisis'],        tag:'listens like it\'s his calling. It is.' },
  { key:'pemberton', name:'Sis. Pemberton (organist)',   fits:['musician','elderly','student','scientist'], tag:'"the organ is halfway to heaven"' },
  { key:'olsen',     name:'Frank Olsen',                 fits:['eternal','critic','nothome','student'],  tag:'came back himself; knows the road out AND in',
    avail: () => { const f = houses.find(x => x.arch === 'lessactive'); return !!(f && (f.churchCommit || f.stage === 'friendly')); } },
  { key:'ym',        name:'the ward young men',          fits:['teen','partyhouse'],                     tag:'pizza-based fellowship' },
  { key:'reyes',     name:'Sis. Reyes',                  fits:['newlyweds','scientist','busy'],          tag:'speaks four languages, one of them casserole' },
  { key:'tubbs',     name:'Elder Tubbs (yes, that one)', fits:['partyhouse','teen','jw'],                tag:'church-ball ambassador to the world' },
];
function wardAvail(w) { return !w.avail || w.avail(); }
function wardByKey(k) { return WARD.find(w => w.key === k); }
function goodPairing(h) {
  const w = wardByKey(h.member);
  return !!(w && w.fits.includes(h.arch));
}

// ---------- weather ----------
function rollWeather() {
  const r = Math.random();
  weather = r < 0.22 ? 'rain' : r < 0.34 ? 'hot' : 'clear';
}
function rainTree() { return { start:'a', nodes:{
  a: n('narr', `You knock. Inside, a TV murmurs and a light is plainly on — but nobody braves the doorway for strangers in this weather. Rain drums its little sermon on the porch roof.\n\n(Rainy days: fewer doors open. The umbrella people stay friendly, though.)`, [
    o(`(Tuck the pamphlets deeper into the bag and move on.)`, 'END'),
  ]),
}};}

// ---------- weekly goals (Thursday-night planning) ----------
const GOAL_DEFS = [
  { key:'lessons', t:'Teach 4 lessons by Sunday night',        stat:'lessons',  target:4 },
  { key:'church',  t:'Bring 2 friends to sacrament meeting',   stat:'atChurch', target:2 },
  { key:'bap',     t:'Extend a baptismal date this week',      stat:'bapDates', target:1 },
  { key:'service', t:'Render 3 acts of service',               stat:'service',  target:3 },
];
let weeklyGoals = null;       // [{key, baseline}] — set Thursday, resolved Sunday night
let goalPicks = [];
function goalsPending() { return dayName(day) === 'Thursday' && !weeklyGoals; }
function startGoals() { goalPicks = []; mode = 'goals'; blip(550,.07); }
function toggleGoal(i) {
  const g = GOAL_DEFS[i]; if (!g) return;
  const at = goalPicks.indexOf(i);
  if (at >= 0) goalPicks.splice(at, 1);
  else if (goalPicks.length < 2) { goalPicks.push(i); blip(620,.04); }
}
function confirmGoals() {
  if (goalPicks.length !== 2) return;
  weeklyGoals = goalPicks.map(i => ({ key: GOAL_DEFS[i].key, baseline: stats[GOAL_DEFS[i].stat] }));
  blip(720,.07);
  nextDay();
}
function goalProgress(g) {
  const def = GOAL_DEFS.find(d => d.key === g.key);
  return { def, got: stats[def.stat] - g.baseline };
}
function resolveGoals() {           // Sunday night, before Monday begins
  if (!weeklyGoals) return;
  for (const g of weeklyGoals) {
    const { def, got } = goalProgress(g);
    if (got >= def.target) {
      addSpirit(6); addUnity(8);
      morningNotes.push(`★ WEEKLY GOAL MET — ${def.t} (${got}/${def.target}). Elder Sorensen`,
                        `   draws a small firework in the area book. Planning works.`);
    } else {
      morningNotes.push(`Weekly goal missed — ${def.t} (${got}/${def.target}). "Realistic goals`,
                        `   are a skill too," Elder Sorensen says, already drafting next week's.`);
    }
  }
  weeklyGoals = null;
}
function drawGoals() {
  panel(140, 80, 680, 464, '#fc9');
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fc9'; ctx.font = 'bold 20px monospace';
  ctx.fillText('WEEKLY PLANNING — Thursday, 9:30 PM', 480, 120);
  ctx.fillStyle = '#ddd'; ctx.font = '13px monospace';
  ctx.fillText('Elder Sorensen uncaps the good marker. Pick TWO goals for the week.', 480, 148);
  ctx.fillText('(Choosing realistic ones is itself the skill. Resolved Sunday night.)', 480, 166);
  optBoxes = [];
  GOAL_DEFS.forEach((g, i) => {
    const y = 190 + i * 64, on = goalPicks.includes(i);
    ctx.fillStyle = on ? 'rgba(120,90,50,0.6)' : 'rgba(60,60,90,0.6)';
    ctx.fillRect(200, y, 560, 50);
    ctx.strokeStyle = on ? '#fc9' : '#778'; ctx.strokeRect(200.5, y+0.5, 560, 50);
    ctx.fillStyle = on ? '#ffe9a8' : '#cdf'; ctx.font = 'bold 14px monospace';
    ctx.fillText(`${i+1}. ${g.t}${on ? '  ✎' : ''}`, 480, y + 30);
    optBoxes.push({ x:200, y, w:560, h:50, idx:i });
  });
  ctx.fillStyle = goalPicks.length === 2 ? '#ffee99' : '#777';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(goalPicks.length === 2 ? '[ Enter — commit the week ]' : 'Pick two (1–4 or tap)…', 480, 506);
  ctx.textAlign = 'left';
}

// ---------- daily tick: members, retention, unity ----------
let morningNotes = [];
const CALLINGS = ['ward greeter', 'hymnbook steward', 'Sunday School secretary', 'official resetter of the folding chairs'];
function dailyDepthTick() {
  addUnity(-1);                                     // unity is maintained, not assumed
  for (const h of houses) {
    const nm = RES[h.arch].name.split(' ')[0];
    // fellowshipping
    if (h.member && (h.stage === 'investigator' || h.baptized) && !h.dropped) {
      const w = wardByKey(h.member), good = goodPairing(h);
      h.memberDays = (h.memberDays || 0) + 1;
      if (h.stage === 'investigator') h.interest = Math.min(100, h.interest + (good ? 2 : 1));
      const C = concernOf(h);
      if (good && C && h.concernActive && h.memberDays >= 2 && C.memberKey === h.member) {
        h.concernActive = false; h.interest += 8;
        morningNotes.push(`${w.name} took ${nm} to lunch. The worry about ${C.short.toLowerCase()}`,
                          `   came up — and came down. (Concern resolved. The ward is the secret.)`);
      } else if (!good && !h.memberComedy) {
        h.memberComedy = true;
        morningNotes.push(`${w.name} had ${nm} over for dinner. The slideshow had 240 slides.`,
                          `   ${nm} survived. The pairing is... not magic. (F in the area book to reassign.)`);
      }
    }
    // retention: new converts need a friend, a calling, and regular visits
    if (h.baptized && h.baptizedDay && day <= h.baptizedDay + 14) {
      if (day - (h.lastVisit || h.baptizedDay) > 3 && !h.drifting) {
        h.drifting = true;
        morningNotes.push(`${nm} hasn't seen you since ${dayName(h.lastVisit||h.baptizedDay)}. New converts need`,
                          `   visits like seedlings need water. (They're drifting — go knock.)`);
      }
      if (h.drifting && day - (h.lastVisit||0) <= 1) {
        h.drifting = false;
        morningNotes.push(`Your visit landed. ${nm} is steady again — pencil marks back in the scriptures.`);
      }
      if (day === h.baptizedDay + 14) {
        const score = (h.member ? 1 : 0) + (h.calling ? 1 : 0) + (h.drifting ? 0 : 1);
        h.retained = score >= 2;
        morningNotes.push(h.retained
          ? `Two weeks since the font: ${nm} has ${h.member?'a friend':''}${h.member&&h.calling?', ':''}${h.calling?'a calling':''} — and roots. ★ Converted, not just baptized.`
          : `Two weeks since the font: ${nm} is drifting. It's not too late — it's just not automatic. Visit. Pair. Hold on.`);
      }
    }
  }
}

// ---------- the area book (Tab) ----------
let abSel = 0, abScroll = 0;
function abList() {
  const weight = h => h.stage === 'investigator' && !h.dropped ? 0
    : h.stage === 'appt' ? 1
    : h.baptized ? 2
    : h.stage === 'friendly' ? 3
    : h.stage === 'nothome' ? 5 : 4;
  return houses.filter(h => h.visits > 0 || h.stage !== 'fresh' || h.referred)
               .sort((a, b) => weight(a) - weight(b) || a.i - b.i);
}
function abAssignable(h) { return (h.stage === 'investigator' && !h.dropped) || h.baptized; }
function abCycleMember() {
  const list = abList(), h = list[abSel];
  if (!h || !abAssignable(h)) { blip(180,.06); return; }
  const avail = WARD.filter(wardAvail);
  const cur = avail.findIndex(w => w.key === h.member);
  const next = cur + 1 >= avail.length ? -1 : cur + 1;     // wraps through 'none'
  h.member = next === -1 ? '' : avail[next].key;
  h.memberDays = 0; h.memberComedy = false;
  blip(620,.05);
}
function abStatus(h) {
  if (h.baptized) {
    if (h.retained) return ['MEMBER — rooted ★', '#ffd966'];
    if (h.drifting) return ['NEW CONVERT — drifting', '#e89a55'];
    return ['NEW CONVERT — needs visits', '#ffd966'];
  }
  if (h.stage === 'investigator' && !h.dropped)
    return [`Friend — lesson ${h.lessons}/5${h.bapDate ? ' • DATE SET' : ''}${h.churchCommit ? ' • ⛪' : ''}`, '#66ccff'];
  if (h.stage === 'appt') return [day >= h.apptDay ? 'Return appt — TODAY' : `Return appt — ${dayName(h.apptDay)}`, '#88ff88'];
  if (h.rejectedUntil > day) return ['Needs space', '#cc7777'];
  if (h.stage === 'friendly') return ['Friend of the elders', '#cc99ff'];
  if (h.stage === 'nothome') return ['Never home — keep trying', '#8aa'];
  if (h.dropped) return ['Stepped back — be kind', '#999'];
  return ['Contacted', '#999'];
}
function drawAreaBook() {
  panel(40, 28, 880, 568, '#cba');
  ctx.textAlign = 'left'; ctx.font = 'bold 18px monospace'; ctx.fillStyle = '#cba';
  ctx.fillText('AREA BOOK', 64, 58);
  ctx.font = '12px monospace'; ctx.fillStyle = '#998';
  ctx.fillText('↑/↓ select   F — assign fellowshipper   Tab/Esc — close', 560, 58);
  ctx.fillStyle = '#776'; ctx.fillRect(60, 68, 840, 1);
  // header
  ctx.font = 'bold 12px monospace'; ctx.fillStyle = '#a98';
  ctx.fillText('NAME', 70, 88); ctx.fillText('STATUS', 280, 88); ctx.fillText('INT', 540, 88);
  ctx.fillText('CONCERN', 590, 88); ctx.fillText('FELLOWSHIPPER', 730, 88);
  const list = abList();
  abSel = Math.max(0, Math.min(abSel, list.length - 1));
  const VIS = 17;
  if (abSel < abScroll) abScroll = abSel;
  if (abSel >= abScroll + VIS) abScroll = abSel - VIS + 1;
  list.slice(abScroll, abScroll + VIS).forEach((h, vi) => {
    const i = abScroll + vi, y = 106 + vi * 26;
    if (i === abSel) { ctx.fillStyle = 'rgba(120,110,80,0.35)'; ctx.fillRect(58, y - 14, 844, 24); }
    ctx.font = '13px monospace'; ctx.fillStyle = '#ede';
    ctx.fillText(RES[h.arch].name.slice(0, 24), 70, y);
    const [st, col] = abStatus(h);
    ctx.fillStyle = col; ctx.fillText(st.slice(0, 30), 280, y);
    ctx.fillStyle = '#dba';
    ctx.fillText('★'.repeat(Math.round(h.interest / 25)) || '·', 540, y);
    const C = concernOf(h);
    ctx.fillStyle = C && h.concernActive ? '#e89a55' : '#7a9';
    ctx.fillText(C ? (h.concernRevealed ? `${C.short} ${h.concernActive ? '✗' : '✓'}` : '?') : '', 590, y);
    const w = wardByKey(h.member);
    ctx.fillStyle = w ? (goodPairing(h) ? '#9d9' : '#cc9') : '#556';
    ctx.fillText(abAssignable(h) ? (w ? w.name.slice(0, 22) : '— (press F)') : '', 730, y);
  });
  if (list.length > abScroll + VIS) { ctx.fillStyle = '#998'; ctx.fillText('▾ more', 70, 106 + VIS * 26); }
  // footer: goals, fish log
  ctx.fillStyle = '#776'; ctx.fillRect(60, 548, 840, 1);
  ctx.font = '12px monospace'; ctx.fillStyle = '#cba';
  let foot = '';
  if (weeklyGoals) foot = 'WEEK: ' + weeklyGoals.map(g => { const p = goalProgress(g); return `${p.def.t.split(' ').slice(0,3).join(' ')} ${Math.min(p.got,p.def.target)}/${p.def.target}`; }).join('   •   ');
  else foot = dayName(day) === 'Thursday' ? 'Weekly planning tonight, 9:30 PM.' : 'Weekly goals are set Thursday nights.';
  ctx.fillText(foot, 70, 568);
  ctx.fillStyle = '#889';
  ctx.fillText(`Back page — fish log: ${fishLog.count} caught${fishLog.best ? ', best: ' + fishLog.best : ''}`, 70, 586);
  ctx.textAlign = 'left';
}
