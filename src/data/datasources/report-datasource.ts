import { Report } from '@/src/domain/entities/report';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REPORTS_KEY = '@afl-docs/reports';

function isValidReport(data: unknown): data is Report[] {
  if (!Array.isArray(data) || data.length === 0) return false;
  return 'uuid' in data[0] && 'reports' in data[0] && 'created_at' in data[0];
}

export interface ReportDataSource {
  getReports(): Promise<Report[]>;
  getReportById(id: string): Promise<Report | null>;
  getReportByHash(hash: string): Promise<Report | null>;
  saveReport(report: Report): Promise<void>;
  saveAll(reports: Report[]): Promise<void>;
  deleteReportById(id: string): Promise<void>;
}

export class ReportLocalDataSource implements ReportDataSource {
  async getReports(): Promise<Report[]> {
    const data = await AsyncStorage.getItem(REPORTS_KEY);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0 && !('uuid' in parsed[0])) {
        await AsyncStorage.removeItem(REPORTS_KEY);
        return [];
      }
      return parsed;
    } catch {
      await AsyncStorage.removeItem(REPORTS_KEY);
      return [];
    }
  }

  async getReportById(id: string): Promise<Report | null> {
    const reports = await this.getReports();
    return reports.find((r) => String(r.id) === id) ?? null;
  }

  async getReportByHash(hash: string): Promise<Report | null> {
    const reports = await this.getReports();
    return reports.find((r) => r.uuid === hash) ?? null;
  }

  async saveReport(report: Report): Promise<void> {
    const reports = await this.getReports();
    reports.push(report);
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }

  async saveAll(reports: Report[]): Promise<void> {
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }

  async deleteReportById(id: string): Promise<void> {
    const reports = await this.getReports();
    const filtered = reports.filter((r) => String(r.id) !== id);
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(filtered));
  }
}
