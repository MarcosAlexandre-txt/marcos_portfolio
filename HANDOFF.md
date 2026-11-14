# Handoff — Portfólio de Marcos Alexandre Bernardo

Brief completo para construir o site. A composição da tela principal foi aprovada pelo usuário em 2026-11-10; nenhum código de aplicação existe ainda. Leia este arquivo inteiro antes de escrever qualquer coisa.

## 1. O que é

Portfólio acadêmico e profissional de Marcos Alexandre Bernardo, aluno de Desenvolvimento de Software Multiplataforma (DSM) na FATEC São José dos Campos. É a entrega oficial da disciplina de Portfólio do semestre 2026-2 e será publicado no GitHub Pages.

Dois públicos:

- Professores da FATEC, que conferem cada item obrigatório do roteiro "Portfólio DSM — Orientações Gerais e Ferramentas 2026-2".
- Recrutadores e líderes técnicos avaliando Marcos para estágio em Engenharia de Software, Análise de Dados, Segurança da Informação e DevOps.

A interface é uma adaptação do menu de pausa de *Persona 3 Reload* (P3R). O usuário pediu fidelidade à linguagem do jogo, mas recusou cópia: a tela foi recomposta para apresentar uma pessoa.

## 2. Stack e entrega

- Astro + Bun + TypeScript, saída estática. Three.js para a camada 3D.
- Deploy no GitHub Pages por GitHub Actions. O diretório ainda não é um repositório git.
- Sem backend. Tudo roda como arquivos estáticos.
- Página alvo: `src/pages/index.astro`.

## 3. Arquivos que já existem

| Caminho | O que é |
|---|---|
| `PRODUCT.md` | Contexto do produto e todas as evidências de conteúdo. Fonte da verdade para os fatos. |
| `.impeccable/surfaces/src-pages-index-astro.md` | Brief da página, com o contrato de direção atualizado. |
| `.impeccable/mocks/comp-10.png` | **Composição aprovada** da tela principal (1920×1080). Abra antes de codar. |
| `.impeccable/mocks/src/comp3.html` | HTML/CSS que gerou a composição. Serve de referência de medidas, cores e recortes; é rascunho de posicionamento absoluto, não código para copiar. |
| `.impeccable/refs/` | Referências do jogo: captura do menu principal, quadros do vídeo do menu de pausa e dos submenus. Estudo local, nunca publicar. |
| `public/images/water-1920.jpg`, `water-2560.jpg` | Fundo: foto real da superfície da água, já convertida para a paleta. |
| `public/images/statue.webp` | Estátuas recortadas e convertidas para a paleta, com transparência. |
| `public/images/marcos-perfil.jpg` | Foto de perfil (460×460). O arquivo `.png` de mesmo nome é o mesmo JPEG com extensão errada; use o `.jpg` e apague o `.png`. |
| `design/source/` | Imagens originais, `grade.sh` (regenera os rasters acima) e `CREDITS.md`. |

Composições `comp-2` a `comp-9` e `decision/assigned.png` foram rejeitadas. Não as use.

## 4. Processo (skill impeccable)

O projeto usa a skill impeccable em `/home/pottassiuw/.agents/skills/impeccable/`. O estado de construção está na fase `spec` (a fase `comps` foi fechada com `comp-10` aprovada).

1. Leia `SKILL.md` da skill e rode `scripts/impeccable context --target src/pages/index.astro` uma vez.
2. Rode `scripts/impeccable build-phase status` e siga as fases na ordem: spec, plates, hero, sections, motion, responsive, review.
3. Leia `reference/craft-floor.md` imediatamente antes de qualquer edição de interface.
4. O trabalho só termina com a revisão final, o veredito e o `DESIGN.md`.

A composição aprovada é a referência a traduzir para código semântico, responsivo e acessível. Não recomponha a tela nem troque o elemento principal sem perguntar ao usuário.

## 5. Sistema visual

### Cores

| Token | Valor | Uso |
|---|---|---|
| `--abyss` | `#020a52` | fundo mais profundo, base da página |
| `--deep` | `#041ba5` | azul profundo |
| `--cobalt` | `#0c46d0` | azul médio |
| `--sky` | `#35d2ff` | ciano claro da superfície |
| `--navy` | `#06207f` | contorno de texto branco sobre a água |
| `--ink` | `#05070f` | texto sobre placas brancas |
| `--white` | `#ffffff` | placas, texto de comandos auxiliares |
| `--red` | `#f3122f` | sombra deslocada, cursor, borda da placa |
| `--pink` / `--violet` | `#ff8fd6` / `#d89aff` | borda superior das placas, estilhaços |
| `--c1` a `--c4` | `#78e9ff`, `#66fbff`, `#0bc5f8`, `#3ad6ff` | itens do menu não selecionados |

