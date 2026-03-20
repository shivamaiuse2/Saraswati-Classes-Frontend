import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Ban, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/types/student";
import studentService from "@/services/studentService";
import { useApp } from "@/context/AppContext";

const standards = [
  "1st", "2nd", "3rd", "4th", "5th", "6th",
  "7th", "8th", "9th", "10th", "11th", "12th",
] as const;

type StandardOption = (typeof standards)[number];

const boards: Student["board"][] = ["SSC", "CBSE"];

const AdminStudentManagement = () => {
  const { courses, testSeries } = useApp();
  const [rows, setRows] = useState<Student[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBlocking, setIsBlocking] = useState<string | null>(null);

  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const res = await studentService.getStudents(1, 100);
        if (res.success && res.data) {
          setRows(res.data as any);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const openAdd = () => {
    setEditing({
      id: "",
      fullName: "",
      address: "",
      mobile: "",
      email: "",
      standard: "" as StandardOption,
      board: "SSC",
      enrolledCourses: [],
      enrolledTestSeries: [],
      username: "",
      password: "",
      status: "active",
      dateOfBirth: "",
      guardianName: "",
      guardianPhone: "",
    });
    setSelectedCourseIds([]);
    setSelectedSeriesIds([]);
    setDialogOpen(true);
  };

  const openEdit = (student: Student) => {
    setEditing(student);
    setSelectedCourseIds(student.enrolledCourses);
    setSelectedSeriesIds(student.enrolledTestSeries);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await studentService.deleteStudent(id);
      if (res.success) {
        setRows((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) { console.error(e); }
  };

  const handleToggleBlock = async (id: string) => {
    const student = rows.find(s => s.id === id);
    if (!student) return;
    setIsBlocking(id);
    try {
      const response = student.status === "blocked"
        ? await studentService.unblockStudent(id)
        : await studentService.blockStudent(id);
      if (response.success && response.data) {
        setRows((prev) => prev.map((s) => (s.id === id ? response.data as any : s)));
      }
    } catch (error) { console.error(error); }
    setIsBlocking(null);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.fullName.trim() || !editing.email.trim()) return;

    setIsSaving(true);
    try {
      const payload = {
        name: editing.fullName,
        email: editing.email,
        phone: editing.mobile,
        address: editing.address,
        standard: editing.standard,
        board: editing.board,
        status: editing.status?.toUpperCase() ?? "ACTIVE",
        password: editing.password,
        dateOfBirth: editing.dateOfBirth,
        guardianName: editing.guardianName,
        guardianPhone: editing.guardianPhone,
        enrolledCourses: selectedCourseIds,
        enrolledTestSeries: selectedSeriesIds,
      };

      if (editing.id) {
        const response = await studentService.updateStudent(editing.id, payload as any);
        if (response.success && response.data) {
          setRows((prev) => prev.map((s) => (s.id === editing.id ? response.data as any : s)));
        }
      } else {
        const response = await studentService.createStudent(payload as any);
        if (response.success && response.data) {
          setRows((prev) => [...prev, response.data as any]);
        }
      }
    } catch (e) {
      console.error('Error saving student:', e);
    } finally {
      setIsSaving(false);
    }

    setDialogOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Student Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage student records, enrolments and account access. Data is stored locally
            via mock services and can be wired to real APIs later.
          </p>
        </div>
        <Button size="sm" className="gap-1" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enrolled Courses / Tests</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-6 text-center text-xs text-muted-foreground"
                  >
                    No students configured in this view. Use &quot;Add
                    Student&quot; to create placeholder rows.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs">{row.fullName}</TableCell>
                  <TableCell className="text-xs">{row.email}</TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-col gap-1">
                      {row.enrolledCourses.length > 0 && (
                        <span>
                          Courses:{" "}
                          {row.enrolledCourses
                            .map((id) => courses.find((c) => c.id === id)?.title)
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                      {row.enrolledTestSeries.length > 0 && (
                        <span>
                          Tests:{" "}
                          {row.enrolledTestSeries
                            .map((id) =>
                              testSeries.find((t) => t.id === id)?.title
                            )
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                      {row.enrolledCourses.length === 0 &&
                        row.enrolledTestSeries.length === 0 && (
                          <span className="text-muted-foreground">
                            Not enrolled yet
                          </span>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{row.username}</TableCell>
                  <TableCell className="text-xs">{row.password}</TableCell>
                  <TableCell className="text-xs">
                    <Badge
                      variant={row.status === "blocked" ? "destructive" : "outline"}
                      className="gap-1"
                    >
                      {row.status === "blocked" ? (
                        <Ban className="h-3 w-3" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3" />
                      )}
                      {row.status === "blocked" ? "Blocked" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => handleToggleBlock(row.id)}
                    >
                      {row.status === "blocked" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Ban className="h-3 w-3" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {editing?.id ? "Edit Student" : "Add Student"}
            </DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-3 mt-2 overflow-y-auto pr-3">
                <div className="space-y-1">
                  <Label htmlFor="student-name-input">Full Name</Label>
                  <Input
                    id="student-name-input"
                    value={editing.fullName}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, fullName: e.target.value } : prev
                      )
                    }
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="student-dob-input">Date of Birth</Label>
                    <Input
                      id="student-dob-input"
                      type="date"
                      value={editing.dateOfBirth ? new Date(editing.dateOfBirth).toISOString().split('T')[0] : ""}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, dateOfBirth: e.target.value } : prev
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="student-guardian-name-input">Guardian Name</Label>
                    <Input
                      id="student-guardian-name-input"
                      value={editing.guardianName}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, guardianName: e.target.value } : prev
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="student-guardian-phone-input">Guardian Phone</Label>
                    <Input
                      id="student-guardian-phone-input"
                      value={editing.guardianPhone}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, guardianPhone: e.target.value } : prev
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="student-email-input">Email</Label>
                    <Input
                      id="student-email-input"
                      value={editing.email}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, email: e.target.value } : prev
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="student-address-input">Full Address</Label>
                  <Textarea
                    id="student-address-input"
                    rows={3}
                    value={editing.address}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, address: e.target.value } : prev
                      )
                    }
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="student-mobile-input">Mobile Number</Label>
                    <Input
                      id="student-mobile-input"
                      value={editing.mobile}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, mobile: e.target.value } : prev
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Standard</Label>
                    <Select
                      value={editing.standard}
                      onValueChange={(value) =>
                        setEditing((prev) =>
                          prev ? { ...prev, standard: value as StandardOption } : prev
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select standard" />
                      </SelectTrigger>
                      <SelectContent>
                        {standards.map((std) => (
                          <SelectItem key={std} value={std}>
                            {std}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Board</Label>
                    <Select
                      value={editing.board}
                      onValueChange={(value) =>
                        setEditing((prev) =>
                          prev ? { ...prev, board: value as Student["board"] } : prev
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        {boards.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="student-username-input">Username</Label>
                    <Input
                      id="student-username-input"
                      value={editing.username}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, username: e.target.value } : prev
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="student-password-input">Password</Label>
                  <Input
                    id="student-password-input"
                    type="text"
                    value={editing.password}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, password: e.target.value } : prev
                      )
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Enroll in Courses</Label>
                    <div className="border rounded-md p-2 max-h-40 overflow-auto space-y-1 text-xs">
                      {courses.map((course) => {
                        const checked = selectedCourseIds.includes(course.id);
                        return (
                          <label
                            key={course.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="h-3 w-3"
                              checked={checked}
                              onChange={(e) => {
                                setSelectedCourseIds((prev) =>
                                  e.target.checked
                                    ? [...prev, course.id]
                                    : prev.filter((id) => id !== course.id)
                                );
                              }}
                            />
                            <span>{course.title}</span>
                          </label>
                        );
                      })}
                      {courses.length === 0 && (
                        <p className="text-muted-foreground">
                          No courses configured yet.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Enroll in Test Series</Label>
                    <div className="border rounded-md p-2 max-h-40 overflow-auto space-y-1 text-xs">
                      {testSeries.map((ts) => {
                        const checked = selectedSeriesIds.includes(ts.id);
                        return (
                          <label
                            key={ts.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="h-3 w-3"
                              checked={checked}
                              onChange={(e) => {
                                setSelectedSeriesIds((prev) =>
                                  e.target.checked
                                    ? [...prev, ts.id]
                                    : prev.filter((id) => id !== ts.id)
                                );
                              }}
                            />
                            <span>{ts.title}</span>
                          </label>
                        );
                      })}
                      {testSeries.length === 0 && (
                        <p className="text-muted-foreground">
                          No test series configured yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDialogOpen(false)}
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
    </div>
  );
};

export default AdminStudentManagement;

