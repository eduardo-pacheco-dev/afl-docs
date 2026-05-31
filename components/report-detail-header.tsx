import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { CircularProgress } from './circular-progress';
import { DropdownMenu } from './dropdown-menu';
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
    }
    spinAnim.setValue(0);
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

  const menuItems = [
    ...(onArchive ? [{ label: 'Arquivar', icon: 'archive-outline' as const, onPress: onArchive }] : []),
    ...(onDelete ? [{ label: 'Deletar', icon: 'trash-outline' as const, color: '#ef4444', onPress: onDelete }] : []),
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <CircularProgress progress={report.progress} />

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

      <DropdownMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
      />
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
});
