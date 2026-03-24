import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
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
import ImageUploader from "@/components/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import contentService from "@/services/contentService";

interface GalleryRow {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
}

const AdminGalleryManagement = () => {
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await contentService.getAdminGalleryItems(1, 100);
        if (response.success) {
          setRows(response.data.map(item => ({
            id: item.id,
            category: item.category,
            title: item.title,
            imageUrl: item.image
          })));
        } else {
          throw new Error(response.message || "Failed to load gallery items");
        }
      } catch (error: any) {
        console.error("Error loading gallery items:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load gallery items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const openAdd = () => {
    setEditing({
      id: "",
      category: "",
      title: "",
      imageUrl: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (row: GalleryRow) => {
    setEditing(row);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await contentService.deleteGalleryItem(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting gallery item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete gallery item",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setEditing((prev) => (prev ? { ...prev, imageUrl } : null));
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editing.id) {
        const response = await contentService.updateGalleryItem(editing.id, {
          title: editing.title,
          image: editing.imageUrl,
          category: editing.category,
        });
        
        if (response.success) {
          setRows(prev => prev.map(r => r.id === editing.id ? {
            id: response.data.id,
            title: response.data.title,
            category: response.data.category,
            imageUrl: response.data.image
          } : r));
          toast({
            title: "Success",
            description: "Gallery item updated successfully",
          });
        } else {
          throw new Error(response.message || "Failed to update gallery item");
        }
      } else {
        const response = await contentService.createGalleryItem({
          title: editing.title,
          image: editing.imageUrl,
          category: editing.category,
        });
        
        if (response.success) {
          setRows(prev => [...prev, {
            id: response.data.id,
            title: response.data.title,
            category: response.data.category,
            imageUrl: response.data.image
          }]);
          toast({
            title: "Success",
            description: "Gallery item created successfully",
          });
        } else {
          throw new Error(response.message || "Failed to create gallery item");
        }
      }
      
      setDialogOpen(false);
      setEditing(null);
    } catch (error: any) {
      console.error("Error saving gallery item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save gallery item",
        variant: "destructive",
      });
    }
  };

  const shortUrl = (url: string) =>
    url.length > 40 ? `${url.slice(0, 37)}...` : url;

  // Shimmer row component
  const TableShimmerRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-3 w-40" /></TableCell>
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
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">
            Gallery Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage images for Classroom Photos, Topper Achievements and Events.
            Upload images directly or paste a URL.
          </p>
        </div>
        <Button size="sm" className="gap-1" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Image URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableShimmerRow key={i} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>
                      <img 
                        src={row.imageUrl} 
                        alt={row.title}
                        className="h-10 w-16 rounded object-cover border"
                      />
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
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-xs text-muted-foreground"
                    >
                      No gallery items yet. Use &quot;Add Image&quot; to create
                      new entries.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {editing?.id ? "Edit Gallery Item" : "Add Gallery Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2 overflow-y-auto pr-3">
            <div className="space-y-1">
              <Label htmlFor="gallery-title-input">Title</Label>
              <Input
                id="gallery-title-input"
                value={editing?.title || ""}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, title: e.target.value } : null))
                }
                placeholder="Enter title for the gallery item"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gallery-category-input">Category</Label>
              <Input
                id="gallery-category-input"
                value={editing?.category || ""}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, category: e.target.value } : null))
                }
                placeholder="Enter category (e.g. Classroom Photos)"
              />
            </div>
            
            {/* Image Uploader */}
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUploader
                onImageSelect={handleImageSelect}
                currentImage={editing?.imageUrl || ""}
                folder="gallery"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDialogOpen(false);
                setEditing(null);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!editing?.imageUrl}>
              {editing?.id ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGalleryManagement;
