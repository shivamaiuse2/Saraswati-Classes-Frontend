import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import courseService from "@/services/courseService";
import testSeriesService from "@/services/testSeriesService";
import studentService from "@/services/studentService";
import bannerService from "@/services/bannerService";
import contentService from "@/services/contentService";
import enrollmentService from "@/services/enrollmentService";
import contactService from "@/services/contactService";
import { useAuth } from "@/context/AuthContext";

// Import mock data (only for default values, not for actual app functionality)
import {
  Course,
  TestSeries,
  EnrollmentRequest,
  PopupContent,
  StudentUser,
  HeroPoster,
  defaultCourses,
  defaultTestSeriesList,
  defaultHeroPosters,
  defaultPopupContent,
} from "@/data/mockData";

// Define types for contact message, result, blog, and resource
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status?: string;
}

export interface Result {
  id: string;
  name: string;
  marks: string;
  exam: string;
  image: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  price: string;
}

// Conversion functions to map API responses to frontend types
const convertApiToCourse = (apiCourse: any): Course => ({
  id: apiCourse.id,
  title: apiCourse.title,
  category: apiCourse.category as "Science" | "Competitive",
  description: apiCourse.description,
  fullDescription: apiCourse.fullDescription || apiCourse.description,
  mode: apiCourse.mode as "Online" | "Offline" | "Online / Offline",
  image: apiCourse.image,
  chapters: apiCourse.chapters || [],
  demoVideoUrl: apiCourse.demoVideoUrl || '',
  timing: apiCourse.timing,
  days: apiCourse.days,
  pricePerSubject: apiCourse.pricePerSubject,
  subjects: apiCourse.subjects || [],
  duration: apiCourse.duration || '',
});

const convertApiToTestSeries = (apiTestSeries: any): TestSeries => ({
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
});

const convertApiToHeroPoster = (apiBanner: any): HeroPoster => ({
  id: apiBanner.id,
  imageUrl: apiBanner.imageUrl,
  testSeriesId: apiBanner.testSeriesId || '',
  enabled: apiBanner.enabled !== undefined ? apiBanner.enabled : true,
  createdAt: apiBanner.createdAt || new Date().toISOString(),
});

const convertApiToStudent = (apiStudent: any): StudentUser => {
  const profile = apiStudent.studentProfile || {};
  
  // Extract enrollment IDs
  const enrolledCourses = (profile.courseEnrollments || []).map((e: any) => e.courseId);
  const enrolledTestSeries = (profile.testSeriesEnrollments || []).map((e: any) => e.testSeriesId);
  
  // Extract approved/active enrollments
  const approvedCourses = (profile.courseEnrollments || [])
    .filter((e: any) => e.status === 'ACTIVE')
    .map((e: any) => e.courseId);
  const approvedTestSeries = (profile.testSeriesEnrollments || [])
    .filter((e: any) => e.status === 'ACTIVE')
    .map((e: any) => e.testSeriesId);

  return {
    id: apiStudent.id,
    email: apiStudent.email,
    password: '', // Never expose password
    name: profile.name || apiStudent.name || '',
    fullName: profile.name || apiStudent.name || '',
    address: profile.address || apiStudent.address || '',
    mobile: profile.phone || apiStudent.phone || '',
    phone: profile.phone || apiStudent.phone || '',
    standard: profile.standard || apiStudent.standard || '',
    board: profile.board || apiStudent.board || 'SSC',
    username: apiStudent.username || profile.username || apiStudent.email || '',
    status: (profile.status || apiStudent.status || 'ACTIVE').toLowerCase() === 'blocked' ? 'blocked' : 'active',
    approvedCourses,
    approvedTestSeries,
    enrolledCourses,
    enrolledTestSeries,
    dateOfBirth: profile.dateOfBirth || null,
    guardianName: profile.guardianName || '',
    guardianPhone: profile.guardianPhone || '',
    profileImage: profile.profileImage || null,
    createdAt: apiStudent.createdAt || new Date().toISOString(),
  } as any; // Cast because types might slightly mismatch StudentUser
};

const convertApiToEnrollment = (apiEnrollment: any): EnrollmentRequest => ({
  id: apiEnrollment.id,
  name: apiEnrollment.name,
  email: apiEnrollment.email,
  phone: apiEnrollment.phone,
  message: apiEnrollment.message || '',
  courseOrSeries: apiEnrollment.courseOrSeries,
  status: apiEnrollment.status as "Pending" | "Approved" | "Rejected",
  createdAt: apiEnrollment.createdAt || new Date().toISOString(),
  studentId: apiEnrollment.studentId || undefined,
  username: apiEnrollment.username || undefined,
  password: apiEnrollment.password || undefined,
});

