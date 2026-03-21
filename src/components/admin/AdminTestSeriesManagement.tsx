import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Loader2, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import testSeriesService from "@/services/testSeriesService";

interface SeriesFormState {
  id?: string;
  title: string;
  overview: string;
  features: string;
  testPattern: string;
  benefits: string;
  image: string;
  demoTestLink: string;
  testsCount: string;
  mode: string;
  price: string;
}

const emptySeriesForm: SeriesFormState = {
  title: "",
  overview: "",
  features: "Detailed Analysis,Mock Tests",
  testPattern: "Standard Objective Pattern",
  benefits: "Improve Speed,Boost Confidence",
  image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=500&q=60",
  demoTestLink: "",
  testsCount: "10",
  mode: "ONLINE",
  price: "1000",
};

const AdminTestSeriesManagement = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [seriesDialogOpen, setSeriesDialogOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<SeriesFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [manageTestsOpen, setManageTestsOpen] = useState(false);
  const [selectedSeriesForTests, setSelectedSeriesForTests] = useState<any | null>(null);
  const [seriesTests, setSeriesTests] = useState<any[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [newTest, setNewTest] = useState({ testNumber: "", title: "", description: "", testLink: "" });

  useEffect(() => {
    const fetchTestSeries = async () => {
      setIsLoading(true);
      try {
        const res = await testSeriesService.getAdminTestSeries(1, 100);
        if (res.success && res.data) {
          setSeries(res.data as any);
        }
      } catch (error) {
        console.error('Error fetching test series:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestSeries();
  }, []);

  const openAdd = () => {
    setEditingSeries(emptySeriesForm);
    setSeriesDialogOpen(true);
  };

  const openEdit = (ts: any) => {
    setEditingSeries({
      id: ts.id,
      title: ts.title,
      overview: ts.overview || "",
      features: Array.isArray(ts.features) ? ts.features.join(", ") : "",
      testPattern: ts.testPattern || "",
      benefits: Array.isArray(ts.benefits) ? ts.benefits.join(", ") : "",
      image: ts.image || "",
      demoTestLink: ts.demoTestLink || "",
      testsCount: ts.testsCount?.toString() || "0",
      mode: ts.mode || "ONLINE",
      price: ts.price?.toString() || "0",
    });
    setSeriesDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await testSeriesService.deleteTestSeries(id);
      if (res.success) {
        setSeries((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) { console.error(e); }
    setIsDeleting(null);
  };

  const handleSave = async () => {
    if (!editingSeries) return;
    if (!editingSeries.title.trim()) return;

    setIsSaving(true);

    const base = {
      title: editingSeries.title,
      overview: editingSeries.overview || 'Default Overview',
      features: editingSeries.features.split(',').map(s => s.trim()).filter(Boolean),
      testPattern: editingSeries.testPattern,
      benefits: editingSeries.benefits.split(',').map(s => s.trim()).filter(Boolean),
      image: editingSeries.image,
      ctaLabel: "Enroll Now",
      demoTestLink: editingSeries.demoTestLink,
      heroPosterThumbnail: editingSeries.image,
      showInHeroPoster: false,
      testsCount: parseInt(editingSeries.testsCount) || 1,
      mode: editingSeries.mode,
      price: editingSeries.price,
    };

    try {
      if (editingSeries.id) {
        const response = await testSeriesService.updateTestSeries(editingSeries.id, base as any);
        if (response.success && response.data) {
          setSeries((prev) =>
            prev.map((s) => (s.id === editingSeries.id ? response.data as any : s))
          );
        }
      } else {
        const response = await testSeriesService.createTestSeries(base as any);
        if (response.success && response.data) {
          setSeries((prev) => [response.data as any, ...prev]);
        }
      }
    } catch (err) { console.error(err); } finally {
      setIsSaving(false);
    }

    setSeriesDialogOpen(false);
    setEditingSeries(null);
  };

  const openManageTests = async (ts: any) => {
    setSelectedSeriesForTests(ts);
    setManageTestsOpen(true);
    setIsLoadingTests(true);
    try {
      const resp = await testSeriesService.getTestSeriesById(ts.id);
      if (resp.success && resp.data) {
        setSeriesTests(resp.data.tests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTests(false);
    }
  };

  const currentTestsCount = seriesTests.length;
  // Use as total count target
  const targetTestsCount = selectedSeriesForTests?.testsCount || 0;

  const handleAddTest = async () => {
    if (!selectedSeriesForTests || !newTest.title || !newTest.testLink) return;
    try {
      const resp = await testSeriesService.addTest(selectedSeriesForTests.id, {
        ...newTest,
        testNumber: newTest.testNumber || (seriesTests.length + 1).toString()
      });
      if (resp.success && resp.data) {
        setSeriesTests(prev => [...prev, resp.data]);
        setNewTest({ testNumber: "", title: "", description: "", testLink: "" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      const resp = await testSeriesService.deleteTest(testId);
      if (resp.success) {
        setSeriesTests(prev => prev.filter(t => t.id !== testId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Test Series Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure test series information and sync with the backend.
          </p>
        </div>
        <Button size="sm" className="gap-1" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Test Series
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Tests Count</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <div className="text-sm text-muted-foreground">
                        Loading test series from database...
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : series.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-6 text-center text-xs text-muted-foreground"
                  >
                    No test series configured in this view. Use &quot;Add Test
                    Series&quot; to create placeholder rows.
                  </TableCell>
                </TableRow>
              ) : (
                series.map((ts) => (
                  <TableRow key={ts.id}>
                  <TableCell className="text-xs">{ts.title}</TableCell>
                  <TableCell className="text-xs">{ts.mode || "ONLINE"}</TableCell>
                  <TableCell className="text-xs">{ts.testsCount || 0}</TableCell>
                  <TableCell className="text-xs">
                    ₹{parseInt(ts.price || "0").toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 text-primary"
                      title="Manage Tests"
                      onClick={() => openManageTests(ts)}
                    >
                      <ClipboardList className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => openEdit(ts)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                      onClick={() => handleDelete(ts.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={seriesDialogOpen} onOpenChange={setSeriesDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {editingSeries?.id ? "Edit Test Series" : "Add Test Series"}
            </DialogTitle>
          </DialogHeader>

          {editingSeries && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-3 mt-2 overflow-y-auto pr-3">
                <div className="space-y-1">
                  <Label htmlFor="ts-title-input">Title</Label>
                  <Input
                    id="ts-title-input"
                    value={editingSeries.title}
                    onChange={(e) =>
                      setEditingSeries((prev) =>
                        prev ? { ...prev, title: e.target.value } : prev
                      )
                    }
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="ts-mode-input">Mode</Label>
                  <select
                    id="ts-mode-input"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingSeries.mode}
                    onChange={(e) =>
                      setEditingSeries((prev) =>
                        prev ? { ...prev, mode: e.target.value } : prev
                      )
                    }
                  >
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                    <option value="OMR_BASED">OMR BASED</option>
                    <option value="BOARD_STYLE">BOARD STYLE</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="ts-count-input">Number of Tests</Label>
                    <Input
                      id="ts-count-input"
                      type="number"
                      value={editingSeries.testsCount}
                      onChange={(e) =>
                        setEditingSeries((prev) =>
                          prev ? { ...prev, testsCount: e.target.value } : prev
                        )
                      }
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ts-price-input">Fees (₹)</Label>
                    <Input
                      id="ts-price-input"
                      value={editingSeries.price}
                      onChange={(e) =>
                        setEditingSeries((prev) =>
                          prev ? { ...prev, price: e.target.value } : prev
                        )
                      }
                      placeholder="e.g. 6000"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ts-overview-input">Overview</Label>
                  <Textarea
                    id="ts-overview-input"
                    rows={2}
                    value={editingSeries.overview}
                    onChange={(e) =>
                      setEditingSeries((prev) =>
                        prev ? { ...prev, overview: e.target.value } : prev
                      )
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ts-image-input">Image URL</Label>
                  <Input
                    id="ts-image-input"
                    value={editingSeries.image}
                    onChange={(e) =>
                      setEditingSeries((prev) =>
                        prev ? { ...prev, image: e.target.value } : prev
                      )
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ts-pattern-input">Test Pattern</Label>
                  <Input
                    id="ts-pattern-input"
                    value={editingSeries.testPattern}
                    onChange={(e) =>
                      setEditingSeries((prev) =>
                        prev ? { ...prev, testPattern: e.target.value } : prev
                      )
                    }
                    placeholder="e.g. 150 questions | 90 minutes"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ts-demo-input">Demo Test Link (Google Form)</Label>
                  <Input
                    id="ts-demo-input"
                    value={editingSeries.demoTestLink}
                    onChange={(e) =>
                      setEditingSeries((prev) =>
                        prev ? { ...prev, demoTestLink: e.target.value } : prev
                      )
                    }
                    placeholder="https://forms.gle/..."
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ts-features-input">Features (comma separated)</Label>
                  <Textarea
                    id="ts-features-input"
                    rows={2}
                    value={editingSeries.features}
                    onChange={(e) =>
                      setEditingSeries((prev) =>
                        prev ? { ...prev, features: e.target.value } : prev
                      )
                    }
                    placeholder="Feature 1, Feature 2..."
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ts-benefits-input">Benefits (comma separated)</Label>
                  <Textarea
                    id="ts-benefits-input"
                    rows={2}
                    value={editingSeries.benefits}
                    onChange={(e) =>
                      setEditingSeries((prev) =>
                        prev ? { ...prev, benefits: e.target.value } : prev
                      )
                    }
                    placeholder="Benefit 1, Benefit 2..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSeriesDialogOpen(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MANAGE TESTS DIALOG */}
      <Dialog open={manageTestsOpen} onOpenChange={setManageTestsOpen}>
        <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tests in: {selectedSeriesForTests?.title}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <div className="space-y-4 rounded-lg bg-muted/40 p-4 border border-dashed">
              <h4 className="text-sm font-semibold">Add New Test</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Test Title</Label>
                  <Input 
                    placeholder="e.g. Chapter 1 Quiz" 
                    value={newTest.title} 
                    onChange={e => setNewTest(p => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Sequence No.</Label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 1" 
                    value={newTest.testNumber} 
                    onChange={e => setNewTest(p => ({ ...p, testNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label>Description</Label>
                  <Input 
                    placeholder="Optional details" 
                    value={newTest.description} 
                    onChange={e => setNewTest(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label>Google Form / Test Link</Label>
                  <Input 
                    placeholder="https://forms.gle/..." 
                    value={newTest.testLink} 
                    onChange={e => setNewTest(p => ({ ...p, testLink: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleAddTest} className="w-full mt-2" size="sm">
                Add Test to Series
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Existing Tests ({currentTestsCount} / {targetTestsCount})</h4>
                {currentTestsCount < targetTestsCount && (
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Remaining: {targetTestsCount - currentTestsCount}
                  </span>
                )}
              </div>
              
              {isLoadingTests ? (
                <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : seriesTests.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground py-6 border border-dashed rounded-md">
                  No tests added yet. Use the form above to add your first test.
                </p>
              ) : (
                <div className="space-y-2">
                  {seriesTests.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border bg-background group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary bg-primary/5 h-5 w-5 rounded flex items-center justify-center border border-primary/20">{t.testNumber}</span>
                          <span className="text-sm font-medium">{t.title}</span>
                        </div>
                        {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
                        <p className="text-[10px] text-primary truncate max-w-xs mt-1">{t.testLink}</p>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteTest(t.id)}
                      >
                        <Trash2 className="h-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="pt-4 border-t flex justify-end">
            <Button onClick={() => setManageTestsOpen(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestSeriesManagement;
