// ---------------- main loop ----------------
function frame(now) {
  const dt = Math.min(50, now - last); last = now;
  update(dt);
  // world
  lctx.fillStyle = '#467f36'; lctx.fillRect(0,0,LW,LH);
  drawWorld();
  // weather
  if (weather === 'rain') {
    lctx.fillStyle = 'rgba(40,50,90,0.16)'; lctx.fillRect(0,0,LW,LH);
    lctx.strokeStyle = 'rgba(190,205,235,0.4)'; lctx.lineWidth = 1;
    const tn = performance.now();
    for (let i = 0; i < 42; i++) {
      const x = ((i*131) + (tn/3|0)) % (LW+20) - 10, y = ((i*89) + (tn/2.2|0)) % LH;
      lctx.beginPath(); lctx.moveTo(x, y); lctx.lineTo(x-2, y+7); lctx.stroke();
    }
  } else if (weather === 'hot') { lctx.fillStyle = 'rgba(255,180,60,0.07)'; lctx.fillRect(0,0,LW,LH); }
  // evening tint
  if (time > 1080) {
    const k = Math.min(0.45, (time-1080)/400);
    lctx.fillStyle = `rgba(20,20,60,${k})`; lctx.fillRect(0,0,LW,LH);
  }
  ctx.clearRect(0,0,960,624);
  ctx.drawImage(lo, 0, 0, LW, LH, 0, 0, 960, 624);
  drawHUD();
  if (mode === 'play') drawMinimap();
  if (mode === 'title') drawTitle();
  else if (mode === 'daystart') drawModal('MISSIONARY DAILY SCHEDULE', dayLines, isPday(day) ? '[ Enter — start P-Day ]' : '[ Enter — personal study ]', '#ffd966');
  else if (mode === 'study') drawStudy();
  else if (mode === 'pday') drawPdayHub();
  else if (mode === 'minigame') { if (MG && MG.draw) MG.draw(); }
  else if (mode === 'mgresult') drawModal('P-DAY', mgResult || [], time >= 1080 ? '[ Enter — back to work ]' : '[ Enter — back to P-Day ]', '#9ce');
  else if (mode === 'areabook') drawAreaBook();
  else if (mode === 'goals') drawGoals();
  else if (mode === 'dlg') drawDlg();
  else if (mode === 'summary') drawModal('NIGHTLY PLANNING — KEY INDICATORS', summaryLines(), goalsPending() ? '[ Enter — weekly planning ]' : '[ Enter — next day ]', '#88ccff');
  else if (mode === 'ceremony') drawModal('★  A BAPTISM  ★', ceremonyText, '[ Enter — the work goes on ]', '#88ddff');
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
</script>
</body>
</html>
