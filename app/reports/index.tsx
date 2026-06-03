import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ReportCard } from '@/components/report-card';
import { ReportListItem } from '@/components/report-list-item';
import { ReportStatusFilter } from '@/components/report-status-filter';
import { Report } from '@/src/domain/entities/report';
import { ReportLocalDataSource } from '@/src/data/datasources/report-datasource';
import { ReportRepositoryImpl } from '@/src/data/repositories/report-repository-impl';
import { GetReportsUseCase } from '@/src/domain/usecases/get-reports';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type ViewMode = 'card' | 'list';

const dataSource = new ReportLocalDataSource();
const repository = new ReportRepositoryImpl(dataSource);
const getReportsUseCase = new GetReportsUseCase(repository);

export default function ReportsListScreen() {
  const theme = useColorScheme() ?? 'light';
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const loadReports = useCallback(async () => {
    const data = await getReportsUseCase.execute();
    setReports(data);
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  }, [loadReports]);

  const filtered = useMemo(() => {
    let result = reports;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.form?.title ?? r.description ?? '').toLowerCase().includes(q) ||
          (r.tecnico_nome ?? '').toLowerCase().includes(q) ||
          (r.operadora ?? '').toLowerCase().includes(q),
      );
    }
    if (selectedStatuses.length > 0) {
      result = result.filter((r) => selectedStatuses.includes(r.status));
    }
    return result;
  }, [search, reports, selectedStatuses]);

  const statuses = useMemo(() => {
    const set = new Set(reports.map((r) => r.status));
    return Array.from(set);
  }, [reports]);

  const toggleStatus = useCallback((status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Report }) => {
      const props = { ...item, onPress: () => router.push(`/reports/${item.id}` as any) };
      return viewMode === 'card' ? <ReportCard {...props} /> : <ReportListItem {...props} />;
    },
    [viewMode],
  );

  const bgColor = theme === 'dark' ? '#151718' : '#fff';
  const inputBg = theme === 'dark' ? '#1c1c1c' : '#f5f5f5';
  const inputColor = Colors[theme].text;
  const borderColor = theme === 'dark' ? '#2c2c2c' : '#e0e0e0';
  const inactiveColor = Colors[theme].icon;
  const toggleBg = theme === 'dark' ? '#2c2c2c' : '#e8e8e8';
  const toggleActiveBg = theme === 'dark' ? '#4a4a4a' : '#ffffff';
  const toggleActiveColor = Colors[theme].text;
  const toggleInactiveColor = theme === 'dark' ? '#6b6b6b' : '#999999';

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.filterBar, { backgroundColor: bgColor, borderColor }]}>
        <View style={[styles.searchContainer, { backgroundColor: inputBg, borderColor }]}>
          <Ionicons name="search" size={18} color={inactiveColor} />
          <TextInput
            style={[styles.input, { color: inputColor }]}
            placeholder="Pesquisar relatórios..."
            placeholderTextColor={inactiveColor}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={[styles.toggleGroup, { backgroundColor: toggleBg }]}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              { backgroundColor: viewMode === 'card' ? toggleActiveBg : 'transparent' },
            ]}
            onPress={() => setViewMode('card')}
          >
            <Ionicons
              name="grid-outline"
              size={18}
              color={viewMode === 'card' ? toggleActiveColor : toggleInactiveColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              { backgroundColor: viewMode === 'list' ? toggleActiveBg : 'transparent' },
            ]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list-outline"
              size={18}
              color={viewMode === 'list' ? toggleActiveColor : toggleInactiveColor}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ReportStatusFilter statuses={statuses} selected={selectedStatuses} onToggle={toggleStatus} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, reports.length === 0 && styles.listEmpty]}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: inputBg }]}>
              <Ionicons name="document-text-outline" size={40} color={inactiveColor} />
            </View>
            <Text style={[styles.emptyTitle, { color: inputColor }]}>Nenhum relatório</Text>
            <Text style={[styles.emptyDesc, { color: inactiveColor }]}>
              Use o código de acesso na página inicial para adicionar relatórios.
            </Text>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 3,
    padding: 3,
    borderRadius: 10,
  },
  toggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
