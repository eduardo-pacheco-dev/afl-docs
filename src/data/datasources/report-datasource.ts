import AsyncStorage from '@react-native-async-storage/async-storage';
import { Report } from '@/src/domain/entities/report';

const REPORTS_KEY = '@afl-docs/reports';

export interface ReportDataSource {
  getReports(): Promise<Report[]>;
  saveReport(report: Report): Promise<void>;
  saveAll(reports: Report[]): Promise<void>;
}

export class ReportLocalDataSource implements ReportDataSource {
  async getReports(): Promise<Report[]> {
    const data = await AsyncStorage.getItem(REPORTS_KEY);
    if (!data) {
      const defaults: Report[] = [
        { id: '1', title: 'Relatório 1' },
        { id: '2', title: 'Relatório 2' },
        { id: '3', title: 'Relatório 3' },
      ];
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  }

  async saveReport(report: Report): Promise<void> {
    const reports = await this.getReports();
    reports.push(report);
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }

  async saveAll(reports: Report[]): Promise<void> {
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }
}
