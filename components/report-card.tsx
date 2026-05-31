import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import type { Report } from '@/src/domain/entities/report';

type ReportCardProps = Report;

export function ReportCard({
  title,
  subtitle,
  initials,
  status,
  date,
  auditor,
  executor,
  client,
}: ReportCardProps) {
  const theme = useColorScheme() ?? 'light';
  const iconColor = Colors[theme].icon;
  const textColor = Colors[theme].text;
  const borderColor = theme === 'dark' ? '#2c2c2c' : '#e5e5e5';
  const cardBg = theme === 'dark' ? '#1c1c1c' : '#ffffff';

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: iconColor }]}>{subtitle}</Text>

          <View style={styles.metaRow}>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
              <Text style={styles.statusText}>{status}</Text>
            </View>

            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color={iconColor} />
              <Text style={[styles.dateText, { color: iconColor }]}>{date}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.separator, { borderBottomColor: borderColor }]} />

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="person-outline" size={14} color={iconColor} />
          <Text style={[styles.footerText, { color: iconColor }]} numberOfLines={1}>
            {auditor}
          </Text>
        </View>

        <View style={styles.footerItem}>
          <Ionicons name="construct-outline" size={14} color={iconColor} />
          <Text style={[styles.footerText, { color: iconColor }]} numberOfLines={1}>
            {executor}
          </Text>
        </View>

        <View style={styles.footerItem}>
          <Ionicons name="folder-outline" size={14} color={iconColor} />
          <Text style={[styles.footerText, { color: iconColor }]} numberOfLines={1}>
            {client}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
  },
  separator: {
    borderBottomWidth: 1,
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  footerText: {
    fontSize: 12,
  },
});
