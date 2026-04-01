import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Loader2, Play, ExternalLink, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Recording, CreateRecordingData } from "@/services/recordingService";
import recordingService from "@/services/recordingService";
import courseService from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@/types/course";

interface RecordingFormState extends CreateRecordingData {
  id?: string;
}

const emptyRecordingForm: RecordingFormState = {
  title: "",
  description: "",
  youtubeLink: "",
  courseId: "none",
};

const AdminRecordingManagement = () => {
  const { toast } = useToast();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecording, setEditingRecording] = useState<RecordingFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [filterCourseId, setFilterCourseId] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, [filterCourseId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [recRes, courseRes] = await Promise.all([
        recordingService.getAllRecordings(filterCourseId === "all" ? undefined : filterCourseId),
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
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openAdd = () => {
    setEditingRecording(emptyRecordingForm);
    setDialogOpen(true);
  };

  const openEdit = (recording: Recording) => {
    setEditingRecording({
      id: recording.id,
      title: recording.title,
      description: recording.description,
      youtubeLink: recording.youtubeLink,
      courseId: recording.courseId || "none",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recording?")) return;
    setIsDeleting(id);
    try {
      const res = await recordingService.deleteRecording(id);
      if (res.success) {
        setRecordings((prev) => prev.filter((r) => r.id !== id));
        toast({
          title: "Success",
          description: "Recording deleted successfully",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to delete recording",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSave = async () => {
    if (!editingRecording) return;
    if (!editingRecording.title || !editingRecording.description || !editingRecording.youtubeLink) {
      toast({ title: "Validation Error", description: "Title, description and YouTube link are required", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const data: CreateRecordingData = {
      title: editingRecording.title,
      description: editingRecording.description,
      youtubeLink: editingRecording.youtubeLink,
      courseId: (editingRecording.courseId && editingRecording.courseId !== "none") ? editingRecording.courseId : undefined,
    };

    try {
      if (editingRecording.id) {
        const response = await recordingService.updateRecording(editingRecording.id, data);
        if (response.success) {
          toast({ title: "Success", description: "Recording updated successfully" });
          fetchData();
          setDialogOpen(false);
          setEditingRecording(null);
        }
      } else {
        const response = await recordingService.createRecording(data);
        if (response.success) {
          toast({ title: "Success", description: "Recording created successfully" });
          fetchData();
          setDialogOpen(false);
          setEditingRecording(null);
        }
      }
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error",
        description: e.message || "Failed to save recording",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Recordings</h1>
          <p className="text-sm text-muted-foreground">
            Manage video-based learning content for your students.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white rounded-md border px-2 py-1 shadow-sm">
                <Filter className="h-4 w-4 text-slate-400" />
                <Select value={filterCourseId} onValueChange={setFilterCourseId}>
                    <SelectTrigger className="border-none shadow-none h-8 w-[180px] focus:ring-0">
                        <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {courses.map(course => (
                            <SelectItem key={course.id} value={course.id}>
                                {course.board} - {course.standard}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Recording
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 border-b">
                <TableRow>
                  <TableHead className="font-bold py-4">Thumbnail</TableHead>
                  <TableHead className="font-bold py-4">Details</TableHead>
                  <TableHead className="font-bold py-4">Linked Course</TableHead>
                  <TableHead className="font-bold py-4">Date</TableHead>
                  <TableHead className="text-right font-bold py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-16 w-28 rounded-lg" /></TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : recordings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                            <Play className="h-12 w-12 mb-4 text-slate-200" />
                            <p className="font-medium">No recordings found</p>
                            <p className="text-sm">Click &quot;Add Recording&quot; to create your first video content.</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recordings.map((recording) => (
                    <TableRow key={recording.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="relative group">
                            <img 
                                src={recording.thumbnailUrl} 
                                alt={recording.title} 
                                className="h-16 w-28 object-cover rounded-lg shadow-sm border border-slate-100"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-lg transition-opacity">
                                <Play className="h-6 w-6 text-white" />
                            </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-semibold text-slate-900">{recording.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{recording.description}</div>
                        <div className="mt-1 text-[10px] text-blue-600 flex items-center gap-1 font-medium">
                            <ExternalLink className="h-3 w-3" />
                            <a href={recording.youtubeLink} target="_blank" rel="noreferrer" className="hover:underline">View on YouTube</a>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {recording.course ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {recording.course.board} - {recording.course.standard}
                            </span>
                        ) : (
                            <span className="text-xs text-slate-400 italic">Not linked</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-xs text-slate-500">
                        {new Date(recording.createdAt).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex justify-end gap-2 pr-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 text-blue-600 border-blue-100 hover:bg-blue-50 hover:text-blue-700 shadow-sm transition-all active:scale-95" 
                            onClick={() => openEdit(recording)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 text-red-600 border-red-100 hover:text-red-700 hover:bg-red-50 shadow-sm transition-all active:scale-95" 
                            onClick={() => handleDelete(recording.id)} 
                            disabled={isDeleting === recording.id}
                          >
                            {isDeleting === recording.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl border-none shadow-2xl rounded-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{editingRecording?.id ? "Edit Recording" : "Add New Recording"}</DialogTitle>
                <DialogDescription className="text-indigo-100 italic">
                    Fill in the details to create a new video recording entry.
                </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-8 space-y-6 bg-white">
          {editingRecording && (
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700 font-semibold">Title</Label>
                <Input 
                    id="title"
                    value={editingRecording.title} 
                    onChange={e => setEditingRecording(p => p ? { ...p, title: e.target.value } : null)} 
                    placeholder="e.g. Geometry Introduction" 
                    className="focus-visible:ring-indigo-500 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtubeLink" className="text-slate-700 font-semibold">YouTube Link</Label>
                <Input 
                    id="youtubeLink"
                    value={editingRecording.youtubeLink} 
                    onChange={e => setEditingRecording(p => p ? { ...p, youtubeLink: e.target.value } : null)} 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    className="focus-visible:ring-indigo-500 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseId" className="text-slate-700 font-semibold">Associated Course (Optional)</Label>
                <Select 
                    value={editingRecording.courseId} 
                    onValueChange={(v) => setEditingRecording(p => p ? { ...p, courseId: v } : null)}
                >
                  <SelectTrigger id="courseId" className="focus:ring-indigo-500 border-slate-200">
                    <SelectValue placeholder="Select a course (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None / Not Linked</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.board} - {course.standard}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-semibold">Short Description</Label>
                <Textarea 
                    id="description"
                    value={editingRecording.description} 
                    onChange={e => setEditingRecording(p => p ? { ...p, description: e.target.value } : null)} 
                    placeholder="Describe what this video is about..." 
                    rows={4}
                    className="focus-visible:ring-indigo-500 border-slate-200 resize-none"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="hover:bg-slate-100">Cancel</Button>
            <Button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white min-w-[120px] shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Content"}
            </Button>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRecordingManagement;