Vermelho é pontual: só em seleção, cursor e sombra de placa.

### Tipografia

- **Archivo** variável (eixos itálico, largura e peso). Comandos e nome: peso 900, itálico, largura 84%, caixa alta, `letter-spacing: -0.055em`, `line-height` perto de 0.8.
- **Anton** para as palavras gigantes de título das seções.
- Texto corrido e metadados: Archivo regular ou 500–700, largura 88–100%.
- Hospede as fontes no próprio site (Fontsource ou arquivos em `public/fonts`), não dependa do Google Fonts em produção.

O brief antigo citava Barlow Condensed, Chakra Petch e JetBrains Mono; foram substituídas por Archivo e Anton na composição que o usuário aprovou.

### Componentes

- **Placa.** Paralelogramo branco levemente irregular, com uma segunda forma deslocada atrás em degradê vermelho → rosa → violeta. Texto em `--ink` com `text-shadow: 5px 5px 0 var(--red)`. É o estado selecionado de um comando e, em escala maior, a placa de identidade.
- **Moldura da foto.** Paralelogramo com borda `--ink` de 9 px e sombra vermelha deslocada. Recorta a foto nos quatro lados (a foto original corta o topo do cabelo e os ombros, por isso nunca aparece solta).
- **Filtro da foto.** Leve e frio: `saturate(.92) contrast(1.1) brightness(1.04)`, uma camada de degradê azul em `soft-light` a 42% e um escurecimento azul na base. O rosto tem de continuar em cor natural e reconhecível. O usuário rejeitou versão em duotone/cartum ("não quero parecer um avatar").
- **Menu em leque.** Só tipografia, sem caixas nem numeração. Cada item gira um pouco mais que o anterior (de −10° no primeiro a +3° no último), com tamanhos e tons de ciano alternados e leve sobreposição.
- **Carta Arcana.** Retângulo vertical com borda ciano, contorno interno fino, numeral romano em Anton e rótulo do projeto. Estado focado: carta branca, texto `--ink`, sombra vermelha e cursor triangular vermelho à esquerda.
- **Bloco de comandos.** Canto inferior direito: frase da ação atual em itálico branco com contorno `--navy`, a palavra "Comandos" com um fio branco, e as teclas em círculos.
- **Controle de música.** Canto superior direito: barras de equalizador e o nome da faixa.
- **Estilhaços.** Poucos paralelogramos pequenos em rosa, violeta e branco, soltos na água.

### Fundo

1. `water-*.jpg` em tela cheia (`object-fit: cover`).
2. Degradê por cima: ciano fraco no topo, transparente no meio, `--deep` a 50% e `--abyss` a 90% embaixo; mais um escurecimento da esquerda para o centro para a placa se destacar.
3. Feixes de luz descendo do canto superior direito.
4. `statue.webp` no canto inferior direito, com máscara que a dissolve à esquerda e embaixo.
5. Bolhas em formato de gota, em ciano claro, poucas.

## 6. Tela principal

Reproduza `comp-10.png`. Em 1920×1080:

- **Placa de identidade** cruzando o canto superior esquerdo a −11°, de x≈96 a x≈1340. Na ponta esquerda, a moldura com a foto (≈410×440). À direita, em duas linhas, `MARCOS ALEXANDRE` / `BERNARDO` (≈94 px). Abaixo: `Desenvolvimento de Software Multiplataforma · FATEC SJC · 2026-2`.
- **Menu em leque** no canto inferior esquerdo: `Sobre`, `Projetos`, `Formação`, `Skills`, `Contato`.
- **Três cartas Arcana** no centro, levemente abertas em leque:
  - I — API 2026-2 · Ordens de Serviço · Parceiro: Altave
  - II — API 2026-1 · We Logic · Parceiro: Newe Log
  - III — API 2025-2 · SCRUM Academy · Cliente interno FATEC
- **Estátuas** no canto inferior direito.
- **Música** no canto superior direito; **bloco de comandos** no canto inferior direito.

Comportamento:

- O nome é o `<h1>` da página.
- Os comandos são links de verdade dentro de um `<nav>`. Setas ↑/↓ movem a seleção, Enter abre, Esc volta ao menu principal. Mouse e toque também selecionam.
- As cartas Arcana **são selecionáveis** (confirmado ao usuário): cada uma abre direto o dossiê do seu projeto. Recebem foco por teclado, e ←/→ alterna entre elas quando uma está focada.
- A frase do bloco de comandos descreve o item focado (ex.: "Abrir dossiê do projeto", "Conhecer o Marcos").
- A palavra vertical gigante que existia em versões anteriores foi removida da tela principal a pedido do usuário.

