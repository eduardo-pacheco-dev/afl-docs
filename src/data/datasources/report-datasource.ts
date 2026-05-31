import { Report } from '@/src/domain/entities/report';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REPORTS_KEY = '@afl-docs/reports';

function getDefaultReports(): Report[] {
  return [
    {
      id: '1',
      title: 'SN-PRAC1 - Auditoria EHS',
      subtitle: 'NOKIA',
      initials: 'SN',
      status: 'Concluído',
      date: '25/05/2026',
      auditor: 'Eduardo Pacheco',
      executor: 'Higo Oliveira',
      client: 'TIM #140',
      responsible: 'Joelson Gomes',
      progress: 71,
      approved: 49,
      total: 69,
    },
    {
      id: '2',
      title: 'CT-ALPHA01 – Inspeção de Segurança',
      subtitle: 'ALPHA',
      initials: 'CT',
      status: 'Em andamento',
      date: '28/05/2026',
      auditor: 'Maria Souza',
      executor: 'João Santos',
      client: 'VIVO #089',
      responsible: 'João Santos',
      progress: 45,
      approved: 22,
      total: 49,
    },
    {
      id: '3',
      title: 'RF-BETA02 – Auditoria Ambiental',
      subtitle: 'BETA LTDA',
      initials: 'RF',
      status: 'Pendente',
      date: '01/06/2026',
      auditor: 'Carlos Lima',
      executor: 'Ana Costa',
      client: 'CLARO #022',
      responsible: 'Ana Costa',
      progress: 10,
      approved: 3,
      total: 28,
    },
    {
      id: '4',
      title: 'MK-GAMMA03 – Revisão de Processos',
      subtitle: 'GAMMA S.A.',
      initials: 'MK',
      status: 'Concluído',
      date: '20/05/2026',
      auditor: 'Fernanda Rocha',
      executor: 'Pedro Alves',
      client: 'OI #315',
      responsible: 'Pedro Alves',
      progress: 100,
      approved: 42,
      total: 42,
    },
    {
      id: '5',
      title: 'PL-DELTA04 – Diagnóstico EHS',
      subtitle: 'DELTA IND.',
      initials: 'PL',
      status: 'Em andamento',
      date: '30/05/2026',
      auditor: 'Eduardo Pacheco',
      executor: 'Luciana Torres',
      client: 'TIM #140',
      responsible: 'Luciana Torres',
      progress: 60,
      approved: 31,
      total: 52,
    },
  ];
}

function isValidReport(data: unknown): data is Report[] {
  if (!Array.isArray(data) || data.length === 0) return false;
  return 'responsible' in data[0] && 'progress' in data[0];
}

export interface ReportDataSource {
  getReports(): Promise<Report[]>;
  getReportById(id: string): Promise<Report | null>;
  saveReport(report: Report): Promise<void>;
  saveAll(reports: Report[]): Promise<void>;
}

export class ReportLocalDataSource implements ReportDataSource {
  async getReports(): Promise<Report[]> {
    const data = await AsyncStorage.getItem(REPORTS_KEY);
    if (!data) {
      const defaults = getDefaultReports();
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(defaults));
      return defaults;
    }

    const parsed = JSON.parse(data);
    if (isValidReport(parsed)) return parsed;

    const defaults = getDefaultReports();
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  async getReportById(id: string): Promise<Report | null> {
    const reports = await this.getReports();
    return reports.find((r) => r.id === id) ?? null;
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
