import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ReportDetailHeader } from '@/components/report-detail-header';
import { Report } from '@/src/domain/entities/report';
import { ReportLocalDataSource } from '@/src/data/datasources/report-datasource';
import { ReportRepositoryImpl } from '@/src/data/repositories/report-repository-impl';
import { GetReportByIdUseCase } from '@/src/domain/usecases/get-report-by-id';

const getReportByIdUseCase = new GetReportByIdUseCase(
  new ReportRepositoryImpl(new ReportLocalDataSource()),
);

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (id) getReportByIdUseCase.execute(id).then(setReport);
  }, [id]);

  if (!report) return null;

  return (
    <ThemedView style={styles.container}>
      <ReportDetailHeader report={report} onSync={() => {}} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
