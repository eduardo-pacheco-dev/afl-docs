import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { getStatusConfig } from '@/constants/status';
import { FormSubmitButton } from '../../form-submit-button';

export type FormFile = {
  uri: string;
  name: string;
  size: number;
  mimeType?: string;
};

type FormFileQuestionProps = {
  title: string;
  status?: string;
  description?: string;
  accept?: string[];
  files: FormFile[];
  onChange: (files: FormFile[]) => void;
  onSubmit: () => void;
};

export function FormFileQuestion({ title, status, description, accept, files, onChange, onSubmit }: FormFileQuestionProps) {
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme].text;
  const mutedColor = theme === 'dark' ? '#9BA1A6' : '#8e8e93';
  const inputBg = theme === 'dark' ? '#2c2c2c' : '#f8f8f8';
  const dashedBorder = theme === 'dark' ? '#3a3a3a' : '#c7c7cc';
  const showSubmit = status !== 'Em avaliação' && status !== 'Aprovado';
  const readOnly = !showSubmit;

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: accept ?? '*/*',
        multiple: true,
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets) {
        const picked: FormFile[] = result.assets.map((a) => ({
          uri: a.uri,
          name: a.name,
          size: a.size ?? 0,
          mimeType: a.mimeType,
        }));
        onChange([...files, ...picked]);
      }
    } catch {}
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {status && (
          <View style={[styles.badge, { backgroundColor: getStatusConfig(status).bg }]}>
            <Text style={[styles.badgeText, { color: getStatusConfig(status).text }]}>{status}</Text>
          </View>
        )}
      </View>
      {description && <Text style={[styles.description, { color: mutedColor }]}>{description}</Text>}

      {!readOnly && (
        <TouchableOpacity style={[styles.pickerArea, { borderColor: dashedBorder }]} onPress={pickFile} activeOpacity={0.7}>
          <Ionicons name="cloud-upload-outline" size={36} color={mutedColor} />
          <Text style={[styles.pickerText, { color: mutedColor }]}>Toque para selecionar arquivos</Text>
        </TouchableOpacity>
      )}

      {files.length > 0 && (
        <View style={styles.fileList}>
          {files.map((file, i) => (
            <View key={i} style={[styles.fileItem, { backgroundColor: inputBg }]}>
              <Ionicons name="document-outline" size={22} color={textColor} />
              <View style={styles.fileInfo}>
                <Text style={[styles.fileName, { color: textColor }]} numberOfLines={1}>{file.name}</Text>
                <Text style={[styles.fileSize, { color: mutedColor }]}>{formatSize(file.size)}</Text>
              </View>
              {!readOnly && (
                <TouchableOpacity onPress={() => removeFile(i)} hitSlop={8}>
                  <Ionicons name="close-circle" size={22} color="#ff3b30" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {showSubmit && <FormSubmitButton onPress={onSubmit} />}
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
  pickerArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fileList: {
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    marginTop: 2,
  },
});
