import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import courseService from "@/services/courseService";
import testSeriesService from "@/services/testSeriesService";
import studentService from "@/services/studentService";
import bannerService from "@/services/bannerService";
import contentService from "@/services/contentService";
import enrollmentService from "@/services/enrollmentService";
import contactService from "@/services/contactService";
import galleryService, { GalleryItem } from "@/services/galleryService";
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

// Define types for contact message, result, and blog
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

// Conversion functions to map API responses to frontend types
const convertApiToCourse = (apiCourse: any): Course => ({
  id: apiCourse.id,
  board: apiCourse.board as "CBSE" | "SSC" | "HSC",
  standard: apiCourse.standard,
  timing_start: apiCourse.timing_start,
  timing_end: apiCourse.timing_end,
  days: apiCourse.days || [],
  subjects: apiCourse.subjects || [],
  fees: apiCourse.fees,
  isActive: apiCourse.isActive,
  chapters: apiCourse.chapters || [],
  chapterCount: apiCourse.chapterCount || 0,
});

const convertApiToTestSeries = (apiTestSeries: any): TestSeries => ({
  id: apiTestSeries.id,
  title: apiTestSeries.title,
  overview: apiTestSeries.overview,
  features: apiTestSeries.features || [],
  testPattern: apiTestSeries.testPattern,
  benefits: apiTestSeries.benefits || [],
  image: apiTestSeries.image,
  ctaLabel: apiTestSeries.ctaLabel || "Enroll Now",
  demoTestLink: apiTestSeries.demoTestLink || "",
  heroPosterThumbnail: apiTestSeries.heroPosterThumbnail || "",
  showInHeroPoster: apiTestSeries.showInHeroPoster || false,
  testsCount: apiTestSeries.testsCount || 0,
  mode: apiTestSeries.mode || "Online",
  price: apiTestSeries.price || "0",
  tests: apiTestSeries.tests || [],
});

const convertApiToHeroPoster = (apiBanner: any): HeroPoster => ({
  id: apiBanner.id,
  imageUrl: apiBanner.imageUrl,
  testSeriesId: apiBanner.testSeriesId || "",
  enabled: apiBanner.enabled !== undefined ? apiBanner.enabled : true,
  createdAt: apiBanner.createdAt || new Date().toISOString(),
});

const convertApiToStudent = (apiStudent: any): StudentUser => {
  const profile = apiStudent.studentProfile || {};

  // Extract enrollment IDs
  const enrolledCourses = (profile.courseEnrollments || []).map(
    (e: any) => e.courseId,
  );
  const enrolledTestSeries = (profile.testSeriesEnrollments || []).map(
    (e: any) => e.testSeriesId,
  );

  // Extract approved/active enrollments
  const approvedCourses = (profile.courseEnrollments || [])
    .filter((e: any) => e.status === "ACTIVE")
    .map((e: any) => e.courseId);
  const approvedTestSeries = (profile.testSeriesEnrollments || [])
    .filter((e: any) => e.status === "ACTIVE")
    .map((e: any) => e.testSeriesId);

  return {
    id: apiStudent.id,
    email: apiStudent.email,
    password: "", // Never expose password
    name: profile.name || apiStudent.name || "",
    fullName: profile.name || apiStudent.name || "",
    address: profile.address || apiStudent.address || "",
    mobile: profile.phone || apiStudent.phone || "",
    phone: profile.phone || apiStudent.phone || "",
    standard: profile.standard || apiStudent.standard || "",
    board: profile.board || apiStudent.board || "SSC",
    username: apiStudent.username || profile.username || apiStudent.email || "",
    status:
      (profile.status || apiStudent.status || "ACTIVE").toLowerCase() ===
      "blocked"
        ? "blocked"
        : "active",
    approvedCourses,
    approvedTestSeries,
    enrolledCourses,
    enrolledTestSeries,
    dateOfBirth: profile.dateOfBirth || null,
    guardianName: profile.guardianName || "",
    guardianPhone: profile.guardianPhone || "",
    profileImage: profile.profileImage || null,
    createdAt: apiStudent.createdAt || new Date().toISOString(),
  } as any; // Cast because types might slightly mismatch StudentUser
};

