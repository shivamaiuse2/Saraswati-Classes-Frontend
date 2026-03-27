import { useState, useEffect } from "react";
import { Search, X, Eye, MessageSquare, CheckCircle2, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import contactService from "@/services/contactService";
import { useApp } from "@/context/AppContext";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
  userId?: string;
  notes?: string;
}

const AdminInquiryManagement = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { updateContactMessage, removeContactMessage } = useApp(); // Get the update and delete functions from AppContext

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await contactService.getAllInquiries(1, 100);
      if (response.success && response.data) {
        setInquiries(response.data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, notes?: string) => {
    setIsUpdating(true);
    try {
      const response = await contactService.updateInquiryStatus(id, status, notes);
      if (response.success) {
        // Update both local state and AppContext state
        setInquiries(prev => prev.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status } : inquiry
        ));
        // Update the AppContext state to reflect changes in dashboard
        updateContactMessage(id, { status });
        setDialogOpen(false);
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        const response = await contactService.deleteInquiry(id);
        if (response.success) {
          // Remove from both local state and AppContext state
          setInquiries(prev => prev.filter(inquiry => inquiry.id !== id));
          // Update the AppContext state to reflect changes in dashboard
          removeContactMessage(id);
        }
      } catch (error) {
        console.error('Error deleting inquiry:', error);
      }
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inquiry.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'resolved':
        return 'default';
      case 'follow_up':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Inquiry Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage user inquiries and track their resolution status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Total: {inquiries.length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Pending: {inquiries.filter(i => i.status === 'PENDING').length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Resolved: {inquiries.filter(i => i.status === 'RESOLVED').length}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-lg border border-dashed">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inquiries by name, email or message..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X
              className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="follow_up">Follow Up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Inquirer</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell animate-pulse">
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell animate-pulse">
                          <div className="h-4 bg-muted rounded w-full"></div>
                        </TableCell>
                        <TableCell animate-pulse>
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </TableCell>
                        <TableCell animate-pulse>
                          <div className="h-4 bg-muted rounded w-24"></div>
                        </TableCell>
                        <TableCell className="text-right animate-pulse">
                          <div className="h-8 bg-muted rounded w-20 ml-auto"></div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : filteredInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-12 text-center text-xs text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <MessageSquare className="h-8 w-8 opacity-20" />
                        <p>No inquiries found matching "{searchQuery}"</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium">
                        <div className="block sm:hidden text-xs text-muted-foreground mb-1">Name</div>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          {inquiry.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="block md:hidden text-xs text-muted-foreground mb-1">Contact</div>
                        <div className="text-xs">
                          <div>{inquiry.email}</div>
                          <div className="text-muted-foreground">{inquiry.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell max-w-xs">
                        <div className="block lg:hidden text-xs text-muted-foreground mb-1">Message</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {inquiry.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="block sm:hidden text-xs text-muted-foreground mb-1">Status</div>
                        <Badge variant={getStatusBadgeVariant(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="block sm:hidden text-xs text-muted-foreground mb-1">Date</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(inquiry.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="block sm:hidden text-xs text-muted-foreground mb-1">Actions</div>
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleViewInquiry(inquiry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(inquiry.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Inquiry Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-4 overflow-y-auto pr-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                    <p className="text-sm">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p className="text-sm">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                    <p className="text-sm">{selectedInquiry.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <p className="text-sm">
                      <Badge variant={getStatusBadgeVariant(selectedInquiry.status)}>
                        {selectedInquiry.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                  <p className="text-sm mt-1 whitespace-pre-line">{selectedInquiry.message}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Submitted On</h3>
                  <p className="text-sm">{formatDate(selectedInquiry.createdAt)}</p>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Update Status</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={selectedInquiry.status === 'RESOLVED' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedInquiry.id, 'RESOLVED')}
                        disabled={isUpdating}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </Button>
                      <Button
                        variant={selectedInquiry.status === 'FOLLOW_UP' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedInquiry.id, 'FOLLOW_UP')}
                        disabled={isUpdating}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Follow Up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInquiryManagement;