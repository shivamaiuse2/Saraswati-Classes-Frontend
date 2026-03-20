import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Star,
  Target,
  Lock,
  ListChecks,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const TestSeriesDetailPage = () => {
  const { id } = useParams();
  const { testSeries } = useApp();
  const { currentStudent } = useAuth();

  const ts = testSeries.find((t) => t.id === id);
  const [enrollOpen, setEnrollOpen] = useState(false);

  const isApproved =
    !!(currentStudent && ts && currentStudent.approvedTestSeries.includes(ts.id));

  if (!ts)
    return (
      <Layout>
        <div className="py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold">Test Series not found</h1>
          <Link to="/test-series">
            <Button className="mt-4">Back to Test Series</Button>
          </Link>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="py-12 md:py-16 space-y-8">
        <Link
          to="/test-series"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" /> Back to Test Series
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{ts.title}</h1>
              <p className="text-muted-foreground">{ts.overview}</p>
              <p className="text-xs text-muted-foreground">
                {ts.testsCount} tests • {ts.mode}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary shrink-0" /> Syllabus &
                Coverage
              </h2>
              <ul className="space-y-2">
                {ts.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" /> Test Pattern
              </h2>
              <p className="text-sm text-muted-foreground">{ts.testPattern}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" /> Benefits
              </h2>
              <ul className="space-y-2">
                {ts.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Test List
              </h2>
              {isApproved ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    You have access to this test series. Demo / live test links
                    will be integrated here via the backend.
                  </p>
                  {ts.demoTestLink ? (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={ts.demoTestLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Demo Test
                      </a>
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Demo test link will be shared soon.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {Array.from({ length: Math.min(ts.testsCount, 6) }).map(
                    (_, i) => (
                      <Card key={i} className="bg-muted/60 border-dashed">
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center">
                            <Lock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">
                              Test {i + 1} (Locked)
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Test content will be visible once access is
                              granted by admin.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

            <div>
            <Card className="sticky top-20 overflow-hidden rounded-xl shadow-sm">
              <img
                src={ts.image}
                alt={ts.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold">{ts.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {ts.testsCount} tests • {ts.mode}
                </p>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <IndianRupee className="h-4 w-4 shrink-0" />
                  {ts.price}
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
        courseOrSeries={ts.title}
      />
    </Layout>
  );
};

export default TestSeriesDetailPage;