"""Build ../jukebox.html: inject the game's hymn arrays into the template."""
import io, os, re

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
game = io.open(os.path.join(root, 'index.html'), encoding='utf-8').read()
tpl = io.open(os.path.join(root, 'tools', 'jukebox_template.html'), encoding='utf-8').read()

names = ['CTS_SOP','CTS_ALTO','CTS_BASS','CTS_SOP_R','CTS_ALTO_R','CTS_BASS_R',
         'CTS_SOP_F','CTS_ALTO_F','CTS_BASS_F',
         'ENL_SOP','ENL_ALTO','ENL_BASS','PTM_SOP','PTM_ALTO','PTM_BASS',
         'HMT_SOP','HMT_ALTO','HMT_BASS']
lines = []
for n in names:
    m = re.search(r'^const %s = \[\[.*?\];$' % n, game, re.M)
    assert m, 'missing ' + n
    lines.append(m.group(0))

# jukebox-only hymns that are not in the game
extra = os.path.join(root, 'tools', 'jukebox_extra.js')
if os.path.exists(extra):
    lines.append(io.open(extra, encoding='utf-8').read().rstrip())

out = tpl.replace('//__HYMN_DATA__', '\n'.join(lines))
assert '//__HYMN_DATA__' not in out
io.open(os.path.join(root, 'jukebox.html'), 'w', encoding='utf-8', newline='\n').write(out)
print('jukebox.html built:', len(out), 'bytes,', len(lines), 'arrays')
