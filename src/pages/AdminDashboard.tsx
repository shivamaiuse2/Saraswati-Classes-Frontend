import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { AdminTab } from "@/components/admin/AdminSidebar";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import AdminCourseManagement from "@/components/admin/AdminCourseManagement";
import AdminStudentManagement from "@/components/admin/AdminStudentManagement";
import AdminTestSeriesManagement from "@/components/admin/AdminTestSeriesManagement";
import AdminBannerManagement from "@/components/admin/AdminBannerManagement";
import AdminResultManagement from "@/components/admin/AdminResultManagement";
import AdminBlogManagement from "@/components/admin/AdminBlogManagement";
import AdminResourceManagement from "@/components/admin/AdminResourceManagement";
import AdminTestScoreManagement from "@/components/admin/AdminTestScoreManagement";
import AdminInquiryManagement from "@/components/admin/AdminInquiryManagement";

const AdminDashboard = () => {
  const [active, setActive] = useState<AdminTab>("dashboard");

  let content: JSX.Element;
  switch (active) {
    case "courses":
      content = <AdminCourseManagement />;
      break;
    case "students":
      content = <AdminStudentManagement />;
      break;
    case "tests":
      content = <AdminTestSeriesManagement />;
      break;
    case "banners":
      content = <AdminBannerManagement />;
      break;
    case "results":
      content = <AdminResultManagement />;
      break;
    case "blogs":
      content = <AdminBlogManagement />;
      break;
    case "resources":
      content = <AdminResourceManagement />;
      break;
    case "test-scores":
      content = <AdminTestScoreManagement />;
      break;
    case "inquiries":
      content = <AdminInquiryManagement />;
      break;
    case "dashboard":
    default:
      content = <AdminDashboardOverview />;
  }

  return (
    <AdminLayout active={active} onChangeTab={setActive}>
      {content}
    </AdminLayout>
  );
};

export default AdminDashboard;
