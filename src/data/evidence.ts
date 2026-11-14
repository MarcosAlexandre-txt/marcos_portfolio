import { academicProjects, personalProjects, certifications } from './portfolio';

type EvidenceLink = { href:string; external:boolean };
const academicNames:Record<string,string> = {
  'API Altave':'altave',
  'We Logic':'we-logic',
  'SCRUM Academy':'scrum-academy',
};
const certificateNames:Record<string,string> = {
  'Google Cybersecurity':'Google Cybersecurity Certificate',
  'Cisco Linux Essentials':'Cisco Linux Essentials',
  'Cisco IT Essentials':'Cisco IT Essentials',
};

/** Links only to evidence already present in the supplied portfolio data. */
export function skillEvidenceLink(name:string):EvidenceLink|undefined {
  const academic=academicProjects.find(project=>project.id===academicNames[name]);
  if(academic) return {href:`#${academic.id}`,external:false};
  const personal=personalProjects.find(project=>project.name===name);
  if(personal) return {href:`https://github.com/MarcosAlexandre-txt/${personal.repo}`,external:true};
  if(certifications.some(certificate=>certificate.name===certificateNames[name])) return {href:'#formacao',external:false};
  return undefined;
}
