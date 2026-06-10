// ---------------- render: world ----------------
let camx = 0, camy = 0;
function drawWorld() {
  camx = Math.round(Math.max(0, Math.min(WORLDW - LW, player.x - LW/2)));
  camy = Math.round(Math.max(0, Math.min(WORLDH - LH, player.y - LH/2)));
  lctx.save(); lctx.translate(-camx, -camy);
  // tiles (visible window only)
  const tx0 = Math.max(0, Math.floor(camx/T)), tx1 = Math.min(MW, tx0 + Math.ceil(LW/T) + 2);
  const ty0 = Math.max(0, Math.floor(camy/T)), ty1 = Math.min(MH, ty0 + Math.ceil(LH/T) + 2);
  for (let ty = ty0; ty < ty1; ty++) for (let tx = tx0; tx < tx1; tx++) {
    const t = map[ty][tx], x = tx*T, y = ty*T;
    if (t === 0 || t === 4) {
      lctx.fillStyle = ((tx*7+ty*13)%5<2) ? '#4e8a3c' : '#467f36';
      lctx.fillRect(x,y,T,T);
      if ((tx*31+ty*17)%11===0){ lctx.fillStyle='#5a9a46'; lctx.fillRect(x+3,y+5,2,2); }
      if (t===4){ lctx.fillStyle='#e8d04a'; lctx.fillRect(x+2,y+3,2,2); lctx.fillRect(x+7,y+7,2,2);
        lctx.fillStyle='#dd6688'; lctx.fillRect(x+8,y+2,2,2); lctx.fillRect(x+3,y+8,2,2); }
    } else if (t === 1) {
      lctx.fillStyle = '#4a4a52'; lctx.fillRect(x,y,T,T);
      if (HROADS.includes(ty) && tx%2===0 && !VROADS.some(c=>tx===c||tx===c+1)){ lctx.fillStyle='#c8b84a'; lctx.fillRect(x+2,y+11,6,1); }
      if (VROADS.includes(tx) && ty%2===0 && !HROADS.some(r=>ty===r||ty===r+1)){ lctx.fillStyle='#c8b84a'; lctx.fillRect(x+11,y+2,1,6); }
    } else if (t === 2) {
      lctx.fillStyle = '#9a9aa2'; lctx.fillRect(x,y,T,T);
      lctx.fillStyle = '#8a8a92'; lctx.fillRect(x,y,T,1); lctx.fillRect(x,y,1,T);
    } else if (t === 5) {
      lctx.fillStyle = '#3a6ea8'; lctx.fillRect(x,y,T,T);
      if ((tx*13+ty*7)%4===0){ lctx.fillStyle='#5a8ec8'; lctx.fillRect(x+2,y+4,5,1); lctx.fillRect(x+5,y+9,4,1); }
    }
  }
  // door paths
  lctx.fillStyle = '#b8a87a';
  for (const h of houses) lctx.fillRect(h.dx+1, h.dy, 6, 14);
  lctx.fillRect(church.dx+1, church.dy, 8, 8);

  // houses
  for (const h of houses) drawHouse(h);
  drawChurch();
  // characters sorted by y
  const chars = [
    {y: comp.y, f:()=>drawPerson(comp.x, comp.y, comp, true)},
    {y: player.y, f:()=>drawPerson(player.x, player.y, player, false)},
    ...peds.map(p => ({y:p.y, f:()=>drawPed(p)})),
  ].sort((a,b)=>a.y-b.y);
  for (const c of chars) c.f();
  // trees on top
  for (const t of trees) drawTree(t.x, t.y);
  // markers
  for (const h of houses) {
    if (h.baptized) { lctx.fillStyle='#ffd966'; star(h.x+h.w/2, h.y-5, 3); }
    else if (h.stage==='investigator' && !h.dropped) { lctx.fillStyle='#66ccff'; lctx.fillRect(h.x+h.w/2-1, h.y-7, 3, 5); lctx.fillRect(h.x+h.w/2-3, h.y-5, 7, 3); }
    else if (h.referred && h.stage==='fresh') {
      const bob = Math.sin(performance.now()/300)*1.5;
      lctx.fillStyle='#ffee66'; lctx.fillRect(h.x+h.w/2-1, h.y-9+bob, 2, 5); lctx.fillRect(h.x+h.w/2-1, h.y-2+bob, 2, 2);
    } else if (h.stage==='appt' && day>=h.apptDay) {
      lctx.fillStyle='#88ff88'; lctx.fillRect(h.x+h.w/2-1, h.y-8, 2, 6); lctx.fillRect(h.x+h.w/2-3, h.y-6, 6, 2);
    }
  }
  lctx.restore();
  // interaction prompt
  promptText = '';
  if (mode === 'play') {
    for (const p of peds) if (Math.hypot(player.x-p.x,player.y-p.y)<18 && p.talkedDay!==day) promptText = 'E — Talk to ' + p.name;
    if (Math.hypot(player.x-church.dx,player.y-church.dy)<18) promptText = 'E — Visit the chapel';
    for (const h of houses) if (Math.hypot(player.x-h.dx,player.y-h.dy)<16) promptText = 'E — Knock';
  }
}
let promptText = '';
function star(cx, cy, r) {
  for (let i=0;i<5;i++){ const a=-Math.PI/2+i*2.513; lctx.fillRect(cx+Math.cos(a)*r-1, cy+Math.sin(a)*r-1, 2,2); }
  lctx.fillRect(cx-1,cy-1,2,2);
}
function shade(hex, f) {
  const v = parseInt(hex.slice(1),16);
  const r=Math.min(255,Math.max(0,((v>>16)&255)*f)), g=Math.min(255,Math.max(0,((v>>8)&255)*f)), b=Math.min(255,Math.max(0,(v&255)*f));
  return 'rgb('+(r|0)+','+(g|0)+','+(b|0)+')';
}
function drawHouse(h) {
  const {x,y,w} = h;
  // wall
  lctx.fillStyle = shade(h.color, 1.25); lctx.fillRect(x, y+12, w, 26);
  lctx.fillStyle = shade(h.color, 1.05); lctx.fillRect(x, y+12, w, 3);
  // roof
  lctx.fillStyle = shade(h.color, 0.6); lctx.fillRect(x-2, y, w+4, 13);
  lctx.fillStyle = shade(h.color, 0.75); lctx.fillRect(x-2, y, w+4, 4);
  lctx.fillStyle = shade(h.color, 0.5); lctx.fillRect(x-2, y+11, w+4, 2);
  // windows
  lctx.fillStyle = '#2a2a3a'; lctx.fillRect(x+5, y+18, 10, 9); lctx.fillRect(x+31, y+18, 10, 9);
  lctx.fillStyle = (time>1140)?'#ffdd88':'#aaccee';
  lctx.fillRect(x+6, y+19, 8, 7); lctx.fillRect(x+32, y+19, 8, 7);
  lctx.fillStyle = '#2a2a3a'; lctx.fillRect(x+9, y+19, 1, 7); lctx.fillRect(x+35, y+19, 1, 7);
  // door
  lctx.fillStyle = '#3a2a1a'; lctx.fillRect(h.dx, y+24, 8, 14);
  lctx.fillStyle = '#5a4228'; lctx.fillRect(h.dx+1, y+25, 6, 13);
  lctx.fillStyle = '#e8c84a'; lctx.fillRect(h.dx+5, y+31, 1, 2);
}
function drawChurch() {
  const {x,y,w,h} = church;
  lctx.fillStyle = '#d8d2c4'; lctx.fillRect(x, y+10, w, h-10);
  lctx.fillStyle = '#c4beb0'; lctx.fillRect(x, y+10, w, 3);
  lctx.fillStyle = '#7a4a3a'; lctx.fillRect(x-2, y, w+4, 11);
  lctx.fillStyle = '#8a5a48'; lctx.fillRect(x-2, y, w+4, 3);
  // steeple (no cross — accurate)
  lctx.fillStyle = '#e8e2d4'; lctx.fillRect(x+w/2-4, y-16, 8, 17);
  lctx.fillStyle = '#7a4a3a';
  lctx.fillRect(x+w/2-5, y-19, 10, 3); lctx.fillRect(x+w/2-3, y-22, 6, 3); lctx.fillRect(x+w/2-1, y-26, 2, 4);
  // windows (arched-ish)
  lctx.fillStyle = '#8899bb'; lctx.fillRect(x+6, y+18, 7, 12); lctx.fillRect(x+w-13, y+18, 7, 12);
  lctx.fillStyle = '#aabbdd'; lctx.fillRect(x+7, y+19, 5, 4); lctx.fillRect(x+w-12, y+19, 5, 4);
  // double doors
  lctx.fillStyle = '#4a3220'; lctx.fillRect(church.dx, y+h-16, 10, 16);
  lctx.fillStyle = '#5e4228'; lctx.fillRect(church.dx+1, y+h-15, 3, 15); lctx.fillRect(church.dx+6, y+h-15, 3, 15);
  // sign
  lctx.fillStyle = '#333'; lctx.fillRect(x+w+4, y+h-10, 1, 10);
  lctx.fillStyle = '#eee'; lctx.fillRect(x+w, y+h-16, 12, 7);
}
function drawTree(x, y) {
  lctx.fillStyle = '#5a3a22'; lctx.fillRect(x-1, y-4, 3, 7);
  lctx.fillStyle = '#2e6628'; lctx.fillRect(x-5, y-14, 11, 9);
  lctx.fillStyle = '#3a7a32'; lctx.fillRect(x-4, y-13, 9, 7);
  lctx.fillStyle = '#4a8a3e'; lctx.fillRect(x-3, y-12, 5, 4);
}
function drawPerson(x, y, ch, isComp) {
  const px = Math.round(x-4), py = Math.round(y-12);
  const step = ch.moving===false && !isComp ? 0 : Math.floor(ch.frame)%2;
  // shadow
  lctx.fillStyle = 'rgba(0,0,0,0.25)'; lctx.fillRect(px+1, py+12, 7, 2);
  // legs (dark slacks)
  lctx.fillStyle = '#23232e';
  if (player.moving || isComp) { lctx.fillRect(px+2, py+9, 2, 3+(step?1:0)); lctx.fillRect(px+5, py+9, 2, 3+(step?0:1)); }
  else { lctx.fillRect(px+2, py+9, 2, 4); lctx.fillRect(px+5, py+9, 2, 4); }
  // white shirt
  lctx.fillStyle = '#f2f2f0'; lctx.fillRect(px+1, py+4, 7, 6);
  // tie
  lctx.fillStyle = isComp ? '#8a2a3a' : '#2a4a8a'; lctx.fillRect(px+4, py+4, 1, 4);
  // name tag
  lctx.fillStyle = '#111'; lctx.fillRect(px+6, py+5, 2, 2);
  // arms
  lctx.fillStyle = '#f2f2f0'; lctx.fillRect(px, py+5, 1, 4); lctx.fillRect(px+8, py+5, 1, 4);
  // head
  lctx.fillStyle = '#e8b88a'; lctx.fillRect(px+2, py, 5, 4);
  lctx.fillStyle = isComp ? '#3a2a18' : '#6a4a28'; lctx.fillRect(px+2, py-1, 5, 2);
  // face direction: eyes
  lctx.fillStyle = '#222';
  if (player.fy>=0 || player.fx) { lctx.fillRect(px+3+(player.fx>0?1:0), py+2, 1, 1); lctx.fillRect(px+5+(player.fx>0?0:player.fx<0?-1:0), py+2, 1, 1); }
}
function drawPed(p) {
  const px = Math.round(p.x-4), py = Math.round(p.y-12);
  lctx.fillStyle = 'rgba(0,0,0,0.25)'; lctx.fillRect(px+1, py+12, 7, 2);
  const step = Math.floor(performance.now()/180)%2;
  lctx.fillStyle = '#33333e'; lctx.fillRect(px+2, py+9, 2, 3+(step?1:0)); lctx.fillRect(px+5, py+9, 2, 3+(step?0:1));
  lctx.fillStyle = p.shirt; lctx.fillRect(px+1, py+4, 7, 6);
  lctx.fillStyle = p.skin; lctx.fillRect(px+2, py, 5, 4);
  lctx.fillStyle = p.hair; lctx.fillRect(px+2, py-1, 5, 2);
  if (p.kind==='dogwalker') { // Biscuit
    const dx = px + (p.dir>0?-9:12), dy = py+8;
    lctx.fillStyle = '#c89a4a'; lctx.fillRect(dx, dy, 7, 4); lctx.fillRect(dx+(p.dir>0?-2:7), dy-2, 3, 3);
    lctx.fillStyle = '#a87a3a'; lctx.fillRect(dx+1, dy+4, 1, 2); lctx.fillRect(dx+5, dy+4, 1, 2);
  }
}

