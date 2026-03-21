import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, Search, X, Trophy, Calendar } from "lucide-react";
import studentService from "@/services/studentService";
import testSeriesService from "@/services/testSeriesService";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentSuggestion {
  id: string;
  name: string;
  email: string;
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

  const [formData, setFormData] = useState({
    testSeriesId: "",
    testName: "",
    marksObtained: "",
    totalMarks: "100",
    testDate: new Date().toISOString().split('T')[0],
  });

  const suggestionsRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Individual Test Scores</h2>
          <p className="text-sm text-muted-foreground">Upload and manage marks for students in enrolled test series.</p>
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
                  <div className="relative">
                    <Input 
                      type="date" 
                      value={formData.testDate}
                      onChange={e => setFormData(p => ({ ...p, testDate: e.target.value }))}
                    />
                  </div>
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

      {/* QUICK STATS / INFO */}
      {!isAdding && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div className="max-w-md">
              <h3 className="font-semibold text-lg">Student Performance Tracking</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Use the form above to enter marks for any student. These scores will appear in the "Results" section of the student's dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTestScoreManagement;
