import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type DropdownItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress: () => void;
};

type DropdownMenuProps = {
  visible: boolean;
  onClose: () => void;
  items: DropdownItem[];
};

export function DropdownMenu({ visible, onClose, items }: DropdownMenuProps) {
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme].text;
  const bgColor = theme === 'dark' ? '#1c1c1c' : '#ffffff';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.menu, { backgroundColor: bgColor, shadowColor: '#000' }]}>
        {items.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            onPress={() => { onClose(); item.onPress(); }}
          >
            <Ionicons name={item.icon} size={20} color={item.color ?? textColor} />
            <Text style={[styles.menuText, { color: item.color ?? textColor }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
