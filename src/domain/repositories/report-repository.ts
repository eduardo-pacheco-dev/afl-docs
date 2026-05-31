import { Report } from '../entities/report';

export interface ReportRepository {
  getReports(): Promise<Report[]>;
  saveReport(report: Report): Promise<void>;
  saveAll(reports: Report[]): Promise<void>;
}
