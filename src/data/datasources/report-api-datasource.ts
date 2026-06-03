import { Platform } from 'react-native';
import { Report } from '@/src/domain/entities/report';
import { ReportDataSource } from './report-datasource';
import { mapApiReportToReport } from '../mappers/api-report-mapper';

const BASE_URL = Platform.OS === 'web' ? 'http://localhost:8000' : 'http://192.168.100.13:8000';
const TIMEOUT_MS = 10000;

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export class ReportApiDataSource implements ReportDataSource {
  async getReports(): Promise<Report[]> {
    const res = await fetchWithTimeout(`${BASE_URL}/reports`);
    return res.json();
  }

  async getReportById(id: string): Promise<Report | null> {
    const res = await fetchWithTimeout(`${BASE_URL}/reports/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async getReportByHash(hash: string): Promise<Report | null> {
    const res = await fetchWithTimeout(`${BASE_URL}/api/v1/reports/${hash}`);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) return null;
    const body: { data: Report } = await res.json();
    if (!body.data || !body.data.uuid) return null;
    return mapApiReportToReport(body.data);
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

  async deleteReportById(id: string): Promise<void> {
    await fetch(`${BASE_URL}/reports/${id}`, { method: 'DELETE' });
  }
}
