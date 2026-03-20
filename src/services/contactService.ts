import apiClient from '@/lib/api';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
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

const contactService = {
  // Submit contact form
  submitContactForm: async (formData: ContactFormData): Promise<ContactResponse> => {
    const response = await apiClient.post('/contact', formData);
    return response.data;
  },

  // Get contact messages (Admin)
  getInquiries: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get(`/admin/contact-messages?page=${page}&limit=${limit}`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])
    };
  },

  // Get all inquiries (Admin)
  getAllInquiries: async (page: number = 1, limit: number = 10, status?: string, search?: string): Promise<PaginatedResponse<any>> => {
    let url = `/admin/inquiries?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (search) url += `&search=${search}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])
    };
  },

  // Update inquiry status (Admin)
  updateInquiryStatus: async (id: string, status: string, notes?: string): Promise<ContactResponse> => {
    const response = await apiClient.put(`/admin/inquiries/${id}/status`, { status, notes });
    return response.data;
  },

  // Delete inquiry (Admin)
  deleteInquiry: async (id: string): Promise<ContactResponse> => {
    const response = await apiClient.delete(`/admin/inquiries/${id}`);
    return response.data;
  },
};

export default contactService;