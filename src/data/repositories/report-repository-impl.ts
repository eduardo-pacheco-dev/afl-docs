import { Report } from '@/src/domain/entities/report';
import { ReportRepository } from '@/src/domain/repositories/report-repository';
import { ReportDataSource } from '../datasources/report-datasource';

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private dataSource: ReportDataSource) {}

  async getReports(): Promise<Report[]> {
    return this.dataSource.getReports();
  }

  async getReportById(id: string): Promise<Report | null> {
    return this.dataSource.getReportById(id);
  }

  async getReportByHash(hash: string): Promise<Report | null> {
    return this.dataSource.getReportByHash(hash);
  }

  async saveReport(report: Report): Promise<void> {
    return this.dataSource.saveReport(report);
  }

  async saveAll(reports: Report[]): Promise<void> {
    return this.dataSource.saveAll(reports);
  }
}
