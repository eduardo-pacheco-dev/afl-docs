import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ReportDetailHeader } from '@/components/report-detail-header';
import { ReportStatusFilter } from '@/components/report-status-filter';
import { ReportForm } from '@/components/form/report-form';
import { Report } from '@/src/domain/entities/report';
import { statusConfig } from '@/constants/status';
import { ReportApiDataSource } from '@/src/data/datasources/report-api-datasource';
import { ReportLocalDataSource } from '@/src/data/datasources/report-datasource';
import { ReportRepositoryImpl } from '@/src/data/repositories/report-repository-impl';
import { GetReportByIdUseCase } from '@/src/domain/usecases/get-report-by-id';

const localRepository = new ReportRepositoryImpl(new ReportLocalDataSource());
const apiRepository = new ReportRepositoryImpl(new ReportApiDataSource());
const getReportByIdUseCase = new GetReportByIdUseCase(localRepository);

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const navigation = useNavigation();

  const formStatuses = useMemo(() => {
    return Object.keys(statusConfig);
  }, []);

  useEffect(() => {
    if (id) getReportByIdUseCase.execute(id).then(setReport);
  }, [id]);

  useLayoutEffect(() => {
    if (report) navigation.setOptions({ title: report.title });
  }, [report, navigation]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  const handleDelete = () => {
    const doDelete = () => {
      if (!report) return;
      localRepository
        .deleteReportById(String(report.id))
        .then(() => router.back())
        .catch(() => Alert.alert('Erro', 'Não foi possível deletar o relatório.'));
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja deletar este relatório?')) doDelete();
    } else {
      Alert.alert('Deletar relatório', 'Tem certeza que deseja deletar este relatório?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Deletar', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const handleArchive = () => {
    Alert.alert('Arquivar relatório', 'Relatório arquivado com sucesso.');
  };

  const [syncing, setSyncing] = useState(false);

  const handleSync = useCallback(async () => {
    if (!report || syncing) return;
    setSyncing(true);
    try {
      const fresh = await apiRepository.getReportById(String(report.id));
      if (!fresh) {
        Alert.alert('Não encontrado', 'Relatório não encontrado na API.');
        return;
      }
      const all = await localRepository.getReports();
      const updated = all.map((r) => (r.id === fresh.id ? fresh : r));
      await localRepository.saveAll(updated);
      setReport(fresh);
      Alert.alert('Atualizado', 'Dados sincronizados com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível sincronizar os dados.');
    } finally {
      setSyncing(false);
    }
  }, [report, syncing]);

  if (!report) return null;

  return (
    <ThemedView style={styles.container}>
      <ReportDetailHeader report={report} syncing={syncing} onSync={handleSync} onDelete={handleDelete} onArchive={handleArchive} />
      <ReportStatusFilter
        statuses={formStatuses}
        selected={selectedStatuses}
        onToggle={toggleStatus}
      />
      <ReportForm reportId={id} sections={report.reports} selectedStatuses={selectedStatuses} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
