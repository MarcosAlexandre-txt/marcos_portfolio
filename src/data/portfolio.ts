export const academicProjects = [
  {
    id: 'altave', numeral: 'I', teamRepo: 'https://github.com/FawkesCode/API-2026.02/tree/main', term: 'API 2026-2', title: 'Sistema de Ordens de Serviço e Tickets', partner: 'Altave', role: 'Desenvolvedor',
    problem: 'A gestão operacional era fragmentada entre equipes que usavam softwares isolados, gerando ruído de comunicação, falta de visibilidade em tempo real para a liderança e perda de rastreabilidade das ordens de serviço.',
    solution: 'Plataforma web unificada para abertura de tickets vinculados a projetos, fluxo de aprovação de encerramento com parecer, controle de acesso por cargos e equipes e histórico auditável.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Prisma'],
    contributions: ['Implementei rotas e regras de autenticação de usuários.', 'Desenvolvi a restrição de acesso por tipo de conta (RBAC) e a validação de equipes.', 'Criação de rotas para o fluxo de tickets.', 'Modelagem do banco de dados no Prisma.', 'Elaborei a atribuição de equipes e prioridades nas telas.'],
    softSkills: ['Elicitação de Requisitos', 'Autonomia na resolução de problemas'],
  },
  {
    id: 'we-logic', numeral: 'II', teamRepo: 'https://github.com/FawkesCode/API-2026.01', term: 'API 2026-1', title: 'We Logic — Gestão de Compras e Logística', partner: 'Newe Log', role: 'Scrum Master e Desenvolvedor',
    problem: 'O processo de aquisições era manual e descentralizado, com pedidos sem rastreabilidade, aprovações sem registro formal e estoque sem visibilidade em tempo real, causando retrabalho e dificuldade de auditoria.',
    solution: 'Aplicação desktop com pedidos de numeração automática, fluxo de aprovação com parecer, controle de estoque com alerta de nível mínimo, cotações comparativas entre fornecedores, recebimento com nota fiscal e dashboard gerencial.',
    technologies: ['Java', 'JavaFX', 'MySQL', 'Spring Boot'],
    contributions: ['Organização das cerimônias Scrum.', 'Administração de backlog', 'Participei da modelagem de dados do fluxo de compras e logística.', 'Desenvolvi funcionalidades em Java e MySQL.'],
    softSkills: ['Otimização de reuniões', 'Mediação de impedimentos'],
  },
  {
    id: 'scrum-academy', numeral: 'III', teamRepo: 'https://github.com/KaikeCaboclo/Scrum_Projectile', term: 'API 2025-2', title: 'SCRUM Academy — Plataforma Web Educacional', partner: 'FATEC — cliente interno', role: 'Product Owner',
    problem: 'Equipes iniciantes e organizações têm dificuldade de compreender na prática e replicar com consistência os ritos, artefatos e papéis do Scrum. Faltavam também instrumentos para aferir a absorção do método.',
    solution: 'Plataforma web modular com fundamentos referenciados, exemplos práticos de desenvolvimento, módulo de soft skills de TI e sistema de avaliações parciais e geral.',
    technologies: ['Python', 'Flask', 'HTML5', 'CSS3', 'JavaScript'],
    contributions: ['Defini a visão do produto.', 'Priorizei o Product Backlog.', 'Especifiquei as User Stories com critérios de aceitação (DoR/DoD).', 'Validei as entregas com os stakeholders.'],
    softSkills: ['Empatia com o usuário', 'Clareza na documentação', 'Organização de requisitos', 'Tomada de decisão'],
  },
];
export const personalProjects = [
  {name: 'GreenCode AV3', subtitle:'Análises e API pública de logística reversa', repo:'Greencode-III', description:'Estende a API interna com camada analítica, acesso de parceiros por chave de API e limite de requisições e relatórios assíncronos.', stack:'TypeScript · Fastify · PostgreSQL · Prisma · JWT'},
  {name: 'GreenCode AV2', subtitle:'API REST de Logística Reversa', repo:'Greencode-II', description:'Rastreia o ciclo de vida de equipamentos eletrônicos com controle de acesso por papéis.', stack:'TypeScript · Fastify · PostgreSQL · Prisma · JWT · bcryptjs · Docker Compose · OpenAPI/Swagger'},
  {name: 'GreenCode AV1', subtitle:'CLI Auditável Criptografada', repo:'Greencode', description:'Persistência criptografada em AES-256-GCM, trilha de auditoria encadeada por hash SHA-256, senhas com salt, sessão e permissões de administrador, operador, almoxarife e auditor.', stack:'TypeScript · AES-256-GCM · SHA-256'},
  {name: 'BDR AV3', subtitle:'Modelo relacional e rotinas de auditoria', repo:'BDR_AV3', description:'Espelha o modelo Prisma da API em SQL, com procedimentos, funções, gatilhos e validações didáticas.', stack:'MySQL · MariaDB · SQL · Prisma'},
  {name: 'Sistemas JS04', subtitle:'API de carga de treinos esportivos', repo:'Sistemas_JS04', description:'Registra sessões de treino, calcula a carga semanal e sinaliza sobrecarga em um exercício didático.', stack:'Node.js · Express · Sequelize · MySQL'},
  {name: 'Sistemas_JS03', subtitle:'API REST de Vendas e Comissões', repo:'Sistemas_JS03', description:'Gestão de vendedores, comissão parametrizada por tipo de cliente (PF/PJ) e região e relatórios por período.', stack:'Node.js · Express · MySQL 8'},
  {name: 'Sistemas_JS01', subtitle:'Suíte Web de 6 Sistemas de Gestão', repo:'Sistemas_JS01', description:'Frete, Folha de Pagamento, Produção/Estoque, Reservas Hoteleiras, Carga de Treinos e Vendas/Comissões.', stack:'HTML5 · CSS3 · JavaScript · localStorage'},
];
/* `level` stays null until Marcos sets it (1 to 5 stars, never a percentage). `evidence` lists where the skill appears in this portfolio. */
type Skill = { name: string; level: 1 | 2 | 3 | 4 | 5 | null; evidence: string[] };
const skill = (name: string, ...evidence: string[]): Skill => ({ name, level: null, evidence });
export const skillGroups: { name: string; skills: Skill[] }[] = [
  {name:'Linguagens e web', skills:[
    skill('Python', 'SCRUM Academy', 'Google Cybersecurity'),
    skill('Java', 'We Logic'),
    skill('TypeScript', 'API Altave', 'GreenCode AV1', 'GreenCode AV2', 'GreenCode AV3'),
    skill('JavaScript', 'SCRUM Academy', 'Sistemas_JS01', 'Sistemas_JS03'),
    skill('HTML/CSS', 'SCRUM Academy', 'Sistemas_JS01'),
    skill('Flask', 'SCRUM Academy'),
    skill('C#'), skill('C'),
  ]},
  {name:'Dados', skills:[
    skill('SQL', 'Google Cybersecurity', 'We Logic', 'Sistemas_JS03'),
    skill('MySQL', 'We Logic', 'Sistemas_JS03'),
    skill('PostgreSQL', 'GreenCode AV2', 'GreenCode AV3'),
    skill('Power BI'),
  ]},
  {name:'Infraestrutura e DevOps', skills:[
    skill('Git'),
    skill('Linux', 'Cisco Linux Essentials', 'Cisco IT Essentials', 'Google Cybersecurity'),
    skill('Redes', 'Cisco IT Essentials', 'Google Cybersecurity'),
    skill('CI/CD'),
    skill('Docker', 'GreenCode AV2'),
  ]},
  {name:'Segurança da Informação', skills:[
    skill('GRC', 'Google Cybersecurity'),
    skill('Gestão de riscos'),
    skill('IAM', 'Google Cybersecurity'),
    skill('DLP', 'Google Cybersecurity'),
    skill('Resposta a incidentes', 'Google Cybersecurity'),
  ]},
  {name:'Métodos', skills:[skill('Scrum', 'We Logic', 'SCRUM Academy')]},
];
/* as Marcos describes them in his published portfolio */
export const softSkills = [
  {name:'Resolução de problemas', detail:'Abordagem analítica e estruturada para desafios complexos.'},
  {name:'Trabalho em equipe', detail:'Colaboração efetiva em metodologias ágeis e Scrum.'},
  {name:'Aprendizado contínuo', detail:'Autodidata e curiosidade constante por novas tecnologias.'},
  {name:'Comunicação', detail:'Clareza técnica em documentação e apresentações de produtos.'},
];
// Individual illustrated fronts + one shared back; art never assigns proficiency scores or tarot categories.
export const skillArcanas = [
  ...skillGroups.flatMap(group=>group.skills.map(item=>({ ...item, kind:'hard' as const, detail:'', group:group.name }))),
  ...softSkills.map(item=>({ ...item, evidence:[] as string[], level:null, kind:'soft' as const, group:'' })),
];
export const interests = ['Engenharia de Software', 'Análise de Dados', 'Segurança da Informação: GRC, IAM e DLP', 'DevOps e Linux'];
/* one mark per semester of the course, from the first (2025-2) to the last (2028-2) */
export const semesters = ['2025-2', '2026-1', '2026-2', '2027-1', '2027-2', '2028-1', '2028-2'];
export const currentSemester = '2026-2';
export const certifications = [
  {year:'2024', name:'Google Cybersecurity Certificate', issuer:'Google / Coursera', topics:['SQL', 'Python', 'Linux', 'Redes', 'GRC', 'IAM', 'DLP', 'Resposta a incidentes']},
  {year:'2025', name:'Cisco IT Essentials', issuer:'Cisco Networking Academy', topics:['Hardware', 'Software', 'Windows', 'Linux', 'Redes', 'Segurança']},
  {year:'2025', name:'Cisco Linux Essentials', issuer:'Cisco Networking Academy', topics:['Administração Linux', 'Linha de comando', 'Permissões']},
];
