// ---------------- main loop ----------------
function frame(now) {
  const dt = Math.min(50, now - last); last = now;
  update(dt);
  // world
  lctx.fillStyle = '#467f36'; lctx.fillRect(0,0,LW,LH);
  drawWorld();
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
  else if (mode === 'daystart') drawModal('MISSIONARY DAILY SCHEDULE', dayLines, '[ Enter — personal study ]', '#ffd966');
  else if (mode === 'study') drawStudy();
  else if (mode === 'dlg') drawDlg();
  else if (mode === 'summary') drawModal('NIGHTLY PLANNING — KEY INDICATORS', summaryLines(), '[ Enter — next day ]', '#88ccff');
  else if (mode === 'ceremony') drawModal('★  A BAPTISM  ★', ceremonyText, '[ Enter — the work goes on ]', '#88ddff');
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
</script>
</body>
</html>
