export interface FormQuestion {
  type: 'text' | 'photo' | 'yesno' | 'checkbox' | 'radio' | 'file';
  title: string;
  status?: string;
  placeholder?: string;
  description?: string;
  examples?: string[];
  options?: string[];
}

export interface FormSection {
  title: string;
  questions: FormQuestion[];
}

export interface Report {
  id: string;
  hash: string;
  title: string;
  subtitle: string;
  initials: string;
  status: string;
  date: string;
  auditor: string;
  executor: string;
  client: string;
  responsible: string;
  progress: number;
  approved: number;
  total: number;
  forms: FormSection[];
}
