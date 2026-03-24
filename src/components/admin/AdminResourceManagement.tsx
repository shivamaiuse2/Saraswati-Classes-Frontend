import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Loader2, Pencil, X } from "lucide-react";
import contentService from "@/services/contentService";
import { useToast } from "@/hooks/use-toast";

interface ResourceData {
  id?: string;
  title: string;
  description: string;
  price: string;
}

const AdminResourceManagement = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResourceData>({
    title: "",
    description: "",
    price: "",
  });

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const res = await contentService.getAdminResources();
      if (res.success && res.data) {
        setResources(res.data);
      }
    } catch (e) { 
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.price) {
      setIsSaving(true);
      try {
        const payload = {
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price.replace(/\D/g, ''), 10) || 0,
          type: "PDF",
          fileUrl: "",
        };

        if (isEditing && editingId) {
          // Update existing resource
          const res = await contentService.updateResource(editingId, payload as any);
          if (res.success && res.data) {
            toast({
              title: "Success",
              description: "Resource updated successfully",
            });
            setResources(prev => prev.map(r => r.id === editingId ? res.data : r));
          }
        } else {
          // Create new resource
          const res = await contentService.createResource(payload as any);
          if (res.success && res.data) {
            toast({
              title: "Success",
              description: "Resource created successfully",
            });
            setResources(prev => [res.data as any, ...prev]);
          } else {
            loadResources();
          }
        }
      } catch (e) { 
        console.error(e);
        toast({
          title: "Error",
          description: isEditing ? "Failed to update resource" : "Failed to create resource",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }

      resetForm();
    }
  };

  const handleEdit = (resource: any) => {
    setFormData({
      title: resource.title,
      description: resource.description,
      price: resource.price?.toString() || "",
    });
    setEditingId(resource.id);
    setIsEditing(true);
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "" });
    setIsAdding(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await contentService.deleteResource(id);
      if (res.success) {
        toast({
          title: "Success",
          description: "Resource deleted successfully",
        });
        setResources(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) { 
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    }
    finally { setDeletingId(null); }
  };

  // Shimmer card component
  const ShimmerCard = () => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-4 w-16 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-9 w-9 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Resource Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage study materials and resources for students.
          </p>
        </div>
        {!isAdding && !isEditing && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{isEditing ? "Edit Resource" : "Add New Resource"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resource-title">Title</Label>
                <Input
                  id="resource-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter resource title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-description">Description</Label>
                <Textarea
                  id="resource-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter resource description"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-price">Price (₹)</Label>
                <Input
                  id="resource-price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price (0 for free)"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isEditing ? "Updating..." : "Adding..."}</>
                  ) : (
                    isEditing ? "Update Resource" : "Add Resource"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Resources List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No resources added yet. Click "Add Resource" to add one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <p className="text-sm font-medium text-green-600 mt-1">
                      {resource.price > 0 ? `₹${resource.price}` : 'Free'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(resource)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(resource.id)}
                      disabled={deletingId === resource.id}
                    >
                      {deletingId === resource.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminResourceManagement;
