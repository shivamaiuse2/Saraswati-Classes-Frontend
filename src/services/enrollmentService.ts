import apiClient from '@/lib/api';

interface Enrollment {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  courseOrSeries: string;
  status: string;
  studentId?: string;
  username?: string;
  password?: string;
  createdAt: string;
}

interface CreateEnrollmentData {
  name: string;
  email: string;
  phone: string;
  message: string;
  courseOrSeries: string;
  studentId?: string;
  username?: string;
  password?: string;
}

interface UpdateEnrollmentData {
  status?: string;
  studentId?: string;
  username?: string;
  password?: string;
}

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

interface SingleEnrollmentResponse {
  success: boolean;
  message: string;
  data: Enrollment;
}

const enrollmentService = {
  // Get all enrollments
  getEnrollments: async (page: number = 1, limit: number = 10, status?: string, search?: string): Promise<PaginatedResponse<Enrollment>> => {
    let url = `/admin/enrollments?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (search) url += `&search=${search}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])
    };
  },

  // Get enrollment by ID
  getEnrollmentById: async (id: string): Promise<SingleEnrollmentResponse> => {
    const response = await apiClient.get(`/enrollments/${id}`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: apiResponse.data
    };
  },

  // Create a new enrollment
  createEnrollment: async (enrollmentData: CreateEnrollmentData): Promise<SingleEnrollmentResponse> => {
    const response = await apiClient.post('/enrollments', enrollmentData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: apiResponse.data
    };
  },

  // Update an enrollment
  updateEnrollment: async (id: string, enrollmentData: UpdateEnrollmentData): Promise<SingleEnrollmentResponse> => {
    const response = await apiClient.put(`/enrollments/${id}`, enrollmentData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: apiResponse.data
    };
  },

  // Delete an enrollment
  deleteEnrollment: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/enrollments/${id}`);
    return response.data;
  },

  // Update enrollment status
  updateEnrollmentStatus: async (id: string, status: string, notes?: string): Promise<SingleEnrollmentResponse> => {
    const response = await apiClient.put(`/admin/enrollments/${id}/status`, { status, notes });
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: apiResponse.data
    };
  },
};

export default enrollmentService;