export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  videoUrl: string | null;
  testDescription: string | null;
  testLink: string | null;
  createdAt?: string;
  updatedAt?: string;
}

