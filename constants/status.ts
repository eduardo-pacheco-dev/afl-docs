export const statusConfig: Record<string, { bg: string; text: string; icon: string; iconName: string }> = {
  'Aprovado': {
    bg: '#dcfce7',
    text: '#16a34a',
    icon: '#16a34a',
    iconName: 'checkmark-circle',
  },
  'Em avaliação': {
    bg: '#fef9c3',
    text: '#ca8a04',
    icon: '#ca8a04',
    iconName: 'time-outline',
  },
  'Pendente': {
    bg: '#fce7f3',
    text: '#db2777',
    icon: '#db2777',
    iconName: 'alert-circle-outline',
  },
  'Reprovado': {
    bg: '#fef2f2',
    text: '#dc2626',
    icon: '#dc2626',
    iconName: 'close-circle-outline',
  },
};

export function getStatusConfig(status: string) {
  return statusConfig[status] ?? {
    bg: '#f3f4f6',
    text: '#6b7280',
    icon: '#6b7280',
    iconName: 'remove-outline',
  };
}
