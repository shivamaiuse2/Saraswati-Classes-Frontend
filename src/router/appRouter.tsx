import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import CoursesPage from "@/pages/CoursesPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import TestSeriesPage from "@/pages/TestSeriesPage";
import TestSeriesDetailPage from "@/pages/TestSeriesDetailPage";
import StudentLoginPage from "@/pages/StudentLoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import GalleryPage from "@/pages/GalleryPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ResultsPage from "@/pages/ResultsPage";
import Blog from "@/pages/Blog";
import BlogDetailPage from "@/pages/BlogDetailPage";
import RecordingsPage from "@/pages/RecordingsPage";
import RecordingDetailPage from "@/pages/RecordingDetailPage";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/courses" element={<CoursesPage />} />
    <Route path="/courses/:id" element={<CourseDetailPage />} />
    <Route path="/test-series" element={<TestSeriesPage />} />
    <Route path="/test-series/:id" element={<TestSeriesDetailPage />} />
    {/* New dedicated login routes */}
    <Route path="/student-login" element={<StudentLoginPage />} />
    <Route path="/admin-login" element={<AdminLoginPage />} />

    <Route
      path="/admin-dashboard"
      element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      }
    />

    {/* Backward-compatible aliases */}
    <Route
      path="/admin/*"
      element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/*"
      element={
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      }
    />

    <Route path="/about" element={<AboutPage />} />
    <Route path="/gallery" element={<GalleryPage />} />
    <Route path="/resources" element={<ResourcesPage />} />
    <Route path="/results" element={<ResultsPage />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:id" element={<BlogDetailPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/recordings" element={<RecordingsPage />} />
    <Route path="/recordings/:id" element={<RecordingDetailPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;