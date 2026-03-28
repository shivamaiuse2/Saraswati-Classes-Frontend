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

  const displayTitle = `${course.board} - ${course.standard}`;
  const displayTiming = `${course.timing_start} - ${course.timing_end}`;

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
                <Badge variant="secondary">{course.board}</Badge>
                <Badge variant="outline">Batch Program</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{displayTitle}</h1>
              <p className="text-muted-foreground italic">
                Join our premium {course.board} batch for {course.standard}. 
                Experience top-tier education with focused attention and regular performance tracking.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Timing & Schedule</p>
                    <p className="text-muted-foreground">
                      {displayTiming} • {course.days.join(", ")}
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
                        : "Maths and Science"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Academic Program</p>
                    <p className="text-muted-foreground">
                      Full Academic Session
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Batch Fees</p>
                    <p className="text-muted-foreground">
                      ₹{course.fees.toLocaleString("en-IN")} (Yearly)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Why Choose This
                Batch
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
                <Lock className="h-5 w-5 text-primary" /> Learning Content
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
            <Card className="sticky top-20 overflow-hidden rounded-xl shadow-sm border-primary/20">
              <div className="w-full h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center p-8">
                <div className="text-center">
                   <div className="text-2xl font-bold text-primary mb-1">{course.board}</div>
                   <div className="text-lg font-medium text-muted-foreground">{course.standard}</div>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-lg">{displayTitle}</h3>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Board:</strong> {course.board}
                  </p>
                  <p>
                    <strong>Standard:</strong> {course.standard}
                  </p>
                  <p>
                    <strong>Timing:</strong> {displayTiming}
                  </p>
                </div>

                <p className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  <IndianRupee className="h-4 w-4" />
                  {course.fees.toLocaleString("en-IN")} Yearly
                </p>

                {!isApproved && (
                  <Button
                    className="w-full"
                    onClick={() => setEnrollOpen(true)}
                  >
                    Enquire Now
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
        courseOrSeries={displayTitle}
      />
    </Layout>
  );
};

export default CourseDetailPage;