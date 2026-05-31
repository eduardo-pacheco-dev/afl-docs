import { ThemedView } from '@/components/themed-view';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ReportsScreen() {
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Relatórios</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#0891b2',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
