import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/ImageUploader";
import { Plus, Trash2, Loader2, Search, X } from "lucide-react";
import contentService from "@/services/contentService";
import studentService from "@/services/studentService";
import { useToast } from "@/hooks/use-toast";

interface StudentSuggestion {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const AdminResultManagement = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    marks: "",
    exam: "",
    image: "",
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
          const res = await studentService.searchStudents(formData.name);
          if (res.success && res.data) {
            setSuggestions(res.data);
            setShowSuggestions(true);
          }
        } catch (e) {
          console.error('Failed to search students', e);
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

  const handleSelectSuggestion = (suggestion: StudentSuggestion) => {
    setFormData(prev => ({ ...prev, name: suggestion.name }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.marks && formData.exam && formData.image) {
      setIsSaving(true);
      try {
        const payload = {
          name: formData.name,
          exam: formData.exam,
          marks: formData.marks,
          image: formData.image,
        };
        const response = await contentService.createResult(payload);
        if (response.success && response.data) {
          setResults(prev => [response.data as any, ...prev]);
          toast({
            title: "Success",
            description: "Result added successfully",
          });
        } else {
          loadResults();
        }
      } catch (e) {
        console.error("Failed to add result", e);
        toast({
          title: "Error",
          description: "Failed to add result",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
      setFormData({ name: "", marks: "", exam: "", image: "" });
      setIsAdding(false);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Result Management</h2>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Result
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Result</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                      className="pr-8"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                    {formData.name && !isSearching && (
                      <X
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600"
                        onClick={() => setFormData(prev => ({ ...prev, name: "" }))}
                      />
                    )}
                  </div>
                  
                  {/* Autocomplete suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <Search className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-xs text-gray-500">{suggestion.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* No results message */}
                  {showSuggestions && formData.name.length >= 2 && suggestions.length === 0 && !isSearching && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500 text-sm">
                      No students found. You can enter a custom name.
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="exam">Exam Name</Label>
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
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</>
                  ) : (
                    "Add Result"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Results List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
                    <h3 className="font-semibold">{result.name}</h3>
                    <p className="text-sm text-muted-foreground">{result.exam}</p>
                    <p className="text-sm font-medium text-blue-600">{result.marks}</p>
                  </div>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminResultManagement;