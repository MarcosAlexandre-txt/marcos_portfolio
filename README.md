# Marcos Alexandre Bernardo — Portfólio

Astro + Bun + TypeScript + Three.js, com saída estática e fontes locais.

## Executar

```sh
bun install
bun run dev
```

O Astro informa o endereço e a porta. Nesta sessão, o preview da versão compilada está em `http://192.168.15.3:4337/` (use esse endereço de rede no navegador do Orca; o `localhost` do navegador pode apontar para outra máquina).

```sh
bun run check
bun run build
bun test
bun run preview
```

## Estrutura

- `src/pages/index.astro`: tela principal, navegação, controle de música e documento HTML.
- `src/components/SectionViews.astro`: Sobre, Projetos, Formação, Skills e Contato.
- `src/data/portfolio.ts`: dados factuais dos projetos e competências.
- `src/scripts/navigation.ts`: rotas por hash, abas acessíveis e retorno de foco.
- `src/scripts/ocean.ts`: água, bolhas e profundidade com Three.js; carregamento separado.
- `src/scripts/scene.ts`: ambientes animados do trem e da sala, com enquadramento proporcional e pausa fora da tela.
- `src/scripts/arcanas.ts`: baralho Three.js de competências, seleção, filtros e fallback sem WebGL.
- `src/styles/`: sistema visual, seções e adaptação responsiva; `immersive.css` contém as novas composições de Sobre, Formação e Skills.
- `assets/plates/`: imagens de produção aprovadas na revisão de assets. O Astro gera versões WebP para a página.
- `public/audio/color-your-night.mp3`: arquivo fornecido pelo titular.
- `.github/workflows/pages.yml`: publicação manual no GitHub Pages, ainda não executada.

## Navegação e acessibilidade

- Setas para cima/baixo percorrem o menu; Enter abre a seção.
- Setas para esquerda/direita percorrem as cartas ou as abas quando focadas.
- Esc volta ao menu e devolve o foco ao link que abriu a seção.
- M alterna reprodução; o botão também funciona com mouse e toque.
- O volume é salvo localmente quando o navegador permite. Não se salva um estado de reprodução automática.
- Sem JavaScript, todo o conteúdo permanece no HTML em uma página de rolagem única.
- Sem WebGL, com movimento reduzido ou em telas pequenas, a água e as estátuas permanecem como imagens estáticas. Textos e controles nunca dependem do canvas.
- Links externos indicados abrem em nova aba; telefone não é publicado.

## GitHub Pages

O workflow manual calcula `site` e `base` a partir do repositório em que for executado, incluindo o caso `usuario.github.io`. Para testar um subdiretório localmente:

```sh
ASTRO_SITE=https://exemplo.github.io ASTRO_BASE=/nome-do-repositorio bun run build
```

Não há repositório Git inicializado nem deploy realizado por esta construção. Antes da publicação:

1. Confirmar a autoria e licença da imagem das estátuas e completar seu crédito.
2. Documentar o crédito e a autorização de distribuição pública da música declarada pelo titular.
3. Configurar as variáveis de repositório `STATUE_LICENSE_CONFIRMED=true` e `MUSIC_DISTRIBUTION_CONFIRMED=true`, após essas confirmações.
4. Selecionar GitHub Actions como fonte do Pages e executar o workflow manualmente.

O áudio não pode começar automaticamente. Nenhuma captura, vídeo ou outra referência do jogo em `.impeccable/refs` é incluída no build.

## Conteúdo pendente

As três APIs exibem indicações explícitas de pendência para soft skills, aprendizados adicionais e URLs das cópias pessoais. Não há links de API fabricados. Skills são agrupadas sem níveis por decisão do titular, que foi avisado da divergência com o requisito acadêmico descrito no handoff.

Ver `HANDOFF.md` para o conteúdo validado e `design/source/CREDITS.md` para as origens das imagens.

## Redesenho de Sobre, Formação e Skills

