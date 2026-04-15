import apiClient from '@/lib/api';

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryResponse {
  success: boolean;
  count: number;
  data: GalleryItem[];
}

export interface SingleGalleryResponse {
  success: boolean;
  data: GalleryItem;
}

const galleryService = {
  getAllGalleryItems: async (): Promise<GalleryResponse> => {
    const response = await apiClient.get('/gallery');
    return response.data;
  },

  getGalleryItem: async (id: string): Promise<SingleGalleryResponse> => {
    const response = await apiClient.get(`/gallery/${id}`);
    return response.data;
  },

  createGalleryItem: async (formData: FormData): Promise<SingleGalleryResponse> => {
    const response = await apiClient.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateGalleryItem: async (id: string, formData: FormData): Promise<SingleGalleryResponse> => {
    const response = await apiClient.put(`/gallery/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteGalleryItem: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await apiClient.delete(`/gallery/${id}`);
    return response.data;
  }
};

export default galleryService;
