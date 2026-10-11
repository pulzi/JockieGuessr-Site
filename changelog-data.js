// Gerado por atualizar.mjs a partir do CHANGELOG.md e do ROADMAP.md. Não edite à mão.
window.CHANGELOG = [
 {
  "v": "1.7.3",
  "data": "2026-10-11",
  "resumo": "A hora num canto da tela.",
  "grupos": [
   {
    "area": "📺 Telão",
    "itens": [
     "A hora (HH:MM) no rodapé, ao lado da rodada. No painel do host e na tela larga do PC, no topo."
    ]
   }
  ]
 },
 {
  "v": "1.7.2",
  "data": "2026-10-11",
  "resumo": "Correção: o painel do host ficava parado em \"Esperando o estado do jogo…\".",
  "grupos": [
   {
    "area": "🎛️ Painel do host",
    "itens": [
     "O painel não abria na 1.7.0/1.7.1 (um erro no card da playlist dos jogadores travava a tela de carregando)."
    ]
   }
  ]
 },
 {
  "v": "1.7.1",
  "data": "2026-10-11",
  "resumo": "\"Rodada da galera\" passa a se chamar <b>Rodada dos jogadores</b>.",
  "grupos": [
   {
    "area": "✨ Geral",
    "itens": [
     "O nome novo aparece no telão (cena e selo: \"Rodada dos jogadores 1/3\"), no celular e na aba Automático."
    ]
   }
  ]
 },
 {
  "v": "1.7.0",
  "data": "2026-10-11",
  "resumo": "Rodada da galera, blefe de quem escolheu a música, imagem do pódio, menu de músicas novo e apagar perfis.",
  "grupos": [
   {
    "area": "🤖 Modo automático",
    "itens": [
     "<b>Rodada da galera</b>: a cada N rodadas da playlist (padrão 3), um bloco rápido com M músicas que os jogadores sugeriram (padrão 3, 20 s cada; aba Automático). Em cada uma, todo mundo chuta a música e <b>quem escolheu</b>. Não conta no total de rodadas, não repete música no mesmo jogo e alterna as pessoas. Tem cena e selo próprios (\"Rodada da galera 1/3\"). Na mão: um botão em \"Rodada especial\"."
    ]
   },
   {
    "area": "🎮 Quem joga",
    "itens": [
     "<b>Sugerir música também entre as rodadas</b> (não só no lobby).",
     "<b>Menu de escolher música refeito</b>: as suas em capas grandes, vagas com \"+\", busca com ícone e \"Buscando…\", resultados com capa, artista e álbum. As capas vêm pelo próprio jogo (antes não apareciam no Discord).",
     "<b>\"Quem escolheu?\" em botões</b> com a foto de cada um (na rodada da galera, no topo).",
     "<b>Blefe</b>: quando toca a sua música, a tela é igual à de todo mundo; um aviso escondido (\"•••\") lembra que é sua e que o que você mandar não conta. O telão mostra que você \"palpitou\" numa hora qualquer.",
     "<b>Imagem do pódio</b> no fim de jogo: compartilhar, baixar ou copiar (1080×1350, com as fotos e os destaques)."
    ]
   },
   {
    "area": "🎛️ Painel do host",
    "itens": [
     "<b>Apagar perfil</b> (aba Placar → Perfis → ✕): esquece o nome, a foto, os aparelhos e a ficha do hall.",
     "<b>Imagem do pódio</b> na aba Placar, no fim de jogo."
    ]
   }
  ]
 },
 {
  "v": "1.6.0",
  "data": "2026-10-11",
  "resumo": "Parcerias (collab): qualquer artista da faixa vale, \"é collab?\" com bônus, e tipo e álbum de qualquer lançamento.",
  "grupos": [
   {
    "area": "🎮 Quem joga",
    "itens": [
     "<b>Qualquer artista de uma parceria vale o ponto de artista</b>: em STAY, \"Justin Bieber\" vale tanto quanto \"The Kid LAROI\" (antes, só o primeiro valia inteiro).",
     "<b>\"É collab?\"</b> no palpite: abre o campo do outro artista; quem marca e acerta todos os artistas ganha um bônus (+1 por padrão; aba Regras → Extras → Parceria; 0 = sem bônus). Na revelação: \"collab: todos os artistas +1\".",
     "<b>Vários lançamentos</b>: o tipo e o álbum valem em qualquer lançamento da mesma gravação (o single e o álbum, a edição deluxe…). Disse \"single\" e a faixa também saiu como single: o álbum não é cobrado."
    ]
   },
   {
    "area": "🤖 Modo automático e \"tocando agora\"",
    "itens": [
     "Com a conta do Spotify conectada, a resposta é completada pelo Spotify: <b>todos os artistas</b> (o \"tocando agora\" do Linux às vezes só traz o primeiro, e foi o que aconteceu com STAY) e os <b>outros lançamentos</b> da mesma gravação (pelo ISRC; coletâneas de outros artistas não contam)."
    ]
   }
  ]
 },
 {
  "v": "1.5.0",
  "data": "2026-10-11",
  "resumo": "Perfil de cada jogador: nome e foto (da galeria ou do Discord), salvos por aparelho, e o host junta perfis.",
  "grupos": [
   {
    "area": "🎮 Quem joga",
    "itens": [
     "<b>Perfil por aparelho</b>: depois da primeira vez, o jogo abre direto em você (sem digitar o nome de novo). Quem já estava jogando vira perfil sem perder os pontos.",
     "<b>Trocar o nome e a foto no lobby</b> (e no fim de jogo), sem limpar nada: a foto vem da galeria, cortada e reduzida no próprio aparelho. A foto aparece em todo lugar (sala, placar, revelação, pódio, cutscene do fim).",
     "<b>No Discord</b>: com o login ligado, entra com o <b>nome e a foto da conta do Discord</b> (o Discord pede a permissão uma vez). O perfil é o da conta, em qualquer aparelho."
    ]
   },
   {
    "area": "🎛️ Painel do host",
    "itens": [
     "<b>Perfis</b> (aba Placar): todos os aparelhos e contas do Discord, quem está na sala, há quanto tempo foi visto e <b>Juntar</b> dois perfis da mesma pessoa (os pontos, a ficha do hall e as músicas vão juntos; o aparelho antigo passa a entrar no perfil que ficou).",
     "<b>Login do Discord</b> (aba Técnico → Telão no Discord): o campo do Client Secret, com o passo a passo. Fica só no servidor."
    ]
   },
   {
    "area": "🏆 Hall da fama",
    "itens": [
     "A ficha de cada um passa a ser guardada pelo perfil (trocar de nome não divide a ficha). As fichas de antes, pelo nome, passam para o perfil de quem joga com esse nome."
    ]
   }
  ]
 },
 {
  "v": "1.4.0",
  "data": "2026-10-11",
  "resumo": "Fim de jogo em cutscene, hall da fama completo, quem joga no PC com o telão do lado, volume cheio, jogar pela Atividade do Discord, palpite que vale sem clicar, chance na roleta e tempo da resposta e do pódio.",
  "grupos": [
   {
    "area": "🔊 Som",
    "itens": [
     "<b>Volume cheio</b> (Linux): abaixe o Spotify no PC para ouvir a call, e quem ouve pelo jogo continua no volume cheio. O painel mostra o volume do app no PC e avisa se ele estiver mudo (aí não sai som para ninguém).",
     "A música de espera só pula as músicas que ela mesma pôs, no máximo 3 vezes em 30 s, e nunca no automático nem com a rodada aberta. Antes, com a playlist de espera igual à do jogo, ela trocava a música sem parar (e no automático pulava a música da rodada). Se todas as músicas da espera estão no jogo, ela não toca e o painel avisa."
    ]
   },
   {
    "area": "📺 Telão",
    "itens": [
     "<b>Fim de jogo em cutscene</b>: \"Fim de jogo!\", o 3º e o 2º sobem no pódio, suspense (\"E quem levou foi…\"), o campeão com coroa e confete e, depois, os cards dos destaques e dos recordes batidos entrando um a um. Depois, o pódio e o hall da fama se revezam.",
     "<b>Tempo da resposta e do pódio</b> (aba Regras → \"Depois de revelar\", e na aba Automático): quantos segundos a resposta fica na tela e quantos o pódio fica (0 = sem pódio). O automático espera os dois.",
     "<b>Última rodada sem pódio</b>: no automático, a classificação fica escondida até o fim de jogo (o relógio diz \"O resultado final sai em\").",
     "<b>Atividade do Discord</b>: botão <b>\"Jogar daqui\"</b> (palpitar pelo próprio Discord) e <b>volume</b> ao lado do \"Ouvir aqui\".",
     "<b>Fim de jogo</b>: o pódio (com os destaques) e uma tela só do <b>hall da fama</b> (recordes e ranking) se revezam.",
     "<b>Roleta</b>: cada fatia do tamanho da chance que o host escolheu.",
     "<b>Carregando</b>: uma tela com cada etapa da entrada e o tempo (também no console, <code>[carregando]</code>). No Discord, a troca telão ↔ jogar mostra o carregando na hora e diz quanto a página levou para voltar."
    ]
   },
   {
    "area": "🏆 Hall da fama",
    "itens": [
     "Guarda a <b>ficha de cada jogador</b> (pelo nome, entre jogos): jogos, vitórias, pódios, pontos, acertos, melhor jogo, maior sequência, palpite mais rápido e apostas. As vitórias de antes entram na ficha.",
     "Recordes novos: <b>rodada mais gorda</b>, <b>mais vitórias</b>, <b>mais certeiro</b> (a partir de 15 rodadas) e <b>veterano</b>.",
     "<b>Ranking de todos os tempos</b>, os <b>últimos jogos</b> e as <b>músicas que ninguém acertou</b> (completos na aba Placar).",
     "\"Sua carreira\" no fim de jogo de quem joga.",
     "Cada partida inteira (rodadas, palpites, tempos e pontos) fica guardada em <code>&lt;dados&gt;/jogos/</code> (as últimas 200)."
    ]
   },
   {
    "area": "🎛️ Painel do host",
    "itens": [
     "<b>Chance de cada tipo na roleta</b> (aba Avançado): um peso de 1 a 10, com a % ao lado."
    ]
   },
   {
    "area": "🎮 Quem joga",
    "itens": [
     "<b>Aposta</b>: bolinhas com quantas sobram, \"esta é a sua última\" e, quando acabam, o quadro avisa (antes sumia).",
     "<b>O tempo acabou e você não clicou em enviar?</b> Vale o que estava digitado (até incompleto, só a música, por exemplo), sem bônus de rapidez. Vale também para quem mudou o palpite e não clicou em \"Atualizar\", e quando o host fecha a rodada na mão. Na revelação aparece \"enviado no fim do tempo\". (Só vale o que mudou depois do último clique: quem clicou não perde o palpite nem o bônus.)",
     "<b>Tela larga (PC, TV, Discord no computador)</b>: o telão inteiro à esquerda (onda, letra, quem já palpitou, a revelação, o pódio, as reações voando) e uma coluna à direita com você (posição e pontos), as reações e o palpite. Na revelação a coluna mostra só o seu resultado; o de todo mundo está no telão. Entra sozinha numa tela deitada a partir de 900 px de largura; no celular continua a página de sempre.",
     "Jogando pela Atividade do Discord: \"Ouvir aqui\" já ligado, volume no topo e <b>\"Ver telão\"</b> para voltar a só assistir.",
     "O volume fica guardado no aparelho."
    ]
   }
  ]
 },
 {
  "v": "1.3.0",
  "data": "2026-10-10",
  "resumo": "Rodadas especiais com roleta, times, playlist dos jogadores, letra palavra por palavra (Spicy Lyrics), sequência, aposta, modo intro e hall da fama.",
  "grupos": [
   {
    "area": "🏆 Resumo e hall da fama",
    "itens": [
     "No fim de jogo: os destaques da partida (mais rápido, maior sequência, mais certeiro, rodada mais gorda, ninguém acertou).",
     "<b>Hall da fama</b> entre partidas: maior pontuação, mais rápido de todos, maior sequência, mais vitórias; \"Novo recorde!\"."
    ]
   },
   {
    "area": "📺 Animações",
    "itens": [
     "O QR code do lobby voa de verdade (para os lados, sobe, desce e gira), devagar o bastante para a câmera ler.",
     "As animações em loop não recomeçam mais quando a tela é refeita (um palpite, a música pausar…): seguem um relógio só."
    ]
   },
   {
    "area": "🔥 Sequência, aposta e modo intro",
    "itens": [
     "<b>Sequência de acertos</b>: a partir da 3ª seguida, +1 por rodada; 🔥 com o número ao lado do nome.",
     "<b>Aposta \"tenho certeza\"</b> (3 por jogo): acertou, os campos dobram; errou, −2.",
     "<b>Modo intro</b>: a música toca só os primeiros N segundos e pausa (o servidor controla o Spotify).",
     "A tabela \"Como pontua\" mostra as regras ligadas."
    ]
   },
   {
    "area": "👥 Times",
    "itens": [
     "<b>Jogar em times</b> (aba Regras): 2 a 4 times com nome, placar do time pela <b>soma</b> ou pela <b>média</b>.",
     "Quem entra cai no time menor; cada um troca pelo celular (\"Seu time\"); o host sorteia ou muda no Placar.",
     "O telão mostra os times no lobby, na classificação e no fim (\"Laranja venceu!\"); avatares com o anel do time."
    ]
   },
   {
    "area": "🎛️ Abas do painel",
    "itens": [
     "Reorganizadas do jogo para o técnico: Rodada · Automático · Placar · Regras · Avançado · Som · <b>Links</b> · <b>Técnico</b> · Telão.",
     "<b>Técnico</b>: conta do Spotify, link público (domínio), fontes da letra e telão no Discord. <b>Links</b>: os links/QR e o controle pelo celular."
    ]
   },
   {
    "area": "🎲 Rodadas especiais",
    "itens": [
     "<b>Relâmpago</b> (10 s de música + 30 s para digitar; só o mais rápido pontua), <b>Heardle</b> (a música aos pouquinhos; quanto antes, mais pontos), <b>Quem escolheu?</b> (chute quem pôs a música), <b>Roubo</b> (o mais rápido rouba de quem está em 1º) e <b>Vale triplo</b>.",
     "<b>Só a letra</b> (sem som, a letra aparece aos poucos) e <b>Complete a letra</b> (a música para no meio de uma linha; complete as palavras que faltam).",
     "<b>Duelo</b> (dois sorteados palpitam; o resto torce pelo celular) e <b>Mesmo artista</b> (vale só o nome da música; no automático, três seguidas do mesmo artista).",
     "<b>Roleta</b> no telão: gira e para na rodada sorteada. Na mão (menu \"Rodada especial\") ou no automático (a cada N rodadas).",
     "Painel ao vivo no telão e no celular: a contagem do relâmpago e os trechos do heardle.",
     "Nova aba <b>Avançado</b> no painel: todos os números de cada rodada especial e o que pode sair na roleta."
    ]
   },
   {
    "area": "📺 Telão",
    "itens": [
     "<b>Letra palavra por palavra:</b> cada palavra se enche enquanto é cantada e a da vez brilha; sílaba comprida letra por letra; discos girando nos solos; voz de fundo menor embaixo; dueto do outro lado; as cores da capa atrás.",
     "<b>Rodada bônus:</b> cena dourada (\"Rodada bônus… Vale dobro!\") e o selo durante a rodada e no resultado.",
     "No lobby, \"Aguardando jogadores\" e a <b>playlist dos jogadores</b> (quantas músicas cada um pôs)."
    ]
   },
   {
    "area": "🎮 Quem joga",
    "itens": [
     "O formulário pede <b>a música primeiro</b>, depois o artista; o <b>álbum é opcional</b>.",
     "<b>Playlist dos jogadores:</b> escolha suas músicas no lobby (busca ou link). Quando tocar uma sua, \"Essa é sua!\": se ninguém acertar, você ganha +3.",
     "A letra também ganhou o visual novo na caixinha do celular."
    ]
   },
   {
    "area": "🎛️ Painel do host",
    "itens": [
     "<b>Letra:</b> fontes Spicy Lyrics (chave <code>sl_sk_…</code>), NetEase e LRCLIB, com o crédito de quem sincronizou; opção de mostrar a letra só no telão.",
     "<b>Rodada bônus:</b> botões \"Rodada bônus\", \"Próxima vale dobro\" e \"Valer dobro\" (liga e desliga até depois do resultado).",
     "<b>Playlist dos jogadores</b> (aba Automático): liga, limite por pessoa, o que cada um pôs, \"Usar no automático\"."
    ]
   },
   {
    "area": "🤖 Modo automático",
    "itens": [
     "\"A última rodada vale dobro\" (ligado por padrão).",
     "Toca a playlist dos jogadores (uma rodada por música); se o Spotify não tocar, para e devolve o controle."
    ]
   },
   {
    "area": "✨ Geral",
    "itens": [
     "O vinil da cena \"Rodada N\" não tem mais o pontinho no meio do número; as barras de tempo deslizam (sem trancos quando alguém palpita).",
     "<code>.env</code> com senha fixa do host e segredo de sessão: reiniciar o servidor não derruba ninguém.",
     "ROADMAP.md com o plano."
    ]
   }
  ]
 },
 {
  "v": "1.2.0",
  "data": "2026-10-09",
  "resumo": "Linux: o jogo, o som e o \"agora tocando\" funcionam num PC com Linux (PipeWire e MPRIS).",
  "grupos": [
   {
    "area": "🐧 Linux",
    "itens": [
     "<b>Som para os celulares</b> pelo PipeWire: só o Spotify (ou outro app) ou tudo do PC menos o Discord, sem mexer no som que sai da caixa. App que fecha e abre de novo volta a ser transmitido sozinho.",
     "<b>Agora tocando</b> pelo MPRIS: título, artista, álbum, capa e posição (a letra sincronizada e o modo automático funcionam igual), e os comandos de tocar, pausar, próxima, aleatório e pular para um trecho.",
     "App do host em <b>AppImage</b> (<code>npm run dist:linux</code>).",
     "\"Abrir no Spotify do PC\" abre pelo <code>xdg-open</code>; os avisos falam do <code>pacman</code> em vez do <code>winget</code>."
    ]
   }
  ]
 },
 {
  "v": "1.1.0",
  "data": "2026-10-06",
  "resumo": "Clima: música de espera com \"tocando agora\" e letra sincronizada no telão e nos celulares.",
  "grupos": [
   {
    "area": "📺 Telão",
    "itens": [
     "<b>Letra sincronizada</b> em faixa de karaokê, entre a tela e o rodapé: a linha cantada agora em destaque e a próxima embaixo. Aparece na música de espera e no resultado (só se a música tocando for a revelada); nunca com os palpites abertos.",
     "No lobby, o card <b>Tocando enquanto espera</b> (capa, nome, artista e a barra andando) em cima da tabela de pontos.",
     "O título do lobby se ajusta à coluna dele: em 1920×1080 não passa mais por baixo da tabela de pontos."
    ]
   },
   {
    "area": "🎮 Quem joga",
    "itens": [
     "No lobby e no fim de jogo, o <b>tocando agora</b> da música de espera, com a letra numa caixinha.",
     "No resultado, a letra da música revelada embaixo da resposta.",
     "No modo à distância, a letra desconta o atraso do som do celular."
    ]
   },
   {
    "area": "🎛️ Painel do host",
    "itens": [
     "Aba <b>Som → Música de espera e letra</b>: liga a música de espera, escolhe a playlist (menu \"Suas playlists\" ou link), <b>Tocar agora</b> / <b>Outra música</b>, e liga ou desliga a letra.",
     "Rodada na mão começando com a música de espera tocando: o Spotify pausa, para você dar play na música da rodada."
    ]
   },
   {
    "area": "🔊 Som",
    "itens": [
     "A música de espera vai para os celulares mesmo com \"Só transmitir com os palpites abertos\" (ela não entrega nada)."
    ]
   },
   {
    "area": "🖥️ App do PC",
    "itens": [
     "O leitor do \"agora tocando\" do Windows passa a informar a posição da música (é o que sincroniza a letra).",
     "Letras do <a href=\"https://lrclib.net\" target=\"_blank\" rel=\"noopener\">LRCLIB</a>, guardadas em cache: cada música vai à internet uma vez só."
    ]
   }
  ]
 },
 {
  "v": "1.0.0",
  "data": "2026-10-06",
  "resumo": "Primeira versão com número: quiz musical com telão, modo automático pelo Spotify, regras do jogo e bônus de velocidade.",
  "grupos": [
   {
    "area": "🎮 Quem joga",
    "itens": [
     "Entra pelo QR code do telão, só com um nome: sem instalar nada.",
     "Palpite de <b>artista</b>, <b>música</b>, <b>tipo</b> (single, álbum ou EP) e <b>álbum</b>; dá para mudar até a rodada fechar.",
     "Tutorial curtinho na primeira vez (botão <b>?</b> depois).",
     "<b>Reações</b>: 🔥 😂 😱 😭 👏 💀 embaixo da onda; voam pelo telão com o seu nome.",
     "Na revelação: a resposta com a capa, os seus acertos campo a campo, o tempo que você levou e o bônus de rapidez.",
     "No lobby, a tabela <b>Como pontua</b> com as regras da partida."
    ]
   },
   {
    "area": "📺 Telão",
    "itens": [
     "Sem botões: QR code para entrar, quem já está na sala, quem já palpitou, a revelação e o pódio.",
     "Cenas animadas: abertura, \"Rodada N\", \"Palpites fechados\", \"E a música era…\" com a capa, e o fim de jogo com o campeão (e empate).",
     "Tabela <b>Como pontua</b> no lobby (resumida em telas estreitas) e chuva de reações.",
     "<b>Atividade do Discord</b>: o telão abre dentro de uma call, com \"Ouvir aqui\" para quem quiser o som por ali."
    ]
   },
   {
    "area": "🎛️ Painel do host",
    "itens": [
     "Abas organizadas por assunto: <b>Rodada</b>, <b>Automático</b>, <b>Placar</b>, <b>Regras</b>, <b>Som</b>, <b>Conexões</b> e <b>Telão</b>.",
     "<b>Resposta certa</b> preenchida sozinha com o que está tocando no PC (título, artista, álbum, tipo e capa grande, completados pelo Deezer e guardados em cache).",
     "<b>Corretor inteligente</b>: erro de digitação, maiúsculas, acentos e \"só parte do nome\" viram <b>parcial</b> (meio ponto).",
     "<b>Regras</b>: atalhos Completo e Casual, cada campo com 1 a 5 pontos, <b>bônus de velocidade</b> (+3, +2, +1 para os mais rápidos que acertam artista e música, com o atraso do som do celular descontado) e reações liga/desliga.",
     "Expulsar jogadores; quem sai some sozinho das listas depois de 30 s (e volta com os pontos se entrar de novo).",
     "Guia de primeiros passos na primeira vez.",
     "<b>Conexões</b>: links e QR, link público rápido ou <b>com o seu domínio</b> (túnel da Cloudflare), conta do Spotify, telão no Discord e QR para controlar pelo celular."
    ]
   },
   {
    "area": "🤖 Modo automático",
    "itens": [
     "Segue uma playlist do Spotify: troca a música, abre os palpites com tempo (padrão: <b>10 rodadas de 30 s</b>), fecha quando todo mundo palpitou, corrige, revela e segue até o fim de jogo.",
     "Com a <b>conta do Spotify</b> conectada (Premium), o jogo <b>sorteia a faixa</b> e manda o Spotify do PC tocá-la, já no trecho certo; sem conta, usa o \"próxima\" com o aleatório. O volume nunca é mexido.",
     "<b>Não repete</b>: nunca a mesma música no jogo, e passa pela playlist inteira antes de repetir entre partidas.",
     "<b>Assumir o controle</b> e <b>devolver</b> a qualquer momento; <b>Vou jogar também</b> esconde a resposta do painel.",
     "QR code da playlist no telão para quem quiser seguir.",
     "Histórico de cada rodada (palpites, tempos, pontos), base do resumo e do hall da fama."
    ]
   },
   {
    "area": "🔊 Som",
    "itens": [
     "<b>Todos juntos</b> (a caixa do PC toca, os celulares ficam mudos com a onda dançando) ou <b>À distância</b> (o som vai para cada celular, com link público).",
     "Captura só do Spotify (sem as vozes do Discord) ou de tudo do PC; Opus no servidor, WebAssembly no celular.",
     "\"Só transmitir com os palpites abertos\", para ninguém ouvir você procurando a próxima música."
    ]
   },
   {
    "area": "🖥️ App do PC",
    "itens": [
     "<code>JockieGuessr-Host.exe</code> portátil: liga o jogo, o som e o túnel e abre o painel já logado.",
     "<b>Abrir o telão</b> manda o telão para o segundo monitor em tela cheia."
    ]
   },
   {
    "area": "📱 App Android",
    "itens": [
     "<b>JockieGuessr Controle</b>: o celular vira o painel do host pelo QR code (código de uso único), lembra do PC, mantém a tela acesa e vibra a cada palpite."
    ]
   }
  ]
 }
];
window.AREAS = [
 {
  "emoji": "✨",
  "nome": "Geral",
  "desc": "Vale para tudo"
 },
 {
  "emoji": "🎮",
  "nome": "Quem joga",
  "desc": "O site no celular ou no PC de quem palpita"
 },
 {
  "emoji": "📺",
  "nome": "Telão",
  "desc": "A tela grande (segundo monitor, TV, OBS ou a Atividade do Discord)"
 },
 {
  "emoji": "🎛️",
  "nome": "Painel do host",
  "desc": "As abas de quem comanda o jogo"
 },
 {
  "emoji": "🤖",
  "nome": "Modo automático",
  "desc": "O jogo rodando sozinho com uma playlist do Spotify"
 },
 {
  "emoji": "🔊",
  "nome": "Som",
  "desc": "A captura do som do PC e o envio para os celulares"
 },
 {
  "emoji": "🖥️",
  "nome": "App do PC",
  "desc": "O <code>JockieGuessr-Host.exe</code> para Windows"
 },
 {
  "emoji": "📱",
  "nome": "App Android",
  "desc": "O controle remoto do painel"
 },
 {
  "emoji": "🐧",
  "nome": "Linux",
  "desc": "O jogo rodando num PC com Linux"
 }
];
window.ROADMAP = {
 "proximos": [],
 "proximosNota": "",
 "guardado": []
};
