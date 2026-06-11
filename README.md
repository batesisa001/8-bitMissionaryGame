# Called to Serve — an 8-bit Missionary Story

A top-down pixel-art game about LDS missionary life. You play **Elder Young**, serving
alongside your companion **Elder Sorensen** in the town of Maple Hollow — knocking doors,
listening first, serving freely, and teaching the five lessons from *Preach My Gospel*.

## Play

Open `index.html` in any modern browser. No build step, no dependencies — the whole game
(engine, pixel art, dialogue, and music) is one self-contained HTML file. It works on
phones too: tap to walk, tap a door to knock, tap to choose.

Progress autosaves at the start of each day — the title screen offers **Continue**, or
press **R** there to start a new mission.

## Controls

| Key | Action |
| --- | --- |
| WASD / Arrows | Walk (or tap the map on touch screens) |
| E / Space | Knock on doors, talk to people |
| 1–4 or click/tap | Choose a dialogue option |
| Enter | Continue / advance the day |
| M | Toggle music |
| N | Next hymn |
| Tab | Area book (F there assigns a fellowshipper) |
| R (title screen) | Start a new mission |

## The game

- **24 unique residents**, each with their own branching conversation tree — a grieving
  seeker, a skeptic engineer, the local Jehovah's Witnesses, a 20-year "eternal
  investigator," a resigned member who needs kindness rather than lessons, and many more.
- **The five missionary lessons** (Restoration, Plan of Salvation, the Gospel of Jesus
  Christ, the Commandments, Laws and Ordinances), taught over multiple visits with the
  invite–promise–follow-up commitment pattern.
- **Real missionary rhythms**: the 6:30 AM daily schedule, companionship rules, member
  dinners and referrals, Sunday sacrament meeting, nightly key-indicator reports, and a
  9:00 PM curfew.
- **Spirit meter**: kindness, service, and sincere testimony raise it; arguing and
  pushiness drain it — and it changes how people respond at the door.
- **Energy meter**: every door and lesson costs something. Sleep helps, but a string of
  hard days catches up with you, and tired elders teach poorly.
- **Morning study**: choose a study topic each morning — study what you'll teach today
  and the lesson lands noticeably better.
- **P-Day (Mondays)**: chores and free time until 6 PM sharp, then back to work. Four
  NES-honest minigames — the **laundromat rush** (a perfect sort means crisp shirts
  and better sleep all week), **letters home** (pick four lines; Mom's reply arrives
  Thursday and reacts to what you wrote), **church-ball** against the district elders
  (timing-bar shots, contested steals, a whiteboard scoreboard), and **fishing the
  park pond** (five casts; Old Gerald is in there somewhere). All optional, all
  rewarded in energy and spirit.
- **Concerns**: every progressing friend carries one real obstacle — grief, Sundays,
  tithing math, doubts, peer pressure, the coffee thing. Concerns block commitments
  until you work through them in a dedicated visit, or with the right ward member's help.
- **Fellowshipping**: assign ward members to friends from the area book (**Tab**, then
  **F**). The right pairing resolves concerns and builds roots; the wrong one is an
  awkward dinner with a 240-slide presentation — harmless, but reassign.
- **Retention**: baptism isn't the finish line. New converts need a friend, a calling,
  and a visit every few days for two weeks — or they quietly drift. Go knock.
- **The area book (Tab)**: everyone you've met — stage, interest, concerns,
  fellowshipper, weekly goals, and the fish log on the back page.
- **Weekly goals**: Thursday-night planning sets two goals; Sunday night weighs them.
  Choosing realistic ones is itself the skill.
- **Unity meter**: hand your companion lesson parts, play church-ball together, let him
  pray — a unified companionship teaches deeper. Unity is maintained, not assumed.
- **Weather**: rainy days open fewer doors (the umbrella people stay friendly); hot
  days cost more energy at every porch.
- **Goal**: help someone enter the waters of baptism. Then keep going.

## Developing

The shipped game is a single `index.html`, built by concatenating the modules in `src/`:

```
python tools/build_game.py        # src/*  ->  index.html
python tools/build_game_music.py  # refresh the hymn library from tools/jukebox_extra.js, then rebuild
```

`src/15_hymn_library.gen.js` is generated — edit `tools/jukebox_extra.js` (or add hymns
via `tools/emit_extra.py`) instead.

## Music

The soundtrack is a chiptune hymnbook: **31 hymns** in authentic NES-style arrangements —
soprano and alto on square waves, bass on triangle, percussion on the noise channel —
every one transcribed note-for-note from the official scores, and every tune in the
public domain.

- **While you tract**, a rotation of 20 marches and anthems plays — "Called to Serve,"
  "We Are All Enlisted," "Ye Elders of Israel," "The Spirit of God," "Battle Hymn of the
  Republic," and more. A new hymn starts each morning, or press **N** to skip ahead.
- **During lessons**, a rotation of 12 reverent hymns plays softly — "Come, Come, Ye
  Saints," "I Stand All Amazed," "Sweet Hour of Prayer," "Abide with Me; 'Tis Eventide,"
  and others, with the triangle wave carrying the melody.
- **At a baptism**, the "Onward, ever onward" chorus of "Called to Serve" rings out as a
  fanfare, then settles into the game's signature reverent theme.

---

*Fan-made simulation. Not an official product of The Church of Jesus Christ of
Latter-day Saints.*
