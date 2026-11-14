---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Surface Brief: src/pages/index.astro

## Scope and Visitor Mode
- **Target:** `src/pages/index.astro` (and linked section/project views)
- **Mode:** Experience

## Audience, Job, Action & Proof
- **Audience:** FATEC São José dos Campos DSM evaluators checking the 2026-2 rubric and technical recruiters evaluating Marcos Alexandre Bernardo.
- **Visitor Job:** Inspect Marcos's profile (with photo), academic API projects (Altave 2026-2, Newe Log / We Logic 2026-1, SCRUM Academy 2025-2), professional/technical projects (GreenCode AV1/AV2, Sistemas_JS03, Sistemas_JS01), certifications (Google Cybersecurity, Cisco IT Essentials, Cisco Linux Essentials), and contact channels.
- **Primary Action:** select a command or an Arcana card; the card opens that API's full FATEC dossier.
- **Constraints:** No partner company logos (Altave, Newe Log named in text only); skills rated in 1-5 stars and proficiency categories (never percentages); static build for GitHub Pages with Astro + Bun + Three.js; profile photo from GitHub integrated directly in the main P3R menu.

## Direction contract

APPROVED COMP: `.impeccable/mocks/comp-10.png` (source `.impeccable/mocks/src/comp3.html`), approved by the user on 2026-11-10 after four comp rounds. Earlier comps (decision/assigned, comp-2 to comp-9) are superseded. Full build brief: `HANDOFF.md`.

THESIS: The portfolio is Persona 3 Reload's pause menu rebuilt for a person instead of a party: the visitor's name takes the game's selected-item plate at headline scale with his photo set into it, the commands fan out below, and three selectable Arcana cards float in front of sunken statues in real, photographed water. It refuses the static vertical-scroll developer template.

