# Portfólio — Marcos Alexandre Bernardo

Portfólio estático desenvolvido com Astro, TypeScript e Three.js. O projeto usa Bun para instalar dependências e executar os scripts.

## Rodar localmente

```sh
bun install
bun run dev
```

O terminal informa o endereço local. Para verificar a versão de produção:

```sh
bun run check
bun test
bun run build
bun run preview
```

## Onde encontrar cada parte

- `src/pages/index.astro`: página principal e inicialização das interações.
- `src/components/SectionViews.astro`: conteúdo de Sobre, Projetos, Formação, Skills e Contato.
- `src/data/portfolio.ts`: projetos, competências e formação.
- `src/scripts/`: navegação, carrossel, cartas e efeitos visuais.
- `src/styles/`: estilos e regras responsivas.
- `assets/`: imagens usadas no build; `public/`: arquivos servidos diretamente, incluindo o áudio.
- `design/source/`: registros de origem e referências das artes.

O conteúdo principal permanece no HTML sem JavaScript. Os controles de música são opcionais; animações respeitam a preferência por movimento reduzido, e as cartas têm alternativa sem WebGL.


