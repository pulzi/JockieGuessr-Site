// Novidades: monta as versões do changelog-data.js (gerado do CHANGELOG.md), com busca, filtro por área e o roadmap.
(() => {
  const $ = (s) => document.querySelector(s);
  const data = window.CHANGELOG || [];
  const AREAS = window.AREAS || [];
  const RM = window.ROADMAP || { proximos: [], guardado: [] };
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const fmtData = (d) => { const [y, m, dia] = d.split('-'); return `${+dia} ${MESES[m - 1]} ${y}`; };
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const lancadas = data.filter((v) => v.data);
  const atual = lancadas[0];

  $('#resumo').textContent = lancadas.length
    ? `${lancadas.length} versões, de ${fmtData(lancadas[lancadas.length - 1].data)} até ${fmtData(atual.data)}. A atual é a ${atual.v}.`
    : 'O changelog ainda não foi gerado (rode node site/atualizar.mjs).';

  const tl = $('#timeline'), discos = $('#discos');
  const itens = data.map((v) => {
    const forno = !v.data;
    const li = document.createElement('li');
    li.className = 'ver' + (v === atual ? ' atual' : '') + (forno ? ' forno' : '');
    li.id = forno ? 'forno' : 'v' + v.v;
    li.innerHTML = `
      <div class="ver-capa">
        <a class="ver-n" href="#${li.id}" data-cursor="link">${forno ? 'No forno' : 'v' + v.v}</a>
        <div class="ver-meta">
          ${forno ? '<span class="chip gold">ainda não lançado</span>' : `<time datetime="${v.data}">${fmtData(v.data)}</time>`}
          ${v === atual ? '<span class="chip hot">atual</span>' : ''}
          ${!forno && v.v.endsWith('.0.0') ? '<span class="chip">versão grande</span>' : ''}
        </div>
      </div>
      ${v.resumo ? `<p class="ver-resumo">${v.resumo}</p>` : ''}
      ${v.grupos.map((g) => `<div class="ver-g" data-area="${g.area}">${g.area ? `<h4>${g.area}</h4>` : ''}<ul>${g.itens.map((it) => `<li>${it}</li>`).join('')}</ul></div>`).join('')}`;
    li.dataset.texto = norm(li.textContent);
    tl.appendChild(li);
    const a = document.createElement('a');
    a.href = '#' + li.id;
    if (v === atual) a.className = 'atual';
    a.innerHTML = `<span class="vinil"></span><div><b>${forno ? 'No forno' : 'v' + v.v}</b><span>${forno ? 'a lançar' : fmtData(v.data)}</span></div>`;
    discos.appendChild(a);
    return li;
  });

  // áreas (a legenda do CHANGELOG), com quantas versões têm cada uma
  let area = null;
  const areasEl = $('#areas');
  const areaDe = (g) => g.split(' ')[0];
  const usadas = AREAS.filter((a) => data.some((v) => v.grupos.some((g) => areaDe(g.area) === a.emoji)));
  const chip = (rot, valor, n, desc) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.title = desc || '';
    b.className = valor === null ? 'on' : '';
    b.innerHTML = `${rot}${n != null ? ` <span>${n}</span>` : ''}`;
    b.addEventListener('click', () => { area = valor; [...areasEl.children].forEach((x) => x.classList.toggle('on', x === b)); aplicar(); });
    areasEl.appendChild(b);
  };
  chip('Todas', null);
  usadas.forEach((a) => chip(`${a.emoji} ${a.nome}`, a.emoji, data.filter((v) => v.grupos.some((g) => areaDe(g.area) === a.emoji)).length, a.desc.replace(/<[^>]+>/g, '')));

  const q = $('#q');
  function aplicar() {
    const termos = norm(q.value.trim()).split(/\s+/).filter(Boolean);
    let vistos = 0;
    itens.forEach((li) => {
      const grupos = [...li.querySelectorAll('.ver-g')];
      grupos.forEach((g) => {
        const okArea = !area || areaDe(g.dataset.area) === area;
        const okBusca = termos.every((t) => norm(g.textContent).includes(t) || li.dataset.texto.includes(t));
        g.classList.toggle('hide', !(okArea && okBusca));
      });
      const ok = grupos.some((g) => !g.classList.contains('hide')) || (!area && termos.every((t) => li.dataset.texto.includes(t)) && !grupos.length);
      li.classList.toggle('hide', !ok);
      if (ok) vistos++;
    });
    $('#vazio').hidden = vistos > 0;
  }
  q.addEventListener('input', aplicar);

  // roadmap
  $('#rmProx').innerHTML = RM.proximos.length ? `<ol>${RM.proximos.map((x) => `<li>${x}</li>`).join('')}</ol>` : `<p>${RM.proximosNota || 'Nada na fila agora.'}</p>`;
  $('#rmGuard').innerHTML = RM.guardado.map((x) => `<li>${x}</li>`).join('') || '<li>Nada guardado.</li>';
})();
