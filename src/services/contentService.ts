import apiClient from '@/lib/api';

// TYPES
export interface CourseChapter {
  title: string;
  description: string;
  videoUrl: string; // direct YouTube link (not embedded)
}

export interface Course {
  id: string;
  title: string;
  category: "Foundation" | "Science" | "Competitive";
  description: string;
  fullDescription: string;
  mode: "Online" | "Offline" | "Online / Offline";
  image: string;
  chapters: CourseChapter[];
  demoVideoUrl: string; // YouTube embed link
  timing: string;
  days: string;
  pricePerSubject: number;
  subjects?: string[];
  duration?: string;
}

export interface TestSeries {
  id: string;
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

export interface EnrollmentRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  courseOrSeries: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  studentId?: string;
  username?: string;
  password?: string;
}

export interface PopupContent {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  enabled: boolean;
}

export interface StudentUser {
  id: string;
  email: string;
  password: string;
  name: string;
  approvedCourses: string[];
  approvedTestSeries: string[];
  createdAt: string;
}

export interface HeroPoster {
  id: string;
  imageUrl: string;
  testSeriesId: string;
  enabled: boolean;
  createdAt: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author?: string;
  isActive?: boolean;
}

interface Result {
  id: string;
  name: string;
  marks: string;
  exam: string;
  image: string;
  studentId?: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  price: string;
}

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  createdAt: string;
  author?: string;
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

interface SingleItemResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CreateBlogData {
  title: string;
  content: string;
  image: string;
}

interface CreateResourceData {
  title: string;
  description: string;
  price: string;
}

interface CreateResultData {
  name: string;
  marks: string;
  exam: string;
  image: string;
  studentId?: string;
}

// Convert API response to frontend Blog type
const convertApiToBlog = (apiBlog: any): Blog => {
  return {
    id: apiBlog.id,
    title: apiBlog.title,
    content: apiBlog.content,
    image: apiBlog.image || apiBlog.imageUrl || "",
    date: apiBlog.date || apiBlog.createdAt || new Date().toISOString(),
    isActive: apiBlog.isActive !== undefined ? apiBlog.isActive : true,
    author: apiBlog.author || apiBlog.creator?.adminProfile?.name || "Admin",
  } as any;
};

// Convert API response to frontend Resource type
const convertApiToResource = (apiResource: any): Resource => {
  return {
    id: apiResource.id,
    title: apiResource.title,
    description: apiResource.description,
    price: apiResource.price || '',
  };
};

// Convert API response to frontend Result type
const convertApiToResult = (apiResult: any): Result => {
  return {
    id: apiResult.id,
    name: apiResult.name,
    marks: apiResult.marks,
    exam: apiResult.exam,
    image: apiResult.image,
    studentId: apiResult.studentId,
  };
};

// Convert API response to frontend GalleryItem type
const convertApiToGalleryItem = (apiGalleryItem: any): GalleryItem => {
  return {
    id: apiGalleryItem.id,
    title: apiGalleryItem.title,
    image: apiGalleryItem.image,
    category: apiGalleryItem.category,
    createdAt: apiGalleryItem.createdAt || new Date().toISOString(),
    author: apiGalleryItem.author,
  };
};

