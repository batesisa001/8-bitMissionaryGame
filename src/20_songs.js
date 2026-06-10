const SONGS = {
  town: { bpm: 116, div: 4, len: 384, loop: true,
    ch: [
      { wave:'square',   vol:0.032, sus:0.92, ev: CTS_SOP },
      { wave:'square',   vol:0.010, sus:0.92, ev: CTS_ALTO },
      { wave:'triangle', vol:0.065, sus:0.88, ev: CTS_BASS },
    ],
    kick: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    snare:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    hat:  [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0] },
  hymn: { bpm: 66, div: 4, len: 64, loop: true,
    ch: [
      { wave:'triangle', vol:0.05,  sus:1.0, ev: CTS_SOP_R },
      { wave:'square',   vol:0.009, sus:1.0, ev: CTS_ALTO_R },
      { wave:'triangle', vol:0.045, sus:1.0, ev: CTS_BASS_R },
    ]},
  fanfare: { bpm: 138, div: 4, len: 64, loop: false, then: 'hymn',
    ch: [
      { wave:'square',   vol:0.042, sus:0.92, ev: CTS_SOP_F },
      { wave:'square',   vol:0.015, sus:0.92, ev: CTS_ALTO_F },
      { wave:'triangle', vol:0.07,  sus:0.88, ev: CTS_BASS_F },
    ],
    kick: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    snare:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    hat:  [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0] },
  enlisted: { bpm: 112, div: 4, len: 384, loop: true,
    ch: [
      { wave:'square',   vol:0.032, sus:0.92, ev: ENL_SOP },
      { wave:'square',   vol:0.010, sus:0.92, ev: ENL_ALTO },
      { wave:'triangle', vol:0.065, sus:0.88, ev: ENL_BASS },
    ],
    kick: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    snare:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    hat:  [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0] },
  praise: { bpm: 96, div: 4, len: 256, loop: true,
    ch: [
      { wave:'square',   vol:0.032, sus:0.92, ev: PTM_SOP },
      { wave:'square',   vol:0.010, sus:0.92, ev: PTM_ALTO },
      { wave:'triangle', vol:0.065, sus:0.88, ev: PTM_BASS },
    ],
    kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    hat:  [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0] },
  mountain: { bpm: 126, div: 4, len: 256, loop: true,
    ch: [
      { wave:'square',   vol:0.032, sus:0.92, ev: HMT_SOP },
      { wave:'square',   vol:0.010, sus:0.92, ev: HMT_ALTO },
      { wave:'triangle', vol:0.065, sus:0.88, ev: HMT_BASS },
    ],
    kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    hat:  [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0] },
};
// --- the rest of the hymnbook, same NES voicings as the entries above ---
const DR_MARCH = { kick:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], snare:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0] };
const DR_ANTHEM = { kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0] };
const DR_WALTZ = { kick:[1,0,0,0,0,0,0,0,0,0,0,0], snare:[0,0,0,0,0,0,0,0,0,0,0,0], hat:[0,0,0,0,1,0,0,0,1,0,0,0] };      // one 3/4 bar
const DR_MARCH6 = { kick:[1,0,0,0,0,0,0,0,0,0,0,0], snare:[0,0,0,0,0,0,1,0,0,0,0,0], hat:[0,0,1,0,1,0,0,0,1,0,1,0] };     // one 6/8 bar
function march(bpm, len, s, a, b, dr) {
  return Object.assign({ bpm, div:4, len, loop:true, ch: [
    { wave:'square',   vol:0.032, sus:0.92, ev: s },
    { wave:'square',   vol:0.010, sus:0.92, ev: a },
    { wave:'triangle', vol:0.065, sus:0.88, ev: b },
  ]}, dr || DR_MARCH);
}
function reverent(bpm, len, s, a, b) {               // triangle lead, like the lesson theme
  return { bpm, div:4, len, loop:true, ch: [
    { wave:'triangle', vol:0.05,  sus:1.0, ev: s },
    { wave:'square',   vol:0.009, sus:1.0, ev: a },
    { wave:'triangle', vol:0.045, sus:1.0, ev: b },
  ]};
}
function gentle(bpm, len, s, a, b) {                 // quiet square lead, no drums
  return { bpm, div:4, len, loop:true, ch: [
    { wave:'square',   vol:0.026, sus:1.0, ev: s },
    { wave:'square',   vol:0.009, sus:1.0, ev: a },
    { wave:'triangle', vol:0.05,  sus:0.96, ev: b },
  ]};
}
Object.assign(SONGS, {
  // town marches & anthems
  yei:         march(132, 384, YEI_SOP, YEI_ALTO, YEI_BASS),
  israel:      march(80,  256, IIG_SOP, IIG_ALTO, IIG_BASS),
  shoulder:    march(108, 256, PYS_SOP, PYS_ALTO, PYS_BASS),
  presson:     march(100, 256, LUP_SOP, LUP_ALTO, LUP_BASS),
  royalarmy:   march(144, 512, BRA_SOP, BRA_ALTO, BRA_BASS),
  hope:        march(108, 256, HOI_SOP, HOI_ALTO, HOI_BASS),
  truefaith:   march(100, 272, TTF_SOP, TTF_ALTO, TTF_BASS),
  hark:        march(100, 256, HAN_SOP, HAN_ALTO, HAN_BASS),
  blessings:   march(88,  256, CYB_SOP, CYB_ALTO, CYB_BASS),
  dowhatright: march(104, 384, DWR_SOP, DWR_ALTO, DWR_BASS, DR_WALTZ),
  choosetr:    march(90,  256, CTR_SOP, CTR_ALTO, CTR_BASS, DR_ANTHEM),
  carryon:     march(104, 512, CAR_SOP, CAR_ALTO, CAR_BASS, DR_ANTHEM),
  battlehymn:  march(96,  256, BHR_SOP, BHR_ALTO, BHR_BASS, DR_ANTHEM),
  spirit:      march(108, 512, SOG_SOP, SOG_ALTO, SOG_BASS, DR_ANTHEM),
  foundation:  march(104, 320, HFF_SOP, HFF_ALTO, HFF_BASS, DR_ANTHEM),
  angel:       march(138, 240, AFH_SOP, AFH_ALTO, AFH_BASS, DR_MARCH6),
  // reverent themes for lessons
  saints:       reverent(76, 208, CCS_SOP, CCS_ALTO, CCS_BASS),
  amazed:       reverent(76, 288, ISA_SOP, ISA_ALTO, ISA_BASS),
  sweethour:    reverent(66, 240, SHP_SOP, SHP_ALTO, SHP_BASS),
  secretprayer: gentle(80, 256, SCP_SOP, SCP_ALTO, SCP_BASS),
  thinktopray:  reverent(78, 288, DYP_SOP, DYP_ALTO, DYP_BASS),
  nearer:       reverent(69, 256, NMG_SOP, NMG_ALTO, NMG_BASS),
  abide:        gentle(63, 240, AWM_SOP, AWM_ALTO, AWM_BASS),
  morning:      gentle(92, 240, TMB_SOP, TMB_ALTO, TMB_BASS),
  tempest:      gentle(88, 432, MTR_SOP, MTR_ALTO, MTR_BASS),
  judea:        gentle(96, 192, FFA_SOP, FFA_ALTO, FFA_BASS),
  godbe:        gentle(88, 256, GBW_SOP, GBW_ALTO, GBW_BASS),
});
// Walking-around music rotates through the hymnbook — a new hymn each day, or press N.
const TOWN_TRACKS = [
  ['town',       '"Called to Serve" (Hymns no. 249)'],
  ['enlisted',   '"We Are All Enlisted" (Hymns no. 250)'],
  ['praise',     '"Praise to the Man" (Hymns no. 27)'],
  ['mountain',   '"High on the Mountain Top" (Hymns no. 5)'],
  ['yei',        '"Ye Elders of Israel" (Hymns no. 319)'],
  ['israel',     '"Israel, Israel, God Is Calling" (Hymns no. 7)'],
  ['shoulder',   '"Put Your Shoulder to the Wheel" (Hymns no. 252)'],
  ['presson',    '"Let Us All Press On" (Hymns no. 243)'],
  ['royalarmy',  '"Behold! A Royal Army" (Hymns no. 251)'],
  ['hope',       '"Hope of Israel" (Hymns no. 259)'],
  ['truefaith',  '"True to the Faith" (Hymns no. 254)'],
  ['hark',       '"Hark, All Ye Nations!" (Hymns no. 264)'],
  ['blessings',  '"Count Your Blessings" (Hymns no. 241)'],
  ['dowhatright','"Do What Is Right" (Hymns no. 237)'],
  ['choosetr',   '"Choose the Right" (Hymns no. 239)'],
  ['carryon',    '"Carry On" (Hymns no. 255)'],
  ['battlehymn', '"Battle Hymn of the Republic" (Hymns no. 60)'],
  ['spirit',     '"The Spirit of God" (Hymns no. 2)'],
  ['foundation', '"How Firm a Foundation" (Hymns no. 85)'],
  ['angel',      '"An Angel from on High" (Hymns no. 13)'],
];
// Lesson music rotates too — a different reverent hymn each day.
const LESSON_TRACKS = ['hymn', 'saints', 'amazed', 'sweethour', 'secretprayer', 'thinktopray',
                       'nearer', 'abide', 'morning', 'tempest', 'judea', 'godbe'];
