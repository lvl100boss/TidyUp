import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { toast } from "sonner";
import { AlertCircle, User, Image as ImageIcon, Search, CalendarIcon, FilterX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import axios from "axios";

export default function UserFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [recentResponses, setRecentResponses] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [sendingResponse, setSendingResponse] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });

  useEffect(() => {
    fetchFeedbacks();

    const savedResponseData = sessionStorage.getItem('recent_feedback_response');
    if (savedResponseData) {
      try {
        const parsedData = JSON.parse(savedResponseData);
        if (parsedData && !parsedData.displayed) {
          setNotificationData(parsedData);
          setShowNotification(true);

          // Auto-dismiss notification after 10 seconds
          const timer = setTimeout(() => {
            dismissNotification();
          }, 10000);

          parsedData.displayed = true;
          sessionStorage.setItem('recent_feedback_response', JSON.stringify(parsedData));
          
          // Clear timer on component unmount
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.error("Error parsing saved response data", e);
        sessionStorage.removeItem('recent_feedback_response');
      }
    }
  }, []);

  useEffect(() => {
    // Apply filters whenever filter states change
    applyFilters();
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [feedbacks, searchTerm, statusFilter, categoryFilter, priorityFilter, dateRange]);

  // Get paginated data based on current filters
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFeedbacks.slice(startIndex, endIndex);
  };

  // Calculate total pages based on filtered data
  const totalPages = Math.max(1, Math.ceil(filteredFeedbacks.length / itemsPerPage));

  // Ensure current page is valid after filter changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/feedbacks');
      
      if (Array.isArray(response.data)) {
        setFeedbacks(response.data);
        setFilteredFeedbacks(response.data);
      } else {
        toast.error("Data Format Error", {
          description: "The server returned data in an unexpected format"
        });
        setFeedbacks([]);
        setFilteredFeedbacks([]);
      }
    } catch (error) {
      toast.error("Fetch Error", {
        description: "Could not load feedback data. Check console for details."
      });
      setFeedbacks([]);
      setFilteredFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!feedbacks.length) return;

    let result = [...feedbacks];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(feedback => 
        (feedback.subject && feedback.subject.toLowerCase().includes(term)) ||
        (feedback.message && feedback.message.toLowerCase().includes(term)) ||
        (feedback.user && 
          ((feedback.user.first_name && feedback.user.first_name.toLowerCase().includes(term)) ||
           (feedback.user.last_name && feedback.user.last_name.toLowerCase().includes(term)) ||
           (feedback.user.email && feedback.user.email.toLowerCase().includes(term))))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(feedback => feedback.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(feedback => feedback.category === categoryFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(feedback => feedback.priority === priorityFilter);
    }

    // Apply date range filter - Modified to handle future dates properly
    if (dateRange.from || dateRange.to) {
      result = result.filter(feedback => {
        const feedbackDate = new Date(feedback.created_at);
        
        // Set time to midnight for more accurate date comparison
        const startDate = dateRange.from ? new Date(dateRange.from) : null;
        if (startDate) {
          startDate.setHours(0, 0, 0, 0);
        }
        
        const endDate = dateRange.to ? new Date(dateRange.to) : null;
        if (endDate) {
          // Set time to end of day for inclusive filtering
          endDate.setHours(23, 59, 59, 999);
        }
        
        // Handle different date range scenarios
        if (startDate && endDate) {
          return feedbackDate >= startDate && feedbackDate <= endDate;
        } else if (startDate) {
          return feedbackDate >= startDate;
        } else if (endDate) {
          return feedbackDate <= endDate;
        }
        return true;
      });
    }

    setFilteredFeedbacks(result);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setDateRange({ from: null, to: null });
    setFilteredFeedbacks(feedbacks);
  };

  const handleDateFilter = (newRange) => {
    // Validate the date range
    if (newRange.from && newRange.to && newRange.to < newRange.from) {
      newRange.to = newRange.from;
    }
    
    setDateRange(newRange);
  };

  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return "Filter by Date";
    if (dateRange.from && dateRange.to) {
        return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
    }
    return dateRange.from ? 
        `From ${dateRange.from.toLocaleDateString()}` : 
        `Until ${dateRange.to.toLocaleDateString()}`;
  };

  const getStatusVariant = (status) => {
    const variants = {
      'pending': 'warning',
      'in-progress': 'default',
      'resolved': 'success',
      'closed': 'outline'
    };
    return variants[status] || 'default';
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      'High': 'destructive',
      'Medium': 'warning',
      'Low': 'success'
    };
    return variants[priority] || 'default';
  };

  const handleResponse = async (feedbackId) => {
    if (!response.trim()) return;
    
    try {
      setSendingResponse(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      if (selectedStatus && selectedStatus !== selectedFeedback.status) {
        await axios.put(`/admin/feedbacks/${feedbackId}`, { 
          status: selectedStatus 
        }, config);
      }
      
      const responseData = await axios.post(`/admin/feedbacks/${feedbackId}/respond`, { 
        response: response
      }, config);
      
      const adminInfo = responseData.data.admin_info;
      
      // Create timestamp in Philippine time
      const now = new Date();
      const philippineTime = formatPhilippineTime(now);
      
      const notificationInfo = {
        id: feedbackId,
        subject: selectedFeedback.subject,
        recipientName: selectedFeedback.user ? 
          `${selectedFeedback.user.first_name} ${selectedFeedback.user.last_name}` : 
          'Anonymous User',
        recipientEmail: selectedFeedback.user?.email,
        status: selectedStatus || selectedFeedback.status,
        adminName: adminInfo?.name || 'Admin',
        timestamp: adminInfo?.timestamp || philippineTime,
        displayed: false
      };
      
      sessionStorage.setItem('recent_feedback_response', JSON.stringify(notificationInfo));
      
      setNotificationData(notificationInfo);
      setShowNotification(true);
      
      // Auto-dismiss notification after 10 seconds
      setTimeout(() => {
        dismissNotification();
      }, 10000);
      
      setRecentResponses(prev => [feedbackId, ...prev.slice(0, 9)]);
      
      toast.success("Response Sent", {
        description: adminInfo ? 
          `Response sent by ${adminInfo.name} at ${adminInfo.timestamp}` : 
          `Your response has been sent to the user via email at ${philippineTime}`
      });
      
      setIsDialogOpen(false);
      setResponse("");
      setSelectedStatus("");
      
      await fetchFeedbacks();
    } catch (error) {
      toast.error("Send Failed", {
        description: error.response?.data?.message || "Could not send your response. Please check your authentication."
      });
    } finally {
      setSendingResponse(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format timestamp with Philippine time (Asia/Manila)
  const formatPhilippineTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      timeZone: 'Asia/Manila',
      hour12: false
    };
    return new Date(dateString).toLocaleString('en-PH', options);
  };

  const openFeedbackDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setSelectedStatus(feedback.status);
    setIsDialogOpen(true);
  };

  const dismissNotification = () => {
    setShowNotification(false);
    if (notificationData) {
      notificationData.displayed = true;
      sessionStorage.setItem('recent_feedback_response', JSON.stringify(notificationData));
    }
  };

  const wasRecentlyResponded = (feedbackId) => {
    return recentResponses.includes(feedbackId);
  };

  const openImagePreview = (imagePath) => {
    setPreviewImage(`/storage/${imagePath}`);
    setShowImagePreview(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <Head title="User Feedback" />
      <div className="container py-6">
        {showNotification && notificationData && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-medium">Email Sent Successfully</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Your response to "<strong>{notificationData.subject}</strong>" has been sent to {notificationData.recipientName}{notificationData.recipientEmail ? ` (${notificationData.recipientEmail})` : ''}.</p>
                      <p>Sent by: {notificationData.adminName} at {notificationData.timestamp}</p>
                      <div className="mt-1">
                        Feedback status: 
                        <Badge className="ml-2" variant={getStatusVariant(notificationData.status)}>
                          {notificationData.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={dismissNotification} className="h-8 w-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span className="sr-only">Dismiss</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>User Feedback Management</CardTitle>
            <CardDescription>
              Manage and respond to user feedback and feature requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filtering Controls */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by subject, message or user"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="min-w-[200px]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateRange()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <div className="flex gap-4 p-3">
                      <div>
                        <p className="text-sm font-medium mb-2">From</p>
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => handleDateFilter({ ...dateRange, from: date })}
                          initialFocus
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">To</p>
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => handleDateFilter({ ...dateRange, to: date })}
                          disabled={(date) => 
                            dateRange.from && date < dateRange.from
                          }
                          initialFocus
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                >
                  <FilterX className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
              
              {/* Filter summary */}
              {(searchTerm || statusFilter !== "all" || categoryFilter !== "all" || 
                priorityFilter !== "all" || dateRange.from || dateRange.to) && (
                <div className="text-sm text-muted-foreground">
                  Showing {filteredFeedbacks.length} of {feedbacks.length} feedback items
                </div>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Loading feedback data...</div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {feedbacks.length === 0 ? 
                  "No feedback submissions yet." : 
                  "No feedback matches your current filters."}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaginatedData().map((feedback) => (
                      <TableRow 
                        key={feedback.id}
                        className={wasRecentlyResponded(feedback.id) ? "bg-primary/5" : ""}
                      >
                        <TableCell>
                          <div>
                            {feedback.user ? (
                              <>
                                <div className="font-medium">
                                  {feedback.user.first_name} {feedback.user.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {feedback.user.email}
                                </div>
                              </>
                            ) : (
                              <div className="text-sm text-muted-foreground">Anonymous</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{feedback.subject}</TableCell>
                        <TableCell>{feedback.category}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(feedback.status)}>
                            {feedback.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityVariant(feedback.priority)}>
                            {feedback.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(feedback.created_at)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            onClick={() => openFeedbackDialog(feedback)}
                          >
                            {feedback.responded_at ? "View & Re-Respond" : "View & Respond"}
                          </Button>
                          {wasRecentlyResponded(feedback.id) && (
                            <Badge variant="outline" className="ml-2">Recently Responded</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Pagination */}
            {filteredFeedbacks.length > 0 && (
              <div className="flex justify-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Simple pagination logic for showing a window of pages
                    let pageNum;
                    const pageWindow = Math.floor(5 / 2);
                    
                    if (totalPages <= 5) {
                      // If we have 5 or fewer pages, show all
                      pageNum = i + 1;
                    } else if (currentPage <= pageWindow + 1) {
                      // We're near the start
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - pageWindow) {
                      // We're near the end
                      pageNum = totalPages - 4 + i;
                    } else {
                      // We're in the middle
                      pageNum = currentPage - pageWindow + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span>...</span>}
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(totalPages)}
                        size="sm"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
            
            {/* Pagination summary */}
            {filteredFeedbacks.length > itemsPerPage && (
              <div className="text-center text-sm text-muted-foreground mt-2">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredFeedbacks.length)} to {Math.min(currentPage * itemsPerPage, filteredFeedbacks.length)} of {filteredFeedbacks.length} items
              </div>
            )}
          </CardContent>
        </Card>

        {selectedFeedback && (
          <Dialog 
            open={isDialogOpen} 
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setResponse(""); 
                setSelectedStatus("");
                setSendingResponse(false);
              }
            }}
          >
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Feedback Details</DialogTitle>
                <DialogDescription>
                  View and respond to user feedback
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {selectedFeedback.user && (
                  <div className="flex items-center space-x-4 bg-muted p-3 rounded-md">
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Submitted by</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedFeedback.user.first_name} {selectedFeedback.user.last_name} ({selectedFeedback.user.email})
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Subject</h4>
                    <p className="text-sm text-muted-foreground">{selectedFeedback.subject}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Category</h4>
                    <p className="text-sm text-muted-foreground">{selectedFeedback.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Priority</h4>
                    <Badge variant={getPriorityVariant(selectedFeedback.priority)}>
                      {selectedFeedback.priority}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Rating</h4>
                    <p className="text-sm text-muted-foreground">{selectedFeedback.rating} / 5</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Message</h4>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </p>
                </div>
                
                {selectedFeedback.attachments && selectedFeedback.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium">Attachments</h4>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {JSON.parse(selectedFeedback.attachments).map((attachment, index) => (
                        <div 
                          key={index}
                          className="relative group"
                        >
                          <div 
                            className="w-24 h-24 rounded-md overflow-hidden cursor-pointer border border-border"
                            onClick={() => openImagePreview(attachment)}
                          >
                            <img 
                              src={`/storage/${attachment}`} 
                              alt={`Attachment ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 text-center truncate w-24">
                            Attachment {index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue>
                        <Badge variant={getStatusVariant(selectedStatus || selectedFeedback.status)}>
                          {selectedStatus || selectedFeedback.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Response</h4>
                  <Textarea
                    className="mt-2"
                    placeholder="Type your response here... This will be sent to the user via email."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={sendingResponse}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleResponse(selectedFeedback.id)}
                  disabled={!response.trim() || sendingResponse}
                >
                  {sendingResponse ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Response"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Image Attachment</DialogTitle>
              <DialogDescription>
                View the full-size image
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-auto max-h-[calc(90vh-10rem)]">
              {previewImage && (
                <img 
                  src={previewImage} 
                  alt="Attachment preview" 
                  className="w-full h-auto rounded-md"
                />
              )}
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={() => window.open(previewImage, '_blank')}
                variant="outline"
                className="mr-2"
              >
                Open in New Tab
              </Button>
              <Button onClick={() => setShowImagePreview(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
