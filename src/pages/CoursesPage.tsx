import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useApp } from "@/context/AppContext";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const columnReveal: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const cardReveal = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 } 
  },
};

const CoursesPage = () => {
  const { courses, loadingCourses } = useApp();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState("");

  const openEnroll = (target: string) => {
    setEnrollTarget(target);
    setEnrollOpen(true);
  };

  // Group courses by board
  const cbseCourses = courses.filter(c => c.board === "CBSE");
  const sscCourses = courses.filter(c => c.board === "SSC");
  const stateCourses = courses.filter(c => c.board === "STATE");

  const boards = [
    { 
      title: "CBSE", 
      data: cbseCourses, 
      color: "blue", 
      icon: <BookOpen className="h-6 w-6" />,
      tagline: "Class VIII - X" 
    },
    { 
      title: "SSC", 
      data: sscCourses, 
      color: "amber", 
      icon: <GraduationCap className="h-6 w-6" />,
      tagline: "Class VIII - X" 
    },
    { 
      title: "State Board", 
      data: stateCourses, 
      color: "purple", 
      icon: <GraduationCap className="h-6 w-6" />,
      tagline: "XI & XII Science" 
    },
  ];

  return (
    <Layout>
      <section className="min-h-screen pt-24 pb-12 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12 space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Our <span className="text-blue-600">Batches</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our structured coaching programs designed for academic excellence and competitive success.
            </p>
          </motion.div>

          {loadingCourses ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[600px] bg-white rounded-3xl animate-pulse shadow-sm border border-slate-100" />
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-3 gap-8 items-start"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {boards.map((board) => (
                <motion.div 
                  key={board.title} 
                  variants={columnReveal}
                  className="space-y-6"
                >
                  {/* Column Header */}
                  <div className={`p-6 rounded-3xl bg-white shadow-sm border-b-4 border-${board.color}-500 group`}>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 rounded-2xl bg-${board.color}-100 text-${board.color}-600 group-hover:scale-110 transition-transform`}>
                        {board.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{board.title}</h2>
                        <span className="text-sm font-medium text-slate-500">{board.tagline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Cards Container */}
                  <div className="space-y-6">
                    {board.data.length > 0 ? (
                      board.data.map((course) => (
                        <motion.div
                          key={course.id}
                          variants={cardReveal}
                          whileHover={{ y: -5 }}
                          className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden group"
                        >
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-${board.color}-50 rounded-bl-[60px] -z-10 group-hover:bg-${board.color}-100 transition-colors`} />
                          
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${board.color}-100 text-${board.color}-700`}>
                                Standard {course.standard}
                              </span>
                              <h3 className="text-xl font-bold text-slate-900 mt-3">Batch {course.standard}</h3>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-slate-900">₹{course.fees.toLocaleString()}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400">Per Subject / Year</p>
                            </div>
                          </div>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-slate-600">
                              <div className="p-2 rounded-lg bg-slate-100">
                                <Clock className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium">{course.timing_start} – {course.timing_end}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                              <div className="p-2 rounded-lg bg-slate-100">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium">{course.days.join(" – ")}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                              <div className="p-2 rounded-lg bg-slate-100">
                                <BookOpen className="h-4 w-4" />
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {course.subjects.map((sub, idx) => (
                                  <span key={idx} className="text-sm font-medium">
                                    {sub}{idx < course.subjects.length - 1 ? "," : ""}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Button 
                            onClick={() => openEnroll(`${course.board} - ${course.standard}`)}
                            className={`w-full bg-slate-900 hover:bg-${board.color}-600 text-white rounded-2xl py-6 font-bold gap-2 transition-all duration-300`}
                          >
                            Enquire Now
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-slate-100/50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No active batches for this board</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
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