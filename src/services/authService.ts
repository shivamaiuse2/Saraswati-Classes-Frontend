import apiClient from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
  phone?: string;
  standard?: string;
  board?: string;
  address?: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

interface UserProfile {
  success: boolean;
  message: string;
  data: {
    user: any;
  };
}

const authService = {
  // Admin login
  adminLogin: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log("Making admin login request...");
    console.log("Credentials being sent:", credentials);
    try {
      const response = await apiClient.post('/auth/admin/login', credentials);
      console.log("Admin login response received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Admin login API call failed:", error);
      // Handle different error scenarios
      if (error.response?.status === 401 || error.response?.status === 400) {
        // Return the error response for validation errors
        throw new Error(error.response?.data?.message || 'Invalid credentials');
      }
      // For network errors or other issues
      throw new Error('Unable to connect to server. Please try again.');
    }
  },

  // Student login
  studentLogin: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log("Making student login request...");
    try {
      const response = await apiClient.post('/auth/student/login', credentials);
      console.log("Student login response received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Student login API call failed:", error);
      console.log("Error response:", error.response);
      console.log("Error response data:", error.response?.data);
      console.log("Error message from backend:", error.response?.data?.message);
      
      // Handle different error scenarios
      if (error.response?.status === 401 || error.response?.status === 400) {
        const message = error.response?.data?.message || 'Invalid credentials';
        console.log("Throwing extracted error message:", message);
        throw new Error(message);
      }
      if (error.response?.status === 403) {
        // Blocked account
        const message = error.response?.data?.message || 'Your account has been blocked. Please contact admin.';
        console.log("Throwing blocked account error:", message);
        throw new Error(message);
      }
      // For network errors or other issues
      console.log("Throwing generic network error");
      throw new Error('Unable to connect to server. Please try again.');
    }
  },

  // Register student
  registerStudent: async (userData: RegisterCredentials): Promise<RegisterResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Register admin
  registerAdmin: async (userData: Omit<RegisterCredentials, 'standard' | 'board' | 'address' | 'dateOfBirth' | 'guardianName' | 'guardianPhone'>): Promise<RegisterResponse> => {
    const response = await apiClient.post('/auth/admin/register', userData);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<RegisterCredentials>): Promise<UserProfile> => {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data;
  },
};

export default authService;