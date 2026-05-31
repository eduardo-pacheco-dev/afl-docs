import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ReportApiDataSource } from '@/src/data/datasources/report-api-datasource';
import { ReportLocalDataSource } from '@/src/data/datasources/report-datasource';
import { ReportRepositoryImpl } from '@/src/data/repositories/report-repository-impl';
import { GetReportByHashUseCase } from '@/src/domain/usecases/get-report-by-hash';
import { SaveReportUseCase } from '@/src/domain/usecases/save-report';

const apiRepository = new ReportRepositoryImpl(new ReportApiDataSource());
const localRepository = new ReportRepositoryImpl(new ReportLocalDataSource());
const getReportByHashUseCase = new GetReportByHashUseCase(apiRepository);
const saveReportUseCase = new SaveReportUseCase(localRepository);

const CHAR_COUNT = 6;

export default function ReportsScreen() {
  const theme = useColorScheme() ?? 'light';
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleAccess = async () => {
    const code = hash.trim();
    if (code.length !== CHAR_COUNT) return;
    setLoading(true);
    const report = await getReportByHashUseCase.execute(code);
    if (report) {
      await saveReportUseCase.execute(report);
      setLoading(false);
      router.push(`/reports/${report.id}` as any);
    } else {
      setLoading(false);
      Alert.alert('Não encontrado', `Nenhum formulário com o código ${code}.`);
    }
  };

  const bgColor = theme === 'dark' ? '#151718' : '#ffffff';
  const textColor = Colors[theme].text;
  const cardBg = theme === 'dark' ? '#1c1c1c' : '#f8f9fc';
  const dotBg = theme === 'dark' ? '#2c2c2c' : '#eef0f4';
  const dotFilledBg = theme === 'dark' ? '#3a3a3a' : '#d4d6dd';
  const accentColor = Colors[theme].tint;
  const mutedColor = theme === 'dark' ? '#6b6b6b' : '#9ba1a6';

  const chars = hash.split('');

  return (
    <ThemedView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.hero}>
        <View style={[styles.iconCircle, { backgroundColor: dotBg }]}>
          <Ionicons name="document-text-outline" size={32} color={accentColor} />
        </View>
        <Text style={[styles.title, { color: textColor }]}>Acessar Formulário</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Digite o código de 6 dígitos recebido
        </Text>
      </View>

      <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()} style={styles.dotsWrapper}>
        <View style={[styles.dotsRow, { backgroundColor: cardBg }]}>
          {Array.from({ length: CHAR_COUNT }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                chars[i]
                  ? { backgroundColor: dotFilledBg, borderColor: accentColor }
                  : { backgroundColor: dotBg, borderColor: 'transparent' },
              ]}
            >
              <Text style={[styles.dotChar, { color: textColor }]}>{chars[i] ?? ''}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={hash}
        onChangeText={(t) => setHash(t.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CHAR_COUNT))}
        maxLength={CHAR_COUNT}
        autoCapitalize="characters"
        keyboardType="default"
      />

      <TouchableOpacity
        style={[styles.accessBtn, { opacity: hash.length === CHAR_COUNT ? 1 : 0.4 }]}
        activeOpacity={0.85}
        onPress={handleAccess}
        disabled={hash.length !== CHAR_COUNT || loading}
      >
        <Ionicons name="arrow-forward" size={20} color="#fff" />
        <Text style={styles.accessBtnText}>{loading ? 'Buscando...' : 'Acessar'}</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: dotBg }]} />
        <Text style={[styles.dividerText, { color: mutedColor }]}>ou</Text>
        <View style={[styles.dividerLine, { backgroundColor: dotBg }]} />
      </View>

      <TouchableOpacity style={[styles.listBtn, { backgroundColor: cardBg }]} onPress={() => router.push('/reports')}>
        <Ionicons name="list-outline" size={20} color={accentColor} />
        <Text style={[styles.listBtnText, { color: textColor }]}>Ver todos os relatórios</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  hero: {
    alignItems: 'center',
    marginTop: 80,
    gap: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsWrapper: {
    marginTop: 40,
    marginBottom: 28,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
  },
  dot: {
    width: 42,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  dotChar: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  accessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0891b2',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  accessBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  listBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