OWN-WORLD: A photograph of the water surface seen from below, graded into the game's blues (pale cyan #35d2ff through cobalt #0c46d0 to deep #041ba5 and abyss #020a52), with the user's statue image (two laureled poets) cut out, graded the same blue and sunk at the lower right. White plates with a red (#f3122f) offset and pink-to-violet (#ff8fd6 to #d89aff) edge carry identity and selection; type on them is ink (#05070f) with a hard red offset shadow. Commands are heavy condensed italic capitals (Archivo, wdth 84, wght 900, italic) in cyan tints, fanned by progressive rotation with no boxes. Giant upright condensed words (Anton) title each section, never the main screen. Raised from declined challengers: parallax depth planes, asymmetric blade collisions, a white flash synchronized with camera cuts.

STORY: Visitors see who this is before anything else (photo, full name, course), recognise a crafted interactive artifact, and reach every item the FATEC rubric requires through five commands (Sobre, Projetos, Formação, Skills, Contato) and three Arcana cards that open the API dossiers directly.

FIRST VIEWPORT: Full-viewport water photograph. Identity plate crossing the upper left at -11 degrees: slanted photo tile (real photo, light cool grade) at its left end, MARCOS ALEXANDRE BERNARDO in ink with red offset, course line beneath. Fanned command list at the lower left with the selected command on a small plate. Three Arcana cards (I API 2026-2, II API 2026-1, III API 2025-2) in the centre, each a link, the focused one white with the red cursor. Sunken statues at the lower right under light shafts. Music control top right, command hint bottom right. No partner logos, no giant vertical word.

FORM: seed:d517eba48fec0c6d, refined through comp rounds 2 to 4 by the user's direction (fidelity to the real menu, natural photo, identity plate, underwater photograph, statues).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Requested section composition extension

Scope: About, Education and Skills only. The approved home comp above remains authoritative for the home screen; it is not a composition spec for these sections. The user's explicit request pins the local compositions; this is an extension of the established world, not a replacement identity or a new direction tournament.

THESIS: Illustrations become places, while competencies become selectable Arcana. Refuse the framed-illustration-plus-text layout and the unexplained Skills astrolabe.

OWN-WORLD: Retain self-hosted Archivo/Anton, abyss/cobalt/cyan, white slanted plates and restrained red/pink selection details. Real photographs alone keep the portrait frame. The supplied train and classroom art blend into midnight-blue environments. Skills must retain the site's single continuous animated sea: waves, caustics and bubbles stay visible beneath translucent diagonal menu planes. Brand-specific colors belong to card fronts, not a replacement page identity.

STORY: Read the profile inside the train journey, inspect formation under moonlight, then select a hard or soft skill and inspect its existing evidence. No invented proficiency, claims or professional history.

FIRST VIEWPORT: About places its text on the left, the train character on the right, and a music control in the scene, with the real portrait and factual sheet below. Education places the course and semester track to the left of the integrated classroom, then certifications. Skills now follows the user's Social Link menu reference: a giant italic heading, hard/soft navigation, a slanted white selected-name plate and dark evidence panel on the left, one substantial Three.js deck on the right with a distinct selected front, a visible flip control and a horizontal selection rail of front thumbnails below. Mobile stacks the selected name, card and evidence. No rank, stars, levels or pending proficiency text.

FORM: User-pinned local compositions within the incumbent world, inherited seed:d517eba48fec0c6d. Signature interaction: one physical stack with five aligned lower layers and a selected card. Each selected card has its own 848×1264 front and the shared sun-face back. Clicking the card or the explicit flip button turns it over; selection draws a new front through a shared-back transition, with small physical lift and pointer lean. Hard skills use real locally vendored brand marks where applicable and original subject symbols elsewhere, with brand-associated colors. Four soft skills use original abstract geometry and their existing descriptions as trading-card captions, never stats. Cyclic navigation, hard/soft filters, touch swipe, keyboard and the HTML catalog drive the same selection. Texture residency is bounded to six, late loads cannot overwrite a newer selection, and offscreen/hidden rendering pauses. Environmental shaders preserve image aspect and stop when off-screen; reduced motion uses static environments and immediate card positioning.

FINISH: Extension reviewed at 1440×1000 and 390×844, plus Skills at the observed 1611×911 viewport; evidence and scoped verdict are in `.impeccable/review/immersive-finish-review.md` and `immersive-verdict.md`. Existing DESIGN.md absence is pre-existing drift, not repaired as a side effect. The user subsequently rejected the reference crops and requested a new Social Link-like screen with one shared high-quality card. The tiny crop assets are removed; `assets/plates/skill-card.png` is the generated 848×1264 reconstruction, with the exact prompt embedded and recorded in `design/source/skill-card-prompt.txt`. The next user request turns that shared illustration into the back of an actual deck, adds 27 original fronts and restores the continuous water. Current captures are `skill-deck-*`, with the scoped review in `skill-deck-review.md`; `skill-console-*` captures/reviews document the superseded shared-face version. The artwork is disclosed as a reconstruction, not an original game asset. There are no tarot names, rank, level, star or proficiency-pending elements in the current Skills view. The small selection counter is pagination.

## Performance and contextual-evidence refinement

The user's request to keep improving the software preserves the current Experience world and card artwork. Scope: cold-start GPU allocation, appropriately sized thumbnails, animation lifecycle and direct evidence navigation. Do not add decorative effects or alter factual content.

FORM: Preserve the inherited composition/seed. Initialize the deck only when its stage is near the viewport; direct Skills visits may activate immediately after a layout visibility check. Use 96px thumbnails for the 32px catalog while retaining 848×1264 full textures. All three animation surfaces share a cancellable frame loop, stop pending frames on document hiding and resume with a fresh clock. Static capture mode freezes the sea and route transitions. Existing evidence names become visible, keyboard-accessible 44px links to confirmed dossier/repository/certification destinations; the generic action is retained only when no specific evidence exists.

FINISH: Measured catalog image bytes: 1,752,732 → 68,558 (96.09% reduction, not a site-wide loading-time claim). Cold-start home contexts: 2 → 1; a previously visited deck remains cached but pauses offscreen. Automated checks: 16 tests / 462 assertions, normal and /portfolio builds, Astro check clean. Computed layout checks and functional evidence are in boost-*.json. Fresh visual capture is blocked by the Orca compositor's screenshot timeout; `boost-review.md` therefore has disposition `recapture`, not ship. Prior skill-deck screenshots remain historical evidence of the preceding version, not approval of the linked-evidence refinement.
