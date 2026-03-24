import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUploader from "@/components/ImageUploader";
import { Plus, Trash2, Loader2, Search, X, Pencil } from "lucide-react";
import contentService from "@/services/contentService";
import studentService from "@/services/studentService";
import { useToast } from "@/hooks/use-toast";

interface StudentSuggestion {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ResultData {
  id?: string;
  name: string;
  marks: string;
  exam: string;
  image: string;
  studentId: string;
}

const AdminResultManagement = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResultData>({
    name: "",
    marks: "",
    exam: "",
    image: "",
    studentId: "",
  });

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<StudentSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const res = await contentService.getAdminResults();
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (e) {
      console.error("Failed to load results", e);
      toast({
        title: "Error",
        description: "Failed to load results",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  // Debounced search for students
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.name.length >= 1) {
        setIsSearching(true);
        try {
          const response = await studentService.searchStudents(formData.name);
          if (response.success && response.data) {
            setSuggestions(response.data);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error searching students:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData.name]);

  const handleSelectStudent = (student: StudentSuggestion) => {
    setFormData(prev => ({
      ...prev,
      name: student.name,
      studentId: student.id,
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.marks || !formData.exam || !formData.image) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && editingId) {
        // Update existing result
        const response = await contentService.updateResult(editingId, {
          name: formData.name,
          marks: formData.marks,
          exam: formData.exam,
          image: formData.image,
          studentId: formData.studentId || undefined,
        });
        
        if (response.success) {
          toast({
            title: "Success",
            description: "Result updated successfully",
          });
          setResults(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } : r));
          setIsEditing(false);
          setEditingId(null);
        }
      } else {
        // Create new result
        const response = await contentService.createResult({
          name: formData.name,
          marks: formData.marks,
          exam: formData.exam,
          image: formData.image,
          studentId: formData.studentId || undefined,
        });

        if (response.success && response.data) {
          toast({
            title: "Success",
            description: "Result added successfully",
          });
          setResults(prev => [response.data as any, ...prev]);
        }
      }
      
      resetForm();
    } catch (error) {
      console.error("Failed to save result", error);
      toast({
        title: "Error",
        description: isEditing ? "Failed to update result" : "Failed to add result",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (result: any) => {
    setFormData({
      name: result.name,
      marks: result.marks,
      exam: result.exam,
      image: result.image,
      studentId: result.studentId || "",
    });
    setEditingId(result.id);
    setIsEditing(true);
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      marks: "",
      exam: "",
      image: "",
      studentId: "",
    });
    setIsAdding(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await contentService.deleteResult(id);
      if (res.success) {
        setResults(prev => prev.filter(r => r.id !== id));
        toast({
          title: "Success",
          description: "Result deleted successfully",
        });
      }
    } catch (e) {
      console.error("Failed to delete result", e);
      toast({
        title: "Error",
        description: "Failed to delete result",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Shimmer card component
  const ShimmerResultCard = () => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-9 w-9 rounded" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Result Management</h2>
        {!isAdding && !isEditing && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Result
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{isEditing ? "Edit Result" : "Add New Result"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Name with Autocomplete */}
              <div className="relative" ref={suggestionsRef}>
                <Label htmlFor="name">Student Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    ref={inputRef}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Type to search students..."
                    required
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Autocomplete Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleSelectStudent(student)}
                      >
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {formData.studentId && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <span className="bg-green-100 px-2 py-1 rounded">
                    Linked to student account
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setFormData(prev => ({ ...prev, studentId: "" }))}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exam">Exam</Label>
                  <Input
                    id="exam"
                    value={formData.exam}
                    onChange={(e) => setFormData(prev => ({ ...prev, exam: e.target.value }))}
                    placeholder="e.g., SSC Board 2024"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="marks">Marks/Percentage</Label>
                  <Input
                    id="marks"
                    value={formData.marks}
                    onChange={(e) => setFormData(prev => ({ ...prev, marks: e.target.value }))}
                    placeholder="e.g., 95% or 475/500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Student Image</Label>
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  currentImage={formData.image}
                  folder="results"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving || !formData.image}>
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isEditing ? "Updating..." : "Adding..."}</>
                  ) : (
                    isEditing ? "Update Result" : "Add Result"
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

      {/* Results List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ShimmerResultCard key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No results added yet. Click "Add Result" to add one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {results.map((result) => (
            <Card key={result.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{result.name}</h3>
                      {result.studentId && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Linked to Student</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{result.exam}</p>
                    <p className="text-sm font-medium text-blue-600">{result.marks}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(result)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(result.id)}
                      disabled={isDeleting === result.id}
                    >
                      {isDeleting === result.id ? (
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

export default AdminResultManagement;