- **Sobre:** arte do trem como ambiente de fundo, leitura à esquerda, controle de música integrado e retrato real emoldurado.
- **Formação:** sala de aula e lua sem moldura, fundidas ao fundo; curso, semestres e certificações preservados.
- **Skills:** tela de seleção inspirada no menu Social Link: título inclinado, faixa branca com a competência, painel escuro de evidências, carta grande à direita e catálogo horizontal. São 27 competências (23 hard e 4 soft), sem rank, níveis, estrelas ou texto de proficiência pendente.
- **Água contínua:** a tela de Skills deixa o shader aquático global aparecer, incluindo ondulações, luz e bolhas. As diagonais do menu são planos translúcidos, não mais fundos opacos que escondem a água.
- **Verso compartilhado:** `assets/plates/skill-card.png`, 848×1264 px, é a recriação gerada a partir da referência (não um original HD do jogo). O prompt permanece em `design/source/skill-card-prompt.txt`. Essa arte agora é exclusivamente o verso.
- **27 frentes próprias:** `assets/skill-fronts/00.webp`–`26.webp`, também 848×1264 px. Hard skills usam as marcas das tecnologias e suas cores; competências sem marca usam símbolos autorais, não logos inventados. Soft skills têm geometria abstrata original, nome e a descrição profissional já fornecida, como cartas colecionáveis. Sem estatísticas ou pontuações. Gerador reproduzível: `bun scripts/generate-skill-fronts.ts` (requer ImageMagick e os pacotes de fontes instalados). Cada arquivo tem procedência em `.webp.json`.
- **Objeto Three.js:** um deck alinhado, cinco camadas visíveis, bordas com espessura/iluminação e uma carta superior com materiais distintos na frente e no verso. Clique ou botão **Virar carta** gira a carta; selecionar outra competência revela o verso durante a troca e traz a nova frente. Texturas carregam sob demanda, com até seis residentes na GPU, anisotropia e DPR limitado a 2. Não há download de ícones em tempo de execução.
- Catálogo HTML com miniaturas das frentes, anterior/próximo, setas do teclado, Home/End e gesto horizontal para trocar. O contador é paginação, nunca nível. Filtros hard/soft compartilham o estado e toda nova seleção começa pela frente.
- Movimento reduzido mantém os ambientes estáticos e troca cartas sem interpolação. Sem WebGL, uma carta HTML e todos os controles continuam disponíveis. Sem JavaScript, os detalhes de todas as competências ficam no HTML.
- Verificações desta alteração: `bun run check`, `bun run build`, seis testes de conteúdo; inspeção no navegador a 1440×1000 e 390×844, mais Skills a 1611×911. Catálogo, próximo/anterior, filtros, teclado, perda de contexto WebGL e retorno às seções foram exercitados. Capturas e veredito **restrito às correções do redesenho** em `.impeccable/review/immersive-*` e arquivos `sobre-*`, `formacao-*`, `skills-*`.
- Revisão atual do deck: `.impeccable/review/skill-deck-review.md`, capturas `skill-deck-{hard,back,soft}-{1440,1280,1611,390}.png` e `skill-deck-mobile-lower.png`. Foram exercitadas as 27 frentes, giro por clique real, troca partindo do verso e perda de contexto WebGL. Essa verificação inicial teve **7 testes / 265 asserções**, mais checagem Astro e builds normal e `/portfolio`. Os arquivos `skill-console-*` documentam a versão anterior, já substituída. A variante compacta cabe em notebooks; no celular, nome, carta e evidências se empilham.
- Esta revisão local não encerra os gates antigos da composição inicial nem as pendências de publicação descritas abaixo.

## Rodada de desempenho e navegação contextual

- Miniaturas do catálogo agora são WebP de **96 px de largura** (3× o tamanho de exibição). O peso somado dos 27 arquivos caiu de **1.752.732 para 68.558 bytes: 96,09% menos**. Frentes e verso principais continuam em 848×1264 px. Trata-se de redução no catálogo, não de uma alegação de melhoria equivalente no tempo total de carregamento.
- O deck só aloca WebGL e carrega o verso grande ao se aproximar da área visível. Na abertura fria do menu, foram medidos **1 contexto em vez de 2**; após visitar Skills, seu contexto permanece em cache e a animação pausa fora da tela. Controles HTML continuam disponíveis antes da ativação e em caso de falha.
- `src/scripts/frame-loop.ts` centraliza agendamento, cancelamento e retomada de animações do mar, ilustrações e deck. Aba oculta cancela o frame pendente; a retomada reinicia o relógio sem saltos. `?still` agora congela também o mar e as transições de navegação, repintando quando necessário.
- Evidências de skills agora são links: APIs abrem seu dossiê correto, projetos pessoais abrem o repositório confirmado e certificados levam à Formação. O CTA genérico permanece somente onde não há evidência específica. Links têm alvo mínimo de 44 px e foco visível.
- **16 testes / 462 asserções**, Astro check sem erros/avisos/hints, builds normal e `/portfolio` aprovados. Verificados no DOM: 27 seleções, fallback após perda de contexto, destino SCRUM Academy correto e ausência de overflow em 390, 1280, 1440 e 1611 px. Dados: `.impeccable/review/boost-{before,after,layout-checks,functional-checks}.json`.
- **Revisão visual desta rodada ainda pendente:** o navegador do Orca retornou `Screenshot timed out — the browser page did not draw a frame`. Não foi feita aprovação visual com as capturas antigas; o pedido de recaptura está em `.impeccable/review/boost-review.md`. Nenhum número de FPS/Core Web Vitals é afirmado.

## Estado da revisão original

A composição inicial passou no gate de fidelidade com **95%** antes das últimas integrações. A revisão dos assets foi aprovada pelo usuário. As fases `sections` e `motion` estão fechadas.

**O build ainda não tem veredito final de publicação.** A fase `responsive` continua aberta: o navegador embutido do Orca retornou repetidamente `Screenshot timed out — the browser page did not draw a frame`, depois `page_wedged`. As capturas finais em 1440 e 390 px não foram obtidas. Portanto, revisão visual final, auditoria de contraste renderizado e documentação definitiva `DESIGN.md` ainda devem ser concluídas. Não usar a captura antiga do hero como aprovação da versão final.
