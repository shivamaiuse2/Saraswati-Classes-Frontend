import apiClient from '@/lib/api';
import type { TestSeries } from '@/data/mockData'; // Using mockData types

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

interface SingleTestSeriesResponse {
  success: boolean;
  message: string;
  data: any; // Raw API response
}

interface CreateTestSeriesData {
  title: string;
  overview: string;
  features: string[];
  testPattern: string;
  benefits: string[];
  image: string;
  ctaLabel: string;
  demoTestLink: string;
  heroPosterThumbnail: string;
  showInHeroPoster: boolean;
  testsCount: number;
  mode: string;
  price: string;
}

interface UpdateTestSeriesData extends Partial<CreateTestSeriesData> {}

// Convert API response to frontend TestSeries type
const convertApiToTestSeries = (apiTestSeries: any): TestSeries => {
  return {
    id: apiTestSeries.id,
    title: apiTestSeries.title,
    overview: apiTestSeries.overview,
    features: apiTestSeries.features || [],
    testPattern: apiTestSeries.testPattern,
    benefits: apiTestSeries.benefits || [],
    image: apiTestSeries.image,
    ctaLabel: apiTestSeries.ctaLabel || 'Enroll Now',
    demoTestLink: apiTestSeries.demoTestLink || '',
    heroPosterThumbnail: apiTestSeries.heroPosterThumbnail || '',
    showInHeroPoster: apiTestSeries.showInHeroPoster || false,
    testsCount: apiTestSeries.testsCount || 0,
    mode: apiTestSeries.mode || 'Online',
    price: apiTestSeries.price || '0',
    tests: apiTestSeries.tests || [],
  };
};

const testSeriesService = {
  // Get all test series
  getTestSeries: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<TestSeries>> => {
    let url = `/test-series?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;
    
    // Convert API response to frontend format
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToTestSeries);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  // Get all test series (Admin)
  getAdminTestSeries: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<TestSeries>> => {
    let url = `/test-series/admin?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;
    
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToTestSeries);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  // Get test series by ID
  getTestSeriesById: async (id: string): Promise<SingleTestSeriesResponse> => {
    const response = await apiClient.get(`/test-series/${id}`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToTestSeries(apiResponse.data)
    };
  },

  // Create a new test series
  createTestSeries: async (testSeriesData: CreateTestSeriesData): Promise<SingleTestSeriesResponse> => {
    const response = await apiClient.post('/test-series', testSeriesData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToTestSeries(apiResponse.data)
    };
  },

  // Update a test series
  updateTestSeries: async (id: string, testSeriesData: UpdateTestSeriesData): Promise<SingleTestSeriesResponse> => {
    const response = await apiClient.put(`/test-series/${id}`, testSeriesData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToTestSeries(apiResponse.data)
    };
  },

  // Delete a test series
  deleteTestSeries: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/test-series/${id}`);
    return response.data;
  },

  // Test management
  addTest: async (seriesId: string, testData: any): Promise<SingleTestSeriesResponse> => {
    const response = await apiClient.post(`/test-series/${seriesId}/tests`, testData);
    return response.data;
  },

  updateTest: async (testId: string, testData: any): Promise<SingleTestSeriesResponse> => {
    const response = await apiClient.put(`/test-series/tests/${testId}`, testData);
    return response.data;
  },

  deleteTest: async (testId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/test-series/tests/${testId}`);
    return response.data;
  },

  // Test Results management
  recordTestResult: async (resultData: any): Promise<SingleTestSeriesResponse> => {
    const response = await apiClient.post('/test-series/results', resultData);
    return response.data;
  },

  // Get all test results (Admin)
  getAllTestResults: async (page: number = 1, limit: number = 20, studentId?: string): Promise<PaginatedResponse<any>> => {
    let url = `/test-series/results?page=${page}&limit=${limit}`;
    if (studentId) url += `&studentId=${studentId}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Update test result
  updateTestResult: async (id: string, resultData: any): Promise<SingleTestSeriesResponse> => {
    const response = await apiClient.put(`/test-series/results/${id}`, resultData);
    return response.data;
  },

  // Delete test result
  deleteTestResult: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/test-series/results/${id}`);
    return response.data;
  },
};

export default testSeriesService;