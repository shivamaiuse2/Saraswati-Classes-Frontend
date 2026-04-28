import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import InquiryModal from "@/components/InquiryModal";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const TestSeriesPage = () => {
  const { testSeries, loadingTestSeries } = useApp();
  const { currentStudent } = useAuth();

  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState("");

  const openEnroll = (t: string) => {
    setEnrollTarget(t);
    setEnrollOpen(true);
  };

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Test Series
            </h1>
            <p className="text-muted-foreground">
              Practice with real exam-pattern tests and boost your confidence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 justify-items-center w-full">
            {loadingTestSeries ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-full max-w-[320px] h-[320px] bg-slate-100 animate-pulse rounded-2xl" />
              ))
            ) : testSeries.length > 0 ? (
              testSeries.map((ts, i) => (
                <motion.div
                  key={ts.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="w-full max-w-[320px]"
                >
                  <Card className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="overflow-hidden">
                      <img
                        src={ts.image}
                        alt={ts.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg mb-2">{ts.title}</h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        {ts.testsCount} Tests • {ts.mode}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                        {ts.overview}
                      </p>

                      <div className="flex gap-2 mt-auto">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => openEnroll(ts.title)}
                        >
                          Enquire Now
                        </Button>

                        <Link to={`/test-series/${ts.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground w-full">
                  No test series available at the moment.
                </div>
            )}
          </div>
        </div>
      </section>

      <InquiryModal
        open={enrollOpen}
        onOpenChange={setEnrollOpen}
        courseOrSeries={enrollTarget}
      />
    </Layout>
  );
};

export default TestSeriesPage;
