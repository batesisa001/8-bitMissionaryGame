"""Emit all jukebox-only hymns into jukebox_extra.js (the game keeps its own four)."""
import io, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from convert import parse, fmt, mono

NOTE = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
def nm(m): return NOTE[m % 12] + str(m // 12 - 1)

here = os.path.dirname(os.path.abspath(__file__))

# voice spec: (parsed part key, array suffix, keep_high in mono, semitone shift)
SATB  = [('Soprano','SOP',True,0), ('Alto','ALTO',False,0), ('Bass','BASS',False,0)]
TTBB  = [('Tenor 1','SOP',True,12), ('Tenor 2','ALTO',False,12), ('Bass','BASS',False,0)]
SATBA = [('Soprano','SOP',True,0), ('Alto','ALTO',False,0), ('Bass/Accomp.','BASS',False,0)]
GRAND = [('MusicXML Part','SOP',True,0), ('MusicXML Part','ALTO',False,0),
         ('MusicXML Part#2','BASS',False,0)]

HYMNS = [
    ('elders.xml', 'YEI', 0, TTBB,
     '// "Ye Elders of Israel" — Hymns #319, music by Thomas H. Bayly (public domain).\n'
     "// Men's chorus (TTBB): Tenor 1 lead, Tenor 2 harmony, Bass; tenors raised an octave."),
    ('israel.xml', 'IIG', 0, SATB,
     '// "Israel, Israel, God Is Calling" — Hymns #7, George F. Root (public domain).'),
    ('shoulder.xml', 'PYS', 0, SATB,
     '// "Put Your Shoulder to the Wheel" — Hymns #252, Will L. Thompson (public domain).'),
    ('presson.xml', 'LUP', 0, SATB,
     '// "Let Us All Press On" — Hymns #243, Evan Stephens (public domain).'),
    ('royalarmy.xml', 'BRA', 0, SATBA,
     '// "Behold! A Royal Army" — Hymns #251, Adam Geibel (public domain).'),
    ('hopeisrael.xml', 'HOI', 0, SATB,
     '// "Hope of Israel" — Hymns #259, William Clayson (public domain).'),
    ('truefaith.xml', 'TTF', 0, SATB,
     '// "True to the Faith" — Hymns #254, Evan Stephens (public domain).'),
    ('harknations.xml', 'HAN', 0, SATB,
     '// "Hark, All Ye Nations!" — Hymns #264, George F. Root (public domain).'),
    ('blessings.xml', 'CYB', 0, SATB,
     '// "Count Your Blessings" — Hymns #241, E. O. Excell (public domain). 2/4 time.'),
    ('dowhatright.xml', 'DWR', 0, SATB,
     '// "Do What Is Right" — Hymns #237, George Kiallmark (public domain). 3/4 time.'),
    ('choosetr.xml', 'CTR', 0, SATB,
     '// "Choose the Right" — Hymns #239, Henry A. Tucker (public domain).'),
    ('carryon.xml', 'CAR', 0, SATBA,
     '// "Carry On" — Hymns #255, Alfred M. Durham (published 1930, public domain).'),
    ('battlehymn.xml', 'BHR', 0, SATB,
     '// "Battle Hymn of the Republic" — Hymns #60, attr. William Steffe (public domain).'),
    ('spirit.xml', 'SOG', 0, SATB,
     '// "The Spirit of God" — Hymns #2, anonymous tune (public domain).'),
    ('morningbreaks.xml', 'TMB', 0, SATB,
     '// "The Morning Breaks" — Hymns #1, George Careless (public domain). 3/4 time.'),
    ('firmfound.xml', 'HFF', 0, SATB,
     '// "How Firm a Foundation" — Hymns #85, attr. J. Ellis (public domain).'),
    ('angelhigh.xml', 'AFH', 0, GRAND,
     '// "An Angel from on High" — Hymns #13, John E. Tullidge (public domain). 6/8 time.'),
    ('tempest.xml', 'MTR', 0, SATB,
     '// "Master, the Tempest Is Raging" — Hymns #105, H. R. Palmer (public domain). 6/8 time.'),
    ('saints.xml', 'CCS', 0, SATB,
     '// "Come, Come, Ye Saints" — Hymns #30, English folk song (public domain).'),
    ('amazed.xml', 'ISA', 0, SATB,
     '// "I Stand All Amazed" — Hymns #193, Charles H. Gabriel (public domain). 3/4 time.'),
    ('sweethour.xml', 'SHP', 0, SATB,
     '// "Sweet Hour of Prayer" — Hymns #142, William B. Bradbury (public domain). 6/8 time.'),
    ('secretprayer.xml', 'SCP', 0, SATB,
     '// "Secret Prayer" — Hymns #144, Hans Henry Petersen (public domain).'),
    ('thinktopray.xml', 'DYP', 0, SATB,
     '// "Did You Think to Pray?" — Hymns #140, William O. Perkins (public domain).'),
    ('nearer.xml', 'NMG', 0, SATB,
     '// "Nearer, My God, to Thee" — Hymns #100, Lowell Mason (public domain).'),
    ('abide.xml', 'AWM', 0, SATB,
     '// "Abide with Me; \'Tis Eventide" — Hymns #165, Harrison Millard (public domain). 3/4 time.'),
    ('judea.xml', 'FFA', 0, SATBA,
     '// "Far, Far Away on Judea\'s Plains" — Hymns #212, John M. Macfarlane (public domain).'),
    ('godbe.xml', 'GBW', 0, SATB,
     '// "God Be with You Till We Meet Again" — Hymns #152, William G. Tomer (public domain).'),
]

write = '--write' in sys.argv
blocks = []
for fname, tag, transpose, voices, header in HYMNS:
    part_filter = tuple({v[0].split('#')[0] for v in voices})
    parts, info = parse(os.path.join(here, fname), transpose, part_names=part_filter)
    print('//', tag, info)
    lines = [header]
    for pkey, suffix, keep_high, shift in voices:
        if pkey not in parts:
            print('// !! %s: part %r not found (have %r)' % (tag, pkey, list(parts)))
            continue
        ev = mono(parts[pkey], keep_high=keep_high)
        if shift:
            ev = [[s, m + shift, d] for s, m, d in ev]
        end = max(e[0] + e[2] for e in ev)
        print('// %s_%s: %d events, ends %d, range %s-%s' %
              (tag, suffix, len(ev), end, nm(min(e[1] for e in ev)), nm(max(e[1] for e in ev))))
        if suffix == 'SOP':
            print('// melody opens:', ' '.join(nm(e[1]) for e in ev[:14]))
        lines.append('const %s_%s = %s;' % (tag, suffix, fmt(ev)))
    blocks.append('\n'.join(lines))

if write:
    io.open(os.path.join(here, 'jukebox_extra.js'), 'w', encoding='utf-8').write(
        '\n'.join(blocks) + '\n')
    print('wrote jukebox_extra.js')
