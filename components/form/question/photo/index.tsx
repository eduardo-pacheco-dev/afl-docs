import { StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FormQuestion } from '@/src/domain/entities/report';
import { FormPhotoThumb } from './form-photo-thumb';
import { FormUploadActions } from './form-upload-actions';
import { FormSubmitButton } from '../../form-submit-button';

type Photo = { uri: string; synced: boolean };

type FormPhotoQuestionProps = {
  question: FormQuestion;
  photos: Photo[];
  onGallery: () => void;
  onCamera: () => void;
  onNA: () => void;
  onDeletePhoto: (index: number) => void;
  onSubmit: () => void;
};

export function FormPhotoQuestion({
  question,
  photos,
  onGallery,
  onCamera,
  onNA,
  onDeletePhoto,
  onSubmit,
}: FormPhotoQuestionProps) {
  const theme = useColorScheme() ?? 'light';
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';

  return (
    <View>
      <Text style={[styles.examplesLabel, { color: mutedColor }]}>EXEMPLOS</Text>
      <View style={[styles.exampleThumb, { borderColor: theme === 'dark' ? '#3a3a3a' : '#d1d1d6' }]} />

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
  examplesLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
  },
  exampleThumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
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