const contentService = {
  // Blog operations
  getBlogs: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Blog>> => {
    let url = `/content/blogs?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;
    
    // Convert API response to frontend format
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToBlog);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  getAdminBlogs: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Blog>> => {
    const response = await apiClient.get(`/content/admin/blogs?page=${page}&limit=${limit}`);
    const apiResponse = response.data;
    
    // Convert API response to frontend format
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToBlog);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  getBlogById: async (id: string): Promise<SingleItemResponse<Blog>> => {
    const response = await apiClient.get(`/content/blogs/${id}`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToBlog(apiResponse.data)
    };
  },

  createBlog: async (blogData: Blog): Promise<SingleItemResponse<Blog>> => {
    // Backend expects 'image', frontend might send 'imageUrl' or 'image'
    const payload = {
      title: blogData.title,
      content: blogData.content,
      image: (blogData as any).image || (blogData as any).imageUrl || "",
      isActive: blogData.isActive !== undefined ? blogData.isActive : true,
      date: blogData.date || new Date().toISOString()
    };
    
    const response = await apiClient.post('/content/admin/blogs', payload);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToBlog(apiResponse.data)
    };
  },

  updateBlog: async (id: string, blogData: Partial<Blog>): Promise<SingleItemResponse<Blog>> => {
    const payload = {
      ...(blogData.title && { title: blogData.title }),
      ...(blogData.content && { content: blogData.content }),
      ...(((blogData as any).image || (blogData as any).imageUrl) && { image: (blogData as any).image || (blogData as any).imageUrl }),
      ...(blogData.isActive !== undefined && { isActive: blogData.isActive }),
      ...(blogData.date && { date: blogData.date })
    };

    const response = await apiClient.put(`/content/admin/blogs/${id}`, payload);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToBlog(apiResponse.data)
    };
  },

  deleteBlog: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/content/admin/blogs/${id}`);
    return response.data;
  },

  // Resource operations (public)
  getResources: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Resource>> => {
    let url = `/content/resources?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;
    
    // Convert API response to frontend format
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToResource);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  getResourceById: async (id: string): Promise<SingleItemResponse<Resource>> => {
    const response = await apiClient.get(`/content/resources/${id}`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToResource(apiResponse.data)
    };
  },

  // Admin resource operations
  getAdminResources: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Resource>> => {
    const response = await apiClient.get(`/content/admin/resources?page=${page}&limit=${limit}`);
    const apiResponse = response.data;
    
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToResource);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  createResource: async (resourceData: CreateResourceData): Promise<SingleItemResponse<Resource>> => {
    const response = await apiClient.post('/content/admin/resources', resourceData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToResource(apiResponse.data)
    };
  },

  updateResource: async (id: string, resourceData: Partial<CreateResourceData>): Promise<SingleItemResponse<Resource>> => {
    const response = await apiClient.put(`/content/admin/resources/${id}`, resourceData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToResource(apiResponse.data)
    };
  },

  deleteResource: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/content/admin/resources/${id}`);
    return response.data;
  },

  // Result operations
  getResults: async (page: number = 1, limit: number = 10, exam?: string): Promise<PaginatedResponse<Result>> => {
    let url = `/content/results?page=${page}&limit=${limit}`;
    if (exam) url += `&exam=${exam}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;
    
    // Convert API response to frontend format
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToResult);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  getAdminResults: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Result>> => {
    const response = await apiClient.get(`/content/admin/results?page=${page}&limit=${limit}`);
    const apiResponse = response.data;
    
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToResult);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  getResultById: async (id: string): Promise<SingleItemResponse<Result>> => {
    const response = await apiClient.get(`/content/results/${id}`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToResult(apiResponse.data)
    };
  },

  createResult: async (resultData: CreateResultData): Promise<SingleItemResponse<Result>> => {
    const response = await apiClient.post('/content/admin/results', resultData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToResult(apiResponse.data)
    };
  },

  updateResult: async (id: string, resultData: Partial<CreateResultData>): Promise<SingleItemResponse<Result>> => {
    const response = await apiClient.put(`/content/admin/results/${id}`, resultData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToResult(apiResponse.data)
    };
  },

  deleteResult: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/content/admin/results/${id}`);
    return response.data;
  },

  // Gallery operations (public)
  getGalleryItems: async (page: number = 1, limit: number = 10, category?: string): Promise<PaginatedResponse<GalleryItem>> => {
    let url = `/content/gallery?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    
    const response = await apiClient.get(url);
    const apiResponse = response.data;
    
    // Convert API response to frontend format
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToGalleryItem);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  getGalleryItemById: async (id: string): Promise<SingleItemResponse<GalleryItem>> => {
    const response = await apiClient.get(`/content/gallery/${id}`);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToGalleryItem(apiResponse.data)
    };
  },

  // Admin gallery operations
  getAdminGalleryItems: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<GalleryItem>> => {
    const response = await apiClient.get(`/content/admin/gallery?page=${page}&limit=${limit}`);
    const apiResponse = response.data;
    
    const convertedItems = (Array.isArray(apiResponse.data) ? apiResponse.data : (apiResponse.data || [])).map(convertApiToGalleryItem);
    
    return {
      ...apiResponse,
      data: convertedItems
    };
  },

  createGalleryItem: async (galleryData: any): Promise<SingleItemResponse<GalleryItem>> => {
    const response = await apiClient.post('/content/admin/gallery', galleryData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToGalleryItem(apiResponse.data)
    };
  },

  updateGalleryItem: async (id: string, galleryData: Partial<any>): Promise<SingleItemResponse<GalleryItem>> => {
    const response = await apiClient.put(`/content/admin/gallery/${id}`, galleryData);
    const apiResponse = response.data;
    
    return {
      ...apiResponse,
      data: convertApiToGalleryItem(apiResponse.data)
    };
  },

  deleteGalleryItem: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/content/admin/gallery/${id}`);
    return response.data;
  },
};

export default contentService;