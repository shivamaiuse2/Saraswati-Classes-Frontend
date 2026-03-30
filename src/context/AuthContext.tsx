import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import authService from "@/services/authService";
import { useNavigate } from "react-router-dom";

type UserRole = "admin" | "student" | null;

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  adminProfile?: {
    id: string;
    userId: string;
    name: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
  };
  studentProfile?: {
    id: string;
    userId: string;
    name: string;
    phone?: string;
    address?: string;
    standard?: string;
    board?: string;
    status: string;
    profileImage?: string;
    dateOfBirth?: string;
    guardianName?: string;
    guardianPhone?: string;
    username?: string;
    certificates?: any[];
    courseEnrollments?: any[];
    enrollments?: any[];
    testResults?: any[];
    testSeriesEnrollments?: any[];
    createdAt: string;
    updatedAt: string;
  };
}

interface AuthState {
  role: 'admin' | 'student' | null;
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string, userType: 'admin' | 'student') => Promise<boolean>;
  register: (userData: any, userType: 'admin' | 'student') => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  updateProfile: (userData: any) => Promise<boolean>;
}

interface AuthContextType extends AuthState {
  isAdmin: boolean;
  isStudent: boolean;
  currentStudent: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  const initializeAuth = async () => {
    setLoading(true);
    try {
      const storedRole = localStorage.getItem("sc_role") as UserRole;
      const accessToken = localStorage.getItem("accessToken");
      
      if (storedRole && accessToken) {
        // Verify token by fetching user profile
        try {
          const response = await authService.getProfile();
          if (response.success) {
            setRole(storedRole);
            setCurrentUser(response.data.user);
          } else {
            // Token invalid, clear auth
            localStorage.removeItem("sc_role");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        } catch (error) {
          // Token invalid, clear auth
          localStorage.removeItem("sc_role");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (role) {
        localStorage.setItem("sc_role", role);
      } else {
        localStorage.removeItem("sc_role");
      }
    }
  }, [role, loading]);

  const login = async (email: string, password: string, userType: 'admin' | 'student'): Promise<boolean> => {
    try {
      let loginResponse;
      
      if (userType === 'admin') {
        loginResponse = await authService.adminLogin({ email, password });
      } else {
        loginResponse = await authService.studentLogin({ email, password });
      }

      // Check if response indicates success
      if (loginResponse && loginResponse.success) {
        const { user, accessToken, refreshToken } = loginResponse.data;
        
        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Set auth state
        setRole(userType);
        setCurrentUser(user);
        
        return true;
      } else {
        throw new Error(loginResponse?.message || 'Login failed. Please check your credentials.');
      }
      
    } catch (error: any) {
      console.error("Login error in AuthContext:", error);
      
      // If it's already a formatted error (from api.ts interceptor), re-throw it
      if (error?.isNetworkError || error?.isTimeout) {
        throw error;
      }
      
      // If it's already an Error with a message, re-throw it
      if (error instanceof Error && error.message) {
        throw error;
      }
      
      // Otherwise, create a meaningful error message
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || `Unable to login as ${userType}. Please try again.`;
      
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: any, userType: 'admin' | 'student'): Promise<boolean> => {
    try {
      let registerResponse;
      
      if (userType === 'admin') {
        registerResponse = await authService.registerAdmin(userData);
      } else {
        registerResponse = await authService.registerStudent(userData);
      }

      if (registerResponse.success) {
        const { user, accessToken, refreshToken } = registerResponse.data;
        
        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Set auth state
        setRole(userType);
        setCurrentUser(user);
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Registration error:", error);
      return false;
    }
  };
  const logout = () => {
    const currentRole = role;
    
    // Clear auth state
    setRole(null);
    setCurrentUser(null);
    
    // Clear storage
    localStorage.removeItem("sc_role");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sc_current_student");
    localStorage.removeItem("sc_admin");
    
    // Redirect based on role
    if (currentRole === 'admin') {
      navigate('/admin-login');
    } else {
      navigate('/student-login');
    }
  };

  const updateProfile = async (userData: any): Promise<boolean> => {
    try {
      const response = await authService.updateProfile(userData);
      if (response.success) {
        // Update the current user with the response data
        // The response from /auth/profile PUT returns { success, message, data: { user } }
        setCurrentUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    }
  };

  const value: AuthContextType = {
    role,
    isAdmin: role === "admin",
    isStudent: role === "student",
    currentUser,
    loading,
    login,
    register,
    logout,
    initializeAuth,
    updateProfile,
    currentStudent: currentUser?.role === 'STUDENT' ? {
      ...currentUser.studentProfile,
      email: currentUser.email,
      role: currentUser.role,
      id: currentUser.id,
      approvedCourses: currentUser.studentProfile?.courseEnrollments?.map((e: any) => e.courseId) || [],
      approvedTestSeries: currentUser.studentProfile?.testSeriesEnrollments?.map((e: any) => e.testSeriesId) || []
    } : null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};