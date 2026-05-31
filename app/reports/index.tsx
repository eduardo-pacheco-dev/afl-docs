import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ReportCard } from '@/components/report-card';
import { Report } from '@/src/domain/entities/report';
import { ReportLocalDataSource } from '@/src/data/datasources/report-datasource';
import { ReportRepositoryImpl } from '@/src/data/repositories/report-repository-impl';
import { GetReportsUseCase } from '@/src/domain/usecases/get-reports';

const dataSource = new ReportLocalDataSource();
const repository = new ReportRepositoryImpl(dataSource);
const getReportsUseCase = new GetReportsUseCase(repository);

export default function ReportsListScreen() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    getReportsUseCase.execute().then(setReports);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ReportCard {...item} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 12,
  },
});
