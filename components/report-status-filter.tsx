import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { statusConfig } from '@/constants/status';

type ReportStatusFilterProps = {
  statuses: string[];
  selected: string[];
  onToggle: (status: string) => void;
};

export function ReportStatusFilter({ statuses, selected, onToggle }: ReportStatusFilterProps) {
  const theme = useColorScheme() ?? 'light';
  const containerBg = theme === 'dark' ? '#1c1c1c' : '#f8f9fa';
  const borderColor = theme === 'dark' ? '#2c2c2c' : '#e9ecef';
  const activeChipBg = theme === 'dark' ? '#2c2c2c' : '#ffffff';
  const allActive = selected.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: containerBg, borderColor }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => selected.forEach((s) => onToggle(s))}
          style={[styles.chip, allActive && styles.chipActive, { backgroundColor: allActive ? activeChipBg : 'transparent' }]}
        >
          <Text style={[styles.label, { color: allActive ? Colors[theme].text : (theme === 'dark' ? '#6b6b6b' : '#adb5bd'), fontWeight: allActive ? '600' : '400' }]}>
            Todos
          </Text>
        </TouchableOpacity>

        {statuses.map((status) => {
          const conf = statusConfig[status];
          const isActive = selected.includes(status);

          return (
            <TouchableOpacity
              key={status}
              activeOpacity={0.7}
              onPress={() => onToggle(status)}
              style={[
                styles.chip,
                isActive && styles.chipActive,
                { backgroundColor: isActive ? activeChipBg : 'transparent' },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: conf?.text ?? '#6b7280' }]} />
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? conf?.text ?? Colors[theme].text : (theme === 'dark' ? '#6b6b6b' : '#adb5bd'),
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {status}
              </Text>
              {isActive && (
                <Ionicons name="close" size={14} color={conf?.text ?? Colors[theme].text} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
  },
  chipActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
  },
});