const convertApiToEnrollment = (apiEnrollment: any): EnrollmentRequest => ({
  id: apiEnrollment.id,
  name: apiEnrollment.name,
  email: apiEnrollment.email,
  phone: apiEnrollment.phone,
  message: apiEnrollment.message || "",
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
  addTestSeries: (
    ts: Omit<TestSeries, "id"> & { id?: string },
  ) => Promise<TestSeries>;
  updateTestSeries: (id: string, updates: Partial<TestSeries>) => Promise<void>;
  deleteTestSeries: (id: string) => Promise<void>;
  loadingTestSeries: boolean;

  heroPosters: HeroPoster[];
  loadingHeroPosters: boolean;
  addHeroPoster: (p: Omit<HeroPoster, "id" | "createdAt">) => void;
  updateHeroPoster: (id: string, updates: Partial<HeroPoster>) => void;
  removeHeroPoster: (id: string) => void;

  enrollments: EnrollmentRequest[];
  addEnrollment: (
    req: Omit<EnrollmentRequest, "id" | "status" | "createdAt">,
  ) => void;
  updateEnrollmentStatus: (id: string, status: "Approved" | "Rejected") => void;
  updateEnrollment: (id: string, updates: Partial<EnrollmentRequest>) => void;

  popup: PopupContent;
  updatePopup: (p: PopupContent) => void;

  students: StudentUser[];
  addStudent: (s: Omit<StudentUser, "id" | "createdAt">) => StudentUser;
  updateStudent: (id: string, updates: Partial<StudentUser>) => void;
  refreshStudentData: () => void;

  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, "id" | "date">) => void;
  updateContactMessage: (id: string, updates: Partial<ContactMessage>) => void; // New function
  removeContactMessage: (id: string) => void; // New function

  results: Result[];
  addResult: (result: Omit<Result, "id">) => void;
  loadingResults: boolean;

  blogs: Blog[];
  addBlog: (blog: Omit<Blog, "id" | "date">) => void;
  loadingBlogs: boolean;

  loadCourses: () => Promise<void>;
  loadTestSeries: () => Promise<void>;
  testimonials: any[];
  loadingTestimonials: boolean;

  galleryItems: GalleryItem[];
  loadingGallery: boolean;

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
  const [popup, setPopup] = useState<PopupContent>({
    title: "",
    description: "",
    ctaText: "",
    ctaLink: "",
    enabled: false,
  });
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingHeroPosters, setLoadingHeroPosters] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Helper to check if error is a network error
  const isNetworkError = (error: any): boolean => {
    return (
      error?.isNetworkError ||
      error?.code === "ERR_NETWORK" ||
      error?.message?.includes("Network Error") ||
      error?.message?.includes("Unable to connect")
    );
  };

  // Load courses from API
  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await courseService.getCourses(1, 100);
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          setCourses(response.data.map(convertApiToCourse));
        } else {
          const allCourses: Course[] = [];
          for (const key in response.data) {
            allCourses.push(...response.data[key].map(convertApiToCourse));
          }
          setCourses(allCourses);
        }
        setNetworkError(null);
      } else {
        setCourses([]);
      }
    } catch (error: any) {
      console.error("Error loading courses:", error);
      if (isNetworkError(error)) {
        setNetworkError(
          "Unable to connect to the server. Please check your internet connection.",
        );
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
        // Data is already converted by the service
        setTestSeries(response.data);
        setNetworkError(null);
      } else {
        setTestSeries([]);
      }
    } catch (error: any) {
      console.error("Error loading test series:", error);
      if (isNetworkError(error)) {
        setNetworkError(
          "Unable to connect to the server. Please check your internet connection.",
        );
      }
      setTestSeries([]);
    } finally {
      setLoadingTestSeries(false);
    }
  };

  const { role, loading: authLoading } = useAuth();

  // Initialize public data immediately on mount
  useEffect(() => {
    const loadPublicData = async () => {
      // 1. Courses
      courseService.getCourses(1, 100).then(res => {
        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
            setCourses(res.data);
          } else {
            const allCourses: Course[] = [];
            for (const board in res.data) {
              allCourses.push(...res.data[board]);
            }
            setCourses(allCourses);
          }
        }
      }).catch(err => console.error("Error loading courses:", err))
      .finally(() => setLoadingCourses(false));

      // 2. Test Series
      testSeriesService.getTestSeries(1, 100).then(res => {
        if (res.success && res.data) {
          setTestSeries(res.data);
        }
      }).catch(err => console.error("Error loading test series:", err))
      .finally(() => setLoadingTestSeries(false));

      // 3. Hero Posters
      bannerService.getBanners().then(res => {
        if (res.success && res.data) {
          const bannerData = Array.isArray(res.data) ? res.data : (res.data.data || []);
          if (Array.isArray(bannerData)) {
            setHeroPosters(bannerData.map(convertApiToHeroPoster));
          }
        }
      }).catch(err => console.error("Error loading banners:", err))
      .finally(() => setLoadingHeroPosters(false));

      // 4. Results
      contentService.getResults(1, 100).then(res => {
        if (res.success && res.data) {
          setResults(res.data);
        }
      }).catch(err => console.error("Error loading results:", err))
      .finally(() => setLoadingResults(false));

      // 5. Blogs
      contentService.getBlogs(1, 100).then(res => {
        if (res.success && res.data) {
          setBlogs(res.data);
        }
      }).catch(err => console.error("Error loading blogs:", err))
      .finally(() => setLoadingBlogs(false));

      // 6. Testimonials
      contentService.getGalleryItems(1, 10, "Testimonials").then(res => {
        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
            const mapped = res.data.map((item: any) => ({
              id: item.id,
              name: item.title,
              text: item.image,
              avatar: item.image,
            }));
            setTestimonials(mapped);
          }
        }
      }).catch(err => console.error("Error loading testimonials:", err))
      .finally(() => setLoadingTestimonials(false));

      // 7. Gallery
      galleryService.getAllGalleryItems().then(res => {
        if (res.success && res.data) {
          setGalleryItems(res.data);
        }
      }).catch(err => console.error("Error loading gallery:", err))
      .finally(() => setLoadingGallery(false));
    };

    loadPublicData();
  }, []); // Run ONLY once on mount

  // Admin and Auth-dependent data
  useEffect(() => {
    if (authLoading || !role) return;

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

    loadAdminData();
  }, [role, authLoading]);

  const addContactMessage = (msg: Omit<ContactMessage, "id" | "date">) =>
    setContactMessages((prev) => [
      {
        ...msg,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  const addResult = (result: Omit<Result, "id">) =>
    setResults((prev) => [
      { ...result, id: Date.now().toString() } as Result,
      ...prev,
    ]);
  const addBlog = (blog: Omit<Blog, "id" | "date">) =>
    setBlogs((prev) => [
      {
        ...blog,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      } as Blog,
      ...prev,
    ]);

  const updateContactMessage = (
    id: string,
    updates: Partial<ContactMessage>,
  ) => {
    setContactMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
    );
  };

  const removeContactMessage = (id: string) => {
    setContactMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const addCourse = async (c: Omit<Course, "id">) => {
    try {
      const apiCourseData = {
        board: c.board,
        standard: c.standard,
        timing_start: c.timing_start,
        timing_end: c.timing_end,
        days: c.days,
        subjects: c.subjects,
        fees: c.fees,
        isActive: c.isActive !== undefined ? c.isActive : true,
      };
      const response = await courseService.createCourse(apiCourseData);
      if (response.success)
        setCourses((prev) => [...prev, convertApiToCourse(response.data)]);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await courseService.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const addTestSeries = async (
    ts: Omit<TestSeries, "id"> & { id?: string },
  ) => {
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
      const response =
        await testSeriesService.createTestSeries(apiTestSeriesData);
      if (response.success) {
        setTestSeries((prev) => [
          ...prev,
          convertApiToTestSeries(response.data),
        ]);
        return convertApiToTestSeries(response.data);
      }
    } catch (error) {
      console.error("Error adding test series:", error);
    }
    return ts as any;
  };

  const updateTestSeries = async (id: string, updates: Partial<TestSeries>) => {
    try {
      const ts = testSeries.find((t) => t.id === id);
      if (!ts) return;
      const apiTestSeriesData = { ...ts, ...updates } as any;
      const response = await testSeriesService.updateTestSeries(
        id,
        apiTestSeriesData,
      );
      if (response.success)
        setTestSeries((prev) =>
          prev.map((t) =>
            t.id === id ? convertApiToTestSeries(response.data) : t,
          ),
        );
    } catch (error) {
      console.error("Error updating test series:", error);
    }
  };

  const deleteTestSeries = async (id: string) => {
    try {
      await testSeriesService.deleteTestSeries(id);
      setTestSeries((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting test series:", error);
    }
  };

  const addHeroPoster = (p: Omit<HeroPoster, "id" | "createdAt">) => {
    setHeroPosters((prev) => [
      ...prev,
      {
        ...p,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      } as any,
    ]);
  };

  const updateHeroPoster = (id: string, updates: Partial<HeroPoster>) => {
    setHeroPosters((prev) =>
      prev.map((h) => (h.id === id ? ({ ...h, ...updates } as any) : h)),
    );
  };

  const removeHeroPoster = (id: string) => {
    setHeroPosters((prev) => prev.filter((h) => h.id !== id));
  };

  const addEnrollment = (
    req: Omit<EnrollmentRequest, "id" | "status" | "createdAt">,
  ) => {
    setEnrollments((prev) => [
      ...prev,
      {
        ...req,
        id: Date.now().toString(),
        status: "Pending",
        createdAt: new Date().toISOString(),
      } as any,
    ]);
  };

  const updateEnrollmentStatus = (
    id: string,
    status: "Approved" | "Rejected",
  ) => {
    setEnrollments((prev) =>
      prev.map((e) => (e.id === id ? ({ ...e, status } as any) : e)),
    );
  };

  const updateEnrollment = (
    id: string,
    updates: Partial<EnrollmentRequest>,
  ) => {
    setEnrollments((prev) =>
      prev.map((e) => (e.id === id ? ({ ...e, ...updates } as any) : e)),
    );
  };

  const updatePopup = (p: PopupContent) => setPopup(p);

  const addStudent = (s: Omit<StudentUser, "id" | "createdAt">) => {
    const newStudent = {
      ...s,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => [...prev, newStudent as any]);
    return newStudent as any;
  };

  const updateStudent = (id: string, updates: Partial<StudentUser>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? ({ ...s, ...updates } as any) : s)),
    );
  };

  const refreshStudentData = () => {
    studentService
      .getStudents(1, 100)
      .then((res) => {
        if (res.success && res.data)
          setStudents(res.data.map(convertApiToStudent));
        else setStudents([]);
      })
      .catch((error) => {
        console.error("Error refreshing students:", error);
        setStudents([]);
      });
  };

  const clearNetworkError = () => setNetworkError(null);

  return (
    <AppContext.Provider
      value={{
        courses,
        addCourse,
        deleteCourse,
        loadingCourses,
        testSeries,
        addTestSeries,
        updateTestSeries,
        deleteTestSeries,
        loadingTestSeries,
        heroPosters,
        addHeroPoster,
        updateHeroPoster,
        removeHeroPoster,
        loadingHeroPosters,
        enrollments,
        addEnrollment,
        updateEnrollmentStatus,
        updateEnrollment,
        popup,
        updatePopup,
        students,
        addStudent,
        updateStudent,
        refreshStudentData,
        contactMessages,
        addContactMessage,
        updateContactMessage,
        removeContactMessage, // Add the new function
        results,
        addResult,
        loadingResults,
        blogs,
        addBlog,
        loadingBlogs,
        testimonials,
        loadingTestimonials,
        galleryItems,
        loadingGallery,
        loadCourses,
        loadTestSeries,
        networkError,
        clearNetworkError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
