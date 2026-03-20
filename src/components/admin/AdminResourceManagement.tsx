import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import contentService from "@/services/contentService";

const AdminResourceManagement = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const loadResources = async () => {
    try {
      const res = await contentService.getAdminResources();
      if (res.success && res.data) {
        setResources(res.data);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.price) {
      try {
        const payload = {
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price.replace(/\D/g, ''), 10) || 0,
          type: "PDF",
          fileUrl: "",
        };
        const res = await contentService.createResource(payload as any);
        if (res.success && res.data) {
          setResources(prev => [res.data as any, ...prev]);
        } else {
          loadResources();
        }
      } catch (e) { console.error(e); }

      setFormData({ title: "", description: "", price: "" });
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await contentService.deleteResource(id);
      if (res.success) {
        setResources(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Resource Management</h2>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Resource Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., ₹199 (use 0 for free)"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Resource</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                <Button variant="outline" size="sm" onClick={() => handleDelete(resource.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminResourceManagement;