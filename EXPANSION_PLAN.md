# Called to Serve — Full-Game Expansion Plan

A design plan for growing the current build (one town, 24 residents, five lessons, one
baptism arc, 31-hymn soundtrack) into a complete mission-length game — including
**P-Day minigames** as a core weekly rhythm.

Everything below builds on systems that already exist: the day/time loop (`startDay` /
`endDay` / `nextDay`), the dialogue engine (`openDlg` / `persuade`), the spirit meter,
the stats block, the hymn rotation, and the mode state machine
(`title | daystart | play | dlg | summary | ceremony`).

---

## 1. The shape of the full game

**You play one transfer cycle at a time, across a full mission.** The current game is
"forever in Maple Hollow." The full game gives the mission a beginning, middle, and end:

- **Structure: 6 transfers × 2 weeks of play each** (a "transfer" compresses 6 real
  weeks into 14 in-game days). ~84 playable days total, save-anytime.
- **Three areas**, rotated by transfer:
  1. **Maple Hollow** (current map) — the suburban starter area.
  2. **Cedar City Downtown** — denser map: apartments with buzzers (door approaches
     work differently), street contacting, a bus system instead of walking everywhere.
  3. **The Junction** — rural farms: long distances (bikes!), fewer doors, deeper
     relationships, a tiny branch instead of a ward.
- **Companions change at transfers.** Elder Sorensen is one of five companions, each
  with a personality that changes gameplay (see §3).
- **An ending.** The last transfer ends with a homecoming sequence and an epilogue that
  shows what happened to everyone you taught — pulled from your actual playthrough data
  (who was baptized, who stayed active, who you never went back for). The epilogue is
  the emotional payoff and the replay hook.

**Win condition stays the same in spirit:** the game never scores baptisms as points.
The end-of-mission epilogue measures *relationships* — people remembered, served, and
still standing. That tone guardrail (already in the current writing) governs everything
below.

---

## 2. The week, finished

The current game has Sundays. The full game gives every day of the week a character:

| Day | Rhythm |
| --- | --- |
| **Monday — P-Day** | Chores + minigames until 6 PM, then normal proselyting evening (see §5) |
| Tue–Sat | Core loop: study → work the area → appointments → 9 PM planning |
| **Wednesday** | District council at the chapel — goals, role-play training, district drama |
| **Saturday** | Service morning (mini service events), baptisms happen Saturdays (already true) |
| **Sunday** | Sacrament meeting (already exists) + ward council referrals + investigators attending |

