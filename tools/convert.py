"""Convert Church MusicXML hymns into the game's [step16, midi, dur16] event arrays."""
import xml.etree.ElementTree as ET
import sys

STEP_NAMES = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}

def parse(path, transpose, part_names=('Soprano', 'Alto', 'Bass'), lead_parts=('Soprano',)):
    tree = ET.parse(path)
    root = tree.getroot()
    # map part id -> name
    names = {}
    for sp in root.iter('score-part'):
        pn = sp.find('part-name')
        names[sp.get('id')] = (pn.text or '').strip() if pn is not None else ''
    out = {}
    info = {}
    for part in root.iter('part'):
        pname = names.get(part.get('id'), '')
        if pname not in part_names:
            continue
        # grand-staff exports repeat one part name; expose extras as Name#2, Name#3...
        n = 2
        while pname in out:
            pname = names.get(part.get('id'), '') + '#%d' % n
            n += 1
        divisions = 4
        pos = 0            # absolute position in divisions
        events = []        # [start, midi, dur]
        open_tie = {}      # midi -> event being extended
        for meas in part.findall('measure'):
            attr = meas.find('attributes')
            if attr is not None:
                d = attr.find('divisions')
                if d is not None:
                    divisions = int(d.text)
                k = attr.find('key/fifths')
                if k is not None:
                    info.setdefault('fifths', int(k.text))
                t = attr.find('time')
                if t is not None:
                    info.setdefault('time', t.find('beats').text + '/' + t.find('beat-type').text)
            # shadow passes after a <backup> can be shorter than the measure
            # (e.g. when the lead's last note doubles as the partner's notehead),
            # so the true measure length is the high-water mark, not the final pos.
            mstart = mmax = pos
            for el in meas:
                if el.tag == 'backup':
                    pos -= int(el.find('duration').text)
                elif el.tag == 'forward':
                    pos += int(el.find('duration').text)
                    mmax = max(mmax, pos)
                elif el.tag == 'note':
                    if el.find('grace') is not None:
                        continue
                    dur = int(el.find('duration').text)
                    is_chord = el.find('chord') is not None
                    if is_chord:
                        start = pos - dur   # chord notes share onset of previous note
                    else:
                        start = pos
                        pos += dur
                        mmax = max(mmax, pos)
                    if el.find('rest') is not None:
                        continue
                    v = el.find('voice')
                    if v is not None and v.text.strip().startswith('-'):
                        continue   # negative voices are layout shadows of the partner part
                    p = el.find('pitch')
                    midi = (int(p.find('octave').text) + 1) * 12 + STEP_NAMES[p.find('step').text]
                    alter = p.find('alter')
                    if alter is not None:
                        midi += int(round(float(alter.text)))
                    midi += transpose
                    ties = [t.get('type') for t in el.findall('tie')]
                    # scale to 16ths (divisions per quarter -> 4 steps per quarter)
                    s16 = start * 4 // divisions
                    d16 = dur * 4 // divisions
                    if 'stop' in ties and midi in open_tie:
                        open_tie[midi][2] += d16
                        if 'start' not in ties:
                            del open_tie[midi]
                        continue
                    # both notes of a two-note chord are kept; mono() picks the voice later
                    ev = [s16, midi, d16]
                    events.append(ev)
                    if 'start' in ties:
                        open_tie[midi] = ev
            pos = mmax
        events.sort(key=lambda e: e[0])
        out[pname] = events
    return out, info

def mono(events, keep_high):
    """Collapse to one note per onset (parts carry two written voices) and clip overlaps."""
    by_start = {}
    for s, m, d in events:
        cur = by_start.get(s)
        if cur is None:
            by_start[s] = [s, m, d]
        elif keep_high and (m, d) > (cur[1], cur[2]):
            by_start[s] = [s, m, d]
        elif not keep_high and (m, -d) < (cur[1], -cur[2]):
            by_start[s] = [s, m, d]
    out = sorted(by_start.values())
    for i in range(len(out) - 1):
        out[i][2] = min(out[i][2], out[i+1][0] - out[i][0])
    return [e for e in out if e[2] > 0]

def fmt(events):
    return '[' + ','.join('[%d,%d,%d]' % tuple(e) for e in events) + ']'

if __name__ == '__main__':
    for path, transpose, tag in [('enlisted.xml', 2, 'ENL'), ('praise.xml', 0, 'PTM'), ('mountain.xml', 0, 'HMT')]:
        parts, info = parse(path, transpose)
        print('//', path, info)
        for vname, suffix in [('Soprano','SOP'), ('Alto','ALTO'), ('Bass','BASS')]:
            ev = parts.get(vname, [])
            total = max(e[0]+e[2] for e in ev) if ev else 0
            lo = min(e[1] for e in ev); hi = max(e[1] for e in ev)
            print('// %s_%s: %d events, ends step %d, range %d-%d' % (tag, suffix, len(ev), total, lo, hi))
        print()
