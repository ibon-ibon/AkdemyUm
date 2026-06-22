/* ================================================================
   CHARTS — простые графики на Canvas без зависимостей
   ================================================================ */

const Charts = {
  drawActivity(canvas, days) {
    if (!canvas) return;
    const ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    const padding = { top: 20, right: 10, bottom: 30, left: 30 };
    const cw = w - padding.left - padding.right;
    const ch = h - padding.top - padding.bottom;

    const max = Math.max(1, ...days.map(d => d.count));
    const barW = cw / days.length * 0.7;
    const gap = cw / days.length * 0.3;

    // axes
    const isLight = document.documentElement.dataset.theme === "light";
    const textColor = isLight ? "#6b7593" : "#9aa3c2";
    const gridColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (ch / 4) * i;
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + cw, y);
    }
    ctx.stroke();

    // bars
    const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + ch);
    grad.addColorStop(0, "#7c5cff");
    grad.addColorStop(1, "#00d4ff");

    days.forEach((d, i) => {
      const x = padding.left + i * (cw / days.length) + gap / 2;
      const barH = (d.count / max) * ch;
      const y = padding.top + ch - barH;
      ctx.fillStyle = d.count > 0 ? grad : gridColor;
      ctx.beginPath();
      const r = Math.min(4, barW / 2);
      ctx.roundRect ? ctx.roundRect(x, y, barW, Math.max(barH, 2), r) : ctx.rect(x, y, barW, Math.max(barH, 2));
      ctx.fill();

      // подпись дня
      ctx.fillStyle = textColor;
      ctx.font = "11px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.label, x + barW / 2, h - 10);

      // значение сверху
      if (d.count > 0) {
        ctx.fillStyle = textColor;
        ctx.font = "10px -apple-system, sans-serif";
        ctx.fillText(d.count, x + barW / 2, y - 4);
      }
    });
  },

  drawRing(canvas, percent) {
    if (!canvas) return;
    const ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const size = Math.min(w, h);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2, cy = size / 2, r = size / 2 - 8;
    const start = -Math.PI / 2;
    const end = start + 2 * Math.PI * percent;

    // фон
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 8;
    ctx.stroke();

    // прогресс
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, "#7c5cff");
    grad.addColorStop(1, "#00d4ff");
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();

    // текст
    ctx.fillStyle = "#e9edff";
    ctx.font = "bold 22px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(Math.round(percent * 100) + "%", cx, cy);
  }
};