## 7. Seções

Todas as seções seguem a estrutura dos submenus do jogo (ver `.impeccable/refs/p3r-menus-submenu-frames.png`): palavra gigante em Anton com o nome da seção, parcialmente cortada pela borda; o mesmo fundo de água; a foto ou as estátuas em outro enquadramento; conteúdo em lista com barra branca de seleção. O bloco de comandos passa a mostrar "Voltar" (Esc).

O menu tem cinco itens por decisão do usuário. O guia da FATEC continua exigindo Projetos Profissionais e Projetos Pessoais; eles ficam **dentro de Projetos** como abas. Isso foi informado ao usuário e ainda não foi confirmado por ele.

### 7.1 Sobre

Item obrigatório "Apresentação pessoal".

- Foto recente (a mesma, em moldura maior).
- Nome completo: Marcos Alexandre Bernardo.
- Localização: São José dos Campos, SP.
- Formação atual: Tecnólogo em Desenvolvimento de Software Multiplataforma — FATEC São José dos Campos – Prof. Jessen Vidal, agosto de 2025 a dezembro de 2028.
- Objetivos: em busca ativa de estágio; quer aplicar em contexto profissional a prática adquirida em projetos com clientes parceiros reais e sistemas auditáveis. Redija em primeira pessoa, sem inventar fatos além destes.
- Áreas de interesse: Engenharia de Software; Análise de Dados; Segurança da Informação (GRC, IAM, DLP); DevOps e Linux.

### 7.2 Projetos

Três abas: **API**, **Profissionais**, **Pessoais**.

**API (obrigatório).** Uma entrada por carta Arcana. Cada dossiê mostra, nesta ordem: empresa parceira (só o nome, **sem logotipo**), situação-problema, solução, tecnologias, contribuições pessoais, hard skills, soft skills e link para o repositório na conta pessoal.

**I — API 2026-2 — Sistema de Ordens de Serviço e Tickets**
- Parceiro: Altave.
- Papel: Desenvolvedor.
- Problema: gestão operacional fragmentada entre equipes que usavam softwares isolados, gerando ruído de comunicação, falta de visibilidade em tempo real para a liderança e perda de rastreabilidade das ordens de serviço.
- Solução: plataforma web unificada para abertura de tickets vinculados a projetos, fluxo de aprovação de encerramento com parecer, controle de acesso por cargos e equipes e histórico auditável.
- Tecnologias: Next.js, React, TypeScript, Prisma.
- Contribuições pessoais: rotas e regras de autenticação de usuários; restrição de acesso por tipo de conta (RBAC) e validação de equipes; perfil de conta; rotas `POST`/`GET` de projetos e de tickets de instalação; modelagem de tabelas no Prisma; correção da atribuição de equipes e prioridades nas telas.

**II — API 2026-1 — We Logic: Sistema de Gestão de Compras e Logística**
- Parceiro: Newe Log.
- Papel: Scrum Master e Desenvolvedor.
- Problema: processo de aquisições manual e descentralizado, com pedidos sem rastreabilidade, aprovações sem registro formal e estoque sem visibilidade em tempo real, causando retrabalho e dificuldade de auditoria.
- Solução: aplicação desktop com pedidos de numeração automática, fluxo de aprovação com parecer, controle de estoque com alerta de nível mínimo, cotações comparativas entre fornecedores, recebimento com nota fiscal e dashboard gerencial.
- Tecnologias: Java, JavaFX, MySQL, Spring Boot.
- Contribuições pessoais: facilitação das cerimônias Scrum; organização do backlog e das entregas das 3 sprints; modelagem de dados do fluxo de compras e logística; desenvolvimento em Java e MySQL.

**III — API 2025-2 — SCRUM Academy: Plataforma Web Educacional**
- Cliente: interno, FATEC.
- Papel: Product Owner.
- Problema: equipes iniciantes e organizações têm dificuldade de compreender na prática e replicar com consistência os ritos, artefatos e papéis do Scrum, e faltavam instrumentos para aferir a absorção do método.
- Solução: plataforma web modular com fundamentos referenciados, exemplos práticos de desenvolvimento, módulo de soft skills de TI e sistema de avaliações parciais e geral.
- Tecnologias: Python, Flask, HTML5, CSS3, JavaScript.
- Contribuições pessoais: definição da visão do produto; priorização do Product Backlog; especificação das User Stories com critérios de aceitação (DoR/DoD); validação das entregas com os stakeholders.

