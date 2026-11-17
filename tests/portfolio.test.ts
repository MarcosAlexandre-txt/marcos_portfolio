import { describe, expect, test } from 'bun:test';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { academicProjects, personalProjects, skillGroups, skillArcanas } from '../src/data/portfolio';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
describe('Conteúdo estático e restrições do portfólio', () => {
  test('mantém todas as seções legíveis no HTML, sem JavaScript', () => {
    for (const id of ['sobre','projetos','formacao','skills','contato','api','profissionais','academicos',...academicProjects.map(p=>p.id)]) {
      expect(html).toContain(`id="${id}"`);
    }
    expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
    expect(html).not.toMatch(/<section[^>]*\shidden(?:\s|>)/);
  });
  test('separa problema, solução do time e contribuições pessoais nas três APIs', () => {
    expect(academicProjects).toHaveLength(3);
    for (const p of academicProjects) {
      expect(p.problem.length).toBeGreaterThan(80);
      expect(p.solution.length).toBeGreaterThan(80);
      expect(p.contributions.length).toBeGreaterThanOrEqual(4);
      expect(p.softSkills.length).toBeGreaterThanOrEqual(2);
      expect(html).toContain(p.teamRepo);
      expect(html).toContain(`id="${p.id}-title"`);
    }
    expect(html.match(/Soft skills exercitadas/g)?.length).toBe(3);
    expect(html).not.toContain('URL da cópia na conta MarcosAlexandre-txt a confirmar');
    expect(html).not.toContain('Tabletop Corner');
    expect(html).not.toContain('class="hero-brief"');
  });
  test('não inventa níveis, URLs de API ou experiência profissional', () => {
    expect(skillGroups.flatMap(g=>g.skills)).toHaveLength(23);
    expect(skillGroups.flatMap(g=>g.skills).every(skill=>skill.level===null)).toBe(true);
    expect(html).toContain('Ainda não tenho vínculo formal de estágio ou CLT');
    expect(html).not.toContain('★★★★★');
    expect(html).not.toMatch(/(?:proficiência|habilidade|skill)[^<]{0,25}\d+%/i);
    for (const p of personalProjects) expect(html).toContain(`https://github.com/MarcosAlexandre-txt/${p.repo}`);
    expect(html).not.toContain('98167');
  });
  test('música exige interação e arquivos de referência não são publicados', () => {
    const base = (process.env.ASTRO_BASE || '/').replace(/\/?$/, '/');
    expect(html).toContain(`src="${base}audio/color-your-night.mp3"`);
    expect(html).toContain('preload="none"');
    expect(html).not.toMatch(/<audio[^>]*\bautoplay/);
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('.impeccable');
    expect(existsSync(new URL('../dist/audio/color-your-night.mp3', import.meta.url))).toBe(true);
    expect(existsSync(new URL('../dist/.impeccable', import.meta.url))).toBe(false);
  });
  test('integra as ilustrações ao ambiente e mantém as 27 competências nas arcanas', () => {
    expect(html).toContain('scene-environment train-environment');
    expect(html).toContain('scene-environment classroom-environment');
    expect(html).not.toContain('data-astrolabe');
    expect(skillArcanas.filter(item=>item.kind==='hard')).toHaveLength(23);
    expect(skillArcanas.filter(item=>item.kind==='soft')).toHaveLength(4);
    const card=readFileSync(new URL('../assets/plates/skill-card.png',import.meta.url));
    expect(card.readUInt32BE(16)).toBeGreaterThanOrEqual(800);
    expect(card.readUInt32BE(20)).toBeGreaterThanOrEqual(1200);
    expect(html).not.toContain('O Mago');
    expect(html).not.toContain('A Força');
    expect(html).not.toContain('arcana-archetype');
    expect(html).not.toContain('arcana-domain');
    expect(html.match(/data-card-art=/g)?.length).toBe(1);
    const skillsHTML=html.split('id="skills"')[1].split('id="contato"')[0];
    expect(skillsHTML).not.toMatch(/Nível de proficiência|arcana-level|★★★★★|rank/i);
    expect(skillsHTML).toContain('skill-console');
    expect(skillsHTML).toContain('Escolha uma competência');
    for(const [i,item] of skillArcanas.entries()) {
      expect(html).toContain(`id="skill-${i}"`);
      expect(html).toContain(item.name.replace(/&/g,'&amp;'));
    }
    expect(html).toContain('data-arcana-prev');
    expect(html).toContain('data-arcana-next');
  });
  test('baralho tem 27 frentes próprias, verso compartilhado e controle acessível para virar', () => {
    const faces=[...html.matchAll(/data-card-front="([^"]+)"/g)].map(match=>match[1]);
    expect(faces).toHaveLength(27);
    expect(new Set(faces).size).toBe(27);
    const base=(process.env.ASTRO_BASE||'/').replace(/\/?$/, '/');
    expect(faces.every(src=>src.startsWith(`${base}_astro/`))).toBe(true);
    expect(html).toContain('data-card-flip');
    expect(html).toContain('data-card-status');
    for(const [i,skill] of skillArcanas.entries()) {
      const id=String(i).padStart(2,'0');
      const metadata=JSON.parse(readFileSync(new URL(`../assets/skill-fronts/${id}.webp.json`,import.meta.url),'utf8'));
      expect(metadata.skill).toBe(skill.name);
      expect(metadata.width).toBe(848);
      expect(metadata.height).toBe(1264);
      expect(metadata.proficiency).toBe(false);
      expect(existsSync(new URL(`../assets/skill-fronts/${id}.webp`,import.meta.url))).toBe(true);
    }
    const css=readFileSync(new URL('../src/styles/skills.css',import.meta.url),'utf8');
    expect(css).not.toContain('background:#edfaff');
    expect(css).not.toContain('#05b4e6 0%');
    const script=readFileSync(new URL('../src/scripts/arcanas.ts',import.meta.url),'utf8');
    expect(script).toContain('resident.size<=6');
    expect(script).toContain('front,back');
  });
  test('miniaturas são pequenas sem reduzir a resolução das cartas 3D', () => {
    const faces=[...html.matchAll(/data-card-front="([^"]+)"/g)].map(match=>match[1]);
    const tags=[...html.matchAll(/data-skill-card="\d+"[^>]*>\s*(<img[^>]+>)/g)].map(match=>match[1]);
    expect(tags).toHaveLength(27);
    let fullBytes=0,thumbBytes=0;
    const assetBytes=(src:string)=>statSync(new URL(`../dist/_astro/${src.split('/').at(-1)}`,import.meta.url)).size;
    for(const [i,tag] of tags.entries()) {
      const src=tag.match(/src="([^"]+)"/)![1];
      expect(src).not.toBe(faces[i]);
      expect(tag).toContain('width="96"');
      expect(tag).toContain('loading="lazy"');
      expect(tag).toContain('decoding="async"');
      fullBytes+=assetBytes(faces[i]);thumbBytes+=assetBytes(src);
    }
    expect(thumbBytes).toBeLessThan(fullBytes/5);
    expect(html).toContain('class="skill-evidence-link" href="#scrum-academy"');
    expect(html).toContain('class="skill-evidence-link" href="#altave"');
  });
  test('preserva contatos e os créditos no arquivo separado', () => {
    expect(html).toContain('mailto:marcos.alexandre.scrt@gmail.com');
    expect(html).toContain('https://www.linkedin.com/in/marcos-alexandre-cs');
    expect(html).not.toContain('Créditos e licenças');
    expect(html).toContain('images/marcos-perfil.jpg');
    const credits=readFileSync(new URL('../dist/creditos/index.html',import.meta.url),'utf8');
    expect(credits).toContain('Hellbus');
    expect(credits).toContain('https://creativecommons.org/licenses/by-sa/3.0/');
  });
});
