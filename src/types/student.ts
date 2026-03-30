export type StudentStatus = "active" | "blocked";

export interface Student {
  id: string;
  fullName: string;
  address: string;
  mobile: string;
  email: string;
  standard: string;
  board: "SSC" | "CBSE" | "STATE";
  enrolledCourses: string[];
  enrolledTestSeries: string[];
  username: string;
  password: string;
  status: StudentStatus;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
  profileImage?: string;
}

