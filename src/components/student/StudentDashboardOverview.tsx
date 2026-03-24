import { BookOpen, ClipboardList, Clock, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const StudentDashboardOverview = () => {
  const { courses, testSeries, loadingCourses, loadingTestSeries } = useApp();
  const { currentStudent, loading: authLoading } = useAuth();

  const isLoading = authLoading || loadingCourses || loadingTestSeries;

  const approvedCourses = courses.filter((c) =>
    currentStudent?.approvedCourses.includes(c.id)
  );
  const approvedTs = testSeries.filter((t) =>
    currentStudent?.approvedTestSeries.includes(t.id)
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Quick snapshot of your courses, tests and upcoming work.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Shimmer for stats cards
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="rounded-xl shadow-sm">
                <CardContent className="p-6 flex items-center gap-2">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Courses</p>
                  <p className="text-lg font-semibold">
                    {approvedCourses.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ClipboardList className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Test Series</p>
                  <p className="text-lg font-semibold">
                    {approvedTs.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Upcoming Tests
                  </p>
                  <p className="text-lg font-semibold">0</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Best Score (Placeholder)
                  </p>
                  <p className="text-lg font-semibold">—</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Courses Card */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <p className="font-semibold mb-2 text-sm">Recent Courses</p>
            <p className="text-xs text-muted-foreground mb-4">
              Quick access to courses you've been assigned.
            </p>
            <div className="space-y-2">
              {isLoading ? (
                // Shimmer for courses
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-md border px-3 py-2 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </>
              ) : approvedCourses.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-muted-foreground">
                      {c.timing} • {c.days}
                    </p>
                  </div>
                </div>
              ))}
              {!isLoading && approvedCourses.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No courses assigned yet. Approved courses will appear here.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Test Series Card */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <p className="font-semibold mb-2 text-sm">Recent Test Series</p>
            <p className="text-xs text-muted-foreground mb-4">
              Once you are enrolled to test series, they will be listed here.
            </p>
            <div className="space-y-2">
              {isLoading ? (
                // Shimmer for test series
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-md border px-3 py-2 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </>
              ) : approvedTs.slice(0, 3).map((ts) => (
                <div
                  key={ts.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium">{ts.title}</p>
                    <p className="text-muted-foreground">
                      {ts.testsCount} tests • {ts.mode}
                    </p>
                  </div>
                </div>
              ))}
              {!isLoading && approvedTs.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No test series assigned yet. Approved series will appear here.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardOverview;
