import { Report } from '@/src/domain/entities/report';

function mapStatus(status?: string): string {
  const statusMap: Record<string, string> = {
    approved: 'Aprovado',
    reproved: 'Reprovado',
    rejected: 'Reprovado',
    pending: 'Pendente',
    in_progress: 'Em avaliação',
    evaluating: 'Em avaliação',
  };
  return status ? (statusMap[status] ?? status) : 'Pendente';
}

function mapQuestions(questions: Report['reports'][number]['questions'] | undefined) {
  return (questions ?? []).map((q) => ({
    ...q,
    status: mapStatus(q.status),
  }));
}

export function mapApiReportToReport(api: Report): Report {
  return {
    ...api,
    status: mapStatus(api.status),
    reports: (api.reports ?? []).map((section) => ({
      ...section,
      questions: mapQuestions(section.questions),
    })),
    questions_without_section: (api.questions_without_section ?? []).map((q) => ({
      ...q,
      status: mapStatus(q.status),
    })),
  };
}
