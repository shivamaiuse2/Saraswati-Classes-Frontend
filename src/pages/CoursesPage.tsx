import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const categories = ["All", "Foundation", "Science", "Competitive"] as const;

const CoursesPage = () => {
  const { courses, loadingCourses } = useApp();
  const { testSeries, loadingTestSeries } = useApp();
  const { currentStudent } = useAuth();

  const [filter, setFilter] = useState<string>("All");
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState("");

  const filtered =
    filter === "All" 
      ? courses 
      : courses.filter((c) => c.category.toUpperCase() === filter.toUpperCase());

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
              Our Courses
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Carefully designed batches for CBSE, SSC and Science with clear
              timings, days and transparent per-subject fees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={filter === c ? "default" : "outline"}
                onClick={() => setFilter(c)}
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 justify-items-center w-full">
            {loadingCourses ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-full max-w-[320px] h-[320px] bg-slate-100 animate-pulse rounded-3xl" />
              ))
            ) : filtered.length > 0 ? (
              filtered.map((course, i) => {
                const cardColors = [
                  "bg-blue-100",
                  "bg-yellow-100",
                  "bg-purple-100",
                  "bg-orange-100",
                ];
                const colorClass = cardColors[i % cardColors.length] || "bg-blue-100";

                return (
                  <motion.div
                    key={course.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="w-full max-w-[320px]"
                  >
                    <div className={`rounded-3xl p-7 min-h-[320px] flex flex-col justify-between transition hover:shadow-xl hover:-translate-y-1.5 ${colorClass}`}>
                      <p className="text-gray-500 font-semibold text-sm mb-5">{String(i + 1).padStart(2, "0")}</p>
                      <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                      <p className="text-xs text-gray-600 mb-4">{course.timing} • {course.days}</p>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• {course.description}</li>
                        <li>• {course.category}</li>
                        <li>• {course.mode}</li>
                      </ul>
                      <Link to={`/courses/${course.id}`} className="mt-6">
                        <button className="w-full flex items-center justify-center gap-2 bg-blue-800 text-white py-3 rounded-full text-sm font-medium hover:bg-blue-900 transition">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground w-full">
                  No courses found in this category.
                </div>
            )}
          </div>
        </div>
      </section>

      <EnrollmentModal
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        courseOrSeries={enrollTarget}
      />
    </Layout>
  );
};

export default CoursesPage;