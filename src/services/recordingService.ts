import apiClient from "../lib/api";

export interface Recording {
  id: string;
  title: string;
  description: string;
  youtubeLink: string;
  courseId?: string;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    board: string;
    standard: string;
  };
  videoId?: string;
  thumbnailUrl?: string;
  embedUrl?: string;
}

export interface CreateRecordingData {
  title: string;
  description: string;
  youtubeLink: string;
  courseId?: string;
}

const recordingService = {
  getAllRecordings: async (courseId?: string) => {
    const params = courseId ? { courseId } : {};
    const response = await apiClient.get<{ success: boolean; data: Recording[] }>(
      "/recordings",
      { params }
    );
    return response.data;
  },

  getRecordingById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Recording }>(
      `/recordings/${id}`
    );
    return response.data;
  },

  createRecording: async (data: CreateRecordingData) => {
    const response = await apiClient.post<{ success: boolean; data: Recording }>(
      "/recordings",
      data
    );
    return response.data;
  },

  updateRecording: async (id: string, data: Partial<CreateRecordingData>) => {
    const response = await apiClient.put<{ success: boolean; data: Recording }>(
      `/recordings/${id}`,
      data
    );
    return response.data;
  },

  deleteRecording: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/recordings/${id}`
    );
    return response.data;
  },
};

export default recordingService;
