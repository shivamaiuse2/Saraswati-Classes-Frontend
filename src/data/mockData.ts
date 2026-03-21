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
    id: "8th-cbse",
    title: "8th CBSE",
    category: "Foundation",
    description:
      "Build strong fundamentals in Maths and Science aligned with CBSE syllabus.",
    fullDescription:
      "Our 8th CBSE foundation batch focuses on conceptual clarity and regular practice in Maths and Science. Carefully designed classwork and homework help students develop problem-solving skills early and build confidence for higher classes.",
    mode: "Offline",
    image: "https://placehold.co/400x250/0ea5e9/ffffff?text=8th+CBSE",
    demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timing: "6:30 – 7:30 PM",
    days: "Monday – Friday",
    pricePerSubject: 9000,
    subjects: ["Maths", "Science"],
    duration: "Full Academic Year",
    chapters: [
      {
        title: "Number Systems Basics",
        description: "Understanding integers, fractions and decimals with real-life examples.",
        videoUrl: "https://www.youtube.com/watch?v=ysz5d6-0K8A",
      },
      {
        title: "Algebraic Expressions",
        description: "Introduction to variables, expressions and simple equations.",
        videoUrl: "https://www.youtube.com/watch?v=5MgBikgcWnY",
      },
      {
        title: "Introduction to Force and Pressure",
        description: "Key Science concepts with simple experiments.",
        videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      },
    ],
  },
  {
    id: "9th-cbse",
    title: "9th CBSE",
    category: "Foundation",
    description:
      "Strengthen concepts and problem-solving skills for 9th CBSE board.",
    fullDescription:
      "The 9th CBSE course prepares students with strong fundamentals in Algebra, Geometry, Physics and Chemistry. Regular class tests, worksheets and revision sessions ensure that concepts are retained throughout the year.",
    mode: "Offline",
    image: "https://placehold.co/400x250/0ea5e9/ffffff?text=9th+CBSE",
    demoVideoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    timing: "4:15 – 5:30 PM",
    days: "Monday – Saturday",
    pricePerSubject: 9500,
    subjects: ["Maths", "Science"],
    duration: "Full Academic Year",
    chapters: [
      {
        title: "Linear Equations in Two Variables",
        description: "Graphical and algebraic methods to solve linear equations.",
        videoUrl: "https://www.youtube.com/watch?v=V-_O7nl0Ii0",
      },
      {
        title: "Sound and Its Properties",
        description: "Wave nature of sound and its applications.",
        videoUrl: "https://www.youtube.com/watch?v=uelHwf8o7_U",
      },
      {
        title: "Atoms and Molecules",
        description: "Laws of chemical combination and mole concept.",
        videoUrl: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
      },
    ],
  },
  {
    id: "10th-cbse",
    title: "10th CBSE",
    category: "Foundation",
    description:
      "Board-focused 10th CBSE preparation with regular prelim-style tests.",
    fullDescription:
      "Comprehensive coverage of the 10th CBSE Maths and Science syllabus with regular board pattern tests, detailed analysis and intensive revision modules. Special focus is given to presentation and answer-writing skills.",
    mode: "Offline",
    image: "https://placehold.co/400x250/0ea5e9/ffffff?text=10th+CBSE",
    demoVideoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    timing: "4:15 – 5:30 PM",
    days: "Monday – Saturday",
    pricePerSubject: 10500,
    subjects: ["Maths", "Science"],
    duration: "Full Academic Year",
    chapters: [
      {
        title: "Quadratic Equations",
        description: "Concept, factorization and quadratic formula based problems.",
        videoUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
      },
      {
        title: "Light: Reflection and Refraction",
        description: "Mirror and lens formulas with numericals.",
        videoUrl: "https://www.youtube.com/watch?v=fLexgOxsZu0",
      },
      {
        title: "Chemical Reactions and Equations",
        description: "Balancing equations and different types of reactions.",
        videoUrl: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
      },
    ],
  },
  {
    id: "9th-ssc",
    title: "9th SSC",
    category: "Foundation",
    description: "Concept-focused teaching for 9th SSC students.",
    fullDescription:
      "The 9th SSC course is designed as a strong foundation program for Maharashtra State Board students. Systematic teaching, practice sheets and doubt-solving sessions help students stay ahead throughout the year.",
    mode: "Offline",
    image: "https://placehold.co/400x250/0ea5e9/ffffff?text=9th+SSC",
    demoVideoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
    timing: "5:30 – 6:30 PM",
    days: "Monday – Friday",
    pricePerSubject: 8500,
    subjects: ["Maths", "Science"],
    duration: "Full Academic Year",
    chapters: [
      {
        title: "Statistics Basics",
        description: "Understanding mean, median and mode with examples.",
        videoUrl: "https://www.youtube.com/watch?v=ktvTqknDobU",
      },
      {
        title: "Sets and Venn Diagrams",
        description: "Introduction to sets with Venn diagram representation.",
        videoUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
      },
    ],
  },
  {
    id: "10th-ssc",
    title: "10th SSC",
    category: "Foundation",
    description: "Target high marks in SSC board exams.",
    fullDescription:
      "The 10th SSC program includes chapter-wise notes, question banks and multiple full-syllabus mock tests based on the latest board pattern. Students are trained for time management and high-scoring answer writing.",
    mode: "Offline",
    image: "https://placehold.co/400x250/0ea5e9/ffffff?text=10th+SSC",
    demoVideoUrl: "https://www.youtube.com/embed/OPf0YbXqDm0",
    timing: "5:30 – 6:30 PM",
    days: "Monday – Friday",
    pricePerSubject: 9000,
    subjects: ["Maths", "Science"],
    duration: "Full Academic Year",
    chapters: [
      {
        title: "Progressions",
        description: "Arithmetic and geometric progressions with applications.",
        videoUrl: "https://www.youtube.com/watch?v=34Na4j8AVgA",
      },
      {
        title: "Electricity",
        description: "Ohm’s law, series and parallel circuits and numericals.",
        videoUrl: "https://www.youtube.com/watch?v=pRpeEdMmmQ0",
      },
      {
        title: "Acids, Bases and Salts",
        description: "Everyday applications and important reactions.",
        videoUrl: "https://www.youtube.com/watch?v=lp-EO5I60KA",
      },
    ],
  },
  {
    id: "11th-science-pcmb",
    title: "11th Science State Board PCMB",
    category: "Science",
    description:
      "11th Science PCMB coaching aligned with Maharashtra State Board.",
    fullDescription:
      "The 11th Science State Board PCMB course focuses on building strong concepts in Physics, Chemistry, Maths and Biology with regular board pattern tests and practice questions. Ideal for students beginning their science journey and preparing for future entrance exams.",
    mode: "Offline",
    image: "https://placehold.co/400x250/0ea5e9/ffffff?text=11th+Science+PCMB",
    demoVideoUrl: "https://www.youtube.com/embed/e-ORhEE9VVg",
    timing: "6:00 – 9:00 PM",
    days: "As per batch schedule",
    pricePerSubject: 18000,
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    duration: "One Academic Year",
    chapters: [
      {
        title: "Kinematics",
        description: "Motion in a straight line and plane with graphs.",
        videoUrl: "https://www.youtube.com/watch?v=0KSOMA3QBU0",
      },
      {
        title: "Basic Trigonometry",
        description: "Trigonometric ratios and identities with problems.",
        videoUrl: "https://www.youtube.com/watch?v=SlPhMPnQ58k",
      },
      {
        title: "Cell Structure",
        description: "Introduction to cell as a unit of life.",
        videoUrl: "https://www.youtube.com/watch?v=CevxZvSJLk8",
      },
    ],
  },
  {
    id: "12th-science-pcmb-plus",
    title: "12th Science State Board PCMB + JEE + NEET + CET",
    category: "Science",
    description:
      "Integrated 12th Science coaching for Board + JEE + NEET + CET.",
    fullDescription:
      "This integrated 12th Science program covers the complete State Board PCMB syllabus along with targeted preparation for JEE, NEET and CET. The course includes advanced problem-solving sessions, regular test series and detailed analysis to maximise performance in both boards and competitive exams.",
    mode: "Offline",
    image: "https://placehold.co/400x250/0ea5e9/ffffff?text=12th+Science+PCMB",
    demoVideoUrl: "https://www.youtube.com/embed/09R8_2nJtjg",
    timing: "6:00 – 9:00 PM",
    days: "As per batch schedule",
    pricePerSubject: 25000,
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    duration: "One Academic Year",
    chapters: [
      {
        title: "Electrostatics",
        description: "Coulomb’s law, electric field and potential.",
        videoUrl: "https://www.youtube.com/watch?v=RubBzkZzpUA",
      },
      {
        title: "Organic Chemistry Basics",
        description: "Nomenclature and reaction mechanisms overview.",
        videoUrl: "https://www.youtube.com/watch?v=TT2p5g0H3-w",
      },
      {
        title: "Human Physiology",
        description: "Overview of important human body systems.",
        videoUrl: "https://www.youtube.com/watch?v=LsoLEjrDogU",
      },
    ],
  },
  {
    id: "cet-crash-course",
    title: "CET Crash Course",
    category: "Competitive",
    description:
      "Focused 45–50 days crash course for CET with intensive test practice.",
    fullDescription:
      "The CET Crash Course is a short, high-intensity program designed for students targeting MAH-CET. It focuses on speed, accuracy and smart shortcuts in Physics, Chemistry and Mathematics, supported by multiple full-length CET pattern tests.",
    mode: "Offline",
    image: "https://placehold.co/400x250/0ea5e9/ffffff?text=CET+Crash+Course",
    demoVideoUrl: "https://www.youtube.com/embed/kOkQ4T5WO9E",
    timing: "As per crash batch schedule",
    days: "45–50 days crash program",
    pricePerSubject: 8000,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    duration: "45–50 Days",
    chapters: [
      {
        title: "Speed Maths Techniques",
        description: "Shortcuts for arithmetic and algebra for CET.",
        videoUrl: "https://www.youtube.com/watch?v=RgKAFK5djSk",
      },
      {
        title: "Modern Physics Overview",
        description: "High-weightage CET topics in Modern Physics.",
        videoUrl: "https://www.youtube.com/watch?v=pXRviuL6vMY",
      },
    ],
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
    text: "The JEE batch is highly focused with conceptual teaching and lots of practice questions. Test analysis sessions were extremely useful.",
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
