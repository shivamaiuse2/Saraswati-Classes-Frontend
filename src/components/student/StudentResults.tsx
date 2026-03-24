import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart2, ShieldAlert, Trophy, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import studentService from "@/services/studentService";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  name: string;
  marks: string;
  exam: string;
  image: string;
  createdAt: string;
}

const StudentResults = () => {
  const { currentStudent, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  
  const testResults = currentStudent?.testResults || [];

  // Fetch achievements added by admin
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setIsLoadingAchievements(true);
        const res = await studentService.getStudentAchievements();
        if (res.success && res.data) {
          setAchievements(res.data);
        }
      } catch (error) {
        console.error("Failed to load achievements:", error);
        toast({
          title: "Error",
          description: "Failed to load achievements",
          variant: "destructive",
        });
      } finally {
        setIsLoadingAchievements(false);
      }
    };

    loadAchievements();
  }, [toast]);

  const isLoading = authLoading || isLoadingAchievements;
  const hasTestResults = testResults.length > 0;
  const hasAchievements = achievements.length > 0;
  const hasAnyData = hasTestResults || hasAchievements;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold mb-1">Results</h1>
        <p className="text-sm text-muted-foreground">
          Track your performance across tests and exams.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardContent className="p-8">
              <div className="h-4 w-32 bg-muted rounded mb-4" />
              <div className="h-6 w-full bg-muted rounded" />
            </CardContent>
          </Card>
        </div>
      ) : !hasAnyData ? (
        <Card className="bg-amber-50/50 border-amber-200">
          <CardContent className="p-5 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-700">No results available yet. Results appear here after they are uploaded by the admin.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Test Results Section */}
          {hasTestResults && (
            <>
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-sm">Performance Analysis</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your average percentage across all tests is{" "}
                    <span className="font-medium text-foreground">
                      {(testResults.reduce((acc: number, r: any) => acc + r.percentage, 0) / testResults.length).toFixed(1)}%
                    </span>
                    .
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <p className="font-semibold text-sm mb-3">Recent Test Results</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Percent</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((r: any) => (
                        <TableRow key={r.id}>
                          <TableCell className="text-xs font-medium">{r.testName}</TableCell>
                          <TableCell className="text-xs">
                            {r.testDate ? new Date(r.testDate).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell className="text-xs">
                            {r.marksObtained} / {r.totalMarks}
                          </TableCell>
                          <TableCell className="text-xs font-semibold">{r.percentage}%</TableCell>
                          <TableCell className="text-xs">
                            <span className="px-2 py-1 rounded bg-muted font-bold text-[10px]">
                              {r.grade || (r.percentage >= 90 ? 'A+' : r.percentage >= 80 ? 'A' : r.percentage >= 70 ? 'B' : 'C')}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Achievements Section (Added by Admin) */}
          {hasAchievements && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <p className="font-semibold text-sm">My Achievements</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        {achievement.image ? (
                          <img
                            src={achievement.image}
                            alt={achievement.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm">{achievement.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.exam}</p>
                        <p className="text-sm font-medium text-blue-600 mt-2">{achievement.marks}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(achievement.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default StudentResults;
