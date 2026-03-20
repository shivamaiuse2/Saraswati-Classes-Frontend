import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import courseService from "@/services/courseService";
import testSeriesService from "@/services/testSeriesService";
import studentService from "@/services/studentService";
import bannerService from "@/services/bannerService";
import contentService from "@/services/contentService";
import enrollmentService from "@/services/enrollmentService";
import contactService from "@/services/contactService";

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
  category: apiCourse.category as "Foundation" | "Science" | "Competitive",
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

  results: Result[];
  addResult: (result: Result) => void;

  blogs: Blog[];
  addBlog: (blog: Blog) => void;

  resources: Resource[];
  addResource: (resource: Resource) => void;

  loadCourses: () => Promise<void>;
  loadTestSeries: () => Promise<void>;
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

  // Load courses from API
  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await courseService.getCourses(1, 100);
      if (response.success && response.data) {
        setCourses(response.data.map(convertApiToCourse));
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
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
      } else {
        setTestSeries([]);
      }
    } catch (error) {
      console.error("Error loading test series:", error);
      setTestSeries([]);
    } finally {
      setLoadingTestSeries(false);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    loadCourses();
    loadTestSeries();

    bannerService.getBanners().then(res => {
      if (res.success && res.data) setHeroPosters(res.data.map(convertApiToHeroPoster));
      else setHeroPosters([]);
    }).catch(error => {
      console.error('Error loading banners:', error);
      setHeroPosters([]);
    });

    contentService.getResults(1, 100).then(res => {
      if (res.success && res.data) setResults(res.data.map(convertApiToResult));
      else setResults([]);
    }).catch(error => {
      console.error('Error loading results:', error);
      setResults([]);
    });

    contentService.getBlogs(1, 100).then(res => {
      if (res.success && res.data) setBlogs(res.data.map(convertApiToBlog));
      else setBlogs([]);
    }).catch(error => {
      console.error('Error loading blogs:', error);
      setBlogs([]);
    });

    contentService.getResources(1, 100).then(res => {
      if (res.success && res.data) setResources(res.data.map(convertApiToResource));
      else setResources([]);
    }).catch(error => {
      console.error('Error loading resources:', error);
      setResources([]);
    });

    if (localStorage.getItem("sc_role") === "admin") {
      studentService.getStudents(1, 100).then(res => {
        if (res.success && res.data) setStudents(res.data.map(convertApiToStudent));
        else setStudents([]);
      }).catch(error => {
        console.error('Error loading students:', error);
        setStudents([]);
      });

      enrollmentService.getEnrollments(1, 100).then(res => {
        if (res.success && res.data) setEnrollments(res.data.map(convertApiToEnrollment));
        else setEnrollments([]);
      }).catch(error => {
        console.error('Error loading enrollments:', error);
        setEnrollments([]);
      });

      contactService.getAllInquiries(1, 100).then(res => {
        if (res.success && res.data) setContactMessages(res.data.map(convertApiToContactMessage));
        else setContactMessages([]);
      }).catch(error => {
        console.error('Error loading contact messages:', error);
        setContactMessages([]);
      });
    }
  }, []);

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

  return (
    <AppContext.Provider value={{
      courses, addCourse, deleteCourse, loadingCourses,
      testSeries, addTestSeries, updateTestSeries, deleteTestSeries, loadingTestSeries,
      heroPosters, addHeroPoster, updateHeroPoster, removeHeroPoster,
      enrollments, addEnrollment, updateEnrollmentStatus, updateEnrollment,
      popup, updatePopup,
      students, addStudent, updateStudent, refreshStudentData,
      contactMessages, addContactMessage,
      results, addResult,
      blogs, addBlog,
      resources, addResource,
      loadCourses, loadTestSeries,
    }}>
      {children}
    </AppContext.Provider>
  );
};