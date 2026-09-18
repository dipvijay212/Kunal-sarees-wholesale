export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface Highlight {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
