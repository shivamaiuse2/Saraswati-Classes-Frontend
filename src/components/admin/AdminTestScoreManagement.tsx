import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, X, Trophy, Edit2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import studentService from "@/services/studentService";
import testSeriesService from "@/services/testSeriesService";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudentSuggestion {
  id: string;
  name: string;
  email: string;
}

interface TestResult {
  id: string;
  studentId: string;
  testSeriesId: string | null;
  testName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  testDate: string;
  createdAt: string;
  student?: {
    id: string;
    name: string;
    phone?: string;
    user?: {
      email: string;
    };
  };
  testSeries?: {
    id: string;
    title: string;
  } | null;
}

const AdminTestScoreManagement = () => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<StudentSuggestion[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentSuggestion | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [testSeries, setTestSeries] = useState<any[]>([]);
  const [isLoadingSeries, setIsLoadingSeries] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Test results state
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Edit state
  const [editingResult, setEditingResult] = useState<TestResult | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    testName: "",
    marksObtained: "",
    totalMarks: "",
    testDate: "",
    testSeriesId: "",
  });

  const [formData, setFormData] = useState({
    testSeriesId: "",
    testName: "",
    marksObtained: "",
    totalMarks: "100",
    testDate: new Date().toISOString().split('T')[0],
  });

  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load test series
  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoadingSeries(true);
      try {
        const res = await testSeriesService.getAdminTestSeries(1, 100);
        if (res.success && res.data) {
          setTestSeries(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingSeries(false);
      }
    };
    fetchSeries();
  }, []);

  // Load test results
  const loadTestResults = async () => {
    setIsLoadingResults(true);
    try {
      const res = await testSeriesService.getAllTestResults(1, 100);
      if (res.success && res.data) {
        setTestResults(res.data);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to load test results",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResults(false);
    }
  };

  useEffect(() => {
    loadTestResults();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length >= 2 && !selectedStudent) {
        setIsSearching(true);
        try {
          const res = await studentService.searchStudents(searchQuery);
          if (res.success && res.data) {
            setSuggestions(res.data);
            setShowSuggestions(true);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedStudent]);

  const handleSelectStudent = (s: StudentSuggestion) => {
    setSelectedStudent(s);
    setSearchQuery(s.name);
    setShowSuggestions(false);
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !formData.testName || !formData.marksObtained || !formData.totalMarks) {
      toast({
        title: "Missing Info",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        studentId: selectedStudent.id,
        testSeriesId: formData.testSeriesId || null,
        testName: formData.testName,
        marksObtained: parseInt(formData.marksObtained),
        totalMarks: parseInt(formData.totalMarks),
        testDate: formData.testDate
      };

      const res = await testSeriesService.recordTestResult(payload);
      if (res.success) {
        toast({
          title: "Success",
          description: "Test result recorded successfully"
        });
        setFormData({
          testSeriesId: "",
          testName: "",
          marksObtained: "",
          totalMarks: "100",
          testDate: new Date().toISOString().split('T')[0],
        });
        handleClearStudent();
        setIsAdding(false);
        loadTestResults();
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to record test result",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (result: TestResult) => {
    setEditingResult(result);
    setEditFormData({
      testName: result.testName,
      marksObtained: result.marksObtained.toString(),
      totalMarks: result.totalMarks.toString(),
      testDate: new Date(result.testDate).toISOString().split('T')[0],
      testSeriesId: result.testSeriesId || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;

    setIsSaving(true);
    try {
      const res = await testSeriesService.updateTestResult(editingResult.id, {
        testName: editFormData.testName,
        marksObtained: parseInt(editFormData.marksObtained),
        totalMarks: parseInt(editFormData.totalMarks),
        testDate: editFormData.testDate,
        testSeriesId: editFormData.testSeriesId || null,
      });

      if (res.success) {
        toast({
          title: "Success",
          description: "Test result updated successfully"
        });
        setIsEditDialogOpen(false);
        setEditingResult(null);
        loadTestResults();
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to update test result",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test result?")) return;
    
    setIsDeleting(id);
    try {
      const res = await testSeriesService.deleteTestResult(id);
      if (res.success) {
        toast({
          title: "Success",
          description: "Test result deleted successfully"
        });
        setTestResults(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to delete test result",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-700';
      case 'A': return 'bg-blue-100 text-blue-700';
      case 'B': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Individual Test Scores</h2>
          <p className="text-sm text-muted-foreground">Upload and manage marks for students.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"}>
          {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {isAdding ? "Close Form" : "Add Student Score"}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Record New Test Score
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* STUDENT SEARCH */}
                <div className="space-y-2 relative" ref={suggestionsRef}>
                  <Label>Search Student <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input 
                      placeholder="Type student name..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      disabled={!!selectedStudent}
                      className={selectedStudent ? "bg-primary/5 border-primary/30 font-medium" : ""}
                    />
                    {isSearching && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
                    {selectedStudent && (
                      <X className="absolute right-3 top-2.5 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" onClick={handleClearStudent} />
                    )}
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-xl max-h-48 overflow-auto">
                      {suggestions.map(s => (
                        <div 
                          key={s.id} 
                          className="px-4 py-2 hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleSelectStudent(s)}
                        >
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* TEST SERIES SELECT */}
                <div className="space-y-2">
                  <Label>Test Series (Optional)</Label>
                  <Select 
                    value={formData.testSeriesId} 
                    onValueChange={v => setFormData(p => ({ ...p, testSeriesId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="General Test (No Series)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None / General</SelectItem>
                      {testSeries.map(ts => (
                        <SelectItem key={ts.id} value={ts.id}>{ts.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* TEST NAME */}
                <div className="space-y-2">
                  <Label>Test Name <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="e.g. Unit Test 1" 
                    value={formData.testName}
                    onChange={e => setFormData(p => ({ ...p, testName: e.target.value }))}
                  />
                </div>

                {/* TEST DATE */}
                <div className="space-y-2">
                  <Label>Test Date</Label>
                  <Input 
                    type="date" 
                    value={formData.testDate}
                    onChange={e => setFormData(p => ({ ...p, testDate: e.target.value }))}
                  />
                </div>

                {/* SCORES */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Marks Obtained <span className="text-destructive">*</span></Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={formData.marksObtained}
                      onChange={e => setFormData(p => ({ ...p, marksObtained: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Marks <span className="text-destructive">*</span></Label>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      value={formData.totalMarks}
                      onChange={e => setFormData(p => ({ ...p, totalMarks: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving || !selectedStudent}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trophy className="w-4 h-4 mr-2" />}
                  Record Score
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Test Results List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recorded Test Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingResults ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-8 rounded" />
                    </div>
                    <Skeleton className="h-3 w-24" />
                    <div className="flex items-center gap-4 mt-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded" />
                    <Skeleton className="h-9 w-9 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : testResults.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No test scores recorded yet.</p>
              <p className="text-sm">Click "Add Student Score" to record the first result.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{result.testName}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{result.student?.name || 'Unknown Student'}</span>
                      {result.testSeries && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                          {result.testSeries.title}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="font-medium text-primary">
                        {result.marksObtained}/{result.totalMarks} ({result.percentage.toFixed(1)}%)
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(result.testDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(result)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(result.id)}
                      disabled={isDeleting === result.id}
                    >
                      {isDeleting === result.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Test Result</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateResult} className="space-y-4">
            <div className="space-y-2">
              <Label>Test Name</Label>
              <Input 
                value={editFormData.testName}
                onChange={e => setEditFormData(p => ({ ...p, testName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Test Series</Label>
              <Select 
                value={editFormData.testSeriesId} 
                onValueChange={v => setEditFormData(p => ({ ...p, testSeriesId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None / General" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None / General</SelectItem>
                  {testSeries.map(ts => (
                    <SelectItem key={ts.id} value={ts.id}>{ts.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marks Obtained</Label>
                <Input 
                  type="number"
                  value={editFormData.marksObtained}
                  onChange={e => setEditFormData(p => ({ ...p, marksObtained: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input 
                  type="number"
                  value={editFormData.totalMarks}
                  onChange={e => setEditFormData(p => ({ ...p, totalMarks: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Test Date</Label>
              <Input 
                type="date"
                value={editFormData.testDate}
                onChange={e => setEditFormData(p => ({ ...p, testDate: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestScoreManagement;
