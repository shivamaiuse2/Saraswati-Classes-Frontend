import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Search, Filter, Video, Clock, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import Layout from "@/components/Layout";
import recordingService, { Recording } from "@/services/recordingService";
import courseService from "@/services/courseService";
import type { Course } from "@/types/course";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut" as const
        },
    }),
};

const RecordingsPage = () => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [recRes, courseRes] = await Promise.all([
                    recordingService.getAllRecordings(selectedCourse === "all" ? undefined : selectedCourse),
                    courseService.getCourses(1, 100)
                ]);

                if (recRes.success) {
                    setRecordings(recRes.data);
                }

                if (courseRes.success && courseRes.data) {
                    if (Array.isArray(courseRes.data)) {
                        setCourses(courseRes.data);
                    } else {
                        const all: Course[] = [];
                        for (const key in courseRes.data) {
                            all.push(...courseRes.data[key]);
                        }
                        setCourses(all);
                    }
                }
            } catch (error) {
                console.error("Error fetching recordings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCourse]);

    const filteredRecordings = recordings.filter(rec =>
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            {/* Hero Section */}
            {/* <section className="relative py-16 md:py-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                    <Video className="h-4 w-4" />
                    RECORDED CLASSES
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    Learn Every Day, <span className="text-blue-500">Anytime.</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Access our collection of recorded lectures and workshops. Perfect for revision or catching up on missed classes.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto bg-slate-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-sm shadow-2xl">
                    <div className="relative flex-1 w-full flex items-center group">
                        <Search className="absolute left-4 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title or topic..." 
                            className="pl-12 bg-transparent border-none text-white h-12 focus-visible:ring-0 text-md"
                        />
                    </div>
                    <div className="w-full sm:w-auto flex items-center gap-2 pr-2">
                        <Filter className="h-5 w-5 text-slate-500 ml-4 hidden sm:block" />
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                            <SelectTrigger className="w-full sm:w-[200px] bg-slate-800 border-slate-700 text-white h-10 rounded-xl focus:ring-blue-500">
                                <SelectValue placeholder="All Courses" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                <SelectItem value="all">All Courses</SelectItem>
                                {courses.map(course => (
                                    <SelectItem key={course.id} value={course.id}>
                                        {course.board} - {course.standard}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </motion.div>
        </div>
      </section> */}

            {/* Grid Content */}
            <section className="py-4 md:py-6 bg-white relative">
                <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Latest Uploads</h2>
                        </div>
                        <div className="text-sm text-slate-500 font-medium">
                            Showing {filteredRecordings.length} results
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <div className="aspect-video bg-slate-100 animate-pulse rounded-2xl" />
                                    <div className="space-y-3 px-2">
                                        <div className="h-6 w-3/4 bg-slate-100 animate-pulse rounded-md" />
                                        <div className="h-4 w-full bg-slate-100 animate-pulse rounded-md" />
                                        <div className="h-10 w-full bg-slate-100 animate-pulse rounded-md" />
                                    </div>
                                </div>
                            ))
                        ) : filteredRecordings.length > 0 ? (
                            filteredRecordings.map((rec, i) => (
                                <motion.div
                                    key={rec.id}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeIn}
                                    className="group"
                                >
                                    <Card className="border-none bg-transparent shadow-none overflow-visible">
                                        <CardContent className="p-0">
                                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl mb-4 group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                                                <img
                                                    src={rec.thumbnailUrl}
                                                    alt={rec.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                                                        <Play className="h-6 w-6 ml-1" />
                                                    </div>
                                                </div>

                                                {rec.course && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold text-blue-600 shadow-sm border border-white/20">
                                                            {rec.course.board} • {rec.course.standard}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="absolute bottom-4 right-4">
                                                    <span className="px-2 py-1 rounded bg-black/80 text-[10px] font-medium text-white flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        VIDEO
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 px-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                        {rec.title}
                                                    </h3>
                                                    {/* <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                                        <Bookmark className="h-5 w-5" />
                                                    </button> */}
                                                </div>
                                                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                                                    {rec.description}
                                                </p>
                                                <Link to={`/recordings/${rec.id}`}>
                                                    <Button className="w-full h-11 bg-slate-900 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-100 group-hover:shadow-blue-600/20 transition-all font-semibold flex items-center gap-2">
                                                        Watch Class Now
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
                                    <Video className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Recordings Found</h3>
                                <p className="text-slate-500 max-w-sm">
                                    We couldn't find any recordings matching your current filters or search query.
                                </p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSearchQuery(""); setSelectedCourse("all"); }}
                                    className="mt-4 text-blue-600"
                                >
                                    Reset all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

// Helper for ArrowRight because I didn't import it
const ArrowRight = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

export default RecordingsPage;
