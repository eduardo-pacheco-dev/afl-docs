import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import type { Report } from '@/src/domain/entities/report';

type ReportDetailHeaderProps = {
  report: Report;
  syncing?: boolean;
  onSync?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
};

export function ReportDetailHeader({ report, syncing = false, onSync, onDelete, onArchive }: ReportDetailHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (syncing) {
      const loop = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      loop.start();
      return () => loop.stop();
    } else {
      spinAnim.setValue(0);
    }
  }, [syncing, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
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

      <View style={styles.actions}>
        {onSync && (
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: syncBg }]} onPress={onSync}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="sync" size={20} color={iconColor} />
            </Animated.View>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: syncBg }]} onPress={() => setMenuOpen(true)}>
          <Ionicons name="ellipsis-horizontal" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />
        <View style={[styles.menu, { backgroundColor: bgColor, shadowColor: '#000' }]}>
          {onArchive && (
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); onArchive(); }}>
              <Ionicons name="archive-outline" size={20} color={textColor} />
              <Text style={[styles.menuText, { color: textColor }]}>Arquivar</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); onDelete(); }}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <Text style={[styles.menuText, { color: '#ef4444' }]}>Deletar</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
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
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 80,
    right: 16,
    borderRadius: 14,
    paddingVertical: 4,
    minWidth: 170,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
