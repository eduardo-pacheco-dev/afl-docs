import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import type { Report } from '@/src/domain/entities/report';

type ReportDetailHeaderProps = {
  report: Report;
  onSync?: () => void;
};

export function ReportDetailHeader({ report, onSync }: ReportDetailHeaderProps) {
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;
  const bgColor = theme === 'dark' ? '#1c1c1c' : '#ffffff';
  const syncBg = theme === 'dark' ? '#2c2c2c' : '#f0f0f0';
  const trackColor = theme === 'dark' ? '#333' : '#e0e0e0';
  const progressColor = Colors[theme].tint;

  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.progress / 100) * circumference;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.progressContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={progressColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <Text style={[styles.progressText, { color: progressColor }]}>
          {Math.round(report.progress)}%
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {report.title}
        </Text>
        <Text style={[styles.subtitle, { color: iconColor }]} numberOfLines={1}>
          {report.subtitle} · {report.responsible}
        </Text>
        <Text style={[styles.counter, { color: iconColor }]}>
          {report.approved} de {report.total} itens aprovados
        </Text>
      </View>

      {onSync && (
        <TouchableOpacity style={[styles.syncBtn, { backgroundColor: syncBg }]} onPress={onSync}>
          <Ionicons name="sync" size={22} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  progressContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    fontSize: 13,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
  counter: {
    fontSize: 13,
  },
  syncBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
