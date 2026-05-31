import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Report } from '@/src/domain/entities/report';
import { ReportLocalDataSource } from '@/src/data/datasources/report-datasource';
import { ReportRepositoryImpl } from '@/src/data/repositories/report-repository-impl';
import { GetReportsUseCase } from '@/src/domain/usecases/get-reports';
import { SaveReportUseCase } from '@/src/domain/usecases/save-report';

const dataSource = new ReportLocalDataSource();
const repository = new ReportRepositoryImpl(dataSource);
const getReportsUseCase = new GetReportsUseCase(repository);
const saveReportUseCase = new SaveReportUseCase(repository);

export default function ReportsListScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getReportsUseCase.execute().then(setReports);
  }, []);

  async function handleAdd() {
    if (!title.trim()) return;
    const report: Report = {
      id: String(Date.now()),
      title: title.trim(),
    };
    await saveReportUseCase.execute(report);
    setReports((prev) => [...prev, report]);
    setTitle('');
  }

  async function handleDelete(id: string) {
    const updated = reports.filter((r) => r.id !== id);
    await dataSource.saveAll(updated);
    setReports(updated);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Novo relatório"
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </ThemedView>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ThemedView style={styles.item}>
            <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
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
  form: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemTitle: {
    fontSize: 16,
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
