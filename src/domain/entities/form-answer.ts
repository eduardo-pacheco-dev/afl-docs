export interface FormPhoto {
  uri: string;
  synced: boolean;
}

export interface FormAnswer {
  reportId: string;
  sectionIdx: number;
  questionIdx: number;
  text?: string;
  photos: FormPhoto[];
}
