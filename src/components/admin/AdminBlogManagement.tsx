import { useState, useEffect } from "react";
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
import ImageUploader from "@/components/ImageUploader";
import { Plus, Trash2, Pencil, Calendar, User } from "lucide-react";
import contentService from "@/services/contentService";
import { useToast } from "@/hooks/use-toast";

interface BlogFormState {
  id?: string;
  title: string;
  content: string;
  image: string;
  date: string;
  isActive: boolean;
}

const emptyBlogForm: BlogFormState = {
  title: "",
  content: "",
  image: "",
  date: new Date().toISOString().split('T')[0],
  isActive: true,
};

const AdminBlogManagement = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogFormState | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await contentService.getAdminBlogs(1, 100);
      if (res.success && res.data) {
        setBlogs(res.data);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openAdd = () => {
    setEditingBlog(emptyBlogForm);
    setBlogDialogOpen(true);
  };

  const openEdit = (blog: any) => {
    setEditingBlog({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      image: blog.image || blog.imageUrl || "",
      date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      isActive: blog.isActive !== undefined ? blog.isActive : true,
    });
    setBlogDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await contentService.deleteBlog(id);
      if (res.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        toast({ title: "Success", description: "Blog deleted successfully" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to delete blog", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!editingBlog) return;
    if (!editingBlog.title.trim() || !editingBlog.content.trim() || !editingBlog.image) {
      toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      if (editingBlog.id) {
        const response = await contentService.updateBlog(editingBlog.id, editingBlog as any);
        if (response.success && response.data) {
          setBlogs((prev) =>
            prev.map((b) => (b.id === editingBlog.id ? response.data as any : b))
          );
          toast({ title: "Success", description: "Blog updated successfully" });
        }
      } else {
        const response = await contentService.createBlog(editingBlog as any);
        if (response.success && response.data) {
          setBlogs((prev) => [response.data as any, ...prev]);
          toast({ title: "Success", description: "Blog created successfully" });
        }
      }
      setBlogDialogOpen(false);
      setEditingBlog(null);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save blog", variant: "destructive" });
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setEditingBlog(prev => prev ? { ...prev, image: imageUrl } : prev);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage educational blogs for your students.
          </p>
        </div>
        <Button size="sm" className="gap-1" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Blog
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">Loading blogs...</TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No blogs found. Create your first blog to get started.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <img
                        src={blog.image || blog.imageUrl || "https://placehold.co/400x250?text=No+Image"}
                        alt={blog.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[250px] truncate">
                      {blog.title}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {blog.author || "Admin"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(blog.date || blog.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                        blog.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {blog.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => openEdit(blog)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDelete(blog.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlog?.id ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
          </DialogHeader>

          {editingBlog && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="blog-title">Title</Label>
                <Input
                  id="blog-title"
                  placeholder="Enter blog title"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-date">Publish Date</Label>
                  <Input
                    id="blog-date"
                    type="date"
                    value={editingBlog.date}
                    onChange={(e) => setEditingBlog(prev => prev ? { ...prev, date: e.target.value } : null)}
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="blog-active"
                    className="rounded border-gray-300"
                    checked={editingBlog.isActive}
                    onChange={(e) => setEditingBlog(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                  />
                  <Label htmlFor="blog-active" className="cursor-pointer">Active / Published</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Blog Banner Image</Label>
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  currentImage={editingBlog.image}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog-content">Content</Label>
                <Textarea
                  id="blog-content"
                  placeholder="Write your blog content here..."
                  rows={12}
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog(prev => prev ? { ...prev, content: e.target.value } : null)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setBlogDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingBlog.id ? "Update Blog" : "Create Blog"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogManagement;