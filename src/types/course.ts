export type Board = "CBSE" | "SSC" | "STATE";

export interface CourseChapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl?: string;
  testDescription?: string;
  testLink?: string;
  chapterNumber: number;
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
  chapters: CourseChapter[];
  createdAt?: string;
  updatedAt?: string;
}

