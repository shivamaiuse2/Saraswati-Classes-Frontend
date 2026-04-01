import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import Blog from "@/pages/Blog";
import BlogDetailPage from "@/pages/BlogDetailPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import TestSeriesPage from "./pages/TestSeriesPage";
import TestSeriesDetailPage from "./pages/TestSeriesDetailPage";
import RecordingsPage from "./pages/RecordingsPage";
import RecordingDetailPage from "./pages/RecordingDetailPage";

import ResultsPage from "./pages/ResultsPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/test-series" element={<TestSeriesPage />} />
              <Route path="/test-series/:id" element={<TestSeriesDetailPage />} />
              {/* New dedicated login routes */}
              <Route path="/student-login" element={<StudentLoginPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />

              {/* Dashboards */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Backward-compatible dashboard aliases */}
              <Route
                path="/admin/*"
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
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/recordings" element={<RecordingsPage />} />
              <Route path="/recordings/:id" element={<RecordingDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
