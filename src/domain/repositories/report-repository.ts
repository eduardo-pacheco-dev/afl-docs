import { Report } from '../entities/report';

export interface ReportRepository {
  getReports(): Promise<Report[]>;
  getReportById(id: string): Promise<Report | null>;
  getReportByHash(hash: string): Promise<Report | null>;
  saveReport(report: Report): Promise<void>;
  saveAll(reports: Report[]): Promise<void>;
  deleteReportById(id: string): Promise<void>;
}