- **Morning study block (6:30–10:00, currently skipped)** becomes a short interactive
  scene: pick a study topic → small buff for the day ("studied the Restoration: +10
  persuade on lesson 1 today"). Companion study builds the unity meter (§3).
- **Weekly planning (new, Thursday night):** set 2–3 weekly goals (lessons taught,
  members present, new people contacted). Hitting them pays out spirit/morale; choosing
  realistic goals is itself the skill.

---

## 3. New core systems

### 3.1 Companions as gameplay
Five companions across the mission, each one a modifier set plus a personal story arc
that resolves over the transfer:

| Companion | Gameplay flavor | Arc |
| --- | --- | --- |
| **Elder Sorensen** (current) | Balanced; teaches the tutorial transfer | Quietly homesick; learns to lead |
| **Elder Ramos** | +street contacting, –door approaches; bilingual (unlocks the `spanish` arch's full tree) | Visa waiter who finally gets his call to Brazil |
| **Elder Petersen** | Greenie you must train: his persuade rolls are weak until you let him take lesson parts | Confidence arc; eventually outshines you |
| **Elder Holt** | High energy, low obedience: tempts you with shortcuts (skip study, long lunches) that buff today and debuff the area | Hits bottom, decides who he wants to be |
| **Elder Okafor** | District leader; weekly goals matter double; unlocks leadership scenes | Carries the district through a hard transfer |

**Unity meter (new, alongside spirit):** raised by companion study, P-Day activities
done *together*, backing him in lessons; drained by overriding him, skipping council.
Unity multiplies lesson effectiveness — a true principle and a clean mechanic.

### 3.2 Investigator depth (extending the current `h` resident objects)
- **Concerns:** each progressing investigator gets 1–2 concrete obstacles (Word of
  Wisdom and coffee, tithing math, a hostile spouse, work on Sundays, "I can't be
  forgiven"). Concerns block commitments until addressed through dedicated lesson
  branches or member help.
- **Fellowshipping:** assign a ward member (from a roster of ~8 named members) to each
  investigator. Right pairing = retention buff (the `veteran` farmer and the `farmer`
  investigator; the `musician` and the ward organist…). Wrong pairing = awkward dinner
  scene, no harm, comedy.
- **Retention after baptism:** baptized converts stay on the map. They need a calling,
  a friend, and a visit every few days for two weeks or they drift toward
  less-active (the existing `lessactive` arch becomes a *system*, not just a character).
  The epilogue reads this data.
- **The area book:** a new pause screen (Tab) listing everyone: stage, concerns,
  commitments kept, next appointment, assigned member. This is the player's quest log,
  diegetically.

### 3.3 Resources
- **Miles/legs:** Maple Hollow walks, Downtown uses bus tokens, The Junction has bikes
  with a weekly mile budget — running out means walking (time cost doubles). Gentle
  pressure, never a fail state.
- **Monthly funds (MSF):** small grocery budget spent on P-Day (see minigame); eating
  badly all week = –1 energy regen. Member dinners (already implied) restore it free.
- **Energy (new):** depletes with each door/lesson; restored by sleep, food, P-Day.
  Low energy caps persuade rolls. Makes the P-Day loop *mechanically necessary*, not
  just decorative.

### 3.4 Weather & seasons
Each transfer has a season: rain (fewer people answer, umbrellas sprite), snow
(shoveling = free service mini-event on any walkway), summer heat. Palette swaps reuse
the existing tile renderer; weather rolls daily at `startDay`.

---

## 4. Content expansion

- **Residents: 24 → ~60** across the three areas. Every current archetype keeps its
  tree; new archetypes per area: downtown (security-door apartments, a food-truck
  owner, a night-shift nurse you can only catch at odd hours, street musicians,
  a university Institute class), rural (part-member ranch family, the branch president
  who's also the mechanic, a returned missionary gone quiet).
- **NPC schedules:** residents are home/away by time-of-day and day-of-week (the
  `nothome` arch generalizes into a system). The area book records best times — turning
  the existing knock loop into light detective play.
- **Interiors:** chapel, your apartment (planning, study, P-Day chores), and ~6
  teaching living rooms (lesson scenes get a backdrop instead of dialogue-over-map).
- **Mission events (1–2 per transfer):** zone conference (mission president's
  challenge = a transfer-long modifier), exchanges (one day with a different elder),
  a mission tour, transfer calls (the Tuesday-night phone drama), Christmas calls home.
- **Dialogue volume:** roughly 3× current word count. The writing voice of the current
  build (warm, funny, specific, never preachy) is the standard; new content should be
  written to match it, arch by arch.

---

## 5. P-Day minigames ★

Monday. Chores in the morning (one required, quick), then free choice of activities at
the chapel/park until 6 PM. Each activity costs P-Day time; you fit in 2–3 of the 8.
**Rewards feed the new meters:** energy refill, +unity (if done with companion),
occasional story scenes (companions open up during P-Day — their arcs advance here).

Every minigame is built NES-honest: one screen, one mechanic, 60–120 seconds, square-wave
sound effects, hymn soundtrack continues.

| # | Minigame | Mechanic | Reward hook |
| --- | --- | --- | --- |
| 1 | **Church-ball** (cultural hall) | 2-on-2 half-court; timing-bar shots, simple steals; companion is your teammate (his stats reflect who he is) | +energy, big +unity; district elders trash-talk in speech bubbles |
| 2 | **Letters home** (apartment table) | Compose a letter by choosing 4 of 8 sentence fragments; Mom's reply arrives Thursday and its content reacts to what you wrote *and* your week's stats | +spirit; replies are a drip-feed of family storyline across the mission |
| 3 | **The Pond** (existing park pond!) | Fishing: cast, watch the bobber, reaction-tap; rare catches get logged in the area book's back page | +energy; the `farmer` and `teen` residents show up here on Mondays — bonus casual conversations |
| 4 | **Laundromat rush** | Sort a conveyor of falling clothes (white shirts / darks / DO-NOT-WASH suit) into three baskets, speed ramps | Required-chore slot; perfect run = +1 energy all week ("crisp shirts") |
| 5 | **Grocery run** | Shop a tiny store grid against the MSF budget: fill the week's meal list, resist the candy aisle (Elder Holt heckles) | Sets the week's food quality → energy regen |
| 6 | **Bike tune-up / The Junction Loop** (rural transfers) | Side-scrolling district bike ride: potholes, dogs, hills; drafting behind your companion saves energy | +miles budget for the week; unlocks a shortcut route on the area map |
| 7 | **Hymn practice** (chapel piano) | Rhythm game on the actual chiptune engine: notes of a hymn scroll piano-roll style (the jukebox visualizer, made playable); hit Z/X on the beat | Hymn gets added to *Sunday's* sacrament meeting; play it well and a specific investigator is moved (each arc has "their" hymn) |
| 8 | **Zone sports day** (1 per transfer) | Rotating event: ping-pong (Pong with spin), ultimate frisbee (catch positioning), volleyball (timing) vs. rival district | District-wide +unity; winner's district gets bragging rights at council (dialogue changes) |

**Design rules for P-Day:**
- Minigames are *optional but rewarded* — a player who skips them all can still finish
  the game, just on tired legs (lower energy ceiling).
- No minigame ever gates story content; they accelerate and flavor it.
- Each companion has a favorite activity; doing his favorite advances his personal arc
  scene that evening. This is the main delivery channel for companion stories.
- 6 PM sharp, P-Day ends (true to life): the bell rings mid-game if you cut it close,
  and you finish the evening with normal proselyting — a built-in rhythm of play → work.

---

## 6. Presentation & platform

- **Touch controls** (the jukebox's mobile lessons apply): tap-to-walk pathfinding,
  tap residents to knock, dialogue options are already click/tap-friendly. The game
  becomes fully playable on phones — which is where the jukebox audience already is.
- **Save system:** localStorage autosave at `endDay` + 3 manual slots on the title
  screen; save data versioned (`{v: 1, ...}`) so future updates migrate cleanly.
- **Audio:** the 31-hymn library is done. Add: per-area town rotations (downtown gets
  the brisk marches, The Junction gets the gentle ones), a 4–6 note leitmotif per
  companion woven into scene stingers, and weather-aware mixing (rain = soft hat noise
  layer). P-Day gets the bounciest hymns.
- **Pixel art:** seasonal palettes, interiors, ~10 new NPC sprite sheets, weather
  particles, and a few hand-drawn full-screen moments (transfer goodbyes, the
  homecoming) in the same 12px-tile language.
- **Accessibility:** remappable keys, text-speed option, reduced-flash mode,
  colorblind-safe dialogue highlighting.

---

## 7. Technical plan (keeping the soul: one HTML file, zero dependencies)

The 200 KB single file is becoming hard to edit safely. Adopt the pattern already
proven by the music pipeline (`tools/build_game_music.py`):

- **Source splits into `src/` modules** (engine, music, map, dialogue/content per area,
  minigames) **+ a build script** (`tools/build_game.py`) that concatenates into the
  same single self-contained `index.html`. No bundler, no npm — just the existing
  Python tooling. Shipping artifact stays one file.
- **Dialogue as data:** resident trees move to a compact JSON-ish module per area;
  the `n()/o()` node format is already 90% there.
- **Minigame contract:** each minigame is `{enter(state), update(dt), draw(ctx),
  exit() → rewards}` plugged into the existing mode state machine as
  `mode === 'minigame'`. One shared results card UI.
- **Testing:** a headless self-check page (run all dialogue trees for dead ends /
  unreachable nodes; simulate 84 days of `nextDay()` for crash safety; verify every
  hymn's voices end together — extending checks already used during development).
- **Repos:** game work continues in `8-bitMissionaryGame`; the jukebox repo
  (`Hymns8-bit`) keeps receiving the shared music library via the existing build
  scripts.

---

## 8. Build order (5 phases, each independently shippable)

| Phase | Contents | Why this order |
| --- | --- | --- |
| **1. Foundation** | Save/load, energy meter, morning study, source split + build script, touch controls | Everything later depends on saves and the module split; touch unlocks the phone audience immediately |
| **2. P-Day** | Monday schedule, minigames #2 (letters), #4 (laundry), #1 (church-ball), #3 (fishing), rewards wiring | The requested feature; small scope, huge texture; exercises the new minigame contract before harder ones |
| **3. Depth** | Concerns, fellowshipping, retention, area book, weekly goals, unity meter, weather | Turns the existing single arc into a real management-of-relationships game in the existing town |
| **4. The Mission** | Areas 2–3, companions 2–5 with arcs, transfers, district council, mission events, remaining minigames (#5–#8) | The big content lift, built on stable systems |
| **5. The Ending** | Final transfer, homecoming, data-driven epilogue, balancing pass, accessibility pass | The payoff; needs all systems feeding it data |

A reasonable scope estimate: Phases 1–2 are each about the size of the hymn-library
project just completed; Phase 3 is twice that; Phase 4 is the long haul (mostly
writing); Phase 5 is short but delicate.

---

## 9. Tone guardrails (unchanged, now written down)

1. Ordinances are never scored, sped up, or skinned as rewards. The fanfare plays;
   no confetti, no "+500".
2. Rejection stays human — doors close kindly, rudely, sadly, but people are never
   enemies or XP. The `hostile` arch gets *more* interiority as content grows, not less.
3. Faith mechanics (spirit, study buffs) influence *how conversations go*, never
   whether a person's agency flips. `persuade()` keeps its caps; some people say no
   forever, and the epilogue honors them too.
4. Humor punches at missionary life (laundry, bikes, casseroles), never at believers,
   doubters, or other faiths (the JW shop-talk scene is the model).
5. The disclaimer stays: fan-made, not an official product of the Church.
