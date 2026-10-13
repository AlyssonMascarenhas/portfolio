import { PortfolioContent } from '@portfolio/contracts';

export const ptBr: PortfolioContent = {
  profile: {
    name: 'Alysson Mascarenhas',
    headline: 'Engenheiro de Software · Front-end Sênior · Angular',
    tagline:
      'Construo aplicações Angular escaláveis e ajudo times a tomarem boas decisões de arquitetura.',
    sectors: 'Telecom, banking, ERP e e-commerce',
    location: 'São Paulo, Brasil',
    careerStart: '2019-04',
    about: [
      'Sou desenvolvedor front-end com foco em Angular e TypeScript, formado em Engenharia de Software pela UFC. Trabalhei em sistemas onde erro custa caro: Internet Banking PJ e funcionalidades regulatórias do Pix, ferramentas operacionais de telecom e plataformas de ERP e e-commerce.',
      'Boa parte do meu trabalho nos últimos anos foi liderança técnica: conduzir refinamentos, traduzir necessidade de negócio em solução viável, definir padrões de arquitetura e revisar código. Gosto de deixar o time melhor do que encontrei, com documentação que facilita o onboarding, guidelines claras e testes que dão confiança para evoluir.',
      'Recentemente, tenho estruturado regras e contexto para desenvolvimento assistido por IA, para que essas ferramentas sigam os padrões de arquitetura e de negócio do projeto em vez de gerar código genérico.',
      'Este portfólio é uma extensão disso: em vez de listar tecnologias, ele mostra como eu decido.',
    ],
    education: [
      {
        institution: 'Universidade Federal do Ceará',
        degree: 'Bacharelado em Engenharia de Software',
        period: { start: '2018-02', end: '2022-12' },
      },
    ],
    links: {
      email: 'alymascarenhas31@gmail.com',
      linkedin: 'https://www.linkedin.com/in/alyssonmascarenhas',
      github: 'https://github.com/AlyssonMascarenhas',
      resume: 'curriculo-alysson-mascarenhas.pdf',
    },
  },

  experience: [
    {
      id: 'forma-turismo',
      company: 'Forma Turismo',
      period: { start: '2025-01', end: null },
      // TODO: ajustar o título se o cargo oficial for de liderança técnica
      roles: [
        {
          title: 'Desenvolvedor Front-end Angular',
          period: { start: '2025-01', end: null },
        },
      ],
      context: 'ERP e e-commerce com Angular e Ionic.',
      highlights: [
        'Liderança técnica do time front-end: refinamentos, estimativas e direcionamento das entregas.',
        'Padrões de desenvolvimento, guidelines e regras de arquitetura para o projeto.',
        'Documentação técnica de decisões arquiteturais, fluxos e integrações para facilitar o onboarding.',
        'Regras e contexto para desenvolvimento assistido por IA alinhado aos padrões do projeto.',
      ],
      stack: [
        'Angular',
        'Ionic',
        'Arquitetura',
        'IA aplicada ao desenvolvimento',
      ],
    },
    {
      id: 'cwi',
      company: 'CWI Software',
      period: { start: '2024-04', end: '2025-01' },
      roles: [
        {
          title: 'Desenvolvedor Front-end Angular',
          period: { start: '2024-04', end: '2025-01' },
        },
      ],
      context: 'Time de soluções regulatórias do Internet Banking PJ.',
      highlights: [
        'Funcionalidades do ecossistema Pix, incluindo Pix Automático e Pix Agendado.',
        'Ampliação da cobertura de testes com Jest em fluxos bancários sensíveis.',
        'Migração do Design System legado para uma nova arquitetura.',
      ],
      stack: ['Angular', 'Jest', 'Design System', 'Sistemas críticos'],
      relatedLab: {
        label: 'API Playground: tratamento de erros em fluxos críticos',
        route: '/labs/api-playground',
      },
    },
    {
      id: 'brisanet',
      company: 'Brisanet Telecomunicações',
      period: { start: '2021-04', end: '2024-04' },
      roles: [
        {
          title: 'Líder técnico de Front-end',
          period: { start: '2023-01', end: '2024-04' },
        },
        {
          title: 'Desenvolvedor Front-end Angular',
          period: { start: '2021-04', end: '2023-01' },
        },
      ],
      context: 'Sistemas corporativos internos do setor de telecom.',
      highlights: [
        'Como líder: análise de requisitos com stakeholders, coordenação do time e definição de padrões de arquitetura entre projetos.',
        'Como desenvolvedor: mapas com Google Maps para dados geográficos e dashboards com Highcharts.',
        'Estruturação e automação de testes com Jest.',
      ],
      stack: [
        'Angular',
        'Liderança técnica',
        'Google Maps',
        'Highcharts',
        'Jest',
      ],
    },
    {
      id: 'freelance',
      company: 'Freelance',
      period: { start: '2019-04', end: '2021-01' },
      roles: [
        {
          title: 'Desenvolvedor Front-end Angular',
          period: { start: '2019-04', end: '2021-01' },
        },
      ],
      context: 'Sistemas sob demanda para gestão de negócios.',
      highlights: [
        'Módulos de gestão de estoque, relatórios financeiros e dashboards.',
        'Catálogos virtuais e interfaces de gerenciamento de produtos.',
      ],
      stack: ['Angular', 'TypeScript', 'APIs REST'],
    },
  ],

  skills: [
    {
      id: 'core',
      title: 'Principal',
      items: [
        'Angular',
        'TypeScript',
        'JavaScript',
        'Jest',
        'Ionic',
        'Design Systems',
      ],
    },
    {
      id: 'architecture',
      title: 'Arquitetura e liderança',
      items: [
        'Padrões de código',
        'Design patterns',
        'Code review',
        'Refinamento técnico',
        'Documentação',
        'CI/CD',
        'IA aplicada ao desenvolvimento',
      ],
    },
    {
      id: 'complementary',
      title: 'Complementar',
      items: ['React', 'Next.js', 'Node.js', 'Docker', 'AWS', 'Monitoramento'],
    },
  ],
};
