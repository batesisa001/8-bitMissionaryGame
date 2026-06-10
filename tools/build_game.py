"""Build index.html (the shippable single file) by concatenating src/ modules in order."""
import io, os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(root, 'src')
names = sorted(n for n in os.listdir(src) if n.endswith(('.js', '.html')))
out = ''.join(io.open(os.path.join(src, n), encoding='utf-8').read() for n in names)
io.open(os.path.join(root, 'index.html'), 'w', encoding='utf-8', newline='').write(out)
print('index.html built:', len(out), 'bytes from', len(names), 'modules:')
print(' ', '\n  '.join(names))
