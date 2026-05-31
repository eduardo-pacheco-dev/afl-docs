import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type Photo = { uri: string; synced: boolean };

type FormSection = {
  title: string;
  questions: {
    type: 'text' | 'photo';
    title: string;
    status?: string;
    placeholder?: string;
  }[];
};

const defaultSections: FormSection[] = [
  {
    title: 'TÉCNICO 1',
    questions: [
      { type: 'text', title: 'Nome do responsável técnico da atividade', status: 'Aguardando', placeholder: 'Digite sua resposta...' },
      { type: 'photo', title: 'Foto do capacete', status: 'Aguardando' },
    ],
  },
];

export function ReportForm() {
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

  const addPhoto = (key: string, uri: string) => {
    setPhotos((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), { uri, synced: false }] }));
  };

  const pickImage = async (sectionIdx: number, qIdx: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) {
      addPhoto(`${sectionIdx}-${qIdx}`, result.assets[0].uri);
    }
  };

  const takePhoto = async (sectionIdx: number, qIdx: number) => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      addPhoto(`${sectionIdx}-${qIdx}`, result.assets[0].uri);
    }
  };

  const addNAPhoto = (sectionIdx: number, qIdx: number) => {
    addPhoto(`${sectionIdx}-${qIdx}`, 'na');
  };

  const removePhoto = (sectionIdx: number, qIdx: number, photoIdx: number) => {
    const key = `${sectionIdx}-${qIdx}`;
    setPhotos((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((_, i) => i !== photoIdx),
    }));
  };

  const bgColor = theme === 'dark' ? '#151718' : '#ffffff';
  const sectionBg = theme === 'dark' ? '#1c1c1c' : '#f2f2f7';
  const textColor = Colors[theme].text;
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';
  const inputBg = theme === 'dark' ? '#2c2c2c' : '#f8f8f8';
  const borderColor = theme === 'dark' ? '#2c2c2c' : '#d1d1d6';
  const dashedBorder = theme === 'dark' ? '#3a3a3a' : '#c7c7cc';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]} contentContainerStyle={styles.content}>
      {defaultSections.map((section, sIdx) => {
        const isExpanded = expandedSections[sIdx] ?? false;

        return (
          <View key={sIdx} style={[styles.section, { backgroundColor: sectionBg }]}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(sIdx)} activeOpacity={0.7}>
              <View style={styles.sectionHeaderLeft}>
                <View style={[styles.chevronCircle, { backgroundColor: theme === 'dark' ? '#3a3a3a' : '#e8f0fe' }]}>
                  <Ionicons
                    name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                    size={16}
                    color={Colors[theme].tint}
                  />
                </View>
                <Text style={[styles.sectionTitle, { color: textColor }]}>{section.title}</Text>
              </View>
              <Ionicons name="chevron-up" size={18} color={mutedColor} />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.sectionBody}>
                {section.questions.map((q, qIdx) => {
                  const qKey = `${sIdx}-${qIdx}`;
                  const sectionPhotos = photos[qKey] ?? [];

                  return (
                    <View key={qIdx} style={styles.questionBlock}>
                      <View style={styles.questionHeader}>
                        <Text style={[styles.questionTitle, { color: textColor }]}>{q.title}</Text>
                        {q.status && (
                          <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{q.status}</Text>
                          </View>
                        )}
                      </View>

                      {q.type === 'text' && (
                        <TextInput
                          style={[styles.textInput, { backgroundColor: inputBg, borderColor, color: textColor }]}
                          placeholder={q.placeholder}
                          placeholderTextColor={mutedColor}
                          value={textAnswers[qKey] ?? ''}
                          onChangeText={(val) => handleTextChange(qKey, val)}
                          multiline
                        />
                      )}

                      {q.type === 'photo' && (
                        <View>
                          <Text style={[styles.examplesLabel, { color: mutedColor }]}>EXEMPLOS</Text>
                          <View style={[styles.exampleThumb, { backgroundColor: inputBg, borderColor }]} />

                          {sectionPhotos.length > 0 && (
                            <View>
                              <Text style={[styles.photoCounter, { color: mutedColor }]}>
                                FOTOS ({sectionPhotos.length}/{sectionPhotos.length})
                              </Text>
                              <View style={styles.photoGrid}>
                                {sectionPhotos.map((photo, pIdx) => (
                                  <View key={pIdx} style={styles.photoThumb}>
                                    {photo.uri === 'na' ? (
                                      <View style={[styles.naThumb, { backgroundColor: inputBg, borderColor }]}>
                                        <Text style={[styles.naText, { color: mutedColor }]}>N/A</Text>
                                      </View>
                                    ) : (
                                      <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                                    )}
                                    <TouchableOpacity
                                      style={styles.deleteBtn}
                                      onPress={() => removePhoto(sIdx, qIdx, pIdx)}
                                    >
                                      <Ionicons name="close-circle" size={22} color="#ff3b30" />
                                    </TouchableOpacity>
                                    {!photo.synced && (
                                      <View style={styles.syncPending}>
                                        <Ionicons name="time-outline" size={14} color="#f59e0b" />
                                      </View>
                                    )}
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}

                          <View style={styles.uploadRow}>
                            <TouchableOpacity
                              style={[styles.uploadBtn, { borderColor: dashedBorder }]}
                              onPress={() => pickImage(sIdx, qIdx)}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="images-outline" size={28} color={mutedColor} />
                              <Text style={[styles.uploadText, { color: mutedColor }]}>Galeria</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.uploadBtn, { borderColor: dashedBorder }]}
                              onPress={() => takePhoto(sIdx, qIdx)}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="camera-outline" size={28} color={mutedColor} />
                              <Text style={[styles.uploadText, { color: mutedColor }]}>Câmera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.uploadBtn, { borderColor: dashedBorder }]}
                              onPress={() => addNAPhoto(sIdx, qIdx)}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="close-outline" size={28} color={mutedColor} />
                              <Text style={[styles.uploadText, { color: mutedColor }]}>N/A</Text>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: theme === 'dark' ? '#0a7ea4' : '#0891b2' }]}
                            activeOpacity={0.85}
                          >
                            <Ionicons name="send" size={18} color="#fff" />
                            <Text style={styles.submitText}>Enviar</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
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
  questionBlock: {
    gap: 10,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    minHeight: 48,
    textAlignVertical: 'top',
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
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  photoImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadBtn: {
    flex: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '600',
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
});
