import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ReportDetailHeader } from '@/components/report-detail-header';
import { ReportStatusFilter } from '@/components/report-status-filter';
import { ReportForm } from '@/components/report-form';
import { Report } from '@/src/domain/entities/report';
import { ReportApiDataSource } from '@/src/data/datasources/report-api-datasource';
import { ReportRepositoryImpl } from '@/src/data/repositories/report-repository-impl';
import { GetReportByIdUseCase } from '@/src/domain/usecases/get-report-by-id';

const getReportByIdUseCase = new GetReportByIdUseCase(
  new ReportRepositoryImpl(new ReportApiDataSource()),
);

const allStatuses = ['Concluído', 'Em andamento', 'Pendente', 'Reprovado'];

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (id) getReportByIdUseCase.execute(id).then(setReport);
  }, [id]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  if (!report) return null;

  return (
    <ThemedView style={styles.container}>
      <ReportDetailHeader report={report} onSync={() => {}} />
      <ReportStatusFilter
        statuses={allStatuses}
        selected={selectedStatuses}
        onToggle={toggleStatus}
      />
      <ReportForm reportId={id} sections={report.forms} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
