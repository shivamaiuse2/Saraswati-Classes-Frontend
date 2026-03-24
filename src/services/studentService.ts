import apiClient from '@/lib/api';
import type { StudentUser } from '@/data/mockData';

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

interface SingleStudentResponse {
  success: boolean;
  message: string;
  data: any; // Raw API response
}

interface UpdateStudentData {
  name?: string;
  phone?: string;
  address?: string;
  standard?: string;
  board?: string;
  status?: string;
  profileImage?: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
}

interface EnrollmentData {
  name: string;
  email: string;
  phone: string;
  message: string;
  courseOrSeries: string;
  studentId?: string;
  username?: string;
  password?: string;
}

interface EnrollmentResponse {
  success: boolean;
  message: string;
  data: {
    enrollment: any;
  };
}

const convertApiToStudent = (apiStudent: any): any => {
  const profile = apiStudent.studentProfile || {};
  
  // Extract enrollment IDs
  const enrolledCourses = (profile.courseEnrollments || []).map((e: any) => e.courseId);
  const enrolledTestSeries = (profile.testSeriesEnrollments || []).map((e: any) => e.testSeriesId);
  
  // Extract approved/active enrollments
  const approvedCourses = (profile.courseEnrollments || [])
    .filter((e: any) => e.status === 'ACTIVE')
    .map((e: any) => e.courseId);
  const approvedTestSeries = (profile.testSeriesEnrollments || [])
    .filter((e: any) => e.status === 'ACTIVE')
    .map((e: any) => e.testSeriesId);

  return {
    id: apiStudent.id,
    email: apiStudent.email,
    password: '', // Never expose password
    name: profile.name || apiStudent.name || '',
    fullName: profile.name || apiStudent.name || '',
    address: profile.address || apiStudent.address || '',
    mobile: profile.phone || apiStudent.phone || '',
    phone: profile.phone || apiStudent.phone || '',
    standard: profile.standard || apiStudent.standard || '',
    board: profile.board || apiStudent.board || 'SSC',
    username: apiStudent.username || profile.username || apiStudent.email || '',
    status: (profile.status || apiStudent.status || 'ACTIVE').toLowerCase(),
    approvedCourses,
    approvedTestSeries,
    enrolledCourses,
    enrolledTestSeries,
    dateOfBirth: profile.dateOfBirth || null,
    guardianName: profile.guardianName || '',
    guardianPhone: profile.guardianPhone || '',
    profileImage: profile.profileImage || null,
    createdAt: apiStudent.createdAt || new Date().toISOString(),
  };
};

const studentService = {
  // Get all students
  getStudents: async (page: number = 1, limit: number = 10, search?: string, status?: string): Promise<PaginatedResponse<StudentUser>> => {
    let url = `/admin/students?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;

    // Convert API response to frontend format
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToStudent);

    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  // Create student
  createStudent: async (studentData: any): Promise<SingleStudentResponse> => {
    const response = await apiClient.post('/admin/students', studentData);
    const apiResponse = response.data;
    return {
      ...apiResponse,
      data: convertApiToStudent(apiResponse.data)
    };
  },

  // Get student by ID
  getStudentById: async (id: string): Promise<SingleStudentResponse> => {
    const response = await apiClient.get(`/admin/students/${id}`);
    const apiResponse = response.data;

    return {
      ...apiResponse,
      data: convertApiToStudent(apiResponse.data)
    };
  },

  // Update student
  updateStudent: async (id: string, studentData: UpdateStudentData): Promise<SingleStudentResponse> => {
    const response = await apiClient.put(`/admin/students/${id}`, studentData);
    const apiResponse = response.data;

    return {
      ...apiResponse,
      data: convertApiToStudent(apiResponse.data)
    };
  },

  // Delete student
  deleteStudent: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/students/${id}`);
    return response.data;
  },

  // Block student
  blockStudent: async (id: string): Promise<SingleStudentResponse> => {
    const response = await apiClient.put(`/admin/students/${id}/status`, { status: 'BLOCKED' });
    const apiResponse = response.data;

    return {
      ...apiResponse,
      data: convertApiToStudent(apiResponse.data)
    };
  },

  // Unblock student
  unblockStudent: async (id: string): Promise<SingleStudentResponse> => {
    const response = await apiClient.put(`/admin/students/${id}/status`, { status: 'ACTIVE' });
    const apiResponse = response.data;

    return {
      ...apiResponse,
      data: convertApiToStudent(apiResponse.data)
    };
  },

  // Get student enrollments
  getStudentEnrollments: async (studentId: string): Promise<{ success: boolean; message: string; data: { enrollments: any[] } }> => {
    const response = await apiClient.get(`/students/${studentId}/enrollments`);
    return response.data;
  },

  // Create enrollment
  createEnrollment: async (enrollmentData: EnrollmentData): Promise<EnrollmentResponse> => {
    const response = await apiClient.post('/students/enroll', enrollmentData);
    return response.data;
  },

  // Search students by name (for autocomplete)
  searchStudents: async (query: string): Promise<{ success: boolean; message: string; data: Array<{ id: string; name: string; email: string; phone: string }> }> => {
    const response = await apiClient.get(`/admin/students/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get student's achievement results (added by admin)
  getStudentAchievements: async (): Promise<{ success: boolean; message: string; data: Array<{ id: string; name: string; marks: string; exam: string; image: string; createdAt: string }> }> => {
    const response = await apiClient.get('/students/achievements');
    return response.data;
  },
};

export default studentService;