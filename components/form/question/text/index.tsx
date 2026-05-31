import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { getStatusConfig } from '@/constants/status';
import { FormSubmitButton } from '../../form-submit-button';

type FormTextQuestionProps = {
  title: string;
  status?: string;
  description?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function FormTextQuestion({ title, status, description, placeholder, value, onChange, onSubmit }: FormTextQuestionProps) {
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme].text;
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';
  const inputBg = theme === 'dark' ? '#2c2c2c' : '#f8f8f8';
  const borderColor = theme === 'dark' ? '#2c2c2c' : '#d1d1d6';
  const showSubmit = status !== 'Em avaliação' && status !== 'Aprovado';
  const readOnly = !showSubmit;

  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {status && (
          <View style={[styles.badge, { backgroundColor: getStatusConfig(status).bg }]}>
            <Text style={[styles.badgeText, { color: getStatusConfig(status).text }]}>{status}</Text>
          </View>
        )}
      </View>
      {description && <Text style={[styles.description, { color: mutedColor }]}>{description}</Text>}
      <TextInput
        style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={mutedColor}
        value={value}
        onChangeText={onChange}
        multiline
        readOnly={readOnly}
      />
      {showSubmit && <FormSubmitButton onPress={onSubmit} />}
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
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: -4,
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
