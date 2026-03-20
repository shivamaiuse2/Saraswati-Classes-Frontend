import apiClient from '@/lib/api';
import type { Course } from '@/data/mockData'; // Using mockData types
import type { Chapter } from '@/types/chapter';

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SingleCourseResponse {
  success: boolean;
  message: string;
  data: any; // Raw API response
}

interface ChapterResponse {
  success: boolean;
  message: string;
  data: Chapter;
}

interface CreateCourseData {
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  mode: string;
  image: string;
  timing: string;
  days: string;
  pricePerSubject: number;
  subjects: string[];
  duration?: string;
  demoVideoUrl?: string;
  chapters?: CourseChapter[];
}

interface CourseChapter {
  title: string;
  description: string;
  videoUrl?: string;
  testDescription?: string;
  testLink?: string;
}

interface UpdateCourseData extends Partial<CreateCourseData> {}

interface CreateChapterData {
  title: string;
  description: string;
  videoUrl?: string;
  testDescription?: string;
  testLink?: string;
}

interface UpdateChapterData {
  title?: string;
  description?: string;
  videoUrl?: string;
  testDescription?: string;
  testLink?: string;
}

// Convert API response to frontend Course type
const convertApiToCourse = (apiCourse: any): Course => {
  return {
    id: apiCourse.id,
    title: apiCourse.title,
    category: apiCourse.category as "Foundation" | "Science" | "Competitive",
    description: apiCourse.description,
    fullDescription: apiCourse.fullDescription || apiCourse.description,
    mode: apiCourse.mode as "Online" | "Offline" | "Online / Offline",
    image: apiCourse.image,
    chapters: (apiCourse.chapters || []).map((ch: any) => ({
      id: ch.id,
      chapterNumber: ch.chapterNumber,
      title: ch.title,
      description: ch.description,
      videoUrl: ch.videoUrl,
      testDescription: ch.testDescription,
      testLink: ch.testLink,
    })),
    demoVideoUrl: apiCourse.demoVideoUrl || '',
    timing: apiCourse.timing,
    days: apiCourse.days,
    pricePerSubject: apiCourse.pricePerSubject,
    subjects: apiCourse.subjects || [],
    duration: apiCourse.duration || '',
  };
};

const courseService = {
  // Get all courses
  getCourses: async (page: number = 1, limit: number = 10, category?: string, search?: string): Promise<PaginatedResponse<Course>> => {
    let url = `/courses?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;
    
    // Convert API response to frontend format
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToCourse);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  // Get course by ID
  getCourseById: async (id: string): Promise<SingleCourseResponse> => {
    const response = await apiClient.get(`/courses/${id}`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToCourse(apiResponse.data)
    };
  },

  // Create a new course
  createCourse: async (courseData: CreateCourseData): Promise<SingleCourseResponse> => {
    const response = await apiClient.post('/courses', courseData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToCourse(apiResponse.data)
    };
  },

  // Update a course
  updateCourse: async (id: string, courseData: UpdateCourseData): Promise<SingleCourseResponse> => {
    const response = await apiClient.put(`/courses/${id}`, courseData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToCourse(apiResponse.data)
    };
  },

  // Delete a course
  deleteCourse: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  },

  // Get course chapters
  getCourseChapters: async (courseId: string): Promise<{ success: boolean; message: string; data: Chapter[] }> => {
    const response = await apiClient.get(`/courses/${courseId}`);
    const apiResponse = response.data;
    return {
      success: apiResponse.success,
      message: apiResponse.message,
      data: apiResponse.data?.chapters || []
    };
  },

  // Add chapter to course
  addChapterToCourse: async (courseId: string, chapterData: CreateChapterData): Promise<ChapterResponse> => {
    const response = await apiClient.post(`/courses/${courseId}/chapters`, chapterData);
    return response.data;
  },

  // Update a chapter
  updateChapter: async (chapterId: string, chapterData: UpdateChapterData): Promise<ChapterResponse> => {
    const response = await apiClient.put(`/courses/chapters/${chapterId}`, chapterData);
    return response.data;
  },

  // Delete a chapter
  deleteChapter: async (chapterId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/courses/chapters/${chapterId}`);
    return response.data;
  },
};

export default courseService;