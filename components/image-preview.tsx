import { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ImagePreviewProps = {
  uris: string[];
  initialIndex?: number;
  onClose: () => void;
};

export function ImagePreview({ uris, initialIndex = 0, onClose }: ImagePreviewProps) {
  const [index, setIndex] = useState(initialIndex);
  const { width, height } = Dimensions.get('window');
  const uri = uris[index];
  const hasPrev = index > 0;
  const hasNext = index < uris.length - 1;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-circle" size={36} color="#fff" />
        </Pressable>

        <Text style={styles.counter}>{index + 1} / {uris.length}</Text>

        <View style={styles.imageArea}>
          {hasPrev && (
            <Pressable style={styles.navLeft} onPress={() => setIndex((i) => i - 1)}>
              <Ionicons name="chevron-back-circle" size={44} color="#fff" />
            </Pressable>
          )}
          <Image
            source={{ uri }}
            style={{ width, height: height * 0.65 }}
            resizeMode="contain"
          />
          {hasNext && (
            <Pressable style={styles.navRight} onPress={() => setIndex((i) => i + 1)}>
              <Ionicons name="chevron-forward-circle" size={44} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  counter: {
    position: 'absolute',
    top: 66,
    left: 20,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  navLeft: {
    position: 'absolute',
    left: 8,
    zIndex: 10,
  },
  navRight: {
    position: 'absolute',
    right: 8,
    zIndex: 10,
  },
});
