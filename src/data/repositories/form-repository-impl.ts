import { FormAnswer } from '@/src/domain/entities/form-answer';
import { FormRepository } from '@/src/domain/repositories/form-repository';
import { FormDataSource } from '../datasources/form-datasource';

export class FormRepositoryImpl implements FormRepository {
  constructor(private dataSource: FormDataSource) {}

  async saveAnswers(reportId: string, answers: FormAnswer[]): Promise<void> {
    return this.dataSource.saveAnswers(reportId, answers);
  }

  async getAnswers(reportId: string): Promise<FormAnswer[]> {
    return this.dataSource.getAnswers(reportId);
  }
}
