import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { FormQuestion } from '@/src/domain/entities/report';
import { FormPhotoThumb } from './form-photo-thumb';
import { FormUploadActions } from './form-upload-actions';
import { FormSubmitButton } from '../../form-submit-button';

type Photo = { uri: string; synced: boolean };

type FormPhotoQuestionProps = {
  question: FormQuestion;
  photos: Photo[];
  description?: string;
  onGallery: () => void;
  onCamera: () => void;
  onNA: () => void;
  onDeletePhoto: (index: number) => void;
  onSubmit: () => void;
};

export function FormPhotoQuestion({
  question,
  photos,
  description,
  onGallery,
  onCamera,
  onNA,
  onDeletePhoto,
  onSubmit,
}: FormPhotoQuestionProps) {
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme].text;
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';

  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{question.title}</Text>
        {question.status && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{question.status}</Text>
          </View>
        )}
      </View>
      {description && <Text style={[styles.description, { color: mutedColor }]}>{description}</Text>}
      {question.examples && question.examples.length > 0 && (
        <View>
          <Text style={[styles.examplesLabel, { color: mutedColor }]}>EXEMPLOS</Text>
          <View style={styles.examplesRow}>
            {question.examples.map((url, i) => (
              <Image key={i} source={{ uri: url }} style={[styles.exampleThumb, { borderColor: theme === 'dark' ? '#3a3a3a' : '#d1d1d6' }]} cachePolicy="memory-disk" />
            ))}
          </View>
        </View>
      )}

      {photos.length > 0 && (
        <View>
          <Text style={[styles.photoCounter, { color: mutedColor }]}>
            FOTOS ({photos.length}/{photos.length})
          </Text>
          <View style={styles.photoGrid}>
            {photos.map((photo, pIdx) => (
              <FormPhotoThumb
                key={pIdx}
                uri={photo.uri}
                synced={photo.synced}
                onDelete={() => onDeletePhoto(pIdx)}
              />
            ))}
          </View>
        </View>
      )}

      <FormUploadActions onGallery={onGallery} onCamera={onCamera} onNA={onNA} />
      <FormSubmitButton onPress={onSubmit} />
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
  examplesLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
  },
  examplesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  exampleThumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
  },
  photoCounter: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
});
