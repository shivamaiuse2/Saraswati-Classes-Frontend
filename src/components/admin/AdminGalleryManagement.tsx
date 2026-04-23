import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import galleryService, { GalleryItem } from "@/services/galleryService";

const AdminGalleryManagement = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const res = await galleryService.getAllGalleryItems();
      if (res.success) {
        setItems(res.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch gallery items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditItem(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setSelectedFile(null);
    setPreviewUrl(item.imageUrl);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Image file is required for new gallery items",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      if (title.trim()) formData.append("title", title);
      if (description.trim()) formData.append("description", description);
      if (selectedFile) formData.append("image", selectedFile);

      if (editItem) {
        await galleryService.updateGalleryItem(editItem.id, formData);
        toast({ title: "Success", description: "Gallery item updated successfully" });
      } else {
        await galleryService.createGalleryItem(formData);
        toast({ title: "Success", description: "Gallery item added successfully" });
      }
      setIsModalOpen(false);
      fetchGalleryItems();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await galleryService.deleteGalleryItem(id);
      toast({ title: "Success", description: "Item deleted successfully" });
      fetchGalleryItems();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gallery Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage high quality images for the gallery page.</p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-dashed">
          <ImageIcon className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
          <p className="text-muted-foreground">No gallery items found.</p>
          <Button variant="outline" className="mt-4" onClick={openAddModal}>Upload First Image</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <CardContent className="p-0 relative aspect-video">
                <img 
                  src={item.imageUrl} 
                  alt={item.title || "Gallery image"} 
                  className="w-full h-full object-contain transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => openEditModal(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    {item.title && <p className="text-white font-medium line-clamp-1">{item.title}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Gallery Item" : "Upload New Image"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 relative">
              <Label>Image (Original Quality) {editItem ? "(Optional to keep existing)" : "*"}</Label>
              <div 
                className={`border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center overflow-hidden relative cursor-pointer ${previewUrl ? 'border-primary' : 'border-muted-foreground/30 hover:border-primary/50 transition-colors'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain bg-black/5" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-medium flex items-center gap-2"><Plus className="h-4 w-4"/> Change Image</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                    <ImageIcon className="h-8 w-8 opacity-50" />
                    <p className="text-sm font-medium">Click to select image</p>
                    <p className="text-xs opacity-70">JPG, PNG, WEBP allowed (High Quality)</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input 
                id="title" 
                placeholder="E.g., Batch 2024 Farewell" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="A memorable day with all the students..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter className="pt-4 mt-2 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={uploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (editItem ? "Updating..." : "Uploading...") : (editItem ? "Update Image" : "Upload Image")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGalleryManagement;
