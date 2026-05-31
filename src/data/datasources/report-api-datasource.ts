import { Platform } from 'react-native';
import { Report } from '@/src/domain/entities/report';
import { ReportDataSource } from './report-datasource';

const BASE_URL = Platform.OS === 'web' ? 'http://localhost:3001' : 'http://192.168.0.11:3001';

export class ReportApiDataSource implements ReportDataSource {
  async getReports(): Promise<Report[]> {
    const res = await fetch(`${BASE_URL}/reports`);
    return res.json();
  }

  async getReportById(id: string): Promise<Report | null> {
    const res = await fetch(`${BASE_URL}/reports/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async getReportByHash(hash: string): Promise<Report | null> {
    const res = await fetch(`${BASE_URL}/reports?hash=${hash}`);
    const reports: Report[] = await res.json();
    return reports[0] ?? null;
  }

  async saveReport(report: Report): Promise<void> {
    await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
  }

  async saveAll(reports: Report[]): Promise<void> {
    await Promise.all(
      reports.map((report) =>
        fetch(`${BASE_URL}/reports/${report.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        }),
      ),
    );
  }
}
