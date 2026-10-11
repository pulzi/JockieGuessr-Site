// Página inicial: o palco (telão + celular jogando sozinhos), o corretor de verdade,
// a roleta das rodadas especiais, o cupom de pontos, juntos/à distância e o karaokê.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ic = (n) => (window.ic ? window.ic(n) : '');
  const fmt = (n) => (Number.isInteger(n) ? String(n) : String(n).replace('.', ','));
  const sinal = (n) => (n > 0 ? '+' : n < 0 ? '−' : '') + fmt(Math.abs(n));
  const sugerir = (window.Corretor && window.Corretor.sugerir) || (() => ({ valor: 'wrong', motivo: '' }));

  // Regras padrão do jogo (server/game.js: REGRAS_PADRAO)
  const PONTOS = { title: 2, artist: 2, kind: 1, album: 2 };
  const VELOCIDADE = [3, 2, 1];
  const valorDe = (campo, av) => (av === 'ok' ? PONTOS[campo] : av === 'partial' ? PONTOS[campo] / 2 : 0);

  // Só anima o que está na tela
  function quandoVisivel(el, fn) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(true); return; }
    new IntersectionObserver((es) => es.forEach((e) => fn(e.isIntersecting)), { rootMargin: '80px' }).observe(el);
  }

  /* =====================================================================
     PALCO: uma rodada de mentira, em loop
     ===================================================================== */
  const tv = $('#tv'), ph = $('#ph');
  if (tv && ph) {
    const JOG = [
      { n: 'Bia', c: '#e0559b' }, { n: 'Caio', c: '#4c8dff' }, { n: 'Duda', c: '#2fb36d' }, { n: 'Enzo', c: '#a55eea' }, { n: 'Você', c: '#ff6b35', eu: true },
    ];
    // Músicas inventadas para a demonstração (capa feita em CSS)
    const MUSICAS = [
      { t: 'Fita Cassete', a: 'Lua Laranja', k: 'album', al: 'Lado B', capa: ['linear-gradient(170deg,#ffb347,#ff6b35 55%,#3b1d4a)', '#ffd166', '#3b1d4a', '#ff6b35', '#ffd166'],
        palpite: { t: 'fita casete', a: 'lua laranja', k: 'album' },
        outros: [{ t: 'ok', a: 'ok', k: 'ok', al: 'ok', ms: 2 }, { t: 'ok', a: 'partial', k: 'wrong', al: 'wrong', ms: 4 }, { t: 'wrong', a: 'ok', k: 'ok', al: 'wrong', ms: 1 }, { t: 'partial', a: 'ok', k: 'ok', al: 'wrong', ms: 3 }] },
      { t: 'Neon de Domingo', a: 'Os Elétricos', k: 'single', al: '', capa: ['linear-gradient(170deg,#3a7bd5,#6a3093)', '#ff5d8f', '#1a1a40', '#6a3093', '#ff5d8f'],
        palpite: { t: 'neon de domingo', a: 'eletricos', k: 'single' },
        outros: [{ t: 'ok', a: 'ok', k: 'wrong', ms: 3 }, { t: 'wrong', a: 'wrong', k: 'ok', ms: 1 }, { t: 'ok', a: 'ok', k: 'ok', ms: 2 }, { t: 'partial', a: 'wrong', k: 'ok', ms: 4 }] },
      { t: 'Maré Alta', a: 'Brisa & Coral', k: 'ep', al: 'Verão Eterno', capa: ['linear-gradient(170deg,#43e8d8,#1e9bd7 50%,#0b3d5c)', '#fff3b0', '#0b3d5c', '#1e9bd7', '#fff3b0'],
        palpite: { t: 'mare alta', a: 'brisa', k: 'album' },
        outros: [{ t: 'ok', a: 'ok', k: 'ok', al: 'partial', ms: 1 }, { t: 'ok', a: 'ok', k: 'wrong', al: 'wrong', ms: 2 }, { t: 'wrong', a: 'partial', k: 'ok', al: 'wrong', ms: 4 }, { t: 'ok', a: 'wrong', k: 'wrong', al: 'wrong', ms: 3 }] },
    ];
    const ROTULO = { single: 'Single', album: 'Álbum', ep: 'EP' };
    const players = $('#tvPlayers');
    players.innerHTML = JOG.map((j, i) => `<div class="tv-p${j.eu ? ' eu' : ''}" data-i="${i}"><span class="av" style="--c:${j.c}">${j.n[0]}</span><span class="ok">✓</span>${j.n}</div>`).join('');
    const pEls = $$('.tv-p', players);

    // ----- onda do telão -----
    const cv = $('#tvWave'), g = cv.getContext('2d');
    let W = 0, H = 0;
    const tamanho = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0); };
    tamanho();
    if ('ResizeObserver' in window) new ResizeObserver(tamanho).observe(cv); else addEventListener('resize', tamanho);
    const N = 56, fase = Array.from({ length: N }, () => Math.random() * 6.28), vel = Array.from({ length: N }, () => 1.6 + Math.random() * 2.6);
    let amp = 1, ampAlvo = 1, rodando = false, raf = 0;
    function onda(t) {
      amp += (ampAlvo - amp) * 0.06;
      g.clearRect(0, 0, W, H);
      const bw = W / N, grad = g.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, '#ff6b35'); grad.addColorStop(0.5, '#ff9f43'); grad.addColorStop(1, '#ffd166');
      g.fillStyle = grad;
      const s = t / 1000, batida = 0.65 + 0.35 * Math.pow(Math.abs(Math.sin(s * 3.6)), 6);
      for (let i = 0; i < N; i++) {
        const env = Math.sin((i / (N - 1)) * Math.PI) * 0.8 + 0.2;
        const v = (0.25 + 0.75 * Math.abs(Math.sin(s * vel[i] + fase[i]) * Math.cos(s * 0.7 + i * 0.3))) * env * batida * amp;
        const h = Math.max(2, v * H * 0.92), w = bw * 0.62;
        const x = i * bw + (bw - w) / 2, y = (H - h) / 2;
        g.beginPath();
        g.roundRect ? g.roundRect(x, y, w, h, w / 2) : g.rect(x, y, w, h);
        g.fill();
      }
      if (rodando) raf = requestAnimationFrame(onda);
    }
    // ----- onda do celular -----
    const phBars = $$('#phWave i');
    let phT = 0;
    const ondaCel = () => phBars.forEach((b) => { b.style.height = (18 + Math.random() * 78 * amp) + '%'; });

    // ----- reações -----
    const fly = $('#tvFly');
    function reagir(emoji, nome) {
      const el = document.createElement('div');
      el.className = 'voa';
      el.style.left = (8 + Math.random() * 80) + '%';
      el.style.setProperty('--dx', (Math.random() * 16 - 8) + 'cqw');
      el.style.setProperty('--r', (Math.random() * 30 - 15) + 'deg');
      el.innerHTML = `<b>${emoji}</b><span>${nome}</span>`;
      fly.appendChild(el);
      setTimeout(() => el.remove(), 2700);
    }
    let ultima = 0;
    $$('#phReacts button').forEach((b) => b.addEventListener('click', () => {
      // o servidor de verdade deixa no máximo 6 a cada 4 s por pessoa (com meio segundo entre elas)
      const agora = performance.now();
      if (agora - ultima < 350) return;
      ultima = agora;
      reagir(b.textContent, 'Você');
    }));

    // ----- a rodada -----
    let rodada = 3, mi = 0, timers = [];
    const depois = (ms, fn) => timers.push(setTimeout(fn, ms));
    const limpar = () => { timers.forEach(clearTimeout); timers = []; };
    const tTitle = $('#phTitle'), tArtist = $('#phArtist'), segs = $$('#phSegs i'), send = $('#phSend');
    const marca = (v) => `<i class="m-${v}">${v === 'ok' ? '✓' : v === 'partial' ? '~' : '✗'}</i>`;

    function pontuar(m, marcas) {
      // marcas: [{t,a,k,al,ms}] na ordem de JOG; devolve pontos de cada um (regras padrão)
      const campos = ['t', 'a', 'k', ...(m.k === 'single' ? [] : ['al'])];
      const nomeCampo = { t: 'title', a: 'artist', k: 'kind', al: 'album' };
      const base = marcas.map((x) => campos.reduce((s, c) => s + valorDe(nomeCampo[c], x[c] || 'wrong'), 0));
      const acertaram = marcas.map((x, i) => ({ i, ms: x.ms, ok: ['ok', 'partial'].includes(x.t) && ['ok', 'partial'].includes(x.a) }))
        .filter((x) => x.ok).sort((a, b) => a.ms - b.ms);
      const bonus = {};
      acertaram.slice(0, VELOCIDADE.length).forEach((x, k) => { bonus[x.i] = VELOCIDADE[k]; });
      return marcas.map((x, i) => ({ total: base[i] + (bonus[i] || 0), bonus: bonus[i] || 0, campos }));
    }

    function digitar(el, txt, t0, passo) {
      el.classList.add('foco');
      [...txt].forEach((ch, i) => depois(t0 + i * passo, () => { el.textContent += ch; }));
      depois(t0 + txt.length * passo + 60, () => el.classList.remove('foco'));
      return t0 + txt.length * passo + 160;
    }

    function setFase(f) { tv.dataset.fase = f; ph.dataset.fase = f; }

    function abrir() {
      limpar();
      const m = MUSICAS[mi % MUSICAS.length];
      setFase('abertos');
      ampAlvo = 1;
      $('#tvRodada').textContent = `Rodada ${rodada} de 10`;
      const fc = $('#tvFase'); fc.className = 'chip hot'; fc.textContent = 'Palpites abertos';
      $('#phChip').className = 'chip hot'; $('#phChip').textContent = 'ao vivo';
      $('#phRodada').textContent = `Rodada ${rodada} · seu palpite`;
      $('#tvConta').textContent = 'Valendo!';
      pEls.forEach((p) => p.classList.remove('foi'));
      tTitle.textContent = ''; tArtist.textContent = ''; segs.forEach((s) => s.classList.remove('on'));
      send.className = 'ph-send'; send.textContent = 'Mandar palpite';
      // a barra de tempo esvazia em 9 s
      const barra = $('#tvTimer');
      barra.style.transition = 'none'; barra.style.transform = 'scaleX(1)';
      void barra.offsetWidth;
      barra.style.transition = 'transform 9s linear'; barra.style.transform = 'scaleX(0)';
      // os outros palpitam em tempos diferentes
      m.outros.forEach((o, i) => depois(1200 + o.ms * 1300 + Math.random() * 500, () => pEls[i].classList.add('foi')));
      // você digita no celular
      let t = digitar(tTitle, m.palpite.t, 900, 95);
      t = digitar(tArtist, m.palpite.a, t + 200, 95);
      depois(t + 250, () => { segs[{ single: 0, album: 1, ep: 2 }[m.palpite.k]].classList.add('on'); });
      depois(t + 800, () => send.classList.add('aperta'));
      depois(t + 950, () => { send.classList.remove('aperta'); send.classList.add('enviado'); send.textContent = '✓ Palpite enviado'; pEls[4].classList.add('foi'); });
      depois(9000, fechar);
    }

    function fechar() {
      setFase('fechado');
      ampAlvo = 0.45;
      const fc = $('#tvFase'); fc.className = 'chip gold'; fc.textContent = 'Fechado';
      depois(1500, revelar);
    }

    function revelar() {
      const m = MUSICAS[mi % MUSICAS.length];
      // o seu palpite passa pelo corretor de verdade
      const eu = { t: sugerir('title', m.palpite.t, m.t), a: sugerir('artist', m.palpite.a, m.a), k: { valor: m.palpite.k === m.k ? 'ok' : 'wrong', motivo: '' }, al: { valor: 'wrong', motivo: 'em branco' } };
      const marcas = [...m.outros, { t: eu.t.valor, a: eu.a.valor, k: eu.k.valor, al: 'wrong', ms: 2.5 }];
      const pts = pontuar(m, marcas);
      const c = $('#capa');
      c.style.setProperty('--capa-bg', m.capa[0]); c.style.setProperty('--capa-sol', m.capa[1]); c.style.setProperty('--capa-chao', m.capa[2]);
      tv.style.setProperty('--capa1', m.capa[3]); tv.style.setProperty('--capa2', m.capa[4]);
      $('#capaTxt').textContent = m.al || m.t;
      $('#revTipo').textContent = ROTULO[m.k] + (m.al ? ' · ' + m.al : '');
      $('#revTitulo').textContent = m.t;
      $('#revArtista').innerHTML = `${m.a}`;
      const ordem = JOG.map((j, i) => ({ j, i, p: pts[i] })).sort((a, b) => b.p.total - a.p.total);
      $('#revList').innerHTML = ordem.map(({ j, i, p }) => `<div class="rev-row${j.eu ? ' eu' : ''}"><span class="av" style="--c:${j.c}">${j.n[0]}</span><span class="nome">${j.n}</span>
        <span class="marcas">${p.campos.map((cp) => marca(marcas[i][cp] || 'wrong')).join('')}</span>${p.bonus ? `<span class="raio">⚡+${p.bonus}</span>` : ''}<span class="pts">+${fmt(p.total)}</span></div>`).join('');
      // o celular mostra o seu resultado
      const meu = pts[4];
      const linha = (nome, r, campo) => `<div class="ph-tag ${r.valor}"><span>${nome}${r.motivo && r.valor === 'partial' ? `<small>${r.motivo}</small>` : ''}</span><b>${r.valor === 'ok' ? '✓' : r.valor === 'partial' ? '~' : '✗'} +${fmt(valorDe(campo, r.valor))}</b></div>`;
      $('#phRes').innerHTML = `<h5>${m.t}</h5><p>${m.a}</p>${linha('Música', eu.t, 'title')}${linha('Artista', eu.a, 'artist')}${linha('Tipo', eu.k, 'kind')}${m.k !== 'single' ? linha('Álbum', eu.al, 'album') : ''}<div class="ph-total">+${fmt(meu.total)} pontos${meu.bonus ? ` <small>(⚡+${meu.bonus})</small>` : ''}</div>`;
      $('#phChip').className = 'chip ok'; $('#phChip').textContent = 'resultado';
      const fc = $('#tvFase'); fc.className = 'chip ok'; fc.textContent = 'Resultado';
      setFase('revelacao');
      ampAlvo = 0.8;
      // a galera reage
      const EMO = ['🔥', '😂', '😱', '😭', '👏', '💀'];
      [900, 1700, 2600, 3900].forEach((ms, k) => depois(ms, () => reagir(EMO[(Math.random() * EMO.length) | 0], JOG[k].n)));
      depois(7200, cena);
    }

    function cena() {
      rodada = rodada >= 10 ? 1 : rodada + 1;
      mi++;
      $('#cenaN').textContent = rodada;
      const bonus = rodada === 10;
      const ct = $('#cenaTxt'); ct.textContent = bonus ? 'Última · vale dobro' : 'Rodada'; ct.classList.toggle('bonus', bonus);
      setFase('cena');
      depois(2100, abrir);
    }

    let iniciado = false;
    quandoVisivel(tv, (vis) => {
      if (vis && !rodando) {
        rodando = true;
        raf = requestAnimationFrame(onda);
        phT = setInterval(ondaCel, 130);
        if (!iniciado) { iniciado = true; abrir(); }
      } else if (!vis && rodando) {
        rodando = false; cancelAnimationFrame(raf); clearInterval(phT);
      }
    });
  }

  /* =====================================================================
     NÚMEROS contando
     ===================================================================== */
  $$('[data-conta]').forEach((el) => {
    const alvo = +el.dataset.conta;
    if (!alvo || calm) return;
    let feito = false;
    quandoVisivel(el, (vis) => {
      if (!vis || feito) return;
      feito = true;
      const t0 = performance.now();
      (function passo(t) { const k = Math.min(1, (t - t0) / 900); el.textContent = Math.round(alvo * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(passo); })(t0);
    });
  });

  /* =====================================================================
     TESTE O CORRETOR (o mesmo server/corretor.js do jogo)
     ===================================================================== */
  const PRESETS = [
    { nome: 'Bohemian Rhapsody', t: 'Bohemian Rhapsody - Remastered 2011', a: 'Queen', k: 'album', al: 'A Night At The Opera (Deluxe Remastered Version)',
      tente: [['title', 'bohemian rapsody'], ['title', 'bohemian'], ['artist', 'the queen'], ['album', 'a night at the opera']] },
    { nome: 'Get Lucky', t: 'Get Lucky (feat. Pharrell Williams and Nile Rodgers)', a: 'Daft Punk, Pharrell Williams, Nile Rodgers', k: 'album', al: 'Random Access Memories',
      tente: [['title', 'GET LUCKY!!'], ['artist', 'pharrell williams'], ['artist', 'daft punk'], ['album', 'random acess memories']] },
    { nome: 'Evidências', t: 'Evidências', a: 'Chitãozinho & Xororó', k: 'album', al: 'Cowboy do Asfalto',
      tente: [['title', 'evidencias'], ['artist', 'chitaozinho e xororo'], ['artist', 'xororó'], ['title', 'evidência']] },
    { nome: 'Envolver', t: 'Envolver', a: 'Anitta', k: 'single', al: '',
      tente: [['title', 'envolver'], ['artist', 'anita'], ['title', 'envolve']] },
    { nome: 'Under Pressure', t: 'Under Pressure - Remastered 2011', a: 'Queen, David Bowie', k: 'album', al: 'Hot Space (2011 Remaster)',
      tente: [['title', 'pressure'], ['artist', 'david bowie'], ['title', 'under presure'], ['album', 'hot space']] },
  ];
  const presetsEl = $('#presets');
  if (presetsEl) {
    const R = { t: $('#rTitle'), a: $('#rArtist'), al: $('#rAlbum') };
    const G = { title: $('#gTitle'), artist: $('#gArtist'), album: $('#gAlbum') };
    let rKind = 'album', gKind = null;
    const segK = (box, v) => $$('button', box).forEach((b) => b.classList.toggle('on', b.dataset.k === v));

    function badge(el, campo, r, vazio) {
      const antes = el.className;
      if (vazio) { el.className = 'res-badge'; el.innerHTML = `<span class="sym">·</span><span>${campo === 'kind' ? 'escolha para ver' : 'escreva para ver'}</span>`; return; }
      const nome = r.valor === 'ok' ? 'Certo' : r.valor === 'partial' ? 'Parcial' : 'Errado';
      const sym = r.valor === 'ok' ? '✓' : r.valor === 'partial' ? '~' : '✗';
      el.className = `res-badge ${r.valor}`;
      el.innerHTML = `<span class="sym">${sym}</span><span>${nome}${r.motivo ? `<small>${r.motivo}</small>` : ''}</span><b>+${fmt(valorDe(campo, r.valor))}</b>`;
      if (antes !== el.className) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    }

    function corrigir() {
      const single = rKind === 'single';
      $('#rAlbumWrap').hidden = single;
      $('#gAlbumWrap').hidden = single;
      let total = 0, max = 0;
      const resp = { title: R.t.value, artist: R.a.value, album: R.al.value };
      ['title', 'artist', ...(single ? [] : ['album'])].forEach((c) => {
        max += PONTOS[c];
        const v = G[c].value.trim();
        const r = sugerir(c, v, resp[c]);
        badge($('#b' + c[0].toUpperCase() + c.slice(1)), c, r, !v);
        if (v) total += valorDe(c, r.valor);
      });
      max += PONTOS.kind;
      const rk = { valor: gKind && gKind === rKind ? 'ok' : 'wrong', motivo: '' };
      badge($('#bKind'), 'kind', rk, !gKind);
      if (gKind) total += valorDe('kind', rk.valor);
      $('#gTotal').innerHTML = `${fmt(total)} <small>de ${max}</small>`;
    }

    function usarPreset(i) {
      const p = PRESETS[i];
      $$('button', presetsEl).forEach((b, k) => b.classList.toggle('on', k === i));
      R.t.value = p.t; R.a.value = p.a; R.al.value = p.al; rKind = p.k; segK($('#rKind'), rKind);
      Object.values(G).forEach((el) => { el.value = ''; });
      gKind = null; segK($('#gKind'), null);
      const tente = $('#tente');
      tente.innerHTML = '<span>Experimente:</span>' + p.tente.map(([c, v]) => `<button type="button" data-c="${c}" data-v="${v}" data-cursor="testar">${v}</button>`).join('');
      corrigir();
    }

    presetsEl.innerHTML = PRESETS.map((p) => `<button type="button">${p.nome}</button>`).join('');
    $$('button', presetsEl).forEach((b, i) => b.addEventListener('click', () => usarPreset(i)));
    [...Object.values(R), ...Object.values(G)].forEach((el) => el.addEventListener('input', corrigir));
    $$('#rKind button').forEach((b) => b.addEventListener('click', () => { rKind = b.dataset.k; segK($('#rKind'), rKind); corrigir(); }));
    $$('#gKind button').forEach((b) => b.addEventListener('click', () => { gKind = b.dataset.k; segK($('#gKind'), gKind); corrigir(); }));
    $('#tente').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-c]');
      if (!b) return;
      const el = G[b.dataset.c];
      el.value = b.dataset.v;
      corrigir();
      el.focus();
    });
    usarPreset(0);
  }

  /* =====================================================================
     ROLETA (as fatias de server/game.js: ESPECIAIS)
     ===================================================================== */
  const ESP = [
    { id: 'dobro', nome: 'Vale dobro', curto: 'Dobro', ic: 'estrela', txt: 'Tudo o que se ganha na rodada vale ×2, inclusive o bônus de rapidez. Também sai como "rodada bônus" e na última do automático.' },
    { id: 'triplo', nome: 'Vale triplo', curto: 'Triplo', ic: 'estrela', txt: 'Igual ao vale dobro, só que ×3. Bom para virar o placar no fim.' },
    { id: 'relampago', nome: 'Relâmpago', curto: 'Relâmpago', ic: 'raio', txt: '10 s de música e ela para; mais 30 s para digitar. Só o mais rápido que acertar pontua, e vale ×2.' },
    { id: 'heardle', nome: 'Heardle', curto: 'Heardle', ic: 'orelha', txt: 'A música vem aos pouquinhos: 1 s, 3 s, 7 s e 15 s, cada trecho voltando ao começo. Acertou no 1º trecho: +5; no 2º: +3; no 3º: +2; no 4º: +1.' },
    { id: 'quem', nome: 'Quem escolheu?', curto: 'Quem?', ic: 'mascara', txt: 'Só com a playlist dos jogadores: além da música, o formulário pede quem pôs ela na playlist (+2).' },
    { id: 'roubo', nome: 'Roubo', curto: 'Roubo', ic: 'roubo', txt: 'O mais rápido que acertar rouba 2 pontos de quem estava em 1º lugar.' },
    { id: 'letra', nome: 'Só a letra', curto: 'Só a letra', ic: 'microfone', txt: 'Sem som: a letra aparece aos poucos (4 linhas, uma a cada 8 s), sem as linhas com o nome da música. Na revelação, a música toca daquele trecho.' },
    { id: 'completar', nome: 'Complete a letra', curto: 'Complete', ic: 'letra', txt: 'A música toca 10 s antes de uma linha e para no meio dela. Quem completar as 2 palavras que faltam ganha +3 (quase certo, metade).' },
    { id: 'duelo', nome: 'Duelo', curto: 'Duelo', ic: 'duelo', txt: 'Dois sorteados palpitam; vence quem fizer mais pontos na rodada (+2). O resto torce pelo celular, e quem acertar o vencedor ganha +1.' },
    { id: 'artista', nome: 'Mesmo artista', curto: 'Artista', ic: 'album', txt: 'Três músicas seguidas do mesmo artista, valendo só o nome da música (o artista já aparece na tela).' },
    { id: 'normal', nome: 'Rodada normal', curto: 'Normal', ic: 'disco', txt: 'O azar: a roleta parou na fatia sem graça. Rodada comum, com as regras de sempre.' },
  ];
  const roda = $('#roda');
  if (roda) {
    const n = ESP.length, s = 360 / n;
    const CORES = [['#ff6b35', '#1a1006'], ['#29251e', '#f4ede1'], ['#ffd166', '#2a1d02'], ['#f4ede1', '#14120f']];
    const pt = (r, a) => [r * Math.sin(a * Math.PI / 180), -r * Math.cos(a * Math.PI / 180)];
    let svg = '<svg viewBox="-200 -200 400 400" aria-hidden="true">';
    ESP.forEach((e, i) => {
      const [c, tc] = CORES[i % CORES.length];
      const a0 = i * s, a1 = (i + 1) * s, mid = a0 + s / 2;
      const [x0, y0] = pt(200, a0), [x1, y1] = pt(200, a1);
      svg += `<path d="M0 0 L${x0} ${y0} A200 200 0 0 1 ${x1} ${y1} Z" fill="${c}" stroke="#000" stroke-width="3"/>`;
      // o texto corre pelo raio; na metade esquerda, vira para não ficar de cabeça para baixo
      svg += mid <= 180
        ? `<g transform="rotate(${mid - 90})"><text x="182" y="5" text-anchor="end" fill="${tc}">${e.curto}</text></g>`
        : `<g transform="rotate(${mid + 90})"><text x="-182" y="5" text-anchor="start" fill="${tc}">${e.curto}</text></g>`;
    });
    svg += '<circle r="196" fill="none" stroke="#000" stroke-width="4"/>';
    for (let i = 0; i < n; i++) { const [x, y] = pt(188, i * s); svg += `<circle cx="${x}" cy="${y}" r="5" fill="#f4ede1" stroke="#000" stroke-width="2"/>`; }
    roda.innerHTML = svg + '</svg>';

    const card = $('#espCard'), chips = $('#espChips');
    chips.innerHTML = ESP.map((e, i) => `<button type="button" data-i="${i}">${ic(e.ic)} ${e.nome}</button>`).join('');
    function mostrar(i, saiu) {
      const e = ESP[i];
      card.innerHTML = `<span class="esp-num">${String(i + 1).padStart(2, '0')}/${n}</span><div class="ico-box ${saiu ? 'hot' : 'cream'}">${ic(e.ic)}</div><h3>${e.nome}</h3><p>${e.txt}</p>`;
      $$('button', chips).forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
      if (saiu) { card.classList.remove('saiu'); void card.offsetWidth; card.classList.add('saiu'); }
    }
    chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) mostrar(+b.dataset.i); });
    mostrar(2);

    let rot = 0, girando = false;
    const agulha = $('#agulha');
    $('#girar').addEventListener('click', () => {
      if (girando) return;
      girando = true;
      const alvo = (Math.random() * n) | 0;
      const mid = alvo * s + s / 2 + (Math.random() - 0.5) * (s - 8);
      const delta = ((-mid - rot) % 360 + 720) % 360;
      rot += 360 * (calm ? 0 : 5) + delta;
      roda.style.transform = `rotate(${rot}deg)`;
      // a agulha bate a cada fatia que passa
      let ultimaFatia = null;
      const t0 = performance.now();
      (function bater() {
        const m = new DOMMatrix(getComputedStyle(roda).transform);
        const ang = ((Math.atan2(m.b, m.a) * 180 / Math.PI) + 360) % 360;
        const f = Math.floor(ang / s);
        if (ultimaFatia !== null && f !== ultimaFatia) { agulha.classList.remove('bate'); void agulha.offsetWidth; agulha.classList.add('bate'); }
        ultimaFatia = f;
        if (girando && performance.now() - t0 < 6500) requestAnimationFrame(bater);
      })();
      const fim = () => { girando = false; mostrar(alvo, true); if (window.toast) window.toast(`🎲 Saiu: <b>${ESP[alvo].nome}</b>`); };
      if (calm) fim(); else roda.addEventListener('transitionend', fim, { once: true });
    });
  }

  /* =====================================================================
     QUANTO VALE (o cupom): a mesma conta de server/game.js aplicarPontos()
     ===================================================================== */
  const cupom = $('#cupom');
  if (cupom) {
    const CAMPOS = [['title', 'Música'], ['artist', 'Artista'], ['kind', 'Tipo'], ['album', 'Álbum']];
    const st = { kind: 'album', av: { title: 'ok', artist: 'partial', kind: 'ok', album: 'wrong' }, vel: 0, aposta: false, seq: 2, mult: 1 };
    $('#cCampos').innerHTML = CAMPOS.map(([c, nome]) => `<div class="cc" data-c="${c}"><b>${nome}<small>${PONTOS[c]} pt${PONTOS[c] > 1 ? 's' : ''}</small></b><div class="tri">
      <button type="button" data-v="ok">✓ Certo</button><button type="button" data-v="partial">~ Parcial</button><button type="button" data-v="wrong">✗ Errado</button></div></div>`).join('');

    function render() {
      const campos = CAMPOS.filter(([c]) => !(c === 'album' && st.kind === 'single'));
      $$('#cCampos .cc').forEach((el) => {
        const c = el.dataset.c;
        el.classList.toggle('off', c === 'album' && st.kind === 'single');
        $$('button', el).forEach((b) => b.classList.toggle('on', b.dataset.v === st.av[c]));
      });
      $$('#cKind button').forEach((b) => b.classList.toggle('on', b.dataset.k === st.kind));
      $$('#cVel button').forEach((b) => b.classList.toggle('on', +b.dataset.v === st.vel));
      $$('#cMult button').forEach((b) => b.classList.toggle('on', +b.dataset.m === st.mult));
      $('#cSeq').textContent = st.seq;

      const L = [];
      let dosCampos = 0;
      campos.forEach(([c, nome]) => {
        const p = valorDe(c, st.av[c]);
        dosCampos += p;
        L.push([`${nome} ${st.av[c] === 'ok' ? '✓' : st.av[c] === 'partial' ? '~ (metade)' : '✗'}`, sinal(p) || '0', p === 0 ? 'dim' : '']);
      });
      if (st.kind === 'single') L.push(['Álbum (single não tem)', '—', 'dim']);
      const acertou = ['ok', 'partial'].includes(st.av.title) && ['ok', 'partial'].includes(st.av.artist);
      const bonus = acertou && st.vel < VELOCIDADE.length ? VELOCIDADE[st.vel] : 0;
      L.push([acertou ? `Rapidez (${st.vel < 3 ? st.vel + 1 + 'º' : 'depois do 3º'})` : 'Rapidez (sem música e artista)', bonus ? sinal(bonus) : '0', bonus ? '' : 'dim']);
      let extra = 0;
      if (st.aposta) {
        const ap = acertou ? dosCampos : -2;
        extra += ap;
        L.push([acertou ? 'Aposta: campos ×2' : 'Aposta perdida', sinal(ap), ap < 0 ? 'neg' : '']);
      }
      const seqAgora = acertou ? st.seq + 1 : 0;
      const seqPts = acertou && seqAgora >= 3 ? 1 : 0;
      extra += seqPts;
      L.push([acertou ? `Sequência 🔥${seqAgora}${seqAgora < 3 ? ' (a partir de 3)' : ''}` : 'Sequência (quebrou)', seqPts ? '+1' : '0', seqPts ? '' : 'dim']);
      const sub = dosCampos + bonus + extra;
      const total = sub * st.mult;
      const linhas = L.map(([a, b, cls]) => `<div class="l ${cls}"><span>${a}</span><span>${b}</span></div>`).join('');
      cupom.innerHTML = `<h4>Loja de Discos Jockie</h4><div class="sub">cupom da rodada · regras padrão</div><hr>${linhas}<hr>
        <div class="l"><span>Subtotal</span><span>${sinal(sub) || '0'}</span></div>
        ${st.mult > 1 ? `<div class="l"><span>Rodada ${st.mult === 2 ? 'vale dobro' : 'vale triplo'}</span><span>×${st.mult}</span></div>` : ''}
        <hr><div class="tot"><span>TOTAL</span><b class="${total < 0 ? 'neg' : ''}">${sinal(total) || '0'}</b></div>
        <div class="barcode"></div><div class="obs">parcial = metade · o host pode corrigir depois e o placar se ajusta</div>`;
    }
    $('#cCampos').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; st.av[b.closest('.cc').dataset.c] = b.dataset.v; render(); });
    $$('#cKind button').forEach((b) => b.addEventListener('click', () => { st.kind = b.dataset.k; render(); }));
    $$('#cVel button').forEach((b) => b.addEventListener('click', () => { st.vel = +b.dataset.v; render(); }));
    $$('#cMult button').forEach((b) => b.addEventListener('click', () => { st.mult = +b.dataset.m; render(); }));
    $('#cAposta').addEventListener('change', (e) => { st.aposta = e.target.checked; render(); });
    $('#seqMenos').addEventListener('click', () => { st.seq = Math.max(0, st.seq - 1); render(); });
    $('#seqMais').addEventListener('click', () => { st.seq = Math.min(9, st.seq + 1); render(); });
    render();
  }

  /* =====================================================================
     JUNTOS OU À DISTÂNCIA
     ===================================================================== */
  const modo = $('#modo');
  if (modo) {
    const MODOS = {
      juntos: {
        nos: [['disco', 'hot', 'Spotify no PC', 'o host dá o play'], ['som', 'gold', 'Caixa de som', 'o som sai daqui'], ['celular', 'cream', 'Celulares', 'mudos, a onda dança']],
        tab: [['Onde o som toca', 'Na caixa de som do PC'], ['Celulares', 'Mudos (a waveform continua dançando)'], ['Link / QR code', 'O IP do PC na rede Wi-Fi']],
      },
      distancia: {
        nos: [['disco', 'hot', 'Spotify no PC', 'capturado em Opus'], ['nuvem', 'gold', 'Túnel', 'link público do Cloudflare'], ['celular', 'cream', 'Celulares', 'tocam o som']],
        tab: [['Onde o som toca', 'No celular de cada um'], ['Celulares', 'Tocam (toque no aviso "ativar o som")'], ['Link / QR code', 'Público: <code>*.trycloudflare.com</code> ou o seu domínio']],
      },
    };
    function mostrarModo(k) {
      const m = MODOS[k];
      $$('.modos-sw button').forEach((b) => { const on = b.dataset.modo === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
      const no = ([i, cls, b, s]) => `<div class="no"><div class="ico-box ${cls}">${ic(i)}</div><b>${b}</b><span>${s}</span></div>`;
      modo.innerHTML = `<div class="fluxo">${no(m.nos[0])}<div class="cabo"><i></i><i></i></div>${no(m.nos[1])}<div class="cabo"><i></i><i></i></div>${no(m.nos[2])}</div>
        <div class="modo-tab">${m.tab.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('')}</div>`;
    }
    $$('.modos-sw button').forEach((b) => b.addEventListener('click', () => mostrarModo(b.dataset.modo)));
    mostrarModo('juntos');
  }

  /* =====================================================================
     KARAOKÊ: letra inventada, palavra por palavra
     ===================================================================== */
  const kBox = $('#kLinhas');
  if (kBox) {
    const LETRA = [
      { txt: 'Aumenta o som que a rodada começou' },
      { txt: '(começou, começou)', fundo: true },
      { txt: 'Cada um no celular chutando o que tocou' },
      { txt: 'Errou uma letra? Tudo bem, vale metade', dueto: true },
      { solo: 2600 },
      { txt: 'Quem acertar primeiro leva o raio de bônus' },
    ];
    // tempo de cada palavra: as compridas duram mais
    let t = 600;
    const linhas = LETRA.map((l) => {
      if (l.solo) { const o = { solo: true, ini: t, fim: t + l.solo }; t += l.solo; return o; }
      const palavras = l.txt.split(' ').map((w) => { const d = 260 + w.length * 55; const o = { w, ini: t, fim: t + d }; t += d; return o; });
      const o = { ...l, palavras, ini: palavras[0].ini, fim: t };
      t += 450;
      return o;
    });
    const total = t + 900;
    kBox.innerHTML = linhas.map((l) => (l.solo
      ? '<div class="kl k-solo" aria-label="solo"><i></i><i></i><i></i></div>'
      : `<div class="kl${l.fundo ? ' fundo' : ''}${l.dueto ? ' dueto' : ''}">${l.palavras.map((p) => `<span class="kw">${p.w}</span>`).join(' ')}</div>`)).join('');
    const els = $$('.kl', kBox);
    const words = els.map((el) => $$('.kw', el));
    let t0 = 0, rodando = false;
    function quadro(now) {
      const tt = (now - t0) % total;
      let atual = linhas.findIndex((l) => tt >= l.ini - 200 && tt < l.fim + 300);
      if (atual < 0) atual = linhas.findIndex((l) => tt < l.ini);
      if (atual < 0) atual = 0;
      els.forEach((el, i) => {
        // mostra a anterior (apagada), a de agora e a próxima (menor); a voz de fundo vai junto da linha de cima
        const d = i - atual;
        el.hidden = !(d >= -1 && d <= 1) && !(linhas[i].fundo && i - 1 === atual);
        el.classList.toggle('foi', d < 0);
        el.classList.toggle('prox', d > 0 && !(linhas[i].fundo && d === 1));
        const l = linhas[i];
        if (l.solo) {
          const k = (tt - l.ini) / (l.fim - l.ini);
          $$('i', el).forEach((disc, j) => disc.classList.toggle('on', d === 0 && k > j / 3));
          return;
        }
        l.palavras.forEach((p, j) => {
          const k = Math.max(0, Math.min(1, (tt - p.ini) / (p.fim - p.ini)));
          words[i][j].style.setProperty('--p', (k * 100).toFixed(1) + '%');
          words[i][j].classList.toggle('vez', k > 0 && k < 1);
        });
      });
      if (rodando) requestAnimationFrame(quadro);
    }
    quandoVisivel(kBox, (vis) => {
      if (vis && !rodando) { rodando = true; if (!t0) t0 = performance.now(); requestAnimationFrame(quadro); } else if (!vis) rodando = false;
    });
  }
})();
