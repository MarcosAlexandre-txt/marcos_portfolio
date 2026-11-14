import { describe, expect, test } from 'bun:test';
import { skillEvidenceLink } from '../src/data/evidence';
import { skillArcanas, academicProjects, personalProjects } from '../src/data/portfolio';

describe('Evidências de competências',()=>{
  test('abre o dossiê correto, não a API selecionada anteriormente',()=>{
    expect(skillEvidenceLink('SCRUM Academy')).toEqual({href:'#scrum-academy',external:false});
    expect(skillEvidenceLink('We Logic')).toEqual({href:'#we-logic',external:false});
    expect(skillEvidenceLink('API Altave')).toEqual({href:'#altave',external:false});
  });
  test('repositórios e certificados usam somente destinos já confirmados',()=>{
    for(const skill of skillArcanas) for(const name of skill.evidence) {
      const link=skillEvidenceLink(name);
      expect(link).toBeDefined();
      if(link?.external) {
        expect(personalProjects.some(project=>link.href===`https://github.com/MarcosAlexandre-txt/${project.repo}`)).toBe(true);
      } else {
        expect(link?.href==='#formacao'||academicProjects.some(project=>link?.href===`#${project.id}`)).toBe(true);
      }
    }
    expect(skillEvidenceLink('Google Cybersecurity')).toEqual({href:'#formacao',external:false});
  });
  test('não fabrica evidências nem URLs para nomes desconhecidos',()=>{
    expect(skillEvidenceLink('Experiência não informada')).toBeUndefined();
    expect(skillEvidenceLink('')).toBeUndefined();
    expect(skillEvidenceLink('https://exemplo.com')).toBeUndefined();
  });
});
