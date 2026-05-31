import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormAnswer } from '@/src/domain/entities/form-answer';

export interface FormDataSource {
  saveAnswers(reportId: string, answers: FormAnswer[]): Promise<void>;
  getAnswers(reportId: string): Promise<FormAnswer[]>;
}

const FORM_KEY = (reportId: string) => `@afl-docs/form/${reportId}`;

export class FormLocalDataSource implements FormDataSource {
  async saveAnswers(reportId: string, answers: FormAnswer[]): Promise<void> {
    await AsyncStorage.setItem(FORM_KEY(reportId), JSON.stringify(answers));
  }

  async getAnswers(reportId: string): Promise<FormAnswer[]> {
    const data = await AsyncStorage.getItem(FORM_KEY(reportId));
    return data ? JSON.parse(data) : [];
  }
}
