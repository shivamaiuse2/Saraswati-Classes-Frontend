import { useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
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
import { useApp } from "@/context/AppContext";

interface EditableInquiry {
  id: string;
  name: string;
  email: string;
  courseOrSeries: string;
  status: string;
}

const seedInquiries = (
  enrollments: ReturnType<typeof useApp>["enrollments"]
): EditableInquiry[] =>
  enrollments.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    courseOrSeries: e.courseOrSeries,
    status: e.status,
  }));

const AdminInquiryManagement = () => {
  const { enrollments } = useApp();
  const [rows, setRows] = useState<EditableInquiry[]>(() =>
    seedInquiries(enrollments)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditableInquiry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openEdit = (row: EditableInquiry) => {
    setEditing(row);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    // Simulate API call delay for demo
    await new Promise(resolve => setTimeout(resolve, 500));
    setRows((prev) => prev.filter((r) => r.id !== id));
    setDeletingId(null);
  };

  const handleSave = () => {
    if (!editing) return;
    setRows((prev) => prev.map((r) => (r.id === editing.id ? editing : r)));
    setDialogOpen(false);
    setEditing(null);
  };

  // Shimmer row component
  const TableShimmerRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-3 w-24" /></TableCell>
      <TableCell><Skeleton className="h-3 w-32" /></TableCell>
      <TableCell><Skeleton className="h-3 w-40" /></TableCell>
      <TableCell><Skeleton className="h-3 w-16" /></TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-7 w-7 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold mb-1">
          Inquiry Management
        </h1>
        <p className="text-sm text-muted-foreground">
          View and update inquiries generated from the enrollment flow. This
          table uses placeholder/local data; integration with the Google Form
          responses will be added in the backend.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course / Test Series</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                // Show shimmer when no data
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableShimmerRow key={i} />
                  ))}
                </>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-xs">{row.name}</TableCell>
                    <TableCell className="text-xs">{row.email}</TableCell>
                    <TableCell className="text-xs">
                      {row.courseOrSeries}
                    </TableCell>
                    <TableCell className="text-xs">{row.status}</TableCell>
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
                        disabled={deletingId === row.id}
                      >
                        {deletingId === row.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-6 text-center text-xs text-muted-foreground"
                  >
                    No inquiries available in this view. Inquiries captured via
                    the website will be mapped here once backend sync is added.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-sm">Edit Inquiry</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-3 mt-2">
              <div className="space-y-1">
                <Label htmlFor="inq-name-input">Name</Label>
                <Input
                  id="inq-name-input"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="inq-email-input">Email</Label>
                <Input
                  id="inq-email-input"
                  value={editing.email}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, email: e.target.value } : prev
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="inq-course-input">Course / Series</Label>
                <Input
                  id="inq-course-input"
                  value={editing.courseOrSeries}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev
                        ? { ...prev, courseOrSeries: e.target.value }
                        : prev
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="inq-status-input">Status</Label>
                <Input
                  id="inq-status-input"
                  value={editing.status}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, status: e.target.value } : prev
                    )
                  }
                  placeholder="Pending / Approved / Rejected"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInquiryManagement;
