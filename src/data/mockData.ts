export interface Course {
  id: string;
  board: "CBSE" | "SSC" | "HSC";
  standard: string;
  timing_start: string;
  timing_end: string;
  days: string[];
  subjects: string[];
  fees: number;
  isActive: boolean;
  chapters: any[];
  chapterCount?: number;
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
  tests?: any[];
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
  phone?: string;
  address?: string;
  standard?: string;
  board?: string;
  status?: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
  profileImage?: string;
}

export interface HeroPoster {
  id: string;
  imageUrl: string;
  testSeriesId: string;
  enabled: boolean;
  createdAt: string;
}

// DEFAULT COURSES
export const defaultCourses: Course[] = [
  {
    id: "cbse-8",
    board: "CBSE",
    standard: "VIII",
    timing_start: "6:30 PM",
    timing_end: "7:30 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    subjects: ["Maths", "Science"],
    fees: 9000,
    isActive: true,
    chapters: [],
  },
  {
    id: "cbse-9",
    board: "CBSE",
    standard: "IX",
    timing_start: "5:15 PM",
    timing_end: "6:30 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    subjects: ["Maths", "Science"],
    fees: 9500,
    isActive: true,
    chapters: [],
  },
  {
    id: "cbse-10",
    board: "CBSE",
    standard: "X",
    timing_start: "4:00 PM",
    timing_end: "5:15 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    subjects: ["Maths", "Science"],
    fees: 10500,
    isActive: true,
    chapters: [],
  },
  {
    id: "ssc-8",
    board: "SSC",
    standard: "VIII",
    timing_start: "7:30 PM",
    timing_end: "8:30 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    subjects: ["Maths", "Science"],
    fees: 8000,
    isActive: true,
    chapters: [],
  },
  {
    id: "ssc-9",
    board: "SSC",
    standard: "IX",
    timing_start: "5:15 PM",
    timing_end: "6:30 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    subjects: ["Maths", "Science"],
    fees: 8500,
    isActive: true,
    chapters: [],
  },
  {
    id: "ssc-10",
    board: "SSC",
    standard: "X",
    timing_start: "4:00 PM",
    timing_end: "5:15 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    subjects: ["Maths", "Science"],
    fees: 9000,
    isActive: true,
    chapters: [],
  },
  {
    id: "state-11",
    board: "HSC",
    standard: "XI",
    timing_start: "6:15 PM",
    timing_end: "9:30 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    subjects: ["PCMB", "JEE", "MHT-CET"],
    fees: 18000,
    isActive: true,
    chapters: [],
  },
  {
    id: "state-12",
    board: "HSC",
    standard: "XII",
    timing_start: "6:15 PM",
    timing_end: "9:30 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    subjects: ["PCMB", "JEE", "MHT-CET"],
    fees: 25000,
    isActive: true,
    chapters: [],
  },
];

