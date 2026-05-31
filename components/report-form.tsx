import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { FormSection } from '@/components/form-section';
import { FormTextQuestion } from '@/components/form-text-question';
import { FormPhotoThumb } from '@/components/form-photo-thumb';
import { FormUploadActions } from '@/components/form-upload-actions';
import { FormSubmitButton } from '@/components/form-submit-button';
import { FormAnswer } from '@/src/domain/entities/form-answer';
import type { FormSection as FormSectionType } from '@/src/domain/entities/report';
import { FormLocalDataSource } from '@/src/data/datasources/form-datasource';
import { FormRepositoryImpl } from '@/src/data/repositories/form-repository-impl';
import { SaveFormAnswersUseCase } from '@/src/domain/usecases/save-form-answers';

type Photo = { uri: string; synced: boolean };

const saveFormAnswersUseCase = new SaveFormAnswersUseCase(
  new FormRepositoryImpl(new FormLocalDataSource()),
);

function addPhotoToState(
  setPhotos: React.Dispatch<React.SetStateAction<Record<string, Photo[]>>>,
  key: string,
  uri: string,
) {
  setPhotos((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), { uri, synced: false }] }));
}

type ReportFormProps = {
  reportId?: string;
  sections?: FormSectionType[];
};

export function ReportForm({ reportId = '', sections = [] }: ReportFormProps) {
  const theme = useColorScheme() ?? 'light';
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({ 0: true });
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleTextChange = (key: string, value: string) => {
    setTextAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async (sectionIdx: number, qIdx: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) {
      addPhotoToState(setPhotos, `${sectionIdx}-${qIdx}`, result.assets[0].uri);
    }
  };

  const takePhoto = async (sectionIdx: number, qIdx: number) => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      addPhotoToState(setPhotos, `${sectionIdx}-${qIdx}`, result.assets[0].uri);
    }
  };

  const addNAPhoto = (sectionIdx: number, qIdx: number) => {
    addPhotoToState(setPhotos, `${sectionIdx}-${qIdx}`, 'na');
  };

  const removePhoto = (sectionIdx: number, qIdx: number, photoIdx: number) => {
    const key = `${sectionIdx}-${qIdx}`;
    setPhotos((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((_, i) => i !== photoIdx),
    }));
  };

  const handleSubmit = async () => {
    const answers: FormAnswer[] = Object.entries(textAnswers).map(([key, text]) => {
      const [sectionIdx, questionIdx] = key.split('-').map(Number);
      return { reportId, sectionIdx, questionIdx, text, photos: photos[key] ?? [] };
    });
    Object.entries(photos).forEach(([key, photoList]) => {
      if (!textAnswers[key]) {
        const [sectionIdx, questionIdx] = key.split('-').map(Number);
        answers.push({ reportId, sectionIdx, questionIdx, photos: photoList });
      }
    });
    await saveFormAnswersUseCase.execute(reportId, answers);
  };

  const bgColor = theme === 'dark' ? '#151718' : '#ffffff';
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]} contentContainerStyle={styles.content}>
      {sections.map((section, sIdx) => (
        <FormSection key={sIdx} title={section.title} expanded={expandedSections[sIdx] ?? false} onToggle={() => toggleSection(sIdx)}>
          {section.questions.map((q, qIdx) => {
            const qKey = `${sIdx}-${qIdx}`;
            const sectionPhotos = photos[qKey] ?? [];

            return (
              <View key={qIdx} style={styles.questionBlock}>
                {q.type === 'text' && (
                  <FormTextQuestion
                    title={q.title}
                    status={q.status}
                    placeholder={q.placeholder}
                    value={textAnswers[qKey] ?? ''}
                    onChange={(val) => handleTextChange(qKey, val)}
                  />
                )}
                {q.type === 'photo' && (
                  <View>
                    <Text style={[styles.examplesLabel, { color: mutedColor }]}>EXEMPLOS</Text>
                    <View style={styles.exampleThumb} />

                    {sectionPhotos.length > 0 && (
                      <View>
                        <Text style={[styles.photoCounter, { color: mutedColor }]}>
                          FOTOS ({sectionPhotos.length}/{sectionPhotos.length})
                        </Text>
                        <View style={styles.photoGrid}>
                          {sectionPhotos.map((photo, pIdx) => (
                            <FormPhotoThumb
                              key={pIdx}
                              uri={photo.uri}
                              synced={photo.synced}
                              onDelete={() => removePhoto(sIdx, qIdx, pIdx)}
                            />
                          ))}
                        </View>
                      </View>
                    )}

                    <FormUploadActions
                      onGallery={() => pickImage(sIdx, qIdx)}
                      onCamera={() => takePhoto(sIdx, qIdx)}
                      onNA={() => addNAPhoto(sIdx, qIdx)}
                    />
                    <FormSubmitButton onPress={handleSubmit} />
                  </View>
                )}
              </View>
            );
          })}
        </FormSection>
      ))}
      <FormSubmitButton onPress={handleSubmit} label="Enviar Todos" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  questionBlock: {
    gap: 10,
  },
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
    borderColor: '#d1d1d6',
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
