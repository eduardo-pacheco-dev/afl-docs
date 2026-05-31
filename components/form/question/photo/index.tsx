import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
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

async function getLocalUri(url: string): Promise<string> {
  if (Platform.OS === 'web') return url;
  const { File, Paths, Directory } = await import('expo-file-system');
  const filename = url.split('/').pop() ?? url.replace(/[^a-zA-Z0-9]/g, '_');
  const dir = new Directory(Paths.document, 'examples');
  if (!Paths.info(dir.uri).exists) await dir.create();
  const file = new File(dir, filename);
  try {
    await File.downloadFileAsync(url, file);
  } catch {}
  return file.uri;
}

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
  const [localExamples, setLocalExamples] = useState<string[]>([]);

  useEffect(() => {
    if (!question.examples?.length) return;
    let cancelled = false;
    (async () => {
      const local = await Promise.all(question.examples!.map(getLocalUri));
      if (!cancelled) setLocalExamples(local);
    })();
    return () => { cancelled = true; };
  }, [question.examples]);

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
            {(localExamples.length > 0 ? localExamples : question.examples).map((uri, i) => (
              <Image key={i} source={{ uri }} style={[styles.exampleThumb, { borderColor: theme === 'dark' ? '#3a3a3a' : '#d1d1d6' }]} />
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
