import apiClient from '@/lib/api';

interface AnalyticsOverview {
  totalStudents: number;
  totalCourses: number;
  totalTestSeries: number;
  totalEnrollments: number;
  pendingEnrollments: number;
  totalInquiries: number;
  pendingInquiries: number;
  recentActivity: {
    recentStudents: any[];
    recentEnrollments: any[];
    recentInquiries: any[];
  };
}

interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: AnalyticsOverview;
}

const analyticsService = {
  getOverview: async (): Promise<AnalyticsResponse> => {
    const response = await apiClient.get('/admin/analytics/overview');
    return response.data;
  }
};

export default analyticsService;