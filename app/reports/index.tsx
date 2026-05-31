import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Report } from '@/src/domain/entities/report';
import { ReportLocalDataSource } from '@/src/data/datasources/report-datasource';
import { ReportRepositoryImpl } from '@/src/data/repositories/report-repository-impl';
import { GetReportsUseCase } from '@/src/domain/usecases/get-reports';

const getReportsUseCase = new GetReportsUseCase(
  new ReportRepositoryImpl(new ReportLocalDataSource()),
);

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
        renderItem={({ item }) => (
          <ThemedView style={styles.item}>
            <ThemedText>{item.title}</ThemedText>
          </ThemedView>
        )}
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
  item: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});