**Profissionais (obrigatório).** Marcos ainda não tem vínculo formal de estágio ou CLT. A aba diz isso com clareza e aponta a vivência prática: os projetos de API feitos para clientes parceiros reais e os sistemas auditáveis abaixo. Não invente empresa, cargo nem período. Deixe a estrutura pronta para receber um vínculo futuro.

**Pessoais e técnicos.** Repositórios em `github.com/MarcosAlexandre-txt`:

| Projeto | Repositório | Descrição |
|---|---|---|
| GreenCode AV2 — API REST de Logística Reversa | `AV2` | TypeScript, Fastify, PostgreSQL, Prisma, JWT (`@fastify/jwt` + `bcryptjs`), Docker Compose, OpenAPI/Swagger. Rastreia o ciclo de vida de equipamentos eletrônicos com controle de acesso por papéis. |
| GreenCode AV1 — CLI Auditável Criptografada | `Greencode` | TypeScript. Persistência criptografada em AES-256-GCM, trilha de auditoria encadeada por hash SHA-256, senhas com salt, sessão e permissões (administrador, operador, almoxarife, auditor). |
| Sistemas_JS03 — API REST de Vendas e Comissões | `Sistemas_JS03` | Node.js, Express, MySQL 8. Gestão de vendedores, comissão parametrizada por tipo de cliente (PF/PJ) e região, relatórios por período. |
| Sistemas_JS01 — Suíte Web de 6 Sistemas de Gestão | `Sistemas_JS01` | HTML5, CSS3, JavaScript puro, `localStorage`. Frete, Folha de Pagamento, Produção/Estoque, Reservas Hoteleiras, Carga de Treinos e Vendas/Comissões. |
| Tabletop Corner | `tabletop_corner` | Portal temático para comunidade de jogos de tabuleiro e RPG de mesa. |

### 7.3 Formação

Item obrigatório "Informações curriculares".

- Tecnólogo em Desenvolvimento de Software Multiplataforma — FATEC São José dos Campos – Prof. Jessen Vidal (ago/2025 – dez/2028).
- Google Cybersecurity Certificate — Google / Coursera, 2024. SQL, Python, Linux, redes, GRC, IAM, DLP e resposta a incidentes.
- Cisco IT Essentials — Cisco Networking Academy, 2025. Hardware, software, Windows, Linux, redes e segurança.
- Cisco Linux Essentials — Cisco Networking Academy, 2025. Administração Linux, linha de comando e permissões.

### 7.4 Skills

Competências do currículo: Python, Java, TypeScript, C#, C, SQL, MySQL, PostgreSQL, Power BI, Git, Linux, Redes, CI/CD, Scrum, Segurança da Informação (GRC, gestão de riscos, IAM, DLP, resposta a incidentes).

Agrupe por área (Linguagens; Dados; Infraestrutura e DevOps; Segurança; Métodos). O nível de cada uma aparece em **1 a 5 estrelas ou em categoria** ("Fluente", "Desenvolvedor Autônomo", "Utilizador Básico"). **Porcentagens são proibidas pelo guia.**

Os níveis ainda não foram informados (ver pendências). Não chute.

### 7.5 Contato

- LinkedIn: `https://www.linkedin.com/in/marcos-alexandre-cs`
- GitHub: `https://github.com/MarcosAlexandre-txt`
- E-mail: `marcos.alexandre.scrt@gmail.com`

O currículo traz telefone, mas o guia só pede LinkedIn, GitHub e e-mail. Não publique o telefone sem o usuário pedir.

No rodapé desta seção: créditos das imagens (ver `design/source/CREDITS.md`) e da música.

## 8. Movimento

Baseado nos dois vídeos que o usuário indicou (quadros em `.impeccable/refs/`).

- **Entrada.** Tela branca; a espuma se abre em "V" a partir do topo e revela a água; bolhas sobem e se dissipam; a placa de identidade entra em corte rápido e o menu abre em leque, item por item.
- **Repouso.** A superfície da água ondula devagar, poucas bolhas sobem, os feixes de luz oscilam, as estátuas têm um balanço e uma paralaxe leves. Calmo, de acordo com a música.
- **Seleção.** A placa branca salta para o item focado, com um pequeno excesso de rotação que se acomoda. A carta Arcana focada levanta e inclina.
- **Troca de seção.** Como no jogo: a lista cresce e gira para fora do quadro, um clarão branco de um quadro cobre a troca, a palavra gigante da seção desliza para o lugar e o conteúdo entra em seguida. Voltar faz o caminho inverso.
- **Movimento reduzido.** Com `prefers-reduced-motion: reduce`, tudo vira troca direta com um esmaecimento curto; nada de câmera, clarão ou partículas.

