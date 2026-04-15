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
  PlayCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const TestSeriesDetailPage = () => {
  const { id } = useParams();
  const { testSeries, loadingTestSeries } = useApp();
  const { currentStudent } = useAuth();

  const ts = testSeries.find((t) => t.id === id);
  const [enrollOpen, setEnrollOpen] = useState(false);

  if (loadingTestSeries) {
    return (
      <Layout>
        <div className="py-20 text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground italic">Loading test series details...</p>
        </div>
      </Layout>
    );
  }

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

  const isApproved = true; // Always approved to remove login requirement for Test Series module

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" /> Test List / Curriculum
                </h2>
                <Badge variant="secondary" className="px-3 py-1">
                  {ts.tests?.length || ts.testsCount} Modules
                </Badge>
              </div>

              <div className="grid gap-3">
                {(!ts.tests || ts.tests.length === 0) ? (
                  <div className="text-center py-10 border-2 border-dashed rounded-2xl text-slate-400">
                    Test content is being updated. Check back soon.
                  </div>
                ) : (
                  ts.tests.map((test: any, i: number) => (
                    <Card 
                      key={test.id || i} 
                      className={`group transition-all duration-200 border-slate-200 ${isApproved ? 'hover:border-primary hover:shadow-md' : 'opacity-75'}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                            {String(test.testNumber || i + 1).padStart(2, '0')}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                              {test.title}
                              <PlayCircle className="h-3.5 w-3.5 text-primary" />
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">{test.description || "No description available"}</p>
                          </div>
                          {test.testLink && (
                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <a href={test.testLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 text-primary" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
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

                  <Button
                    className="w-full"
                    onClick={() => setEnrollOpen(true)}
                  >
                    Enroll Now
                  </Button>
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