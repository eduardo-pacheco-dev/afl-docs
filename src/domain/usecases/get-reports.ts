import { Report } from '../entities/report';
import { ReportRepository } from '../repositories/report-repository';

export class GetReportsUseCase {
  constructor(private repository: ReportRepository) {}

  async execute(): Promise<Report[]> {
    return this.repository.getReports();
  }
}