const convertApiToResult = (apiResult: any): Result => ({
  id: apiResult.id,
  name: apiResult.name,
  marks: apiResult.marks,
  exam: apiResult.exam,
  image: apiResult.image,
});

const convertApiToBlog = (apiBlog: any): Blog => ({
  id: apiBlog.id,
  title: apiBlog.title,
  content: apiBlog.content,
  image: apiBlog.image,
  date: apiBlog.date || apiBlog.createdAt || new Date().toISOString(),
});

const convertApiToResource = (apiResource: any): Resource => ({
  id: apiResource.id,
  title: apiResource.title,
  description: apiResource.description,
  price: apiResource.price || '',
});

const convertApiToContactMessage = (apiMessage: any): ContactMessage => ({
  id: apiMessage.id,
  name: apiMessage.name,
  email: apiMessage.email,
  phone: apiMessage.phone,
  message: apiMessage.message,
  date: apiMessage.date || apiMessage.createdAt || new Date().toISOString(),
  status: apiMessage.status,
});

interface AppContextType {
  courses: Course[];
  addCourse: (c: Omit<Course, "id">) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  loadingCourses: boolean;

  testSeries: TestSeries[];
  addTestSeries: (ts: Omit<TestSeries, "id"> & { id?: string }) => Promise<TestSeries>;
  updateTestSeries: (id: string, updates: Partial<TestSeries>) => Promise<void>;
  deleteTestSeries: (id: string) => Promise<void>;
  loadingTestSeries: boolean;

  heroPosters: HeroPoster[];
  loadingHeroPosters: boolean;
  addHeroPoster: (p: Omit<HeroPoster, "id" | "createdAt">) => void;
  updateHeroPoster: (id: string, updates: Partial<HeroPoster>) => void;
  removeHeroPoster: (id: string) => void;

  enrollments: EnrollmentRequest[];
  addEnrollment: (req: Omit<EnrollmentRequest, "id" | "status" | "createdAt">) => void;
  updateEnrollmentStatus: (id: string, status: "Approved" | "Rejected") => void;
  updateEnrollment: (id: string, updates: Partial<EnrollmentRequest>) => void;

  popup: PopupContent;
  updatePopup: (p: PopupContent) => void;

  students: StudentUser[];
  addStudent: (s: Omit<StudentUser, "id" | "createdAt">) => StudentUser;
  updateStudent: (id: string, updates: Partial<StudentUser>) => void;
  refreshStudentData: () => void;

  contactMessages: ContactMessage[];
  addContactMessage: (msg: ContactMessage) => void;
  updateContactMessage: (id: string, updates: Partial<ContactMessage>) => void;  // New function
  removeContactMessage: (id: string) => void;  // New function

  results: Result[];
  addResult: (result: Result) => void;
  loadingResults: boolean;

  blogs: Blog[];
  addBlog: (blog: Blog) => void;
  loadingBlogs: boolean;

  resources: Resource[];
  addResource: (resource: Resource) => void;
  loadingResources: boolean;
 
  loadCourses: () => Promise<void>;
  loadTestSeries: () => Promise<void>;
  testimonials: any[];
  loadingTestimonials: boolean;
  
