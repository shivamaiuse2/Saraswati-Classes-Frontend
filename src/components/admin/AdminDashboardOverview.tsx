import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/AppContext";
import { BarChart2, BookOpen, ClipboardList, Users } from "lucide-react";

const AdminDashboardOverview = () => {
  const { courses, testSeries, students, enrollments, contactMessages, loadingCourses, loadingTestSeries } = useApp();

  const isLoading = loadingCourses || loadingTestSeries;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          High-level snapshot of courses, students, test series and inquiries.
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
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-10" />
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
                  <p className="text-xs text-muted-foreground">Courses</p>
                  <p className="text-lg font-semibold">{courses.length}</p>
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
                  <p className="text-lg font-semibold">{testSeries.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-lg font-semibold">{students.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BarChart2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending Inquiries</p>
                  <p className="text-lg font-semibold">
                    {enrollments.filter((e) => e.status === "Pending").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Inquiries Card */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <p className="font-semibold text-sm">Recent Inquiries</p>
            <p className="text-xs text-muted-foreground">
              User submissions from the contact form.
            </p>
            <div className="space-y-2">
              {isLoading ? (
                // Shimmer for inquiries
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4 mb-3 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                </>
              ) : contactMessages.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No inquiries yet. Messages will appear here when users submit the contact form.
                </p>
              ) : (
                contactMessages.slice(0, 5).map((msg) => (
                  <div
                    key={msg.id}
                    className="border rounded-lg p-4 mb-3"
                  >
                    <p className="font-medium">{msg.name}</p>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                    <p className="text-sm text-muted-foreground">{msg.phone}</p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-muted-foreground">{msg.date}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Placeholder Card */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <p className="font-semibold text-sm mb-2">Planned Analytics Area</p>
            <p className="text-xs text-muted-foreground mb-4">
              This space is reserved for future charts such as success ratios, enrolment trends and test performance once backend reporting is connected.
            </p>
            {isLoading ? (
              <Skeleton className="h-40 w-full rounded-xl" />
            ) : (
              <div className="h-40 rounded-xl border border-dashed bg-muted/40 flex items-center justify-center">
                <span className="text-[11px] text-muted-foreground px-4 text-center">
                  Analytics chart placeholder – integrate with real-time data from the institute&apos;s system.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
