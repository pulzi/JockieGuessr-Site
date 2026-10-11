// Cópia de server/corretor.js feita pelo atualizar.mjs: a demonstração do site usa o mesmo corretor do jogo.
// Não edite aqui: mude o server/corretor.js e rode node site/atualizar.mjs.
(() => {
// Corretor "inteligente": sugere certo / parcial / errado para cada campo do palpite. O host sempre pode trocar.
//
//   certo   → igual, ignorando maiúsculas, acentos, pontuação, "(feat. …)", "The" no começo e sufixos do
//             Spotify ("- Remastered 2011", "(Deluxe Edition)", "- Ao Vivo"…); ou o artista principal de uma parceria
//   parcial → erro de digitação (até ~1 letra a cada 5), só um pedaço do nome, metade das palavras,
//             ou um dos outros artistas da parceria
//   errado  → o resto
//
// Devolve { valor, motivo }: o motivo aparece no painel do host ("1 letra diferente", "só parte do nome"…).

/** minúsculas, sem acento, sem "(…)", sem "feat …", sem pontuação. */
function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[([{].*?[)\]}]/g, ' ')
    .replace(/\b(feat|ft|featuring)\b\.?.*$/g, ' ')
    .replace(/&/g, ' e ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const semArtigo = (s) => s.replace(/^(the|a|an) /, '');
const junto = (s) => s.replace(/ /g, '');
// Sufixos que o Spotify e as lojas penduram no nome do álbum
const SUFIXO_ALBUM = /\b(deluxe|expanded|anniversary|remaster(ed)?|edition|edicao|version|versao|special|super|bonus|tracks?|single|ep|\d{4})\b/g;

/** Jeitos aceitos de escrever a resposta (o nome inteiro, antes do " - ", sem os sufixos de álbum). */
function variantes(resposta, campo) {
  const bruto = String(resposta || '');
  const lista = [bruto, bruto.split(/ - | – /)[0]].map(normalizar);
  if (campo === 'album') lista.push(...lista.map((v) => v.replace(SUFIXO_ALBUM, ' ').replace(/\s+/g, ' ').trim()));
  return [...new Set(lista.filter(Boolean))];
}

/** Distância de edição (com troca de letras vizinhas): "rapsody" ↔ "rhapsody" = 1. */
function distancia(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m || !n) return m || n;
  let ante = null, prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + custo);
      if (ante && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], ante[j - 2] + 1);
    }
    ante = prev; prev = cur;
  }
  return prev[n];
}

const palavras = (s) => s.split(' ').filter((p) => p.length > 2);

/** Compara um palpite com UMA forma da resposta. */
function compararUm(p, v) {
  if (p === v || junto(p) === junto(v) || semArtigo(p) === semArtigo(v)) return { valor: 'ok', motivo: '' };

  const a = junto(semArtigo(p)), b = junto(semArtigo(v));
  const d = distancia(a, b);
  const tolerancia = Math.max(1, Math.floor(b.length / 5));
  if (d <= tolerancia && b.length >= 3) return { valor: 'partial', motivo: d === 1 ? '1 letra diferente' : `${d} letras diferentes` };

  // pedaço do nome ("bohemian" para "bohemian rhapsody"), desde que não seja um pedacinho qualquer
  const curto = a.length < b.length ? a : b, longo = a.length < b.length ? b : a;
  if (curto.length >= 4 && curto.length >= longo.length * 0.4 && longo.includes(curto)) return { valor: 'partial', motivo: 'só parte do nome' };

  // metade das palavras (cada uma pode ter 1 erro de digitação). Uma palavra só vale se for comprida:
  // "Pressure" para "Under Pressure" sim; "Love" para "Love Me Harder" não (palavra comum demais)
  const pa = palavras(p), pv = palavras(v);
  if (pv.length >= 2) {
    const certas = pv.filter((w) => pa.some((x) => x === w || (w.length >= 5 && distancia(x, w) <= 1)));
    const vale = certas.length >= 2 || (certas.length === 1 && certas[0].length >= 6);
    if (vale && certas.length / pv.length >= 0.5) return { valor: 'partial', motivo: `${certas.length} de ${pv.length} palavras` };
  }
  return { valor: 'wrong', motivo: '' };
}

const ORDEM = { ok: 2, partial: 1, wrong: 0 };
const melhor = (lista) => lista.reduce((m, r) => (ORDEM[r.valor] > ORDEM[m.valor] ? r : m), { valor: 'wrong', motivo: '' });

/** Artistas de uma parceria: "Daft Punk, Pharrell Williams" / "Anitta & J Balvin" / "X feat. Y". */
function artistasDe(texto) {
  return String(texto || '').split(/,| & | e | x | and |\bfeat\.?|\bft\.?|\bfeaturing\b|\bcom\b/i).map(normalizar).filter(Boolean);
}

/**
 * @param {'artist'|'title'|'kind'|'album'} campo
 * @returns {{valor: 'ok'|'partial'|'wrong', motivo: string}}
 */
