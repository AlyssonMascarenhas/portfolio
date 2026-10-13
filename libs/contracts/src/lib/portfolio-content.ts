/** Datas no formato ISO 'yyyy-mm'. A formatação é responsabilidade da UI (Intl + idioma atual). */
export type YearMonth = `${number}-${number}`;

export interface Period {
  start: YearMonth;
  end: YearMonth | null; // null = atual
}

export interface Profile {
  name: string;
  headline: string;
  tagline: string;
  sectors: string;
  location: string;
  /** Início da carreira: a UI calcula os anos de experiência, então o número nunca fica desatualizado. */
  careerStart: YearMonth;
  about: string[];
  education: Education[];
  links: ProfileLinks;
}

export interface Education {
  institution: string;
  degree: string;
  period: Period;
}

export interface ProfileLinks {
  email: string;
  linkedin: string;
  github?: string;
  resume?: string;
}

export interface ExperienceRole {
  title: string;
  period: Period;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  period: Period;
  roles: ExperienceRole[];
  context: string;
  highlights: string[];
  stack: string[];
}

export interface SkillGroup {
  id: 'core' | 'architecture' | 'complementary';
  title: string;
  items: string[];
}

/** Formato completo do conteúdo de um idioma (usado pelo mock). */
export interface PortfolioContent {
  profile: Profile;
  experience: ExperienceEntry[];
  skills: SkillGroup[];
}
