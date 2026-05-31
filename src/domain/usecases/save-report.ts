import { Report } from '../entities/report';
import { ReportRepository } from '../repositories/report-repository';

export class SaveReportUseCase {
  constructor(private repository: ReportRepository) {}

  async execute(report: Report): Promise<void> {
    return this.repository.saveReport(report);
  }
}
