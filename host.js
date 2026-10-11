// Guia do host: caminho escolhido, checklist salvo neste navegador e gerador de .env (tudo local).
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ler = (k, padrao) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch { return padrao; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // ---------- caminho: Windows / Linux / terminal ----------
  const sugerida = /Windows/i.test(navigator.userAgent) ? 'win' : /Linux/i.test(navigator.userAgent) && !/Android/i.test(navigator.userAgent) ? 'linux' : 'win';
  let rota = ler('jg-host-rota', sugerida);
  function mostrarRota(r) {
    rota = r;
    gravar('jg-host-rota', r);
    $$('.rotas button').forEach((b) => { const on = b.dataset.rota === r; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
    $$('.rota').forEach((el) => { el.hidden = el.dataset.rota !== r; });
    contar();
  }
  $$('.rotas button').forEach((b) => b.addEventListener('click', () => mostrarRota(b.dataset.rota)));

  // ---------- checklist ----------
  let feitos = ler('jg-host-check', {});
  function contar() {
    // conta só os itens visíveis (o caminho escolhido + os opcionais)
    const itens = $$('.check li').filter((li) => !li.closest('.rota[hidden]'));
    const n = itens.filter((li) => feitos[li.dataset.id]).length;
    $('#pcBar').style.width = (itens.length ? (n / itens.length) * 100 : 0) + '%';
    $('#pcTxt').textContent = `${n} de ${itens.length} feitos`;
  }
  $$('.check li').forEach((li) => {
    li.classList.toggle('feito', !!feitos[li.dataset.id]);
    li.addEventListener('click', (e) => {
      if (e.target.closest('a, button, .cmd')) return;
      feitos[li.dataset.id] = !feitos[li.dataset.id];
      li.classList.toggle('feito', feitos[li.dataset.id]);
      gravar('jg-host-check', feitos);
      contar();
    });
  });
  $('#pcZerar').addEventListener('click', () => {
    feitos = {};
    gravar('jg-host-check', feitos);
    $$('.check li').forEach((li) => li.classList.remove('feito'));
    contar();
  });
  mostrarRota(rota);

  // ---------- gerador de .env (crypto do navegador; nada sai daqui) ----------
  const hex = (n) => [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, '0')).join('');
  const PALAVRAS = ['vinil', 'agulha', 'refrao', 'batida', 'faixa', 'pista', 'solo', 'coro', 'disco', 'som', 'eco', 'grave', 'agudo', 'tom', 'ritmo', 'palco'];
  const senhaNova = () => {
    const r = crypto.getRandomValues(new Uint32Array(4));
    return `${PALAVRAS[r[0] % PALAVRAS.length]}-${PALAVRAS[r[1] % PALAVRAS.length]}-${(r[2] % 900) + 100}-${hex(3)}`;
  };
  let segredo = hex(32);
  const eSenha = $('#eSenha'), ePorta = $('#ePorta'), eUrl = $('#eUrl'), out = $('#eOut');
  eSenha.value = senhaNova();
  let texto = '';
  function gerar() {
    const porta = /^\d{2,5}$/.test(ePorta.value.trim()) ? ePorta.value.trim() : '8790';
    const url = eUrl.value.trim().replace(/\/$/, '');
    texto = `# Senha do painel do host (o link fica /host#k=<senha>)\nHOST_PASSWORD=${eSenha.value.trim()}\n\n# Segredo das sessões: com ele fixo, reiniciar o servidor não derruba ninguém\nSESSION_SECRET=${segredo}\n\nPORT=${porta}\n\n# Endereço público fixo (em branco: o QR usa o IP do PC na rede)\nPUBLIC_URL=${url}\n`;
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    out.innerHTML = texto.split('\n').map((l) => (l.startsWith('#') ? `<span class="c">${esc(l)}</span>` : l.includes('=') ? `<span class="k">${esc(l.split('=')[0])}</span>=${esc(l.slice(l.indexOf('=') + 1))}` : esc(l))).join('\n');
  }
  [eSenha, ePorta, eUrl].forEach((el) => el.addEventListener('input', gerar));
  $('#eNovo').addEventListener('click', () => { eSenha.value = senhaNova(); segredo = hex(32); gerar(); });
  $('#eCopiar').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(texto); window.toast && window.toast('.env copiado: salve na raiz do projeto'); } catch { window.toast && window.toast('Selecione o texto e copie à mão'); }
  });
  gerar();
})();
