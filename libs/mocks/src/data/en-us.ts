import { PortfolioContent } from '@portfolio/contracts';

export const enUs: PortfolioContent = {
  profile: {
    name: 'Alysson Mascarenhas',
    headline: 'Software Engineer · Senior Front-end · Angular',
    tagline:
      'I build scalable Angular applications and help teams make sound architecture decisions.',
    sectors: 'Telecom, banking, ERP and e-commerce',
    location: 'São Paulo, Brazil',
    careerStart: '2019-04',
    about: [
      "I'm a front-end developer focused on Angular and TypeScript, with a degree in Software Engineering from the Federal University of Ceará (UFC). I've worked on systems where mistakes are expensive: corporate Internet Banking and regulatory features for Pix, Brazil's instant payment system, internal telecom tools, and ERP and e-commerce platforms.",
      'Much of my recent work has been technical leadership: running refinement sessions, turning business needs into viable solutions, defining architecture standards and reviewing code. I like leaving a team better than I found it, with documentation that makes onboarding easier, clear guidelines, and tests that give people the confidence to change things.',
      "Lately I've been writing rules and context for AI-assisted development, so these tools follow the project's architecture and business standards instead of producing generic code.",
      'This portfolio is an extension of that: instead of listing technologies, it shows how I make decisions.',
    ],
    education: [
      {
        institution: 'Federal University of Ceará (UFC)',
        degree: "Bachelor's in Software Engineering",
        period: { start: '2018-02', end: '2022-12' },
      },
    ],
    links: {
      email: 'alymascarenhas31@gmail.com',
      linkedin: 'https://www.linkedin.com/in/alyssonmascarenhas',
      github: 'https://github.com/AlyssonMascarenhas/portfolio',
      resume: 'curriculo-alysson-mascarenhas.pdf',
    },
  },

  experience: [
    {
      id: 'forma-turismo',
      company: 'Forma Turismo',
      period: { start: '2025-01', end: null },
      roles: [
        {
          title: 'Front-end Developer (Angular)',
          period: { start: '2025-01', end: null },
        },
      ],
      context: 'ERP and e-commerce platforms built with Angular and Ionic.',
      highlights: [
        'Technical leadership of the front-end team: backlog refinement, estimates and delivery guidance.',
        'Development standards, guidelines and architecture rules for the project.',
        'Technical documentation of architecture decisions, flows and integrations to speed up onboarding.',
        "Rules and context for AI-assisted development aligned with the project's standards.",
      ],
      stack: ['Angular', 'Ionic', 'Architecture', 'AI-assisted development'],
    },
    {
      id: 'cwi',
      company: 'CWI Software',
      period: { start: '2024-04', end: '2025-01' },
      roles: [
        {
          title: 'Front-end Developer (Angular)',
          period: { start: '2024-04', end: '2025-01' },
        },
      ],
      context:
        'Regulatory solutions team for a corporate Internet Banking platform.',
      highlights: [
        'Features for the Pix instant payment ecosystem, including Pix Automático (recurring payments) and Pix Agendado (scheduled payments).',
        'Expanded Jest test coverage in sensitive banking flows.',
        'Migration of the legacy Design System to a new architecture.',
      ],
      stack: ['Angular', 'Jest', 'Design System', 'Critical systems'],
    },
    {
      id: 'brisanet',
      company: 'Brisanet Telecomunicações',
      period: { start: '2021-04', end: '2024-04' },
      roles: [
        {
          title: 'Front-end Tech Lead',
          period: { start: '2023-01', end: '2024-04' },
        },
        {
          title: 'Front-end Developer (Angular)',
          period: { start: '2021-04', end: '2023-01' },
        },
      ],
      context: 'Internal corporate systems for a telecom company.',
      highlights: [
        'As tech lead: requirements analysis with stakeholders, team coordination and architecture standards across projects.',
        'As developer: Google Maps features for geographic data and Highcharts dashboards.',
        'Set up and automated tests with Jest.',
      ],
      stack: [
        'Angular',
        'Technical leadership',
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
          title: 'Front-end Developer (Angular)',
          period: { start: '2019-04', end: '2021-01' },
        },
      ],
      context: 'Custom business management systems.',
      highlights: [
        'Inventory management modules, financial reports and dashboards.',
        'Product catalogs and product management interfaces.',
      ],
      stack: ['Angular', 'TypeScript', 'REST APIs'],
    },
  ],

  skills: [
    {
      id: 'core',
      title: 'Core',
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
      title: 'Architecture and leadership',
      items: [
        'Coding standards',
        'Design patterns',
        'Code review',
        'Technical refinement',
        'Documentation',
        'CI/CD',
        'AI-assisted development',
      ],
    },
    {
      id: 'complementary',
      title: 'Complementary',
      items: ['React', 'Next.js', 'Node.js', 'Docker', 'AWS', 'Monitoring'],
    },
  ],
};
