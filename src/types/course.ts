export type Board = "CBSE" | "SSC" | "STATE";

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  youtubeLink?: string;
  formLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  board: Board;
  standard: string;
  timing_start: string;
  timing_end: string;
  days: string[];
  subjects: string[];
  fees: number;
  isActive: boolean;
  chapters: Chapter[];
  chapterCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

