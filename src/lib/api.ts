import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://saraswati-classes-backend.vercel.app/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Helper to check if error is a network error
const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && Boolean(error.code === 'ERR_NETWORK' || error.message?.includes('Network Error'));
};

// Queue for requests while refreshing
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

// Response interceptor to handle errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle network errors
    if (isNetworkError(error)) {
      const networkError = new Error('Unable to connect to the server. Please check your internet connection and try again.');
      (networkError as any).isNetworkError = true;
      (networkError as any).originalError = error;
      return Promise.reject(networkError);
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      const timeoutError = new Error('Request timed out. Please check your connection and try again.');
      (timeoutError as any).isTimeout = true;
      return Promise.reject(timeoutError);
    }

    const originalRequest = error.config;

    // If token expired and not already refreshing, try to refresh
    if (
      error.response?.status === 401 &&
      !originalRequest?.url?.includes("/auth/refresh") &&
      !originalRequest?.url?.includes("/auth/admin/login") &&
      !originalRequest?.url?.includes("/auth/student/login") &&
      !originalRequest?.url?.includes("/auth/register")
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            isRefreshing = false;
            onRefreshed(accessToken);

            // Retry original request
            if (originalRequest?.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return apiClient(originalRequest as InternalAxiosRequestConfig);
          } else {
            throw new Error("Refresh failed");
          }
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = []; // Clear subscribers on failure
          // If refresh fails, redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("sc_role");
          localStorage.removeItem("sc_current_student");
          localStorage.removeItem("sc_admin");
          if (
            !window.location.pathname.includes("/login") &&
            window.location.pathname !== "/"
          ) {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      }

      // If already refreshing, wait for it to finish and retry
      const retryOriginalRequest = new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          if (originalRequest?.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(apiClient(originalRequest as InternalAxiosRequestConfig));
        });
      });
      return retryOriginalRequest;
    }

    // Extract error message from response if available
    const responseData = error.response?.data as any;
    if (responseData?.message) {
      const serverError = new Error(responseData.message);
      (serverError as any).status = error.response?.status;
      (serverError as any).data = responseData;
      (serverError as any).response = error.response;
      return Promise.reject(serverError);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
