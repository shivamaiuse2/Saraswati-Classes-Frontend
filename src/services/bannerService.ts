import apiClient from '@/lib/api';
import type { Banner } from '@/types/banner';

interface BannerResponse {
  success: boolean;
  message: string;
  data: Banner;
}

interface BannersResponse {
  success: boolean;
  message: string;
  data: Banner[];
}

interface CreateBannerData {
  imageUrl: string;
  title: string;
  subtitle: string;
  category: "COURSE" | "TEST_SERIES";
  referenceId: string;
}

interface UpdateBannerData extends Partial<CreateBannerData> { }

const bannerService = {
  // Get all banners
  getBanners: async (): Promise<BannersResponse> => {
    const response = await apiClient.get('/banners');
    return response.data;
  },

  // Get banner by ID
  getBannerById: async (id: string): Promise<BannerResponse> => {
    const response = await apiClient.get(`/banners/${id}`);
    return response.data;
  },

  // Create a new banner (Admin)
  createBanner: async (bannerData: CreateBannerData): Promise<BannerResponse> => {
    const response = await apiClient.post('/banners', bannerData);
    return response.data;
  },

  // Update a banner (Admin)
  updateBanner: async (id: string, bannerData: UpdateBannerData): Promise<BannerResponse> => {
    const response = await apiClient.put(`/banners/${id}`, bannerData);
    return response.data;
  },

  // Delete a banner (Admin)
  deleteBanner: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/banners/${id}`);
    return response.data;
  },
};

export default bannerService;