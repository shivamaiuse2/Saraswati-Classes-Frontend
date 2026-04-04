import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  IndianRupee,
  Lock,
  ListChecks,
  ExternalLink,
  PlayCircle,
  ChevronRight,
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
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  if (loadingCourses) {
    return (
      <Layout>
        <div className="py-20 text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground italic">
            Loading course details...
          </p>
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

  const isApproved = !!(
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
                <Badge variant="outline">Course Program</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{displayTitle}</h1>
              <p className="text-muted-foreground italic">
                Join our premium {course.board} course for {course.standard}.
                Experience top-tier education with focused attention and regular
                performance tracking.
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
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Curriculum</p>
                    <p className="text-muted-foreground">
                      {(course.chapters && course.chapters.length) || 0} Modules / Chapters
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
                <li>Small, focused courses for personalised attention.</li>
                <li>
                  Regular tests and performance tracking aligned with the
                  syllabus.
                </li>
                <li>Concept-building teaching with exam-oriented practice.</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" /> Learning Curriculum
                </h2>
                <Badge variant="secondary" className="px-3 py-1">
                  {(course.chapters && course.chapters.length) || 0} Modules
                </Badge>
              </div>

              {selectedChapter && isApproved ? (
                <Card className="mb-8 border-primary/20 overflow-hidden shadow-md">
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedChapter.youtubeLink.split("v=")[1] || selectedChapter.youtubeLink.split("/").pop()}`}
                      title={selectedChapter.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-2xl font-bold">
                        {selectedChapter.title}
                      </h3>
                      {selectedChapter.formLink && (
                        <Button
                          asChild
                          variant="outline"
                          className="gap-2 border-blue-200 hover:bg-blue-50 text-blue-700"
                        >
                          <a
                            href={selectedChapter.formLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Take Test / Assignment
                          </a>
                        </Button>
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedChapter.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedChapter(null)}
                      className="text-primary hover:text-primary hover:bg-primary/5"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Curriculum
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {!isApproved && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-4 flex items-start gap-3">
                      <Lock className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Private Curriculum Content</p>
                        <p>
                          Complete your enrollment to unlock video lectures and
                          assignments.
                        </p>
                      </div>
                    </div>
                  )}

                  {course.chapters.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-2xl text-slate-400">
                      Curriculum is being updated. Check back soon.
                    </div>
                  ) : (
                    course.chapters.map((ch, i) => (
                      <Card
                        key={ch.id}
                        className={`group transition-all duration-200 border-slate-200 ${isApproved ? "cursor-pointer hover:border-primary hover:shadow-md" : "opacity-75"}`}
                        onClick={() => isApproved && setSelectedChapter(ch)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                {ch.title}
                                {!isApproved ? (
                                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                                ) : (
                                  <PlayCircle className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {ch.description}
                              </p>
                            </div>
                            {isApproved && (
                              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <Card className="sticky top-20 overflow-hidden rounded-xl shadow-sm border-primary/20">
              <div className="w-full h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {course.board}
                  </div>
                  <div className="text-lg font-medium text-muted-foreground">
                    {course.standard}
                  </div>
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
                  <p>
                    <strong>Modules:</strong> {(course.chapters && course.chapters.length) || 0} Chapters
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
