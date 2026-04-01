import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Share2,
    ThumbsUp,
    Play,
    Layers,
    GraduationCap,
    BookOpen,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import recordingService, { Recording } from "@/services/recordingService";

const RecordingDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recording, setRecording] = useState<Recording | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecording = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res = await recordingService.getRecordingById(id);
                if (res.success) {
                    setRecording(res.data);
                } else {
                    setError("Recording not found");
                }
            } catch (err) {
                console.error("Error fetching recording details:", err);
                setError("Failed to load recording. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecording();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full shadow-lg mb-4"></div>
                    <p className="text-slate-600 font-medium">Preparing your video lecture...</p>
                </div>
            </Layout>
        );
    }

    if (error || !recording) {
        return (
            <Layout>
                <div className="min-h-screen bg-white py-20 px-4">
                    <div className="max-w-xl mx-auto text-center">
                        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-6 shadow-sm border border-red-100">
                            <ChevronLeft className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">{error || "Recording not found"}</h2>
                        <Button onClick={() => navigate("/recordings")} className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 px-8 font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95">
                            Back to Recordings
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-slate-50 w-full min-h-screen pb-20 md:pt-12">
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                    {/* Breadcrumbs and Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <Link to="/recordings" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors group">
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
                                <ChevronLeft className="h-4 w-4" />
                            </div>
                            Back to all recordings
                        </Link>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 gap-2 hover:bg-slate-50 rounded-full px-4 active:scale-95 transition-all">
                                <ThumbsUp className="h-4 w-4" />
                                Like
                            </Button>
                            <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 gap-2 hover:bg-slate-50 rounded-full px-4 active:scale-95 transition-all">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl ring-4 ring-white/50"
                            >
                                <iframe
                                    src={recording.embedUrl}
                                    title={recording.title}
                                    className="w-full h-full border-0 shadow-inner"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </motion.div>

                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    {recording.course && (
                                        <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-200">
                                            {recording.course.board} • {recording.course.standard}
                                        </div>
                                    )}
                                    <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                        Recorded Session
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-2">
                                        <Play className="h-3.5 w-3.5 fill-slate-400" />
                                        PUBLISHED ON {new Date(recording.createdAt).toLocaleDateString(undefined, {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                                    {recording.title}
                                </h1>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Class Description</h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                                        {recording.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info Area */}
                        <div className="space-y-6">
                            <Card className="rounded-3xl border-none shadow-xl shadow-slate-200/60 overflow-hidden group">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                                            <Layers className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold">Course Info</h3>
                                    </div>

                                    {recording.course ? (
                                        <div className="space-y-5">
                                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors group cursor-default">
                                                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-100 font-bold uppercase tracking-widest mb-0.5">BOARD</p>
                                                    <p className="text-lg font-bold">{recording.course.board}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors group cursor-default">
                                                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                                    <GraduationCap className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-100 font-bold uppercase tracking-widest mb-0.5">STANDARD</p>
                                                    <p className="text-lg font-bold">{recording.course.standard}</p>
                                                </div>
                                            </div>
                                            <Link to={`/courses/${recording.courseId}`}>
                                                <Button className="w-full mt-2 h-12 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow-xl shadow-blue-950/20 active:scale-95 transition-all">
                                                    View Full Course
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="p-10 text-center flex flex-col items-center justify-center">
                                            <div className="h-16 w-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                                                <Share2 className="h-8 w-8 text-white/50" />
                                            </div>
                                            <p className="text-blue-100 font-medium">This recording isn't linked to a specific course yet.</p>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card className="rounded-3xl border-none shadow-xl shadow-slate-200/60 p-8 space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-1 w-8 bg-slate-300 rounded-full"></div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Class Highlights</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 group">
                                        <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                                            <ArrowRight className="h-3 w-3 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-slate-600 font-medium leading-tight">Complete chapter coverage from basics.</span>
                                    </li>
                                    <li className="flex items-start gap-3 group">
                                        <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                                            <ArrowRight className="h-3 w-3 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-slate-600 font-medium leading-tight">Solved examples and practice questions.</span>
                                    </li>
                                    <li className="flex items-start gap-3 group">
                                        <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                                            <ArrowRight className="h-3 w-3 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-slate-600 font-medium leading-tight">Live recorded session from actual classroom.</span>
                                    </li>
                                </ul>
                                <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold active:scale-95 transition-all">
                                    Download Notes
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RecordingDetailPage;
