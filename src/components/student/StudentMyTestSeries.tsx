import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const StudentMyTestSeries = () => {
  const { testSeries } = useApp();  
  const { currentStudent } = useAuth();

  const approvedTs = testSeries.filter((t) =>
    currentStudent?.approvedTestSeries.includes(t.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold mb-1">
          My Test Series
        </h1>
        <p className="text-sm text-muted-foreground">
          View the test series you are enrolled in and access their individual
          Google Form based tests.
        </p>
      </div>

      {approvedTs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground text-sm">
            No test series assigned yet. Once the admin approves your test
            series enrollment, you will see the list here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {approvedTs.map((ts) => (
            <motion.div
              key={ts.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-base md:text-lg">
                        {ts.title}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ts.testsCount} tests • {ts.mode}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Test list and links are controlled by the institute and
                      will be unlocked as per schedule.
                    </p>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(ts as any).tests && (ts as any).tests.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No tests configured yet for this series. They will appear
                        here once added by the admin.
                      </p>
                    ) : (
                      ((ts as any).tests || []).map((test: any) => (
                        <div
                          key={test.id}
                          className="flex items-start gap-3 rounded-lg border border-dashed bg-muted/60 px-3 py-2"
                        >
                          <div>
                            <p className="text-xs font-medium">
                              Test {test.testNumber}
                            </p>
                            {test.description && (
                              <p className="text-[11px] text-muted-foreground">
                                {test.description}
                              </p>
                            )}
                            {test.testLink && (
                              <a
                                href={test.testLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary underline underline-offset-2"
                              >
                                Open Test Form
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
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

export default StudentMyTestSeries;

