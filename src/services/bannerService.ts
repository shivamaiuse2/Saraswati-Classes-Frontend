import apiClient from '@/lib/api';
import type { HeroPoster } from '@/data/mockData';

interface BannerResponse {
  success: boolean;
  message: string;
  data: any; // Raw API response
}

interface BannersResponse {
  success: boolean;
  message: string;
  data: any[]; // Raw API response
}

interface CreateBannerData {
  imageUrl: string;
  testSeriesId?: string;
  courseId?: string;
  enabled: boolean;
}

interface UpdateBannerData extends Partial<CreateBannerData> {}

// Convert API response to frontend HeroPoster type
const convertApiToHeroPoster = (apiBanner: any): HeroPoster => {
  return {
    id: apiBanner.id,
    imageUrl: apiBanner.imageUrl,
    testSeriesId: apiBanner.testSeriesId || '',
    enabled: apiBanner.enabled !== undefined ? apiBanner.enabled : true,
    createdAt: apiBanner.createdAt || new Date().toISOString(),
  };
};

const bannerService = {
  // Get all active banners
  getBanners: async (): Promise<BannersResponse> => {
    const response = await apiClient.get('/banners');
    const apiResponse = response.data;
    
    // Convert API response to frontend format
    const convertedBanners = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToHeroPoster);
    
    return {
      ...apiResponse,
      data: convertedBanners
    };
  },

  // Get all banners (Admin)
  getAdminBanners: async (): Promise<BannersResponse> => {
    const response = await apiClient.get('/admin/banners');
    const apiResponse = response.data;
    
    // Convert API response to frontend format
    const convertedBanners = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToHeroPoster);
    
    return {
      ...apiResponse,
      data: convertedBanners
    };
  },

  // Get banner by ID
  getBannerById: async (id: string): Promise<BannerResponse> => {
    const response = await apiClient.get(`/admin/banners/${id}`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToHeroPoster(apiResponse.data)
    };
  },

  // Create a new banner
  createBanner: async (bannerData: CreateBannerData): Promise<BannerResponse> => {
    const response = await apiClient.post('/admin/banners', bannerData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToHeroPoster(apiResponse.data)
    };
  },

  // Update a banner
  updateBanner: async (id: string, bannerData: UpdateBannerData): Promise<BannerResponse> => {
    const response = await apiClient.put(`/admin/banners/${id}`, bannerData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToHeroPoster(apiResponse.data)
    };
  },

  // Delete a banner
  deleteBanner: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/banners/${id}`);
    return response.data;
  },

  // Enable a banner
  enableBanner: async (id: string): Promise<BannerResponse> => {
    const response = await apiClient.patch(`/banners/${id}/enable`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: {
        banner: convertApiToHeroPoster(apiResponse.data.banner)
      }
    };
  },

  // Disable a banner
  disableBanner: async (id: string): Promise<BannerResponse> => {
    const response = await apiClient.patch(`/banners/${id}/disable`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: {
        banner: convertApiToHeroPoster(apiResponse.data.banner)
      }
    };
  },
};

export default bannerService;