import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

type FormPhotoThumbProps = {
  uri: string;
  synced: boolean;
  onDelete: () => void;
};

export function FormPhotoThumb({ uri, synced, onDelete }: FormPhotoThumbProps) {
  const theme = useColorScheme() ?? 'light';
  const inputBg = theme === 'dark' ? '#2c2c2c' : '#f8f8f8';
  const borderColor = theme === 'dark' ? '#2c2c2c' : '#d1d1d6';
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';

  return (
    <View style={styles.thumb}>
      {uri === 'na' ? (
        <View style={[styles.naThumb, { backgroundColor: inputBg, borderColor }]}>
          <Text style={[styles.naText, { color: mutedColor }]}>N/A</Text>
        </View>
      ) : (
        <Image source={{ uri }} style={styles.image} />
      )}
      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Ionicons name="close-circle" size={22} color="#ff3b30" />
      </TouchableOpacity>
      {!synced && (
        <View style={styles.syncPending}>
          <Ionicons name="time-outline" size={14} color="#f59e0b" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  naThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  naText: {
    fontSize: 16,
    fontWeight: '700',
  },
  deleteBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    zIndex: 1,
  },
  syncPending: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#fffbe6',
    borderRadius: 10,
    padding: 2,
  },
});
