from convert import parse, fmt, mono

NOTE = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
def nm(m): return NOTE[m % 12] + str(m // 12 - 1)

out = open('hymns_out.js', 'w', encoding='utf-8')
for path, transpose, tag in [('enlisted.xml', 2, 'ENL'), ('praise.xml', 0, 'PTM'), ('mountain.xml', 0, 'HMT')]:
    parts, info = parse(path, transpose)
    print('//', tag, info)
    for vname, suffix in [('Soprano','SOP'), ('Alto','ALTO'), ('Bass','BASS')]:
        ev = mono(parts[vname], keep_high=(vname == 'Soprano'))
        end = max(e[0]+e[2] for e in ev)
        print('// %s_%s: %d events, ends %d, range %s-%s' % (tag, suffix, len(ev), end, nm(min(e[1] for e in ev)), nm(max(e[1] for e in ev))))
        if vname == 'Soprano':
            print('// melody opens:', ' '.join(nm(e[1]) for e in ev[:16]))
        out.write('const %s_%s = %s;\n' % (tag, suffix, fmt(ev)))
out.close()
