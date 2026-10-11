// Cursor personalizado: um vinil que segue o mouse com atraso e gira conforme a velocidade,
// notinhas (♪ ♫) saindo quando o mouse corre e uma explosão de notas no clique.
// Elementos com data-cursor="texto" mostram o texto dentro do disco.
// Fica desligado no touch e para quem pede menos animação (o cursor normal volta).
(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || calm) return;

  const root = document.documentElement;
  const dot = document.createElement('div');
  const disc = document.createElement('div');
  const label = document.createElement('span');
  const canvas = document.createElement('canvas');
  dot.className = 'cur-dot';
  disc.className = 'cur-disc';
  disc.innerHTML = '<div class="cd"></div>';
  label.className = 'cur-label';
  canvas.className = 'cur-fx';
  disc.appendChild(label);
  document.body.append(canvas, disc, dot);
  root.classList.add('has-cursor');

  const ctx = canvas.getContext('2d');
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener('resize', resize);

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const pos = { x: mouse.x, y: mouse.y };
  let last = { x: mouse.x, y: mouse.y };
  let visible = false, angle = 0, travel = 0;
  const notes = [];
  const COLORS = ['#ff6b35', '#ff9f43', '#ffd166', '#f4ede1'];
  const GLYPHS = ['♪', '♫', '♬', '♩'];
  const pick = (a) => a[(Math.random() * a.length) | 0];

  function burst(x, y) {
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
      const v = 2.2 + Math.random() * 3;
      notes.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 46, max: 46, s: 13 + Math.random() * 10, g: pick(GLYPHS), c: pick(COLORS), rot: (Math.random() - 0.5) * 0.6 });
    }
  }

  addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (!visible) { visible = true; pos.x = mouse.x; pos.y = mouse.y; last = { ...mouse }; root.classList.add('cur-on'); }
    const d = Math.hypot(mouse.x - last.x, mouse.y - last.y);
    travel += d;
    // uma notinha a cada ~90 px andados (só quando o mouse corre)
    if (travel > 90 && d > 8) {
      travel = 0;
      notes.push({ x: mouse.x, y: mouse.y, vx: (Math.random() - 0.5) * 0.8, vy: -0.6 - Math.random() * 0.6, life: 40, max: 40, s: 12 + Math.random() * 6, g: pick(GLYPHS), c: pick(COLORS), rot: (Math.random() - 0.5) * 0.4 });
    }
    last = { x: mouse.x, y: mouse.y };
  }, { passive: true });

  document.addEventListener('mouseleave', () => { visible = false; root.classList.remove('cur-on'); });
  addEventListener('mousedown', () => { root.classList.add('cur-down'); burst(mouse.x, mouse.y); });
  addEventListener('mouseup', () => root.classList.remove('cur-down'));

  const HOVER = 'a, button, summary, [role="tab"], label, select, .card, [data-cursor]';
  const TEXT = 'input:not([type=checkbox]):not([type=radio]):not([type=range]), textarea, [contenteditable]';
  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (!t.closest) return;
    const text = t.closest(TEXT);
    const hit = !text && t.closest(HOVER);
    root.classList.toggle('cur-text', !!text);
    root.classList.toggle('cur-hover', !!hit);
    const tip = hit && (hit.dataset.cursor || (hit.closest('[data-cursor]') || {}).dataset?.cursor);
    label.textContent = tip || '';
    root.classList.toggle('cur-has-label', !!tip);
  });

  function frame() {
    const dx = mouse.x - pos.x, dy = mouse.y - pos.y;
    pos.x += dx * 0.2;
    pos.y += dy * 0.2;
    // o disco gira mais rápido quanto mais o mouse corre (e sempre um pouquinho)
    angle += 0.02 + Math.min(Math.hypot(dx, dy), 120) * 0.006;
    dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    disc.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    disc.firstChild.style.transform = `rotate(${angle}rad)`;

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i];
      n.x += n.vx; n.y += n.vy; n.vy += 0.07; n.vx *= 0.98;
      if (--n.life <= 0) { notes.splice(i, 1); continue; }
      const k = n.life / n.max;
      ctx.save();
      ctx.globalAlpha = Math.min(1, k * 1.6);
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rot * (1 - k) * 3);
      ctx.font = `800 ${n.s}px "DM Sans", sans-serif`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000';
      ctx.strokeText(n.g, 0, 0);
      ctx.fillStyle = n.c;
      ctx.fillText(n.g, 0, 0);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
