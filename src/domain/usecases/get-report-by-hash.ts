import { Report } from '../entities/report';
import { ReportRepository } from '../repositories/report-repository';

export class GetReportByHashUseCase {
  constructor(private repository: ReportRepository) {}

  async execute(hash: string): Promise<Report | null> {
    return this.repository.getReportByHash(hash);
  }
}
