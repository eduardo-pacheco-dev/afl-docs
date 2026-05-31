import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type FormSectionProps = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export function FormSection({ title, expanded, onToggle, children }: FormSectionProps) {
  const theme = useColorScheme() ?? 'light';
  const sectionBg = theme === 'dark' ? '#1c1c1c' : '#f2f2f7';
  const textColor = Colors[theme].text;
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';

  return (
    <View style={[styles.section, { backgroundColor: sectionBg }]}>
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.chevronCircle, { backgroundColor: theme === 'dark' ? '#3a3a3a' : '#e8f0fe' }]}>
            <Ionicons
              name={expanded ? 'chevron-down' : 'chevron-forward'}
              size={16}
              color={Colors[theme].tint}
            />
          </View>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
        </View>
        <Ionicons name="chevron-up" size={18} color={mutedColor} />
      </TouchableOpacity>
      {expanded && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 20,
  },
});
