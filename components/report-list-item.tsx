import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { StatusBadge } from '@/components/status-badge';
import type { Report } from '@/src/domain/entities/report';

type ReportListItemProps = Report;

export function ReportListItem({
  title,
  subtitle,
  initials,
  status,
  date,
}: ReportListItemProps) {
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;
  const borderColor = theme === 'dark' ? '#2c2c2c' : '#e5e5e5';
  const bgColor = theme === 'dark' ? '#1c1c1c' : '#ffffff';

  return (
    <View style={[styles.row, { backgroundColor: bgColor, borderColor }]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: iconColor }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.meta}>
        <StatusBadge status={status} size="sm" />
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={12} color={iconColor} />
          <Text style={[styles.dateText, { color: iconColor }]}>{date}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  meta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dateText: {
    fontSize: 11,
  },
});
