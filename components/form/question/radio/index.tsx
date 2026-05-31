import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { getStatusConfig } from '@/constants/status';
import { FormSubmitButton } from '../../form-submit-button';

type FormRadioQuestionProps = {
  title: string;
  status?: string;
  description?: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function FormRadioQuestion({ title, status, description, options, value, onChange, onSubmit }: FormRadioQuestionProps) {
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme].text;
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';
  const inputBg = theme === 'dark' ? '#2c2c2c' : '#f8f8f8';
  const tint = Colors[theme].tint;
  const selectedBg = theme === 'dark' ? '#1a2e3a' : '#f0f9ff';
  const selectedBorder = theme === 'dark' ? '#0a7ea4' : tint;
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

      {options.map((opt, i) => {
        const selected = value === opt;
        return (
          <TouchableOpacity
            key={i}
            style={[styles.option, { backgroundColor: inputBg }, selected && { backgroundColor: selectedBg, borderColor: selectedBorder }]}
            activeOpacity={0.7}
            onPress={() => onChange(opt)}
            disabled={readOnly}
          >
            <Ionicons
              name={selected ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={selected ? tint : mutedColor}
            />
            <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}

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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
