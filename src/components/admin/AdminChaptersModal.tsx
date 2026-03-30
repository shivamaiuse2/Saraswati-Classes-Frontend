import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, X, Loader2, Link as LinkIcon, Youtube, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import courseService from "@/services/courseService";
import { Chapter } from "@/types/course";

interface AdminChaptersModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
}

const AdminChaptersModal = ({ open, onClose, courseId, courseName }: AdminChaptersModalProps) => {
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Partial<Chapter> | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeLink: "",
    formLink: ""
  });

  useEffect(() => {
    if (open && courseId) {
      fetchChapters();
    }
  }, [open, courseId]);

  const fetchChapters = async () => {
    setIsLoading(true);
    try {
      const res = await courseService.getChapters(courseId);
      if (res.success) {
        setChapters(res.data);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingChapter(null);
    setFormData({
      title: "",
      description: "",
      youtubeLink: "",
      formLink: ""
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setFormData({
      title: chapter.title,
      description: chapter.description,
      youtubeLink: chapter.youtubeLink || "",
      formLink: chapter.formLink || ""
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.youtubeLink) {
      toast({
        title: "Validation Error",
        description: "Title, Description and YouTube Link are required",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingChapter?.id) {
        const res = await courseService.updateChapter(editingChapter.id, formData);
        if (res.success) {
          toast({ title: "Success", description: "Chapter updated successfully" });
          fetchChapters();
          setIsFormOpen(false);
        }
      } else {
        const res = await courseService.createChapter(courseId, formData);
        if (res.success) {
          toast({ title: "Success", description: "Chapter created successfully" });
          fetchChapters();
          setIsFormOpen(false);
        }
      }
    } catch (error) {
      console.error("Error saving chapter:", error);
      toast({
        title: "Error",
        description: "Failed to save chapter",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chapter?")) return;
    setDeletingId(id);
    try {
      const res = await courseService.deleteChapter(id);
      if (res.success) {
        setChapters(prev => prev.filter(c => c.id !== id));
        toast({ title: "Success", description: "Chapter deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast({
        title: "Error",
        description: "Failed to delete chapter",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Manage Chapters</DialogTitle>
              <p className="text-slate-500 font-medium mt-1">{courseName}</p>
            </div>
            {!isFormOpen && (
              <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="h-4 w-4" />
                Add Chapter
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isFormOpen ? (
            <div className="space-y-4 border rounded-xl p-6 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">
                  {editingChapter ? "Edit Chapter" : "New Chapter"}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chapter-title">Title</Label>
                  <Input
                    id="chapter-title"
                    placeholder="e.g. Introduction to Algebra"
                    value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chapter-desc">Description</Label>
                  <Textarea
                    id="chapter-desc"
                    placeholder="Provide a brief summary of the chapter content..."
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chapter-video" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-600" />
                      YouTube Video URL
                    </Label>
                    <Input
                      id="chapter-video"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.youtubeLink}
                      onChange={e => setFormData(p => ({ ...p, youtubeLink: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chapter-form" className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-blue-600" />
                      Form Link (Assignment/Test)
                    </Label>
                    <Input
                      id="chapter-form"
                      placeholder="https://forms.gle/..."
                      value={formData.formLink}
                      onChange={e => setFormData(p => ({ ...p, formLink: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 min-w-[100px]">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Chapter
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold w-[250px]">Chapter Title</TableHead>
                    <TableHead className="font-bold hidden md:table-cell">Video Link</TableHead>
                    <TableHead className="font-bold hidden md:table-cell">Form Link</TableHead>
                    <TableHead className="font-bold">Date Created</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : chapters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium">
                        No chapters found for this course. Click &quot;Add Chapter&quot; to begin.
                      </TableCell>
                    </TableRow>
                  ) : (
                    chapters.map((chapter) => (
                      <TableRow key={chapter.id} className="group hover:bg-slate-50/50">
                        <TableCell className="font-medium text-slate-900">
                          <div className="flex flex-col">
                            <span>{chapter.title}</span>
                            <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                              {chapter.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 text-blue-600 text-xs truncate max-w-[200px]">
                            <Youtube className="h-3 w-3 flex-shrink-0" />
                            <a href={chapter.youtubeLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {chapter.youtubeLink}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 text-blue-600 text-xs truncate max-w-[200px]">
                            <Youtube className="h-3 w-3 flex-shrink-0" />
                            <a href={chapter.formLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {chapter.formLink}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {chapter.createdAt ? new Date(chapter.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleOpenEdit(chapter)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleDelete(chapter.id)}
                              disabled={deletingId === chapter.id}
                            >
                              {deletingId === chapter.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 bg-slate-50 border-t">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminChaptersModal;