// TEST SERIES
export const defaultTestSeriesList: TestSeries[] = [
  {
    id: "cet-pcm-test-series",
    title: "CET PCM Test Series",
    overview:
      "Rigorous full-syllabus CET PCM test series with detailed analysis to maximise your score.",
    features: [
      "30+ full syllabus and part syllabus mock tests",
      "Paper discussion and doubt-solving after every test",
      "Topic-wise analysis to identify strong and weak areas",
      "Time management tips and strategies for CET",
    ],
    testPattern: "150 questions | 90 minutes | No negative marking | PCM focused pattern",
    benefits: [
      "Build exam temperament through regular mock practice",
      "Understand question trends and frequently asked topics",
      "Improve speed and accuracy under time pressure",
      "Get personalised guidance based on your performance",
    ],
    image: "https://placehold.co/400x250/0ea5e9/ffffff?text=CET+PCM+Test+Series",
    ctaLabel: "Enroll Now",
    demoTestLink: "https://forms.gle/example-cet-test",
    heroPosterThumbnail:
      "https://placehold.co/600x450/0ea5e9/ffffff?text=CET+PCM+Test+Series",
    showInHeroPoster: true,
    testsCount: 30,
    mode: "Offline / OMR Based",
    price: "₹6,000",
  },
  {
    id: "9th-cbse-test-series",
    title: "9th CBSE Maths & Science Test Series",
    overview:
      "Chapter-wise and full-syllabus 9th CBSE test series for strong fundamentals in Maths and Science.",
    features: [
      "Chapter-wise tests for every unit in Maths & Science",
      "Mixed-topic tests to build application skills",
      "Detailed paper solutions and doubt-solving sessions",
      "Performance tracking across the entire academic year",
    ],
    testPattern: "Objective + subjective pattern aligned with latest CBSE guidelines",
    benefits: [
      "Develop exam writing skills early in the year",
      "Identify conceptual gaps before final exams",
      "Boost confidence with regular exam practice",
      "Stay exam-ready with revision-oriented tests",
    ],
    image:
      "https://placehold.co/400x250/0ea5e9/ffffff?text=9th+CBSE+Test+Series",
    ctaLabel: "Enroll Now",
    demoTestLink: "https://forms.gle/example-9th-cbse-test",
    heroPosterThumbnail:
      "https://placehold.co/600x450/0ea5e9/ffffff?text=9th+CBSE+Test+Series",
    showInHeroPoster: true,
    testsCount: 20,
    mode: "Offline / Written",
    price: "₹4,000",
  },
  {
    id: "10th-cbse-test-series",
    title: "10th CBSE Maths & Science Test Series",
    overview:
      "Board-focused test series for 10th CBSE students targeting top scores in Maths and Science.",
    features: [
      "Prelim-style full syllabus papers",
      "Chapter-wise and unit-wise practice tests",
      "Detailed marking scheme based evaluation",
      "Revision booster papers before board exams",
    ],
    testPattern: "Board-style question papers with section-wise weightage",
    benefits: [
      "Experience real board-exam like environment",
      "Refine presentation and answer writing skills",
      "Get accurate feedback on your preparation level",
      "Reduce exam anxiety with multiple mock attempts",
    ],
    image:
      "https://placehold.co/400x250/0ea5e9/ffffff?text=10th+CBSE+Test+Series",
    ctaLabel: "Enroll Now",
    demoTestLink: "https://forms.gle/example-10th-cbse-test",
    heroPosterThumbnail:
      "https://placehold.co/600x450/0ea5e9/ffffff?text=10th+CBSE+Test+Series",
    showInHeroPoster: false,
    testsCount: 25,
    mode: "Offline / Board Style",
    price: "₹5,500",
  },
];

// HERO POSTERS (derived from test series)
export const defaultHeroPosters: HeroPoster[] = defaultTestSeriesList
  .filter((ts) => ts.showInHeroPoster)
  .map((ts, index) => ({
    id: `default-hero-${ts.id}-${index}`,
    imageUrl: ts.heroPosterThumbnail || ts.image,
    testSeriesId: ts.id,
    enabled: true,
    createdAt: new Date().toISOString(),
  }));

// POPUP (kept for backward compatibility)
export const defaultPopupContent: PopupContent = {
  title: "Explore Our Test Series",
  description: "Boost your exam preparation with structured practice.",
  ctaText: "View Test Series",
  ctaLink: "/test-series",
  enabled: true,
};

// BACKWARD EXPORTS
export const courses = defaultCourses;
export const testSeriesList = defaultTestSeriesList;

// TESTIMONIALS
export const testimonials = [
  {
    name: "Priya Sharma",
    course: "10th CBSE + CET Preparation",
    text: "Saraswati Classes helped me build a strong foundation in Maths and Science. Regular tests and personal guidance boosted my confidence for boards.",
    avatar: "https://placehold.co/80x80/0ea5e9/ffffff?text=PS",
  },
  {
    name: "Rahul Verma",
    course: "JEE Preparation",
    text: "The JEE course is highly focused with conceptual teaching and lots of practice questions. Test analysis sessions were extremely useful.",
    avatar: "https://placehold.co/80x80/0ea5e9/ffffff?text=RV",
  },
  {
    name: "Sneha Patil",
    course: "NEET Preparation",
    text: "Detailed notes, doubt-solving and regular NEET pattern tests made my preparation structured and stress-free.",
    avatar: "https://placehold.co/80x80/0ea5e9/ffffff?text=SP",
  },
  {
    name: "Aditya Deshmukh",
    course: "9th & 10th Foundation",
    text: "I joined in 9th and continued till 10th. The friendly environment and clear explanations made even difficult topics easy to understand.",
    avatar: "https://placehold.co/80x80/0ea5e9/ffffff?text=AD",
  },
];
