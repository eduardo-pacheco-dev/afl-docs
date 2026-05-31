import { FormAnswer } from '../entities/form-answer';

export interface FormRepository {
  saveAnswers(reportId: string, answers: FormAnswer[]): Promise<void>;
  getAnswers(reportId: string): Promise<FormAnswer[]>;
}
