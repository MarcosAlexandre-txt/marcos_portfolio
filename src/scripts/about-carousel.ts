const story = document.querySelector<HTMLElement>('.about-story');
if (story) {
  const slides = [...story.querySelectorAll<HTMLElement>('.about-story-slide')];
  const position = story.querySelector<HTMLElement>('[data-story-position]')!;
  const previous = story.querySelector<HTMLButtonElement>('[data-story-prev]')!;
  const next = story.querySelector<HTMLButtonElement>('[data-story-next]')!;
  const backdrops = [...document.querySelectorAll<HTMLElement>('.about-backdrops [data-story-backdrop]')];
  let current = 0;

  function show(index: number) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    backdrops.forEach((backdrop, i) => { backdrop.classList.toggle('is-active', i === current); });
    position.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }

  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  story.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  story.classList.add('enhanced');
}
