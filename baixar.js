// Baixar: detecta o sistema, põe o card dele em primeiro e mostra versão, tamanho e SHA-256 (do downloads-data.js).
(() => {
  const D = window.DOWNLOADS || { versao: null, arquivos: {} };
  const ua = navigator.userAgent;
  const so = /Android/i.test(ua) ? 'android' : /iPhone|iPad|iPod/i.test(ua) ? 'ios' : /Windows/i.test(ua) ? 'win' : /Linux|X11/i.test(ua) ? 'linux' : /Mac/i.test(ua) ? 'mac' : null;
  const NOMES = { win: 'Windows', linux: 'Linux', android: 'Android', ios: 'iPhone', mac: 'macOS' };
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const fmtData = (d) => { const [y, m, dia] = d.split('-'); return `${+dia} ${MESES[m - 1]} ${y}`; };
  const mb = (b) => (b / 1048576).toFixed(1).replace('.', ',') + ' MB';
  const dl = document.getElementById('dl');

  const detect = document.getElementById('detect');
  if (so === 'ios') detect.innerHTML = 'Você está num <b>iPhone</b>: para jogar não precisa baixar nada, e o painel do host abre no navegador pelo QR do PC.';
  else if (so === 'mac') detect.innerHTML = 'Você está num <b>Mac</b>: o app do host ainda não tem versão para macOS. Dá para rodar pelo terminal (<a class="link" href="host.html#caminho">guia do host</a>).';
  else if (so) detect.innerHTML = `Detectamos <b>${NOMES[so]}</b>: o arquivo certo está em primeiro.`;

  document.querySelectorAll('.dl-card[data-arq]').forEach((card) => {
    const a = D.arquivos[card.dataset.arq];
    const meta = card.querySelector('.dl-meta');
    if (card.dataset.so === so) { card.classList.add('seu'); dl.prepend(card); }
    if (!a) { card.classList.add('falta'); meta.innerHTML = '<span>Ainda não tem arquivo aqui (rode <b>node site/atualizar.mjs</b> depois do build).</span>'; return; }
    const velha = a.versao && D.versao && a.versao !== D.versao;
    const btn = card.querySelector('.dl-btn');
    if (D.releases && location.hostname.endsWith('github.io')) {
      // publicado (GitHub Pages): os arquivos ficam nas Releases do repositório do site
      btn.href = `${D.releases}/${card.dataset.arq}`;
    } else {
      // local: confere se a cópia existe em downloads/ (fora do Git)
      fetch(btn.getAttribute('href'), { method: 'HEAD' }).then((r) => { if (!r.ok) throw 0; }).catch(() => {
        card.classList.add('falta');
        btn.innerHTML = 'Ainda não publicado aqui';
        btn.removeAttribute('download');
      });
    }
    meta.innerHTML = `${a.versao ? `<span class="${velha ? 'velha' : ''}"><b>v${a.versao}</b>${velha ? ` (a ${D.versao} ainda não foi empacotada para cá)` : ''}</span>` : ''}<span>${mb(a.tamanho)}</span><span>gerado em ${fmtData(a.data)}</span>`;
  });

  document.getElementById('shaBody').innerHTML = Object.entries(D.arquivos).map(([nome, a]) =>
    `<tr><td><b>${nome}</b><br><span class="muted">${mb(a.tamanho)}</span></td><td>${a.versao ? 'v' + a.versao : '—'}</td><td>${fmtData(a.data)}</td>
      <td><code>${a.sha256}</code> <button type="button" class="btn ghost sm" data-copy="${a.sha256}" style="margin-top:6px">copiar</button></td></tr>`).join('')
    || '<tr><td colspan="4">Nenhum arquivo ainda.</td></tr>';
})();
