import { useState } from "react";
import StudentLayout, { type TabKey } from "@/components/student/StudentLayout";
import StudentDashboardOverview from "@/components/student/StudentDashboardOverview";
import StudentMyCourses from "@/components/student/StudentMyCourses";
import StudentMyTestSeries from "@/components/student/StudentMyTestSeries";
import StudentResults from "@/components/student/StudentResults";
import StudentProfile from "@/components/student/StudentProfile";
import StudentInquiry from "@/components/student/StudentInquiry";
import logo from "@/assets/logo.png";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  let content: JSX.Element;
  switch (activeTab) {
    case "courses":
      content = <StudentMyCourses />;
      break;
    case "tests":
      content = <StudentMyTestSeries />;
      break;
    case "results":
      content = <StudentResults />;
      break;
    case "profile":
      content = <StudentProfile />;
      break;
    case "inquiries":
      content = <StudentInquiry />;
      break;
    case "overview":
    default:
      content = <StudentDashboardOverview />;
  }

  return (
    <StudentLayout active={activeTab} onChangeTab={setActiveTab}>
      <div className="flex items-center gap-3 mb-6">
        <img
          src={logo}
          alt="Saraswati Classes"
          className="w-10 h-10 object-contain"
        />
        <h2 className="text-xl font-semibold">
          Student Dashboard
        </h2>
      </div>
      {content}
    </StudentLayout>
  );
};

export default StudentDashboard;

