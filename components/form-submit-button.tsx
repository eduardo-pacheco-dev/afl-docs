import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

type FormSubmitButtonProps = {
  onPress: () => void;
  label?: string;
};

export function FormSubmitButton({ onPress, label = 'Enviar' }: FormSubmitButtonProps) {
  const theme = useColorScheme() ?? 'light';

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: theme === 'dark' ? '#0a7ea4' : '#0891b2' }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Ionicons name="send" size={18} color="#fff" />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