function sugerir(campo, palpite, resposta) {
  if (campo === 'kind') return { valor: palpite && palpite === resposta ? 'ok' : 'wrong', motivo: '' };
  const p = normalizar(palpite);
  if (!p || !normalizar(resposta)) return { valor: 'wrong', motivo: '' };

  if (campo === 'artist') {
    const lista = artistasDe(resposta);
    if (lista.length > 1) {
      const principal = compararUm(p, lista[0]);
      if (principal.valor === 'ok') return principal; // o artista principal basta
      const outros = melhor(lista.slice(1).map((x) => compararUm(p, x)));
      if (outros.valor === 'ok') return { valor: 'partial', motivo: 'só um dos artistas' };
      // escreveu todos ("daft punk pharrell"): compara com o nome completo
      return melhor([principal, outros.valor === 'partial' ? { ...outros, motivo: 'só um dos artistas, com erro' } : outros,
        ...variantes(resposta, campo).map((v) => compararUm(p, v))]);
    }
  }
  return melhor(variantes(resposta, campo).map((v) => compararUm(p, v)));
}

// ---------- parcerias e lançamentos (a resposta inteira, não só um campo) ----------
// A resposta pode trazer `artistas` (todos os da faixa, do Spotify) e `versoes` ([{kind, album}]: a mesma gravação
// saiu como single, no álbum, no deluxe…). Sem eles, os artistas saem do texto ("A, B" / "A feat. B").

/** Todos os artistas da resposta. */
function artistasDaResposta(resposta) {
  const lista = Array.isArray(resposta?.artistas) && resposta.artistas.length ? resposta.artistas.map(normalizar) : artistasDe(resposta?.artist);
  return [...new Set(lista.filter(Boolean))];
}

/** Os artistas que a pessoa escreveu ("A, B", "A e B", "A feat. B"…). */
const artistasDoPalpite = (texto) => [...new Set(artistasDe(texto))];

/** Cada artista da resposta: o melhor que o palpite chegou nele. */
function porArtista(palpite, resposta) {
  const meus = artistasDoPalpite(palpite?.artist);
  return artistasDaResposta(resposta).map((a) => melhor(meus.map((m) => compararUm(m, a))));
}

/** Acertou todos os artistas de uma parceria (erro de digitação vale)? É o bônus de "é collab?". */
function acertouTodos(palpite, resposta) {
  const r = porArtista(palpite, resposta);
  return r.length > 1 && r.every((x) => x.valor !== 'wrong');
}

/**
 * Sugere certo / parcial / errado para um campo, olhando a resposta inteira:
 *   artista → qualquer artista da faixa vale o ponto inteiro (o palpite pode ter vários; "Justin Bieber" em STAY vale)
 *   tipo    → vale qualquer jeito que a faixa saiu (single e álbum, se saiu dos dois jeitos)
 *   álbum   → vale qualquer álbum em que a faixa saiu (o deluxe, a outra edição…); disse "single" e a faixa também
 *             saiu como single: o álbum não é cobrado
 * @returns {{valor: 'ok'|'partial'|'wrong', motivo: string}}
 */
function avaliarCampo(campo, palpite, resposta) {
  const versoes = Array.isArray(resposta?.versoes) ? resposta.versoes : [];
  if (campo === 'artist') {
    if (!normalizar(palpite?.artist)) return { valor: 'wrong', motivo: '' };
    const lista = artistasDaResposta(resposta);
    if (lista.length < 2) return sugerir('artist', palpite.artist, resposta.artist);
    const cada = porArtista(palpite, resposta);
    const certos = cada.filter((x) => x.valor === 'ok').length;
    if (certos) return { valor: 'ok', motivo: certos === lista.length ? 'todos os artistas' : `${certos} de ${lista.length} artistas` };
    // escreveu o nome inteiro junto ("daft punk pharrell"), ou com erro de digitação
    return melhor([...cada.map((x) => (x.valor === 'partial' ? { ...x, motivo: `um dos artistas, ${x.motivo}` } : x)), sugerir('artist', palpite.artist, resposta.artist)]);
  }
  if (campo === 'kind') {
    const ok = palpite?.kind && (palpite.kind === resposta?.kind || versoes.some((v) => v.kind === palpite.kind));
    return { valor: ok ? 'ok' : 'wrong', motivo: ok && palpite.kind !== resposta?.kind ? 'a faixa também saiu assim' : '' };
  }
  if (campo === 'album') {
    if (palpite?.kind === 'single' && versoes.some((v) => v.kind === 'single')) return { valor: 'ok', motivo: 'saiu como single também' };
    const albuns = [resposta?.album, ...versoes.filter((v) => v.kind !== 'single').map((v) => v.album)].filter(Boolean);
    const r = melhor([...new Set(albuns)].map((a) => sugerir('album', palpite?.album, a)));
    return r.valor !== 'wrong' && albuns.length > 1 && !sugerir('album', palpite?.album, resposta?.album).valor.startsWith('ok') ? { ...r, motivo: r.motivo || 'outra edição do álbum' } : r;
  }
  return sugerir(campo, palpite?.[campo], resposta?.[campo]);
}

window.Corretor = { normalizar, distancia, sugerir, artistasDaResposta, acertouTodos, avaliarCampo };
})();
