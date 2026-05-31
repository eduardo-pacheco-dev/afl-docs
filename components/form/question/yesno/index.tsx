import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { getStatusConfig } from '@/constants/status';
import { FormSubmitButton } from '../../form-submit-button';

type BinarySegmentedControlProps = {
  title: string;
  status?: string;
  description?: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  onSubmit: () => void;
};

export function BinarySegmentedControl({ title, status, description, value, onChange, onSubmit }: BinarySegmentedControlProps) {
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme].text;
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';
  const inputBg = theme === 'dark' ? '#2c2c2c' : '#f8f8f8';
  const yesBg = theme === 'dark' ? '#0d2818' : '#f0fdf4';
  const noBg = theme === 'dark' ? '#2a1011' : '#fef2f2';
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

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: inputBg }, value === true && { backgroundColor: yesBg, borderColor: '#16a34a' }]}
          activeOpacity={0.7}
          onPress={() => onChange(true)}
          disabled={readOnly}
        >
          <Ionicons
            name={value === true ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={22}
            color={value === true ? '#16a34a' : mutedColor}
          />
          <Text style={[styles.optionText, { color: value === true ? '#16a34a' : textColor }]}>Sim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { backgroundColor: inputBg }, value === false && { backgroundColor: noBg, borderColor: '#dc2626' }]}
          activeOpacity={0.7}
          onPress={() => onChange(false)}
          disabled={readOnly}
        >
          <Ionicons
            name={value === false ? 'close-circle' : 'close-circle-outline'}
            size={22}
            color={value === false ? '#dc2626' : mutedColor}
          />
          <Text style={[styles.optionText, { color: value === false ? '#dc2626' : textColor }]}>Não</Text>
        </TouchableOpacity>
      </View>

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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
