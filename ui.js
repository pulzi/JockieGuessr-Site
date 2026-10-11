// Transição entre páginas, menu do celular, barra de progresso, botão de topo,
// blocos aparecendo ao rolar, versão atual nos [data-versao] e o toast.
// Tudo o que é animação some para quem pede menos movimento.
(() => {
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- versão (do downloads-data.js, gerado pelo atualizar.mjs) ----------
  const versao = window.DOWNLOADS && window.DOWNLOADS.versao;
  if (versao) document.querySelectorAll('[data-versao]').forEach((el) => { el.textContent = 'v' + versao; });

  // ---------- toast ----------
  let toastEl, toastT;
  window.toast = (msg) => {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 2400);
  };

  // ---------- copiar (qualquer [data-copy]) ----------
  document.addEventListener('click', async (e) => {
    const b = e.target.closest && e.target.closest('[data-copy]');
    if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); window.toast('Copiado!'); } catch { window.toast('Não deu para copiar: selecione e copie à mão'); }
    b.classList.add('ok'); setTimeout(() => b.classList.remove('ok'), 1400);
  });

  // ---------- menu do celular ----------
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.burger');
  if (nav && burger) {
    burger.addEventListener('click', () => {
      const aberto = nav.classList.toggle('aberto');
      burger.setAttribute('aria-expanded', String(aberto));
    });
    nav.querySelectorAll('nav a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('aberto')));
  }

  // ---------- transição entre páginas (cada destino tem a sua) ----------
  const ORDER = { home: 0, manual: 1, host: 2, novidades: 3, baixar: 4 };
  const persona = (path) => {
    const f = path.split('/').pop().replace(/\.html$/, '');
    return ORDER[f] !== undefined ? f : 'home';
  };
  const here = persona(location.pathname);
  const ico = (n) => (window.ic ? window.ic(n) : '');
  const TXT = {
    home: { name: 'Jockie<span>Guessr</span>', sub: 'voltando para o lobby' },
    manual: { ico: 'LADO A', name: 'Manual', sub: 'tirando o disco da capa…' },
    host: { name: 'Host', sub: 'aumentando o som…' },
    novidades: { name: 'Novidades', sub: 'rebobinando as versões' },
    baixar: { ico: ico('baixar'), name: 'Baixar', sub: '<span class="pt-dl"><i></i></span><span class="pt-pct">0%</span>' },
  };
  const OUT_MS = { home: 560, manual: 540, host: 760, novidades: 600, baixar: 720 };
  const ALTURAS = [0.92, 0.7, 1, 0.82, 0.6, 0.95, 0.75, 1, 0.66, 0.88, 0.72, 0.97, 0.8, 0.64];

  function overlay(p, d, state) {
    const el = document.createElement('div');
    el.className = `pt pt-p-${p} pt-d-${d} ${state}`;
    el.setAttribute('aria-hidden', 'true');
    const t = TXT[p];
    const bars = ALTURAS.map((h, i) => `<i style="--n:${d === 'r' ? i : ALTURAS.length - 1 - i};--h:${h}"></i>`).join('');
    el.innerHTML = `<div class="pt-bg"></div><div class="pt-bars">${bars}</div>
      <div class="pt-box"><div class="pt-disc"></div><div class="pt-ico">${t.ico || ''}</div><div class="pt-name">${t.name}</div><div class="pt-sub">${t.sub}</div></div>`;
    document.body.appendChild(el);
    return el;
  }

  // Chegando: o <head> já cobriu a página com a cor do destino; troca pela cortina de verdade e abre
  const m = root.className.match(/pt-p-(\w+)/), md = root.className.match(/pt-d-(\w)/);
  if (root.classList.contains('pt-in') && m) {
    const p = m[1], d = md ? md[1] : 'r';
    const el = overlay(p, d, 'covered');
    root.classList.add('pt-entering');
    root.classList.remove('pt-in');
    let opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      el.classList.replace('covered', 'open');
      setTimeout(() => { el.remove(); root.classList.remove('pt-entering', `pt-p-${p}`, `pt-d-${d}`); }, 1000);
    };
    // abre no segundo quadro; o setTimeout garante mesmo com a aba em segundo plano (sem quadros)
    requestAnimationFrame(() => requestAnimationFrame(open));
    setTimeout(open, 80);
  }

  function isInternal(a, e) {
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.hasAttribute('download') || (a.target && a.target !== '_self')) return false;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return false;
    if (url.pathname === location.pathname && url.search === location.search) return false; // âncora na mesma página
    if (!/(\.html|\/)$/.test(url.pathname) && /\.\w+$/.test(url.pathname)) return false; // arquivo, não página
    return url;
  }

  let leaving = null;
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    const url = isInternal(a, e);
    if (!url || calm) return;
    e.preventDefault();
    if (leaving) return;
    const p = persona(url.pathname);
    const d = ORDER[p] >= ORDER[here] ? 'r' : 'l';
    try { sessionStorage.setItem('pt', JSON.stringify({ p, d })); } catch {}
    leaving = overlay(p, d, 'cover');
    const pct = leaving.querySelector('.pt-pct');
    if (pct) { const t0 = performance.now(); (function tick() { const k = Math.min(1, (performance.now() - t0) / (OUT_MS.baixar - 80)); pct.textContent = Math.round(k * 100) + '%'; if (k < 1) requestAnimationFrame(tick); })(); }
    setTimeout(() => { location.href = url.href; }, OUT_MS[p]);
  });

  // Voltar pelo navegador pode restaurar a página com a cortina fechada
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    if (leaving) { leaving.remove(); leaving = null; }
    try { sessionStorage.removeItem('pt'); } catch {}
  });

  // ---------- barra de progresso de leitura ----------
  const bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);

  // ---------- voltar ao topo (um vinil) ----------
  const top = document.createElement('button');
  top.className = 'to-top';
  top.setAttribute('aria-label', 'Voltar ao topo');
  top.dataset.cursor = 'topo';
  top.innerHTML = ico('cima');
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }));
  document.body.appendChild(top);

  let ticking = false;
  function onScroll() {
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    top.classList.toggle('show', scrollY > innerHeight * 0.9);
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ---------- blocos aparecendo ao rolar ----------
  if (calm || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  window.revelar = (els) => els.forEach((el) => {
    // irmãos entram em cascata
    const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
    el.style.setProperty('--d', Math.min(sib, 6) * 60 + 'ms');
    el.classList.add('reveal');
    io.observe(el);
  });
  window.revelar(document.querySelectorAll('[data-rv], .card, .faq details, .sec-head, .steps > li'));
})();