  networkError: string | null;
  clearNetworkError: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTestSeries, setLoadingTestSeries] = useState(true);

  // Use empty initial states instead of localStorage
  const [heroPosters, setHeroPosters] = useState<HeroPoster[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentRequest[]>([]);
  const [popup, setPopup] = useState<PopupContent>({ title: '', description: '', ctaText: '', ctaLink: '', enabled: false });
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingHeroPosters, setLoadingHeroPosters] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Helper to check if error is a network error
  const isNetworkError = (error: any): boolean => {
    return error?.isNetworkError || 
           error?.code === 'ERR_NETWORK' || 
           error?.message?.includes('Network Error') ||
           error?.message?.includes('Unable to connect');
  };

  // Load courses from API
  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await courseService.getCourses(1, 100);
      if (response.success && response.data) {
        setCourses(response.data.map(convertApiToCourse));
        setNetworkError(null);
      } else {
        setCourses([]);
      }
    } catch (error: any) {
      console.error("Error loading courses:", error);
      if (isNetworkError(error)) {
        setNetworkError('Unable to connect to the server. Please check your internet connection.');
      }
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Load test series from API
  const loadTestSeries = async () => {
    setLoadingTestSeries(true);
    try {
      const response = await testSeriesService.getTestSeries(1, 100);
      if (response.success && response.data) {
        setTestSeries(response.data.map(convertApiToTestSeries));
        setNetworkError(null);
      } else {
        setTestSeries([]);
      }
    } catch (error: any) {
      console.error("Error loading test series:", error);
      if (isNetworkError(error)) {
        setNetworkError('Unable to connect to the server. Please check your internet connection.');
      }
      setTestSeries([]);
    } finally {
      setLoadingTestSeries(false);
    }
  };

  const { role, loading: authLoading } = useAuth();

  // Initialize data on mount and role/auth state change
  useEffect(() => {
    // Wait for auth to initialize before making calls (prevents missing tokens)
    if (authLoading) return;

    // PUBLIC DATA (In parallel for ultra-low latency)
    const loadPublicData = async () => {
      try {
        const [
          coursesRes,
          testRes,
          bannersRes,
          resultsRes,
          blogsRes,
          resourcesRes,
          testimonialsRes
        ] = await Promise.allSettled([
          courseService.getCourses(1, 100),
          testSeriesService.getTestSeries(1, 100),
          bannerService.getBanners(),
          contentService.getResults(1, 100),
          contentService.getBlogs(1, 100),
          contentService.getResources(1, 100),
          contentService.getGalleryItems(1, 10, "Testimonials")
        ]);

        if (coursesRes.status === 'fulfilled' && coursesRes.value.success) {
          setCourses(coursesRes.value.data.map(convertApiToCourse));
        }
        if (testRes.status === 'fulfilled' && testRes.value.success) {
          setTestSeries(testRes.value.data.map(convertApiToTestSeries));
        }
        if (bannersRes.status === 'fulfilled' && bannersRes.value.success) {
          setHeroPosters(bannersRes.value.data.map(convertApiToHeroPoster));
        }
        if (resultsRes.status === 'fulfilled' && resultsRes.value.success) {
          setResults(resultsRes.value.data.map(convertApiToResult));
        }
        if (blogsRes.status === 'fulfilled' && blogsRes.value.success) {
          setBlogs(blogsRes.value.data.map(convertApiToBlog));
        }
        if (resourcesRes.status === 'fulfilled' && resourcesRes.value.success) {
          setResources(resourcesRes.value.data.map(convertApiToResource));
        }
        if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.success) {
          const mapped = testimonialsRes.value.data.map(item => ({
            id: item.id,
            name: item.title,
            text: item.image, 
            avatar: item.image 
          }));
          setTestimonials(mapped);
        }
      } catch (error) {
        console.error('Error loading public data:', error);
      } finally {
        setLoadingCourses(false);
        setLoadingTestSeries(false);
        setLoadingTestimonials(false);
        setLoadingHeroPosters(false);
        setLoadingBlogs(false);
        setLoadingResults(false);
        setLoadingResources(false);
      }
    };

    // ADMIN DATA
    const loadAdminData = async () => {
      if (role === "admin") {
        try {
          const [studentsRes, enrollRes, inquiriesRes] = await Promise.allSettled([
            studentService.getStudents(1, 100),
            enrollmentService.getEnrollments(1, 100),
            contactService.getAllInquiries(1, 100)
          ]);

          if (studentsRes.status === 'fulfilled' && studentsRes.value.success) {
            setStudents(studentsRes.value.data.map(convertApiToStudent));
          }
          if (enrollRes.status === 'fulfilled' && enrollRes.value.success) {
            setEnrollments(enrollRes.value.data.map(convertApiToEnrollment));
          }
          if (inquiriesRes.status === 'fulfilled' && inquiriesRes.value.success) {
            setContactMessages(inquiriesRes.value.data.map(convertApiToContactMessage));
          }
        } catch (error) {
          console.error('Error loading admin data:', error);
        }
      }
    };

    loadPublicData();
    loadAdminData();
  }, [role, authLoading]);

  const addContactMessage = (msg: ContactMessage) => setContactMessages((prev) => [msg, ...prev]);
  const addResult = (result: Result) => setResults((prev) => [result, ...prev]);
  const addBlog = (blog: Blog) => setBlogs((prev) => [blog, ...prev]);
  const addResource = (resource: Resource) => setResources((prev) => [resource, ...prev]);

  const addCourse = async (c: Omit<Course, "id">) => {
    try {
      const apiCourseData = {
        title: c.title,
        category: c.category,
        description: c.description,
        fullDescription: c.fullDescription || c.description,
        mode: c.mode || "Online",
        image: c.image || "",
        timing: c.timing || "",
        days: c.days,
        pricePerSubject: c.pricePerSubject || 0,
        subjects: c.subjects || [],
        duration: c.duration || "",
        demoVideoUrl: c.demoVideoUrl || "",
      };
      const response = await courseService.createCourse(apiCourseData);
      if (response.success) setCourses(prev => [...prev, convertApiToCourse(response.data)]);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await courseService.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const addTestSeries = async (ts: Omit<TestSeries, "id"> & { id?: string }) => {
    try {
      const apiTestSeriesData = {
        title: ts.title,
        overview: ts.overview || "",
        features: ts.features || [],
        testPattern: ts.testPattern || "",
        benefits: ts.benefits || [],
        image: ts.image || "",
        ctaLabel: ts.ctaLabel || "Enroll Now",
        demoTestLink: ts.demoTestLink || "",
        heroPosterThumbnail: ts.heroPosterThumbnail || "",
        showInHeroPoster: ts.showInHeroPoster || false,
        testsCount: ts.testsCount || 0,
        mode: ts.mode || "Online",
        price: ts.price || "0",
      };
      const response = await testSeriesService.createTestSeries(apiTestSeriesData);
      if (response.success) {
        setTestSeries(prev => [...prev, convertApiToTestSeries(response.data)]);
        return convertApiToTestSeries(response.data);
      }
    } catch (error) {
      console.error("Error adding test series:", error);
    }
    return ts as any;
  };

  const updateTestSeries = async (id: string, updates: Partial<TestSeries>) => {
    try {
      const ts = testSeries.find(t => t.id === id);
      if (!ts) return;
      const apiTestSeriesData = { ...ts, ...updates } as any;
      const response = await testSeriesService.updateTestSeries(id, apiTestSeriesData);
      if (response.success) setTestSeries(prev => prev.map(t => t.id === id ? convertApiToTestSeries(response.data) : t));
    } catch (error) {
      console.error("Error updating test series:", error);
    }
  };

  const deleteTestSeries = async (id: string) => {
    try {
      await testSeriesService.deleteTestSeries(id);
      setTestSeries(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting test series:", error);
    }
  };

  const addHeroPoster = (p: Omit<HeroPoster, "id" | "createdAt">) => {
    setHeroPosters(prev => [...prev, { ...p, id: Date.now().toString(), createdAt: new Date().toISOString() } as any]);
  };

  const updateHeroPoster = (id: string, updates: Partial<HeroPoster>) => {
    setHeroPosters(prev => prev.map(h => h.id === id ? { ...h, ...updates } as any : h));
  };

  const removeHeroPoster = (id: string) => {
    setHeroPosters(prev => prev.filter(h => h.id !== id));
  };

  const addEnrollment = (req: Omit<EnrollmentRequest, "id" | "status" | "createdAt">) => {
    setEnrollments(prev => [...prev, { ...req, id: Date.now().toString(), status: "Pending", createdAt: new Date().toISOString() } as any]);
  };

  const updateEnrollmentStatus = (id: string, status: "Approved" | "Rejected") => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } as any : e));
  };

  const updateEnrollment = (id: string, updates: Partial<EnrollmentRequest>) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, ...updates } as any : e));
  };

  const updatePopup = (p: PopupContent) => setPopup(p);

  const addStudent = (s: Omit<StudentUser, "id" | "createdAt">) => {
    const newStudent = { ...s, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setStudents(prev => [...prev, newStudent as any]);
    return newStudent as any;
  };

  const updateStudent = (id: string, updates: Partial<StudentUser>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } as any : s));
  };

  const refreshStudentData = () => {
    studentService.getStudents(1, 100).then(res => {
      if (res.success && res.data) setStudents(res.data.map(convertApiToStudent));
      else setStudents([]);
    }).catch(error => {
      console.error('Error refreshing students:', error);
      setStudents([]);
    });
  };

  const updateContactMessage = (id: string, updates: Partial<ContactMessage>) => {
    setContactMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  };

  const removeContactMessage = (id: string) => {
    setContactMessages(prev => 
      prev.filter(msg => msg.id !== id)
    );
  };

  const clearNetworkError = () => setNetworkError(null);

  return (
    <AppContext.Provider value={{
      courses, addCourse, deleteCourse, loadingCourses,
      testSeries, addTestSeries, updateTestSeries, deleteTestSeries, loadingTestSeries,
      heroPosters, addHeroPoster, updateHeroPoster, removeHeroPoster, loadingHeroPosters,
      enrollments, addEnrollment, updateEnrollmentStatus, updateEnrollment,
      popup, updatePopup,
      students, addStudent, updateStudent, refreshStudentData,
      contactMessages, addContactMessage, updateContactMessage, removeContactMessage,  // Add the new function
      results, addResult, loadingResults,
      blogs, addBlog, loadingBlogs,
      resources, addResource, loadingResources,
      testimonials, loadingTestimonials,
      loadCourses, loadTestSeries,
      networkError, clearNetworkError,
    }}>
      {children}
    </AppContext.Provider>
  );
};