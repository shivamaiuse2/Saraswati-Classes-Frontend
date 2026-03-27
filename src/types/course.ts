import type { Chapter } from "./chapter";

export type CourseCategory = "Science" | "Competitive";

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  description: string;
  subjects: string[];
  days: string;
  time: string;
  fees: number;
  chapters: Chapter[];
}

