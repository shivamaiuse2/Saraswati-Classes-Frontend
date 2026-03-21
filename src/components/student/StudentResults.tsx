import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const StudentResults = () => {
  const { currentStudent, loading } = useAuth();
  const results = currentStudent?.testResults || [];
  const isLoading = loading;

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
      ) : results.length === 0 ? (
        <Card className="bg-amber-50/50 border-amber-200">
          <CardContent className="p-5 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-700">No results available yet. Results appear here after they are uploaded by the admin.</p>
          </CardContent>
        </Card>
      ) : (
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
                  {(results.reduce((acc: number, r: any) => acc + r.percentage, 0) / results.length).toFixed(1)}%
                </span>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="font-semibold text-sm mb-3">Recent Results</p>
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
                  {results.map((r: any) => (
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
    </div>
  );
};

export default StudentResults;

