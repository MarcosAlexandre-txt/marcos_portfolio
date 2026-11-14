export {};

const sectionIds = ['sobre','projetos','formacao','skills','contato'];
const projectIds = ['altave','we-logic','scrum-academy'];
const tabIds = ['api','profissionais','pessoais'];
const home = document.querySelector<HTMLElement>('.home')!;
const sections = [...document.querySelectorAll<HTMLElement>('.section-view')];
const panels = [...document.querySelectorAll<HTMLElement>('.project-panel')];
const dossiers = [...document.querySelectorAll<HTMLElement>('.project-dossier')];
const tabs = [...document.querySelectorAll<HTMLAnchorElement>('.tab-link')];
let currentTab = 'api';
let currentProject = 'altave';
let lastSection = '';
let origin: HTMLElement | null = null;
let initialized = false;

document.querySelector('.project-tabs')?.setAttribute('role','tablist');
for (const tab of tabs) {
  tab.setAttribute('role','tab');
  tab.id = `tab-${tab.dataset.tab}`;
  tab.setAttribute('aria-controls',tab.dataset.tab!);
  tab.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const index = event.key==='Home'?0:event.key==='End'?tabs.length-1:(tabs.indexOf(tab)+(event.key==='ArrowLeft'?-1:1)+tabs.length)%tabs.length;
    tabs[index].focus(); tabs[index].click();
  });
}
for (const panel of panels) {
  panel.setAttribute('role','tabpanel');
  panel.setAttribute('aria-labelledby',`tab-${panel.id}`);
}
function commitRoute() {
  const hash = location.hash.slice(1);
  let section = sectionIds.includes(hash)?hash:'';
  if(projectIds.includes(hash)) { section='projetos';currentTab='api';currentProject=hash; }
  if(tabIds.includes(hash)) { section='projetos';currentTab=hash; }
  if(hash==='projetos') currentTab='api';
  home.hidden = Boolean(section);
  sections.forEach(view=>{view.hidden=view.id!==section;});
  panels.forEach(panel=>{panel.hidden=panel.id!==currentTab;});
  dossiers.forEach(dossier=>{dossier.hidden=dossier.id!==currentProject;});
  tabs.forEach(tab=>{
    const active=tab.dataset.tab===currentTab;
    tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;
  });
  document.querySelectorAll<HTMLAnchorElement>('.project-index a').forEach(link=>link.setAttribute('aria-current',String(link.hash===`#${currentProject}`)));
  document.documentElement.dataset.view = section || 'inicio';
  if(initialized) {
    if(!section) {
      (origin?.isConnected?origin:document.querySelector<HTMLElement>('.command.selected'))?.focus({preventScroll:true});
    } else if(section!==lastSection) {
      document.querySelector<HTMLElement>(`#${section}-title`)?.focus({preventScroll:true});
    } else if(projectIds.includes(hash)) {
      document.querySelector<HTMLElement>(`#${currentProject}-title`)?.focus({preventScroll:true});
    }
  }
  if(section!==lastSection || projectIds.includes(hash)) window.scrollTo(0,0);
  lastSection = section;
  initialized = true;
}
function renderRoute() {
  if(initialized && !document.documentElement.classList.contains('still') && !matchMedia('(prefers-reduced-motion: reduce)').matches && document.startViewTransition) {
    document.startViewTransition(commitRoute);
  } else commitRoute();
}
document.addEventListener('click',event=>{
  const link=(event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  if(!link) return;
  const id=link.hash.slice(1);
  if(![...sectionIds,...projectIds,...tabIds,'inicio'].includes(id)) return;
  if(!home.hidden&&id!=='inicio') origin=link;
  if(location.hash===link.hash) {event.preventDefault();renderRoute();}
});
window.addEventListener('hashchange',renderRoute);
renderRoute();
document.documentElement.classList.add('enhanced');
