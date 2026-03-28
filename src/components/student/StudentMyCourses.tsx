import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const StudentMyCourses = () => {
  const { courses, loadingCourses } = useApp();
  const { currentStudent, loading: authLoading } = useAuth();

  const isLoading = authLoading || loadingCourses;

  const approvedCourses = courses.filter((c) =>
    currentStudent?.approvedCourses?.includes(c.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold mb-1">
          My Courses
        </h1>
        <p className="text-sm text-muted-foreground">
          View your assigned courses and directly access their chapter videos and
          chapter tests.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-6 w-48 bg-muted rounded" />
                  </div>
                  <div className="h-4 w-16 bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-full bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : approvedCourses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground text-sm">
            No courses assigned yet. Once the admin approves your enrollment,
            your courses and modules will appear here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {approvedCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{course.board}</Badge>
                        <Badge variant="outline">Batch Program</Badge>
                      </div>
                      <h2 className="font-semibold text-base md:text-lg">
                        {course.board} - {course.standard}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        {course.timing_start} - {course.timing_end} • {course.days.join(", ")}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {course.chapters.length} modules
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {course.chapters.map((ch, idx) => {
                      const chapterNumber = ch.chapterNumber || idx + 1;
                      const youtubeLink = ch.videoUrl || "";
                      const testLink = ch.testLink || "";

                      return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-dashed bg-muted/60 px-3 py-2"
                      >
                        <span className="text-xs font-semibold text-primary mt-0.5">
                          {chapterNumber}.
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{ch.title}</p>
                          {ch.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {ch.description}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {youtubeLink && (
                              <a
                                href={youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-2"
                              >
                                Watch Video
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {testLink && (
                              <a
                                href={testLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-2"
                              >
                                Chapter Test
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      );
                    })}

                    {course.chapters.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Modules will be configured for this batch by the
                        admin. You’ll see topic-wise videos here once they are
                        added.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMyCourses;