const LESSON_NAMES = new Set(LESSON_TRACKS);
const hintEl = document.getElementById('hint');
function updateHint() {
  hintEl.textContent = 'WASD / Arrows to walk • E to knock / talk • 1–4 or click to choose • Enter to continue • M for music • N for next hymn • ♪ ' + TOWN_TRACKS[Music.hymnIdx][1];
}
const Music = {
  on: true, song: null, name: '', step: 0, nextT: 0, timer: null, noiseBuf: null, master: null, hymnIdx: 0,
  playTown() { this.play(TOWN_TRACKS[this.hymnIdx][0]); updateHint(); },
  playLesson() { this.play(LESSON_TRACKS[(day - 1) % LESSON_TRACKS.length]); },
  nextHymn() {
    this.hymnIdx = (this.hymnIdx + 1) % TOWN_TRACKS.length;
    if (!LESSON_NAMES.has(this.name) && this.name !== 'fanfare') this.playTown(); else updateHint();
  },
  init() {
    if (this.timer) return;
    // ask iOS (16.4+) to treat us as media playback so the silent switch doesn't mute us
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    // mobile unlock: a tick of silence, started inside the first user gesture
    try {
      const u = AC.createBufferSource();
      u.buffer = AC.createBuffer(1, 1, 22050);
      u.connect(AC.destination); u.start(0);
    } catch (e) {}
    const sr = AC.sampleRate, b = AC.createBuffer(1, sr*0.2|0, sr), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random()*2 - 1;
    this.noiseBuf = b;
    this.master = AC.createGain(); this.master.connect(AC.destination);
    this.timer = setInterval(() => this.tick(), 30);
    this.playTown();
  },
  play(name) {
    if (name === this.name) return;
    this.name = name; this.song = SONGS[name]; this.step = 0;
    if (AC) this.nextT = AC.currentTime + 0.08;
  },
  toggle() { this.on = !this.on; },
  tick() {
    if (!this.on || !this.song || !AC || AC.state !== 'running') return;
    const s = this.song, spb = 60 / s.bpm / s.div;
    while (this.nextT < AC.currentTime + 0.16) {
      const i = this.step % s.len, t = this.nextT;
      for (const ch of s.ch) {
        if (ch.ev) {
          if (!ch.evMap) { ch.evMap = {}; for (const e of ch.ev) (ch.evMap[e[0]] = ch.evMap[e[0]] || []).push(e); }
          const evs = ch.evMap[i];
          if (evs) for (const e of evs) this.note(ch, e[1], t, spb * e[2]);
        } else {
          const v = ch.p[i % ch.p.length];
          if (v) this.note(ch, v, t, spb * (ch.lenMul || 1));
        }
      }
      if (s.kick && s.kick[i % s.kick.length]) this.kick(t);
      if (s.hat && s.hat[i % s.hat.length]) this.noise(t, 7000, 0.03, 0.01);
      if (s.snare && s.snare[i % s.snare.length]) this.noise(t, 1800, 0.09, 0.028);
      this.step++; this.nextT += spb;
      if (!s.loop && this.step >= s.len) { const nx = s.then; this.name=''; if (nx) this.play(nx); else this.playTown(); break; }
    }
  },
  note(ch, midi, t, baseDur) {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = ch.wave; o.frequency.value = 440 * Math.pow(2, (midi-69)/12);
    const dur = (ch.sus || 0.9) * baseDur;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(ch.vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.03);
  },
  kick(t) {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.09);
    g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.12);
  },
  noise(t, freq, dur, vol) {
    const src = AC.createBufferSource(); src.buffer = this.noiseBuf;
    const f = AC.createBiquadFilter(); f.type = freq > 4000 ? 'highpass' : 'bandpass'; f.frequency.value = freq;
    const g = AC.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.master); src.start(t); src.stop(t + dur + 0.03);
  },
};
document.addEventListener('visibilitychange', () => { if (AC) (document.hidden ? AC.suspend() : AC.resume()); });

