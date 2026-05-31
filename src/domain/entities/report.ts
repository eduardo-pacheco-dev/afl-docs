export interface Report {
  id: string;
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
}
