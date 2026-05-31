import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

type FormUploadActionsProps = {
  onGallery: () => void;
  onCamera: () => void;
  onNA: () => void;
};

export function FormUploadActions({ onGallery, onCamera, onNA }: FormUploadActionsProps) {
  const theme = useColorScheme() ?? 'light';
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';
  const dashedBorder = theme === 'dark' ? '#3a3a3a' : '#c7c7cc';

  return (
    <View style={styles.row}>
      <TouchableOpacity style={[styles.btn, { borderColor: dashedBorder }]} onPress={onGallery} activeOpacity={0.7}>
        <Ionicons name="images-outline" size={28} color={mutedColor} />
        <Text style={[styles.text, { color: mutedColor }]}>Galeria</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { borderColor: dashedBorder }]} onPress={onCamera} activeOpacity={0.7}>
        <Ionicons name="camera-outline" size={28} color={mutedColor} />
        <Text style={[styles.text, { color: mutedColor }]}>Câmera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { borderColor: dashedBorder }]} onPress={onNA} activeOpacity={0.7}>
        <Ionicons name="close-outline" size={28} color={mutedColor} />
        <Text style={[styles.text, { color: mutedColor }]}>N/A</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});
