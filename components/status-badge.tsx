import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusConfig } from '@/constants/status';

type StatusBadgeProps = {
  status: string;
  size?: 'sm' | 'md';
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const isSm = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, isSm && styles.badgeSm]}>
      <Ionicons name={config.iconName as any} size={isSm ? 12 : 14} color={config.icon} />
      <Text style={[styles.text, { color: config.text }, isSm && styles.textSm]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 11,
  },
});