// ---------------- render: UI ----------------
function ww(c, text, maxw) {
  const out = [];
  for (const para of String(text).split('\n')) {
    if (para === '') { out.push(''); continue; }
    let line = '';
    for (const w of para.split(' ')) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxw && line) { out.push(line); line = w; } else line = t;
    }
    out.push(line);
  }
  return out;
}
function panel(x,y,w,h,border) {
  ctx.fillStyle = 'rgba(16,16,28,0.93)'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle = border||'#8a8aa8'; ctx.lineWidth = 2; ctx.strokeRect(x+1.5,y+1.5,w-3,h-3);
  ctx.strokeStyle = '#44445c'; ctx.strokeRect(x+5.5,y+5.5,w-11,h-11);
}
function drawHUD() {
  ctx.fillStyle = 'rgba(10,10,20,0.85)'; ctx.fillRect(0,0,960,30);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 14px monospace'; ctx.textAlign='left';
  ctx.fillText(`DAY ${day} — ${dayName(day)}`, 12, 20);
  ctx.fillText(clock(), 200, 20);
  // curfew warning
  if (time > 1200) { ctx.fillStyle = '#ff8866'; ctx.fillText('Curfew 9:00 PM!', 300, 20); }
  // music indicator + spirit & energy meters
  ctx.fillStyle = Music.on ? '#9c9' : '#555'; ctx.fillText('♪', 400, 20);
  ctx.fillStyle = '#ccc'; ctx.fillText('SPIRIT', 428, 20);
  ctx.fillStyle = '#333'; ctx.fillRect(492, 9, 96, 13);
  const sg = ctx.createLinearGradient(492,0,588,0); sg.addColorStop(0,'#cc8833'); sg.addColorStop(1,'#ffdd66');
  ctx.fillStyle = sg; ctx.fillRect(492, 9, 96*spirit/100, 13);
  ctx.strokeStyle = '#888'; ctx.strokeRect(492.5,9.5,96,13);
  ctx.fillStyle = '#ccc'; ctx.fillText('ENERGY', 604, 20);
  ctx.fillStyle = '#333'; ctx.fillRect(676, 9, 96, 13);
  if (energy < 25) ctx.fillStyle = '#cc5544';
  else { const eg = ctx.createLinearGradient(676,0,772,0); eg.addColorStop(0,'#338855'); eg.addColorStop(1,'#88ee99'); ctx.fillStyle = eg; }
  ctx.fillRect(676, 9, 96*energy/100, 13);
  ctx.strokeStyle = '#888'; ctx.strokeRect(676.5,9.5,96,13);
  ctx.fillStyle = '#ddd'; ctx.font = '13px monospace';
  ctx.fillText(`Lessons ${stats.lessons}  ★ ${stats.baptisms}`, 800, 20);
  if (promptText && mode==='play') {
    ctx.font = 'bold 15px monospace'; ctx.textAlign='center';
    ctx.fillStyle = 'rgba(10,10,20,0.85)';
    const w = ctx.measureText(promptText).width + 24;
    ctx.fillRect(480-w/2, 560, w, 26);
    ctx.fillStyle = '#ffee99'; ctx.fillText(promptText, 480, 578);
    ctx.textAlign='left';
  }
}
function drawMinimap() {
  const S = 144 / WORLDW, MX = 960 - 152, MY = 38, MH2 = WORLDH * S;
  ctx.fillStyle = 'rgba(10,10,22,0.78)'; ctx.fillRect(MX-4, MY-4, 152, MH2+8);
  ctx.strokeStyle = '#556'; ctx.strokeRect(MX-3.5, MY-3.5, 151, MH2+7);
  ctx.fillStyle = '#5a5a64';
  for (const r of HROADS) ctx.fillRect(MX, MY + r*T*S, 144, 2);
  for (const c of VROADS) ctx.fillRect(MX + c*T*S, MY, 2, MH2);
  ctx.fillStyle = '#3a6ea8'; ctx.fillRect(MX + 5*T*S, MY + 31*T*S, 9*T*S, 6*T*S);
  for (const h of houses) {
    ctx.fillStyle = h.baptized ? '#ffd966'
      : (h.stage==='investigator' && !h.dropped) ? '#66ccff'
      : (h.stage==='appt' && day >= h.apptDay) ? '#88ff88'
      : h.stage==='friendly' ? '#cc99ff'
      : h.rejectedUntil > day ? '#cc5555' : '#9a9a9a';
    ctx.fillRect(MX + h.x*S, MY + h.y*S, 5, 4);
  }
  ctx.fillStyle = '#f0ead8'; ctx.fillRect(MX + church.x*S, MY + church.y*S, 6, 5);
  if (Math.floor(performance.now()/300) % 2) {
    ctx.fillStyle = '#ffffff'; ctx.fillRect(MX + player.x*S - 1, MY + player.y*S - 1, 3, 3);
  }
  ctx.font = '10px monospace'; ctx.fillStyle = '#889';
  ctx.fillText('green=appt blue=teaching gold=baptized', MX-2, MY + MH2 + 16);
}
function portraitFor(who) {
  if (who === ME || who === 'me2') return { skin:'#e8b88a', hair:'#6a4a28', shirt:'#f2f2f0', tie:'#2a4a8a', tag:true, label:ME };
  if (who === CO) return { skin:'#e8b88a', hair:'#3a2a18', shirt:'#f2f2f0', tie:'#8a2a3a', tag:true, label:CO };
  if (who && who.arch) { const r = RES[who.arch]; return { skin:r.skin, hair:r.hair, shirt:r.shirt, label:r.name }; }
  if (who && who.kind) return { skin:who.skin, hair:who.hair, shirt:who.shirt, label:who.name };
  return null;
}
function drawDlg() {
  const node = curNode(); if (!node) return;
  const who = node.who;
  const port = (who==='narr') ? null : portraitFor(who === 'me2' ? ME : who);
  const X=20, W=920, H=250, Y=624-H-14;
  panel(X, Y, W, H, '#aab');
  let tx = X+20;
  if (port) {
    // portrait
    const px=X+18, py=Y+18, s=5;
    ctx.fillStyle='#222232'; ctx.fillRect(px-4,py-4,13*s+8,13*s+8);
    ctx.strokeStyle='#667'; ctx.strokeRect(px-3.5,py-3.5,13*s+7,13*s+7);
    ctx.fillStyle=port.shirt; ctx.fillRect(px+1*s,py+8*s,11*s,5*s);
    if (port.tie){ ctx.fillStyle=port.tie; ctx.fillRect(px+6*s,py+8*s,1*s,4*s); }
    if (port.tag){ ctx.fillStyle='#111'; ctx.fillRect(px+9*s,py+9*s,2.4*s,1.6*s); }
    ctx.fillStyle=port.skin; ctx.fillRect(px+3*s,py+1*s,7*s,7*s);
    ctx.fillStyle=port.hair; ctx.fillRect(px+3*s,py+0.2*s,7*s,2*s);
    ctx.fillStyle='#222'; ctx.fillRect(px+4.5*s,py+4*s,s,s); ctx.fillRect(px+7.5*s,py+4*s,s,s);
    ctx.fillStyle='#a06a5a'; ctx.fillRect(px+5.5*s,py+6.5*s,2*s,0.7*s);
    tx = px + 13*s + 20;
  }
  const name = who==='narr' ? '' : (port ? port.label : '');
  let ty = Y+30;
  if (name) { ctx.fillStyle = '#ffd966'; ctx.font = 'bold 15px monospace'; ctx.fillText(name, tx, ty); ty += 20; }
  ctx.fillStyle = '#eee'; ctx.font = '14px monospace';
  const lines = ww(ctx, node.text || '', X+W-tx-30);
  const maxBody = liveOpts(node).length ? 7 : 10;
  for (const l of lines.slice(0, 11)) { ctx.fillText(l, tx, ty); ty += 17; }
  // options
  optBoxes = [];
  const opts = liveOpts(node);
  if (opts.length) {
    let oy = Y + H - opts.length*24 - 14;
    opts.forEach((op, i) => {
      const txt = `${i+1}. ${op.t}`;
      ctx.font = '14px monospace';
      const olines = ww(ctx, txt, W-90);
      const bh = 22;
      ctx.fillStyle = 'rgba(60,60,90,0.6)'; ctx.fillRect(X+44, oy, W-88, bh);
      ctx.strokeStyle = '#778'; ctx.strokeRect(X+44.5, oy+0.5, W-88, bh);
      ctx.fillStyle = '#cdf'; ctx.fillText(olines[0].slice(0,108), X+52, oy+16);
      optBoxes.push({x:X+44, y:oy, w:W-88, h:bh, idx:i});
      oy += 24;
    });
  } else {
    ctx.fillStyle = '#999'; ctx.font = 'italic 13px monospace';
    ctx.fillText('[ Enter to continue ]', X+W-220, Y+H-16);
  }
}
function drawModal(title, lines, footer, accent) {
  panel(140, 60, 680, 504, accent||'#aab');
  ctx.textAlign='center';
  ctx.fillStyle = accent||'#ffd966'; ctx.font = 'bold 20px monospace';
  ctx.fillText(title, 480, 100);
  ctx.font = '14px monospace';
  let y = 135;
  for (const l of lines) {
    ctx.fillStyle = l.startsWith('   ★')||l.startsWith('★') ? '#88ddff' : (l.startsWith('DAY')||l.startsWith('TODAY')?'#ffd966':'#ddd');
    ctx.fillText(l, 480, y); y += 19;
    if (y > 520) break;
  }
  if (footer) { ctx.fillStyle = '#999'; ctx.font = 'italic 13px monospace'; ctx.fillText(footer, 480, 546); }
  ctx.textAlign='left';
}
function drawStudy() {
  panel(140, 100, 680, 420, '#aab');
  ctx.textAlign='center';
  ctx.fillStyle = '#ffd966'; ctx.font = 'bold 20px monospace';
  ctx.fillText('PERSONAL STUDY — 7:00 AM', 480, 140);
  ctx.fillStyle = '#ddd'; ctx.font = '14px monospace';
  ctx.fillText('Elder Sorensen is already marking pages. Choose this', 480, 172);
  ctx.fillText("morning's focus — it will carry into today's teaching.", 480, 191);
  optBoxes = [];
  studyChoices.forEach((t, i) => {
    const y = 225 + i * 80;
    ctx.fillStyle = 'rgba(60,60,90,0.6)'; ctx.fillRect(200, y, 560, 64);
    ctx.strokeStyle = '#778'; ctx.strokeRect(200.5, y+0.5, 560, 64);
    ctx.fillStyle = '#ffee99'; ctx.font = 'bold 15px monospace';
    ctx.fillText(`${i+1}. ${t.t}`, 480, y + 26);
    ctx.fillStyle = '#aac'; ctx.font = '13px monospace';
    ctx.fillText(t.d, 480, y + 48);
    optBoxes.push({x:200, y, w:560, h:64, idx:i});
  });
  ctx.fillStyle = '#999'; ctx.font = 'italic 13px monospace';
  ctx.fillText('[ 1–3 or tap to choose ]', 480, 506);
  ctx.textAlign='left';
}
function drawTitle() {
  ctx.fillStyle = '#101020'; ctx.fillRect(0,0,960,624);
  // decorative pixels
  for (let i=0;i<60;i++){ const x=(i*167)%960, y=(i*113)%200; ctx.fillStyle='rgba(255,255,255,'+(0.2+(i%5)*0.1)+')'; ctx.fillRect(x,y,2,2); }
  ctx.textAlign='center';
  ctx.fillStyle = '#ffd966'; ctx.font = 'bold 44px monospace';
  ctx.fillText('CALLED TO SERVE', 480, 150);
  ctx.fillStyle = '#88aacc'; ctx.font = 'bold 18px monospace';
  ctx.fillText('— a missionary story —', 480, 185);
  ctx.fillStyle = '#ddd'; ctx.font = '15px monospace';
  const intro = [
    'You are ELDER YOUNG. Your companion is ELDER SORENSEN.',
    'Together (always together — that\'s the rule) you serve in the',
    'town of Maple Hollow for The Church of Jesus Christ of Latter-day Saints.',
    '',
    'Knock doors. Listen first. Serve freely. Teach the five lessons',
    'from Preach My Gospel. Invite, promise blessings, follow up.',
    'Be home by 9:00 PM for nightly planning.',
    '',
    'Goal: help someone enter the waters of baptism.',
    'Watch your SPIRIT — kindness and service raise it;',
    'arguing and pushing drain it. It changes how people respond.',
    '',
    'WASD / Arrows — walk      E — knock & talk      1-4 / click — choose',
    'Enter — continue      M — music on/off      N — next hymn',
    'On touch screens: tap to walk, tap a door to knock, tap to choose.',
    '♪ A new 8-bit hymn every morning — 31 public-domain hymns in all.',
    'Progress autosaves at the start of each day.',
  ];
  let y = 240; for (const l of intro){ ctx.fillText(l, 480, y); y+=24; }
  ctx.fillStyle = '#ffee99'; ctx.font = 'bold 17px monospace';
  const sv = savedGame();
  if (Math.floor(performance.now()/500)%2) {
    ctx.fillText(sv ? `[ Enter — continue Day ${sv.day} ]` : '[ Press ENTER to begin Day 1 ]', 480, 578);
  }
  if (sv) { ctx.fillStyle = '#8aa'; ctx.font = '13px monospace'; ctx.fillText('[ R — start a new mission ]', 480, 602); }
  ctx.textAlign='left';
}
function summaryLines() {
  const d = k => stats[k] - dayStats[k];
  return [
    `${dayName(day)}, Day ${day} — 9:00 PM. Home for nightly planning.`,
    `Elder Sorensen reads the key indicators aloud while you fill in`,
    `the area book:`,
    ``,
    `   Doors knocked ............... ${d('doors')}`,
    `   Gospel conversations ........ ${d('convos')}`,
    `   Pass-along cards ............ ${d('cards')}`,
    `   Copies of the Book of Mormon  ${d('boms')}`,
    `   Return appointments set ..... ${d('appts')}`,
    `   New friends taught .......... ${d('friends')}`,
    `   Lessons taught .............. ${d('lessons')}`,
    `   Acts of service ............. ${d('service')}`,
    `   Friends at church ........... ${d('atChurch')}`,
    `   Baptismal dates set ......... ${d('bapDates')}`,
    `   ★ Baptisms .................. ${d('baptisms')}`,
    ``,
    `MISSION TOTALS — Lessons ${stats.lessons} • BoM ${stats.boms} • Baptisms ${stats.baptisms}`,
    ``,
    `9:30 PM — planning tomorrow. 10:30 PM — lights out.`,
    `(Elder Sorensen is asleep in under a minute. Unbelievable.)`,
  ];
}

