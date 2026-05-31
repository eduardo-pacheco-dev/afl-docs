import { Report } from '../entities/report';

export interface ReportRepository {
  getReports(): Promise<Report[]>;
  getReportById(id: string): Promise<Report | null>;
  saveReport(report: Report): Promise<void>;
  saveAll(reports: Report[]): Promise<void>;
}
