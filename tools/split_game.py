"""One-time split of index.html into src/ modules (cut at existing section comments).

After splitting, tools/build_game.py concatenates src/* back into index.html.
The split is verified byte-identical before anything is written.
"""
import io, os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
game = io.open(os.path.join(root, 'index.html'), encoding='utf-8').read()

# (module filename, anchor that BEGINS it). First module begins at file start.
CUTS = [
    ('00_head.html',            None),
    ('05_audio.js',             '// ---------------- audio blips ----------------'),
    ('10_music_core.js',        '// ---------------- 8-bit music ----------------'),
    ('15_hymn_library.gen.js',  '// ==== BEGIN HYMN LIBRARY'),
    ('20_songs.js',             'const SONGS = {'),
    ('30_state.js',             '// ---------------- game state ----------------'),
    ('35_input.js',             '// ---------------- input ----------------'),
    ('40_dialogue.js',          '// ---------------- dialogue engine ----------------'),
    ('50_trees.js',             '// ============================================================\n'
                                '// FIRST-CONTACT DIALOGUE TREES'),
    ('60_actions.js',           '// ---------------- interaction dispatch ----------------'),
    ('65_dayflow.js',           '// ---------------- day flow ----------------'),
    ('70_render.js',            '// ---------------- render: world ----------------'),
    ('90_main.js',              '// ---------------- main loop ----------------'),
]

# find cut positions, in order, each search starting after the previous
pos = [0]
start = 0
for name, anchor in CUTS[1:]:
    i = game.index(anchor, start)
    pos.append(i)
    start = i + len(anchor)
pos.append(len(game))

pieces = [(CUTS[k][0], game[pos[k]:pos[k+1]]) for k in range(len(CUTS))]
assert ''.join(p for _, p in pieces) == game, 'split is not lossless'

src = os.path.join(root, 'src')
os.makedirs(src, exist_ok=True)
for name, body in pieces:
    io.open(os.path.join(src, name), 'w', encoding='utf-8', newline='').write(body)
    print('%-26s %7d bytes' % (name, len(body)))
print('split OK (lossless)')
