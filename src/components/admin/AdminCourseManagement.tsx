import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Loader2, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { Course, Board } from "@/types/course";
import courseService from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

interface CourseFormState {
  id?: string;
  board: Board;
  standard: string;
  timing_start: string;
  timing_end: string;
  days: string; // Comma separated in form
  subjects: string; // Comma separated in form
  fees: string;
  isActive: boolean;
}

const emptyCourseForm: CourseFormState = {
  board: "CBSE",
  standard: "",
  timing_start: "",
  timing_end: "",
  days: "Monday, Tuesday, Wednesday, Thursday, Friday",
  subjects: "Maths, Science",
  fees: "",
  isActive: true,
};

const boards: Board[] = ["CBSE", "SSC", "STATE"];

const AdminCourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await courseService.getCourses(1, 100);
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          const all: Course[] = [];
          for (const key in res.data) {
            all.push(...res.data[key]);
          }
          setCourses(all);
        }
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

  const openAdd = () => {
    setEditingCourse(emptyCourseForm);
    setCourseDialogOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse({
      id: course.id,
      board: course.board,
      standard: course.standard,
      timing_start: course.timing_start,
      timing_end: course.timing_end,
      days: course.days.join(", "),
      subjects: course.subjects.join(", "),
      fees: course.fees.toString(),
      isActive: course.isActive,
    });
    setCourseDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
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
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSave = async () => {
    if (!editingCourse) return;
    if (!editingCourse.standard) {
      toast({ title: "Validation Error", description: "Standard is required", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const subjectsArray = editingCourse.subjects.split(",").map(s => s.trim()).filter(Boolean);
    const daysArray = editingCourse.days.split(",").map(d => d.trim()).filter(Boolean);
    const feesNumber = Number(editingCourse.fees) || 0;

    const data = {
      board: editingCourse.board,
      standard: editingCourse.standard,
      timing_start: editingCourse.timing_start,
      timing_end: editingCourse.timing_end,
      days: daysArray,
      subjects: subjectsArray,
      fees: feesNumber,
      isActive: editingCourse.isActive,
    };

    try {
      if (editingCourse.id) {
        const response = await courseService.updateCourse(editingCourse.id, data);
        if (response.success) {
          toast({ title: "Success", description: "Course updated successfully" });
          fetchCourses();
        }
      } else {
        const response = await courseService.createCourse(data);
        if (response.success) {
          toast({ title: "Success", description: "Course created successfully" });
          fetchCourses();
        }
      }
      setCourseDialogOpen(false);
      setEditingCourse(null);
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Batches</h1>
          <p className="text-sm text-muted-foreground">
            Manage your CBSE, SSC and State Board course batches.
          </p>
        </div>
        <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Batch
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Board</TableHead>
                  <TableHead className="font-bold">Standard</TableHead>
                  <TableHead className="font-bold">Timing</TableHead>
                  <TableHead className="font-bold hidden md:table-cell">Days</TableHead>
                  <TableHead className="font-bold">Fees</TableHead>
                  <TableHead className="font-bold hidden lg:table-cell">Subjects</TableHead>
                  <TableHead className="text-right font-bold font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                      No batches found. Click &quot;Add Batch&quot; to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          course.board === 'CBSE' ? 'bg-blue-100 text-blue-700' : 
                          course.board === 'SSC' ? 'bg-amber-100 text-amber-700' : 
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {course.board}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{course.standard}</TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {course.timing_start} – {course.timing_end}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-slate-600 truncate max-w-[200px]">
                        {course.days.join(", ")}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">₹{course.fees.toLocaleString()}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-slate-600 truncate max-w-[150px]">
                        {course.subjects.join(", ")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" onClick={() => openEdit(course)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(course.id)} disabled={isDeleting === course.id}>
                            {isDeleting === course.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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

      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCourse?.id ? "Edit Batch" : "Add New Batch"}</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Board</Label>
                <Select value={editingCourse.board} onValueChange={(v: Board) => setEditingCourse(p => p ? {...p, board: v} : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Board" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Standard</Label>
                <Input value={editingCourse.standard} onChange={e => setEditingCourse(p => p ? {...p, standard: e.target.value} : null)} placeholder="e.g. VIII, IX, X, XII Science" />
              </div>
              <div className="space-y-2">
                <Label>Start Timing</Label>
                <Input value={editingCourse.timing_start} onChange={e => setEditingCourse(p => p ? {...p, timing_start: e.target.value} : null)} placeholder="e.g. 6:30 PM" />
              </div>
              <div className="space-y-2">
                <Label>End Timing</Label>
                <Input value={editingCourse.timing_end} onChange={e => setEditingCourse(p => p ? {...p, timing_end: e.target.value} : null)} placeholder="e.g. 7:30 PM" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Working Days (Comma separated)</Label>
                <Input value={editingCourse.days} onChange={e => setEditingCourse(p => p ? {...p, days: e.target.value} : null)} placeholder="Monday, Tuesday, ..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Subjects (Comma separated)</Label>
                <Input value={editingCourse.subjects} onChange={e => setEditingCourse(p => p ? {...p, subjects: e.target.value} : null)} placeholder="Maths, Science" />
              </div>
              <div className="space-y-2">
                <Label>Annual Fees (per subject)</Label>
                <Input type="number" value={editingCourse.fees} onChange={e => setEditingCourse(p => p ? {...p, fees: e.target.value} : null)} placeholder="9000" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={editingCourse.isActive} onChange={e => setEditingCourse(p => p ? {...p, isActive: e.target.checked} : null)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium">Batch is Active</span>
                </label>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setCourseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 min-w-[100px]">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Batch"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseManagement;