Three.js cuida do que precisa de profundidade: cartas Arcana (inclinação, giro ao selecionar), bolhas, ondulação da superfície e paralaxe das estátuas. Todo texto e controle fica em HTML por cima do canvas; nada de texto dentro do WebGL. Sem WebGL, ou com movimento reduzido, a tela cai para as imagens estáticas e continua completa.

## 9. Música

O usuário quer "Color Your Night" (Persona 3 Reload) criando uma atmosfera calma. A faixa é protegida por direitos autorais e o repositório será público. O usuário ainda **não escolheu** entre:

1. Player oficial do YouTube embutido (sem risco de direitos; o player precisa ficar visível).
2. Arquivo de áudio hospedado no site (controle visual total; risco de remoção por direitos fica com o usuário, que fornece o arquivo).

Não baixe a faixa nem coloque o áudio no repositório por conta própria. Construa o controle (botão e tecla `M`, estado tocando/pausado, volume lembrado) e pergunte ao usuário qual fonte usar. Nos dois casos a música só começa depois de uma ação do visitante; navegadores bloqueiam som automático.

## 10. Regras que não podem ser quebradas

- Nenhum logotipo de Altave ou Newe Log. Só o nome, em texto.
- Nenhuma porcentagem para descrever habilidade.
- Situação-problema nunca é "falta de sistema"; use os textos da seção 7.2.
- Cada projeto separa o que o time fez do que Marcos fez.
- Links de repositório de API apontam para cópias na conta pessoal `MarcosAlexandre-txt`.
- Não invente experiência profissional, métricas, números, soft skills específicas nem níveis de habilidade.
- Material do jogo (capturas, vídeo, áudio) não entra no site publicado.

## 11. Acessibilidade e responsivo

- Conteúdo inteiro no HTML, em seções com títulos. Sem JavaScript, a página funciona como uma rolagem única com todas as seções.
- Navegação completa por teclado, foco sempre visível, ordem de leitura lógica.
- Contraste medido sobre a foto real, na posição final de cada texto. O rótulo da música no topo claro e os textos pequenos das cartas Arcana são os pontos de atenção.
- Abaixo de ~900 px a composição empilha: placa de identidade no topo, menu em leque abaixo com inclinação menor, cartas Arcana em faixa horizontal rolável, estátuas reduzidas ao fundo. Alvos de toque com pelo menos 44 px.
- A foto tem 460 px; não a exiba maior que isso em pixels de CSS.

## 12. Pendências com o usuário

### Decisões confirmadas nesta construção

- Música: usar o arquivo fornecido pelo usuário em `/home/pottassiuw/Downloads/Color Your Night.mp3`. O usuário declarou que o fornecedor autorizou seu uso; autoria, crédito e termos de distribuição ainda não foram documentados. Não buscar ou baixar outra cópia.
- Skills: o usuário decidiu não usar níveis, estrelas, categorias de proficiência ou porcentagens. Agrupar por área e relacionar às evidências dos projetos. Esta decisão substitui a apresentação de níveis prevista na seção 7.4; permanece a divergência com a exigência acadêmica descrita neste handoff, já informada ao usuário.
- Projetos: confirmadas as abas API, Profissionais e Pessoais dentro de Projetos.

Pergunte antes de preencher os itens ainda não confirmados; até lá, deixe o espaço marcado como pendente no conteúdo, sem inventar.

1. Fonte da música (seção 9).
2. Confirmação de que Profissionais e Pessoais ficam como abas dentro de Projetos.
3. Nível de cada skill (1 a 5 estrelas ou categoria).
4. Soft skills exercitadas em cada API. O que os papéis documentados sugerem, a confirmar: facilitação e organização (We Logic, Scrum Master); comunicação com stakeholders e priorização (SCRUM Academy, Product Owner); colaboração técnica em equipe (Altave).
5. Hard skills adquiridas em cada API, se ele quiser algo além das tecnologias listadas.
6. URLs exatas dos repositórios das três APIs na conta pessoal.
7. Nome do repositório do site no GitHub, para configurar `site` e `base` do Astro.
8. Origem e licença da foto das estátuas (o usuário forneceu a imagem; autor desconhecido).
9. Foto de perfil maior e mais aberta, se ele tiver. A atual limita o tamanho da moldura.

## 13. Créditos de imagem

- Água: "Snell's window edge.jpg", de Hellbus, Wikimedia Commons, CC BY-SA 3.0. A versão convertida é uma adaptação: exige crédito visível e a mesma licença.
- Estátuas: imagem fornecida pelo usuário; licença a confirmar (pendência 8).
