import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, ListPlus, X, Loader2, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Course, CourseCategory } from "@/types/course";
import type { Chapter } from "@/types/chapter";
import courseService from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

interface CourseFormState {
  id?: string;
  title: string;
  category: CourseCategory;
  time: string;
  days: string;
  description: string;
  fees: string;
  subjects: string;
}

const emptyCourseForm: CourseFormState = {
  title: "",
  category: "Foundation",
  time: "",
  days: "",
  description: "",
  fees: "",
  subjects: "",
};

const categories: CourseCategory[] = ["Foundation", "Science", "Competitive"];

const AdminCourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [chapterCourseId, setChapterCourseId] = useState<string | null>(null);
  const [chapterDrafts, setChapterDrafts] = useState<Chapter[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [newChapter, setNewChapter] = useState<{
    title: string;
    description: string;
    videoUrl: string;
    testDescription: string;
    testLink: string;
  }>({
    title: "",
    description: "",
    videoUrl: "",
    testDescription: "",
    testLink: "",
  });
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingChapterData, setEditingChapterData] = useState<{
    title: string;
    description: string;
    videoUrl: string;
    testDescription: string;
    testLink: string;
  } | null>(null);
  const [isSavingChapter, setIsSavingChapter] = useState(false);
  const [isDeletingChapter, setIsDeletingChapter] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const res = await courseService.getCourses();
        if (res.success && res.data) {
          setCourses((res.data as any[]).map(c => ({
            ...c,
            time: c.timing || c.time || "",
            fees: c.pricePerSubject || c.fees || 0
          })) as any);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to fetch courses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [toast]);

  const openAdd = () => {
    setEditingCourse(emptyCourseForm);
    setCourseDialogOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse({
      id: course.id,
      title: course.title,
      category: course.category,
      time: course.time,
      days: course.days,
      description: course.description,
      fees: course.fees.toString(),
      subjects: course.subjects.join(", "),
    });
    setCourseDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await courseService.deleteCourse(id);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
        toast({
          title: "Success",
          description: "Course deleted successfully",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
    setIsDeleting(null);
  };

  const handleSave = async () => {
    if (!editingCourse) return;
    if (!editingCourse.title.trim()) return;

    setIsSaving(true);
    const subjectsArray = editingCourse.subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const feesNumber = Number(editingCourse.fees) || 0;

    const baseData = {
      title: editingCourse.title,
      category: editingCourse.category,
      description: editingCourse.description,
      subjects: subjectsArray,
      days: editingCourse.days,
      time: editingCourse.time,
      pricePerSubject: feesNumber,
      fullDescription: editingCourse.description,
      mode: "Online",
      duration: "1 year",
      timing: editingCourse.time,
    };

    try {
      if (editingCourse.id) {
        const response = await courseService.updateCourse(editingCourse.id, baseData as any);
        if (response.success && response.data) {
          const updated = response.data as any;
          setCourses((prev) =>
            prev.map((c) => (c.id === editingCourse.id ? { ...updated, time: updated.timing || updated.time || "", fees: updated.pricePerSubject || updated.fees || 0 } as any : c))
          );
          toast({
            title: "Success",
            description: "Course updated successfully",
          });
        }
      } else {
        const response = await courseService.createCourse(baseData as any);
        if (response.success && response.data) {
          const created = response.data as any;
          setCourses((prev) => [...prev, { ...created, time: created.timing || created.time || "", fees: created.pricePerSubject || created.fees || 0 } as any]);
          toast({
            title: "Success",
            description: "Course created successfully",
          });
        }
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }

    setCourseDialogOpen(false);
    setEditingCourse(null);
  };

  const openChapters = async (course: Course) => {
    setChapterCourseId(course.id);
    setChapterDrafts(course.chapters || []);
    setNewChapter({
      title: "",
      description: "",
      videoUrl: "",
      testDescription: "",
      testLink: "",
    });
    setChapterDialogOpen(true);
  };

  const handleAddChapter = async () => {
    if (!chapterCourseId) return;
    if (!newChapter.title.trim() || !newChapter.description.trim()) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      });
      return;
    }

    setIsSavingChapter(true);
    try {
      const response = await courseService.addChapterToCourse(chapterCourseId, {
        title: newChapter.title,
        description: newChapter.description,
        videoUrl: newChapter.videoUrl || undefined,
        testDescription: newChapter.testDescription || undefined,
        testLink: newChapter.testLink || undefined,
      });

      if (response.success && response.data) {
        setChapterDrafts((prev) => [...prev, response.data]);
        setNewChapter({
          title: "",
          description: "",
          videoUrl: "",
          testDescription: "",
          testLink: "",
        });
        toast({
          title: "Success",
          description: "Chapter added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding chapter:', error);
      toast({
        title: "Error",
        description: "Failed to add chapter",
        variant: "destructive",
      });
    } finally {
      setIsSavingChapter(false);
    }
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditingChapterData({
      title: chapter.title,
      description: chapter.description,
      videoUrl: chapter.videoUrl || "",
      testDescription: chapter.testDescription || "",
      testLink: chapter.testLink || "",
    });
  };

  const handleUpdateChapter = async (chapterId: string) => {
    if (!editingChapterData) return;
    if (!editingChapterData.title.trim() || !editingChapterData.description.trim()) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      });
      return;
    }

    setIsSavingChapter(true);
    try {
      const response = await courseService.updateChapter(chapterId, {
        title: editingChapterData.title,
        description: editingChapterData.description,
        videoUrl: editingChapterData.videoUrl || undefined,
        testDescription: editingChapterData.testDescription || undefined,
        testLink: editingChapterData.testLink || undefined,
      });

      if (response.success && response.data) {
        setChapterDrafts((prev) =>
          prev.map((ch) => (ch.id === chapterId ? response.data : ch))
        );
        setEditingChapterId(null);
        setEditingChapterData(null);
        toast({
          title: "Success",
          description: "Chapter updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast({
        title: "Error",
        description: "Failed to update chapter",
        variant: "destructive",
      });
    } finally {
      setIsSavingChapter(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    setIsDeletingChapter(chapterId);
    try {
      const response = await courseService.deleteChapter(chapterId);
      if (response.success) {
        setChapterDrafts((prev) => prev.filter((ch) => ch.id !== chapterId));
        if (editingChapterId === chapterId) {
          setEditingChapterId(null);
          setEditingChapterData(null);
        }
        toast({
          title: "Success",
          description: "Chapter deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast({
        title: "Error",
        description: "Failed to delete chapter",
        variant: "destructive",
      });
    } finally {
      setIsDeletingChapter(null);
    }
  };

  const handleCancelChapterEdit = () => {
    setEditingChapterId(null);
    setEditingChapterData(null);
  };

  const handleCloseChapterDialog = () => {
    setChapterDialogOpen(false);
    setChapterCourseId(null);
    setChapterDrafts([]);
    setEditingChapterId(null);
    setEditingChapterData(null);
    setNewChapter({
      title: "",
      description: "",
      videoUrl: "",
      testDescription: "",
      testLink: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Course Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage the list of courses visible on the website. All changes here
            are frontend-only placeholders until backend APIs are connected.
          </p>
        </div>
        <Button size="sm" className="gap-1" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Chapters</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <div className="text-sm text-muted-foreground">
                        Loading courses from database...
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-6 text-center text-xs text-muted-foreground"
                  >
                    No courses configured in this admin view. Use &quot;Add
                    Course&quot; to create placeholder rows.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="text-xs">{course.title}</TableCell>
                  <TableCell className="text-xs">{course.category}</TableCell>
                  <TableCell className="text-xs">{course.time}</TableCell>
                  <TableCell className="text-xs">{course.days}</TableCell>
                  <TableCell className="text-xs">
                    ₹{course.fees.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-xs">
                    {course.subjects.join(", ")}
                  </TableCell>
                  <TableCell className="text-xs">
                    {course.chapters.length}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => openEdit(course)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => openChapters(course)}
                    >
                      <ListPlus className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {editingCourse?.id ? "Edit Course" : "Add Course"}
            </DialogTitle>
          </DialogHeader>

          {editingCourse && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-3 mt-2 overflow-y-auto pr-3">
                <div className="space-y-1">
                  <Label htmlFor="course-title-input">Course Title</Label>
                  <Input
                    id="course-title-input"
                    value={editingCourse.title}
                    onChange={(e) =>
                      setEditingCourse((prev) =>
                        prev ? { ...prev, title: e.target.value } : prev
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="course-category-input">Category</Label>
                  <Select
                    value={editingCourse.category}
                    onValueChange={(value) =>
                      setEditingCourse((prev) =>
                        prev
                          ? { ...prev, category: value as CourseCategory }
                          : prev
                      )
                    }
                  >
                    <SelectTrigger id="course-category-input">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="course-time-input">Time</Label>
                  <Input
                    id="course-time-input"
                    value={editingCourse.time}
                    onChange={(e) =>
                      setEditingCourse((prev) =>
                        prev ? { ...prev, time: e.target.value } : prev
                      )
                    }
                    placeholder="e.g. 4:15 – 5:30 PM"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="course-days-input">Days</Label>
                  <Input
                    id="course-days-input"
                    value={editingCourse.days}
                    onChange={(e) =>
                      setEditingCourse((prev) =>
                        prev ? { ...prev, days: e.target.value } : prev
                      )
                    }
                    placeholder="e.g. Monday – Saturday"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="course-fees-input">Fees</Label>
                  <Input
                    id="course-fees-input"
                    value={editingCourse.fees}
                    onChange={(e) =>
                      setEditingCourse((prev) =>
                        prev ? { ...prev, fees: e.target.value } : prev
                      )
                    }
                    placeholder="e.g. 9000"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="course-subjects-input">Subjects</Label>
                  <Input
                    id="course-subjects-input"
                    value={editingCourse.subjects}
                    onChange={(e) =>
                      setEditingCourse((prev) =>
                        prev ? { ...prev, subjects: e.target.value } : prev
                      )
                    }
                    placeholder="e.g. Maths, Science"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="course-description-input">Short Description</Label>
                  <Textarea
                    id="course-description-input"
                    rows={3}
                    value={editingCourse.description}
                    onChange={(e) =>
                      setEditingCourse((prev) =>
                        prev ? { ...prev, description: e.target.value } : prev
                      )
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCourseDialogOpen(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={chapterDialogOpen} onOpenChange={handleCloseChapterDialog}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm">Manage Chapters</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="space-y-4 mt-2 overflow-y-auto pr-3">
              <div className="space-y-2">
                {chapterDrafts.map((ch) => (
                  <div key={ch.id}>
                    {editingChapterId === ch.id ? (
                      <div className="rounded-lg border bg-blue-50 px-3 py-3 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold">
                            Editing Chapter {ch.chapterNumber}
                          </p>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5"
                            onClick={handleCancelChapterEdit}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <Label htmlFor={`edit-ch-title-${ch.id}`} className="text-xs">Chapter Title</Label>
                            <Input
                              id={`edit-ch-title-${ch.id}`}
                              className="text-xs h-8"
                              value={editingChapterData?.title || ""}
                              onChange={(e) =>
                                setEditingChapterData((prev) =>
                                  prev
                                    ? { ...prev, title: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-ch-desc-${ch.id}`} className="text-xs">Chapter Description</Label>
                            <textarea
                              id={`edit-ch-desc-${ch.id}`}
                              className="w-full rounded border border-input bg-white px-2 py-1 text-xs resize-none"
                              rows={2}
                              value={editingChapterData?.description || ""}
                              onChange={(e) =>
                                setEditingChapterData((prev) =>
                                  prev
                                    ? { ...prev, description: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-ch-yt-${ch.id}`} className="text-xs">Video URL</Label>
                            <Input
                              id={`edit-ch-yt-${ch.id}`}
                              className="text-xs h-8"
                              value={editingChapterData?.videoUrl || ""}
                              onChange={(e) =>
                                setEditingChapterData((prev) =>
                                  prev
                                    ? { ...prev, videoUrl: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-ch-test-desc-${ch.id}`} className="text-xs">Test Description</Label>
                            <Input
                              id={`edit-ch-test-desc-${ch.id}`}
                              className="text-xs h-8"
                              value={editingChapterData?.testDescription || ""}
                              onChange={(e) =>
                                setEditingChapterData((prev) =>
                                  prev
                                    ? { ...prev, testDescription: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-ch-test-link-${ch.id}`} className="text-xs">Google Form Link</Label>
                            <Input
                              id={`edit-ch-test-link-${ch.id}`}
                              className="text-xs h-8"
                              value={editingChapterData?.testLink || ""}
                              onChange={(e) =>
                                setEditingChapterData((prev) =>
                                  prev
                                    ? { ...prev, testLink: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={handleCancelChapterEdit}
                            disabled={isSavingChapter}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleUpdateChapter(ch.id)}
                            disabled={isSavingChapter}
                          >
                            {isSavingChapter ? (
                              <><Loader2 className="h-3 w-3 animate-spin mr-1" />Updating...</>
                            ) : "Update"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed bg-muted/60 px-3 py-2 space-y-1 flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-semibold">
                            Chapter {ch.chapterNumber}: {ch.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ch.description}
                          </p>
                          {ch.videoUrl && (
                            <p className="text-[11px] text-muted-foreground">
                              Video: {ch.videoUrl}
                            </p>
                          )}
                          {ch.testLink && (
                            <p className="text-[11px] text-muted-foreground">
                              Test: {ch.testLink}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => handleEditChapter(ch)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() => handleDeleteChapter(ch.id)}
                            disabled={isDeletingChapter === ch.id}
                          >
                            {isDeletingChapter === ch.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {chapterDrafts.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No chapters added yet. Use the form below to add the first one.
                  </p>
                )}
              </div>

              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-semibold">Add New Chapter</p>
                <div className="space-y-1">
                  <Label htmlFor="chapter-title-input">
                    Chapter Title
                  </Label>
                  <Input
                    id="chapter-title-input"
                    value={newChapter.title}
                    onChange={(e) =>
                      setNewChapter((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="e.g. Introduction to Algebra"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="chapter-description-input">
                    Chapter Description
                  </Label>
                  <Textarea
                    id="chapter-description-input"
                    rows={2}
                    value={newChapter.description}
                    onChange={(e) =>
                      setNewChapter((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description of the chapter content"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="chapter-youtube-input">Video URL</Label>
                  <Input
                    id="chapter-youtube-input"
                    value={newChapter.videoUrl}
                    onChange={(e) =>
                      setNewChapter((prev) => ({
                        ...prev,
                        videoUrl: e.target.value,
                      }))
                    }
                    placeholder="e.g. https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="chapter-test-desc-input">Test Description</Label>
                  <Input
                    id="chapter-test-desc-input"
                    value={newChapter.testDescription}
                    onChange={(e) =>
                      setNewChapter((prev) => ({
                        ...prev,
                        testDescription: e.target.value,
                      }))
                    }
                    placeholder="e.g. Chapter 1 Quiz"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="chapter-test-link-input">Google Form Link</Label>
                  <Input
                    id="chapter-test-link-input"
                    value={newChapter.testLink}
                    onChange={(e) =>
                      setNewChapter((prev) => ({
                        ...prev,
                        testLink: e.target.value,
                      }))
                    }
                    placeholder="e.g. https://forms.google.com/..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCloseChapterDialog}
                  >
                    Close
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleAddChapter}
                    disabled={isSavingChapter}
                  >
                    {isSavingChapter ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-1" />Adding...</>
                    ) : (
                      <><Plus className="h-4 w-4 mr-1" />Add Chapter</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseManagement;

