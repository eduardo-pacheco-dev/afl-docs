import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type FormTextQuestionProps = {
  title: string;
  status?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export function FormTextQuestion({ title, status, placeholder, value, onChange }: FormTextQuestionProps) {
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme].text;
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';
  const inputBg = theme === 'dark' ? '#2c2c2c' : '#f8f8f8';
  const borderColor = theme === 'dark' ? '#2c2c2c' : '#d1d1d6';

  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {status && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{status}</Text>
          </View>
        )}
      </View>
      <TextInput
        style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={mutedColor}
        value={value}
        onChangeText={onChange}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    minHeight: 48,
    textAlignVertical: 'top',
  },
});
