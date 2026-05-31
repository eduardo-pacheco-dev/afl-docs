import { FormAnswer } from '../entities/form-answer';
import { FormRepository } from '../repositories/form-repository';

export class SaveFormAnswersUseCase {
  constructor(private repository: FormRepository) {}

  async execute(reportId: string, answers: FormAnswer[]): Promise<void> {
    return this.repository.saveAnswers(reportId, answers);
  }
}
