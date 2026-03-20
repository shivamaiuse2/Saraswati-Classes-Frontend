import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Upload } from "lucide-react";
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
import type { Banner } from "@/types/banner";
import bannerService from "@/services/bannerService";
import { useApp } from "@/context/AppContext";

const AdminBannerManagement = () => {
  const { testSeries } = useApp();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [linkedTestSeriesId, setLinkedTestSeriesId] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    bannerService.getAdminBanners().then((res) => {
      if (res.success && res.data) {
        setBanners(res.data.map((h: any) => ({
          id: h.id,
          image: h.imageUrl || h.image,
          linkedTestSeriesId: h.testSeriesId || h.linkedTestSeriesId,
        })));
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    // Update preview when image URL changes
    if (image && image.startsWith("http")) {
      setImagePreview(image);
    }
  }, [image]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSave = async () => {
    if (!image) return;
    try {
      const payload: any = { imageUrl: image, enabled: true };
      if (linkedTestSeriesId) {
        payload.testSeriesId = linkedTestSeriesId;
      }
      
      if (editingId) {
        const response = await bannerService.updateBanner(editingId, payload);
        if (response.success && response.data) {
          const updated = response.data as any;
          setBanners((prev) =>
            prev.map((b) => (b.id === editingId ? { id: updated.id, image: updated.imageUrl || updated.image, linkedTestSeriesId: updated.testSeriesId || updated.linkedTestSeriesId || '' } : b))
          );
        }
      } else {
        const response = await bannerService.createBanner(payload);
        if (response.success && response.data) {
          const created = response.data as any;
          setBanners((prev) => [...prev, { id: created.id, image: created.imageUrl || created.image, linkedTestSeriesId: created.testSeriesId || created.linkedTestSeriesId || '' }]);
        }
      }
    } catch (err) { console.error(err); }

    setEditingId(null);
    setImage("");
    setLinkedTestSeriesId("");
    setImagePreview("");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground text-sm">
            Configure homepage promotional banners and link them to specific test
            series. These are stored locally and can be wired to backend APIs later.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1"
          onClick={() => {
            setEditingId(null);
            setImage("");
            setLinkedTestSeriesId("");
            setImagePreview("");
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Linked Test Series</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => {
                const ts = testSeries.find((t) => t.id === banner.linkedTestSeriesId);
                return (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={banner.image}
                          alt="Banner"
                          className="h-10 w-20 rounded-md object-cover border"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {ts ? ts.title : "Unknown test series"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => {
                          setEditingId(banner.id);
                          setImage(banner.image);
                          setImagePreview(banner.image);
                          setLinkedTestSeriesId(banner.linkedTestSeriesId);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7"
                        onClick={async () => {
                          try {
                            const res = await bannerService.deleteBanner(banner.id);
                            if (res.success) {
                              setBanners((prev) => prev.filter((b) => b.id !== banner.id));
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {banners.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-6 text-center text-xs text-muted-foreground"
                  >
                    No banners configured yet. Use &quot;Add Banner&quot; to create
                    one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {editingId ? "Edit Banner" : "Add Banner"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="space-y-4 mt-2 overflow-y-auto pr-3">
              <div className="space-y-1">
                <Label htmlFor="banner-image">Banner Image URL</Label>
                <Input
                  id="banner-image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Or Upload Image</Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                      ? "border-primary bg-primary/5"
                      : "border-input hover:border-primary/50"
                    }`}
                >
                  <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="file-input"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-xs">
                      <p className="font-medium">
                        Drag and drop your image here
                      </p>
                      <p className="text-muted-foreground">
                        or click to select from device
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {imagePreview && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="border rounded-lg overflow-hidden bg-muted/30 p-2">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="banner-series">Link to Test Series</Label>
                <select
                  id="banner-series"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={linkedTestSeriesId}
                  onChange={(e) => setLinkedTestSeriesId(e.target.value)}
                >
                  <option value="">Select test series</option>
                  {testSeries.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
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
                  {editingId ? "Save" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBannerManagement;

