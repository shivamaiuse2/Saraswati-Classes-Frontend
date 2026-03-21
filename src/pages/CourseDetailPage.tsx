import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  IndianRupee,
  Lock,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, loadingCourses } = useApp();
  const { currentStudent } = useAuth();

  const course = courses.find((c) => c.id === id);
  const [enrollOpen, setEnrollOpen] = useState(false);

  if (loadingCourses) {
    return (
      <Layout>
        <div className="py-20 text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground italic">Loading course details...</p>
        </div>
      </Layout>
    );
  }

  if (!course)
    return (
      <Layout>
        <div className="py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <Link to="/courses">
            <Button className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </Layout>
    );

  const isApproved =
    !!(
      currentStudent &&
      course &&
      currentStudent.approvedCourses.includes(course.id)
    );

  return (
    <Layout>
      <div className="py-12 md:py-16 space-y-8">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" /> Back to Courses
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.mode}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">
                {course.fullDescription}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Timing & Schedule</p>
                    <p className="text-muted-foreground">
                      {course.timing} • {course.days}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Subjects Covered</p>
                    <p className="text-muted-foreground">
                      {course.subjects && course.subjects.length > 0
                        ? course.subjects.join(", ")
                        : "As per batch plan"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Course Duration</p>
                    <p className="text-muted-foreground">
                      {course.duration || "Full Academic Year"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Price per Subject</p>
                    <p className="text-muted-foreground">
                      ₹{course.pricePerSubject.toLocaleString("en-IN")} per
                      subject
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Why Choose This
                Course
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Small, focused batches for personalised attention.</li>
                <li>
                  Regular tests and performance tracking aligned with the
                  syllabus.
                </li>
                <li>Concept-building teaching with exam-oriented practice.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Course Content
              </h2>

              <p className="text-sm text-muted-foreground mb-4">
                Detailed modules and private video lectures will be unlocked
                once the admin grants access. Below is the structure where
                module-wise videos will appear.
              </p>

              <div className="space-y-2">
                {course.chapters.map((ch, i) => (
                  <Card key={i} className="bg-muted/60 border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-primary bg-background w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-sm flex items-center gap-2">
                            {ch.title}
                            <Lock className="h-3 w-3 text-primary" />
                          </p>
                          {ch.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {ch.description}
                            </p>
                          )}
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Video content will be available here as a private
                            YouTube link after admin approval.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-20 overflow-hidden rounded-xl shadow-sm">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-lg">{course.title}</h3>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Mode:</strong> {course.mode}
                  </p>
                  <p>
                    <strong>Category:</strong> {course.category}
                  </p>
                  <p>
                    <strong>Timing:</strong> {course.timing}
                  </p>
                </div>

                <p className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  <IndianRupee className="h-4 w-4" />
                  {course.pricePerSubject.toLocaleString("en-IN")} per subject
                </p>

                {!isApproved && (
                  <Button
                    className="w-full"
                    onClick={() => setEnrollOpen(true)}
                  >
                    Enroll Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EnrollmentModal
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        courseOrSeries={course.title}
      />
    </Layout>
  );
};

export default CourseDetailPage;