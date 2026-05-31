import { Report } from '../entities/report';
import { ReportRepository } from '../repositories/report-repository';

export class GetReportByIdUseCase {
  constructor(private repository: ReportRepository) {}

  async execute(id: string): Promise<Report | null> {
    return this.repository.getReportById(id);
  }
}
