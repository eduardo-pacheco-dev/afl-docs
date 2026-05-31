import { Report } from '../entities/report';

export interface ReportRepository {
  getReports(): Promise<Report[]>;
}
