import { Report } from '@/src/domain/entities/report';

export interface ReportDataSource {
  getReports(): Promise<Report[]>;
}

export class ReportLocalDataSource implements ReportDataSource {
  async getReports(): Promise<Report[]> {
    return [
      { id: '1', title: 'Relatório 1' },
      { id: '2', title: 'Relatório 2' },
      { id: '3', title: 'Relatório 3' },
    ];
  }
}
