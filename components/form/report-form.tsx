import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FormSection } from './form-section';
import { FormTextQuestion } from './question/text';
import { FormPhotoQuestion } from './question/photo';
import { BinarySegmentedControl } from './question/yesno';
import { FormCheckboxQuestion } from './question/checkbox';
import { FormRadioQuestion } from './question/radio';
import { FormFileQuestion } from './question/file';
import type { FormFile } from './question/file';
import { FormSubmitButton } from './form-submit-button';
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
  const [yesnoAnswers, setYesnoAnswers] = useState<Record<string, boolean | null>>({});
  const [checkboxAnswers, setCheckboxAnswers] = useState<Record<string, string[]>>({});
  const [radioAnswers, setRadioAnswers] = useState<Record<string, string | null>>({});
  const [fileAnswers, setFileAnswers] = useState<Record<string, FormFile[]>>({});

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleTextChange = (key: string, value: string) => {
    setTextAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleYesNoChange = (key: string, value: boolean) => {
    setYesnoAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (key: string, selected: string[]) => {
    setCheckboxAnswers((prev) => ({ ...prev, [key]: selected }));
  };

  const handleRadioChange = (key: string, value: string) => {
    setRadioAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key: string, files: FormFile[]) => {
    setFileAnswers((prev) => ({ ...prev, [key]: files }));
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
                    description={q.description}
                    placeholder={q.placeholder}
                    value={textAnswers[qKey] ?? ''}
                    onChange={(val) => handleTextChange(qKey, val)}
                    onSubmit={handleSubmit}
                  />
                )}
                {q.type === 'photo' && (
                  <FormPhotoQuestion
                    question={q}
                    description={q.description}
                    photos={sectionPhotos}
                    onGallery={() => pickImage(sIdx, qIdx)}
                    onCamera={() => takePhoto(sIdx, qIdx)}
                    onNA={() => addNAPhoto(sIdx, qIdx)}
                    onDeletePhoto={(pIdx) => removePhoto(sIdx, qIdx, pIdx)}
                    onSubmit={handleSubmit}
                  />
                )}
                {q.type === 'yesno' && (
                  <BinarySegmentedControl
                    title={q.title}
                    status={q.status}
                    description={q.description}
                    value={yesnoAnswers[qKey] ?? null}
                    onChange={(val) => handleYesNoChange(qKey, val)}
                    onSubmit={handleSubmit}
                  />
                )}
                {q.type === 'checkbox' && (
                  <FormCheckboxQuestion
                    title={q.title}
                    status={q.status}
                    description={q.description}
                    options={q.options ?? []}
                    value={checkboxAnswers[qKey] ?? []}
                    onChange={(selected) => handleCheckboxChange(qKey, selected)}
                    onSubmit={handleSubmit}
                  />
                )}
                {q.type === 'radio' && (
                  <FormRadioQuestion
                    title={q.title}
                    status={q.status}
                    description={q.description}
                    options={q.options ?? []}
                    value={radioAnswers[qKey] ?? null}
                    onChange={(val) => handleRadioChange(qKey, val)}
                    onSubmit={handleSubmit}
                  />
                )}
                {q.type === 'file' && (
                  <FormFileQuestion
                    title={q.title}
                    status={q.status}
                    description={q.description}
                    files={fileAnswers[qKey] ?? []}
                    onChange={(files) => handleFileChange(qKey, files)}
                    onSubmit={handleSubmit}
                  />
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
});
