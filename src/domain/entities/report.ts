export interface QuestionAnswer {
  value: string | Record<string, unknown> | null;
}

export interface Question {
  id: number;
  label: string;
  type: string;
  options?: unknown;
  required: boolean;
  order: number;
  status?: string;
  description?: string;
  answer?: QuestionAnswer | null;
}

export interface Section {
  id: number;
  title: string;
  description?: string;
  order: number;
  questions: Question[];
}

export interface Form {
  id: number;
  title: string;
  description?: string;
}

export interface Report {
  id: number;
  uuid: string;
  title: string;
  description?: string;
  status: string;
  config?: Record<string, unknown>;
  site_id?: number;
  end_id?: number;
  operadora?: string;
  tecnico_nome?: string;
  form?: Form;
  reports: Section[];
  questions_without_section?: Question[];
  created_at: string;
  updated_at: string;
}
