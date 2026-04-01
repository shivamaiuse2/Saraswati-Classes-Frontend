import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import ImageUploader from "@/components/ImageUploader";
import type { Banner } from "@/types/banner";
import bannerService from "@/services/bannerService";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const AdminBannerManagement = () => {
  const { testSeries, courses, loadCourses, loadTestSeries } = useApp();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<"COURSE" | "TEST_SERIES">("COURSE");
  const [referenceId, setReferenceId] = useState("");

  useEffect(() => {
    fetchBanners();
    loadCourses();
    loadTestSeries();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await bannerService.getBanners();
      if (res.success && res.data) {
        setBanners(res.data);
      }
    } catch (error) {
      console.error("Fetch banners error:", error);
      toast.error("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (url: string) => {
    setImageUrl(url);
  };

  const handleSave = async () => {
    if (!imageUrl || !title || !subtitle || !category || !referenceId) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        imageUrl,
        title,
        subtitle,
        category,
        referenceId,
      };

      if (editingId) {
        const response = await bannerService.updateBanner(editingId, payload);
        if (response.success) {
          toast.success("Banner updated successfully");
          fetchBanners();
          setDialogOpen(false);
        }
      } else {
        const response = await bannerService.createBanner(payload);
        if (response.success) {
          toast.success("Banner created successfully");
          fetchBanners();
          setDialogOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Save banner error:", error);
      toast.error(error.response?.data?.message || "Failed to save banner");
    } finally {
      setIsSaving(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setImageUrl("");
    setTitle("");
    setSubtitle("");
    setCategory("COURSE");
    setReferenceId("");
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setImageUrl(banner.imageUrl);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setCategory(banner.category);
    setReferenceId(banner.referenceId);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    setDeletingId(id);
    try {
      const res = await bannerService.deleteBanner(id);
      if (res.success) {
        toast.success("Banner deleted successfully");
        setBanners((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error("Delete banner error:", error);
      toast.error("Failed to delete banner");
    } finally {
      setDeletingId(null);
    }
  };

  // Dynamic reference items based on category
  const referenceItems = category === "COURSE" 
    ? courses.map(c => ({ id: c.id, label: `${c.standard} - ${c.board} (${c.subjects.join(', ')})` }))
    : testSeries.map(ts => ({ id: ts.id, label: ts.title }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage promotional banners for the home page.
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[100px]">Preview</TableHead>
                <TableHead>Title & Subtitle</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Linked Item</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-12 w-20 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40 mb-2" /><Skeleton className="h-3 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No banners found. Click &quot;Add Banner&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                banners.map((banner) => {
                  let linkedLabel = "Unknown";
                  if (banner.category === "COURSE") {
                    const c = courses.find(item => item.id === banner.referenceId);
                    linkedLabel = c ? `${c.standard} - ${c.board}` : banner.referenceId;
                  } else {
                    const ts = testSeries.find(item => item.id === banner.referenceId);
                    linkedLabel = ts ? ts.title : banner.referenceId;
                  }

                  return (
                    <TableRow key={banner.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="h-12 w-20 rounded-md object-cover border shadow-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{banner.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{banner.subtitle}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          banner.category === "COURSE" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {banner.category.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {linkedLabel}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(banner)}
                            className="h-8 w-8 hover:bg-background hover:shadow-md transition-all"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(banner.id)}
                            disabled={deletingId === banner.id}
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all"
                          >
                            {deletingId === banner.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>{editingId ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <ImageUploader
                onImageSelect={handleImageSelect}
                currentImage={imageUrl}
                folder="banners"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Banner Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Special Offer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-muted/30 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Banner Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="e.g. Get 20% off on all courses"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="bg-muted/30 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(val: any) => {
                    setCategory(val);
                    setReferenceId(""); // Reset reference when category changes
                  }}
                >
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COURSE">Course</SelectItem>
                    <SelectItem value="TEST_SERIES">Test Series</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select {category === "COURSE" ? "Course" : "Test Series"}</Label>
                <Select
                  value={referenceId}
                  onValueChange={setReferenceId}
                  disabled={!category}
                >
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder={`Select ${category === "COURSE" ? "Course" : "Test Series"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {referenceItems.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground text-center">
                        No items found in this category
                      </div>
                    ) : (
                      referenceItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingId ? "Update Banner" : "Create Banner"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBannerManagement;
