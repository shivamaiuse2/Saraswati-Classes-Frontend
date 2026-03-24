import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import ImageUploader from "@/components/ImageUploader";
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
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    bannerService.getAdminBanners().then((res) => {
      if (res.success && res.data) {
        setBanners(res.data.map((h: any) => ({
          id: h.id,
          image: h.imageUrl || h.image,
          linkedTestSeriesId: h.testSeriesId || h.linkedTestSeriesId,
        })));
      }
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const handleImageSelect = (imageUrl: string) => {
    setImage(imageUrl);
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
    setDialogOpen(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setImage("");
    setLinkedTestSeriesId("");
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setImage(banner.image);
    setLinkedTestSeriesId(banner.linkedTestSeriesId);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground text-sm">
            Configure homepage promotional banners and link them to specific test
            series. Upload images directly or paste a URL.
          </p>
        </div>
        <Button size="sm" className="gap-1" onClick={openAdd}>
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
              {isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-10 w-20 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-7 w-7 rounded" />
                          <Skeleton className="h-7 w-7 rounded" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : banners.map((banner) => {
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
                        onClick={() => openEdit(banner)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7"
                        onClick={async () => {
                          setDeletingId(banner.id);
                          try {
                            const res = await bannerService.deleteBanner(banner.id);
                            if (res.success) {
                              setBanners((prev) => prev.filter((b) => b.id !== banner.id));
                            }
                          } catch (e) {
                            console.error(e);
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        disabled={deletingId === banner.id}
                      >
                        {deletingId === banner.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!isLoading && banners.length === 0 && (
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
              {/* Image Uploader */}
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  currentImage={image}
                  folder="banners"
                />
              </div>

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
                <Button size="sm" onClick={handleSave} disabled={!image}>
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
