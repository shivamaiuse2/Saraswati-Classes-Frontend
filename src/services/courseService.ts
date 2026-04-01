import apiClient from '@/lib/api';
// Using local Course interface instead of importing from mockData to avoid conflict
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

export interface Course {
  id: string;
  board: "CBSE" | "SSC" | "HSC";
  standard: string;
  timing_start: string;
  timing_end: string;
  days: string[];
  subjects: string[];
  fees: number;
  isActive: boolean;
  chapters: any[];
  chapterCount?: number;
}

interface CreateCourseData {
  board: string;
  standard: string;
  timing_start: string;
  timing_end: string;
  days: string[];
  subjects: string[];
  fees: number;
  isActive?: boolean;
}

// Convert API response to frontend Course type
const convertApiToCourse = (apiCourse: any): Course => {
  return {
    id: apiCourse.id,
    board: apiCourse.board,
    standard: apiCourse.standard,
    timing_start: apiCourse.timing_start,
    timing_end: apiCourse.timing_end,
    days: apiCourse.days || [],
    subjects: apiCourse.subjects || [],
    fees: apiCourse.fees,
    isActive: apiCourse.isActive,
    chapters: apiCourse.chapters || [],
    chapterCount: apiCourse.chapterCount || 0,
  };
};

interface UpdateCourseData extends Partial<CreateCourseData> { }

const courseService = {
  // Get all courses (returns grouped object if no board filter)
  getCourses: async (page: number = 1, limit: number = 10, board?: string, search?: string): Promise<any> => {
    let url = `/courses?page=${page}&limit=${limit}`;
    if (board) url += `&board=${board}`;
    if (search) url += `&search=${search}`;

    const response = await apiClient.get(url);
    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      if (Array.isArray(apiResponse.data)) {
        apiResponse.data = apiResponse.data.map(convertApiToCourse);
      } else {
        // Grouped response
        const grouped: any = {};
        for (const board in apiResponse.data) {
          grouped[board] = apiResponse.data[board].map(convertApiToCourse);
        }
        apiResponse.data = grouped;
      }
    }

    return apiResponse;
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

  // Chapter Methods
  getChapters: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}/chapters`);
    return response.data;
  },

  createChapter: async (courseId: string, chapterData: any) => {
    const response = await apiClient.post(`/courses/${courseId}/chapters`, chapterData);
    return response.data;
  },

  updateChapter: async (id: string, chapterData: any) => {
    const response = await apiClient.put(`/chapters/${id}`, chapterData);
    return response.data;
  },

  deleteChapter: async (id: string) => {
    const response = await apiClient.delete(`/chapters/${id}`);
    return response.data;
  },
};

export default courseService;