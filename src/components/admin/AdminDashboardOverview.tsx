import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/AppContext";
import { BarChart2, BookOpen, ClipboardList, Users } from "lucide-react";

const AdminDashboardOverview = () => {
  const { courses, testSeries, students, enrollments, contactMessages, loadingCourses, loadingTestSeries } = useApp();

  const isLoading = loadingCourses || loadingTestSeries;

  // Calculate inquiry statistics
  const pendingInquiries = contactMessages.filter(msg => !msg.status || msg.status === 'PENDING' || msg.status === 'FOLLOW_UP').length;
  const resolvedInquiries = contactMessages.filter(msg => msg.status === 'RESOLVED').length;

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
                  <p className="text-lg font-semibold">{pendingInquiries}</p>
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
              User inquiries from the inquiry form.
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
                  No inquiries yet. Messages will appear here when users submit the inquiry form.
                </p>
              ) : (
                contactMessages.slice(0, 5).map((msg) => (
                  <div
                    key={msg.id}
                    className="border rounded-lg p-4 mb-3"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{msg.name}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                        {msg.email}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.phone}</p>
                    <p className="text-sm mt-1">{msg.message}</p>
                    {msg.status && (
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${msg.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : msg.status === 'FOLLOW_UP' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          {msg.status}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{new Date(msg.date).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Inquiries Card */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <p className="font-semibold text-sm">Pending Inquiries</p>
            <p className="text-xs text-muted-foreground">
              Unresolved inquiries requiring admin attention.
            </p>
            <div className="space-y-2">
              {isLoading ? (
                // Shimmer for pending inquiries
                <>
                  {[1, 2].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48 mt-2" />
                      <Skeleton className="h-3 w-24 mt-2" />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-primary">{pendingInquiries}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total Pending Inquiries
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="text-center p-3 bg-secondary rounded-lg">
                      <p className="text-lg font-semibold">{pendingInquiries}</p>
                      <p className="text-xs text-muted-foreground">
                        Pending
                      </p>
                    </div>
                    <div className="text-center p-3 bg-secondary rounded-lg">
                      <p className="text-lg font-semibold">{resolvedInquiries}</p>
                      <p className="text-xs text-muted-foreground">
                        Resolved
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;