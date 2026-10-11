// Manual e guia do host: o índice acompanha a rolagem, a busca filtra as seções, "/" foca a busca.
(() => {
  const sections = [...document.querySelectorAll('.doc section')];
  const links = [...document.querySelectorAll('#tocNav a')];
  const groups = [...document.querySelectorAll('.toc-group')];
  const toc = document.getElementById('toc');
  const q = document.getElementById('q');
  const noResults = document.getElementById('noResults');
  const toggle = document.getElementById('tocToggle');
  if (!toc || !q) return;

  const linkFor = (id) => links.find((a) => a.getAttribute('href') === '#' + id);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove('on'));
      const a = linkFor(e.target.id);
      if (a) { a.classList.add('on'); if (innerWidth > 920) a.scrollIntoView({ block: 'nearest' }); }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach((s) => spy.observe(s));

  const fecharToc = () => { toc.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  links.forEach((a) => a.addEventListener('click', () => {
    const s = document.querySelector(a.getAttribute('href'));
    if (s) { s.classList.remove('flash'); void s.offsetWidth; s.classList.add('flash'); }
    fecharToc();
  }));
  toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded', String(toc.classList.toggle('open'))));

  // busca: texto da seção + palavras-chave (data-k), sem acento
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const index = sections.map((s) => norm(s.textContent + ' ' + (s.dataset.k || '')));
  q.addEventListener('input', () => {
    const terms = norm(q.value.trim()).split(/\s+/).filter(Boolean);
    let shown = 0;
    sections.forEach((s, i) => {
      const hit = terms.every((t) => index[i].includes(t));
      s.classList.toggle('hide', !hit);
      const a = linkFor(s.id);
      if (a) a.classList.toggle('hide', !hit);
      if (hit) shown++;
    });
    groups.forEach((g) => {
      let el = g.nextElementSibling, any = false;
      while (el && el.tagName === 'A') { if (!el.classList.contains('hide')) any = true; el = el.nextElementSibling; }
      g.classList.toggle('hide', !any);
    });
    noResults.hidden = shown > 0;
  });

  addEventListener('keydown', (e) => {
    const typing = /input|textarea|select/i.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); q.focus(); }
    if (e.key === 'Escape' && document.activeElement === q) { q.value = ''; q.dispatchEvent(new Event('input')); q.blur(); }
  });
})();
