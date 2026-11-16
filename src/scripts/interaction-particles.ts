/* A short visual acknowledgment of an intentional selection. No permanent canvas or frame loop. */
const selector = '.command,.arcana-card,.home-preview a,.about-story-controls button,.project-index a,.tab-link,.go,.hero-actions a,.arcana-catalog button,.arcana-filters button,.channels a';

export function startInteractionParticles() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let lastHover = 0;
  function emit(target: HTMLElement, count: number, x?: number, y?: number) {
    if (reduced.matches || document.hidden) return;
    const box = target.getBoundingClientRect();
    const cx = x ?? box.left + box.width / 2;
    const cy = y ?? box.top + box.height / 2;
    const colors = ['#78e9ff', '#b5f6ff', '#ff8fd6'];
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('i');
      dot.className = 'interaction-particle';
      dot.setAttribute('aria-hidden', 'true');
      dot.style.left = `${cx}px`;
      dot.style.top = `${cy}px`;
      dot.style.setProperty('--size', `${4 + (i % 3) * 2}px`);
      dot.style.setProperty('--particle-color', colors[i % colors.length]);
      document.body.append(dot);
      const angle = (Math.PI * 2 * i / count) - Math.PI / 2;
      const distance = count > 2 ? 28 + (i % 3) * 13 : 20;
      const animation = dot.animate([
        { transform: 'translate(-50%, -50%) rotate(35deg) scale(.4)', opacity: .9 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) rotate(95deg) scale(.1)`, opacity: 0 },
      ], { duration: count > 2 ? 520 : 340, easing: 'cubic-bezier(.16,1,.3,1)' });
      animation.onfinish = () => dot.remove();
      animation.oncancel = () => dot.remove();
    }
  }
  document.addEventListener('pointerover', event => {
    if (performance.now() - lastHover < 180) return;
    const target = (event.target as Element).closest<HTMLElement>(selector);
    if (!target || target.contains(event.relatedTarget as Node)) return;
    lastHover = performance.now();
    emit(target, 1);
  });
  document.addEventListener('focusin', event => {
    const target = (event.target as Element).closest<HTMLElement>(selector);
    if (target) emit(target, 2);
  });
  document.addEventListener('click', event => {
    const target = (event.target as Element).closest<HTMLElement>(selector);
    if (target) emit(target, 7, event instanceof MouseEvent && event.detail ? event.clientX : undefined, event instanceof MouseEvent && event.detail ? event.clientY : undefined);
  });
}
