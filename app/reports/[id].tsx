import { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ReportDetailHeader } from '@/components/report-detail-header';
import { ReportStatusFilter } from '@/components/report-status-filter';
import { ReportForm } from '@/components/form/report-form';
import { Report } from '@/src/domain/entities/report';
import { ReportLocalDataSource } from '@/src/data/datasources/report-datasource';
import { ReportRepositoryImpl } from '@/src/data/repositories/report-repository-impl';
import { GetReportByIdUseCase } from '@/src/domain/usecases/get-report-by-id';
import { SaveReportUseCase } from '@/src/domain/usecases/save-report';

const localRepository = new ReportRepositoryImpl(new ReportLocalDataSource());
const getReportByIdUseCase = new GetReportByIdUseCase(localRepository);
const saveReportUseCase = new SaveReportUseCase(localRepository);

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

  const handleDelete = () => {
    Alert.alert('Deletar relatório', 'Tem certeza que deseja deletar este relatório?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            if (!report) return;
            const ds = new ReportLocalDataSource();
            const all = await ds.getReports();
            const filtered = all.filter((r) => r.id !== report.id);
            await ds.saveAll(filtered);
            router.back();
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível deletar o relatório.');
          }
        },
      },
    ]);
  };

  const handleArchive = () => {
    Alert.alert('Arquivar relatório', 'Relatório arquivado com sucesso.');
  };

  if (!report) return null;

  return (
    <ThemedView style={styles.container}>
      <ReportDetailHeader report={report} onSync={() => {}} onDelete={handleDelete} onArchive={handleArchive} />
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
