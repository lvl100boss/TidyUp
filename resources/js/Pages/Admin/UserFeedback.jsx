import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Sample data - replace with your actual data fetching logic
const initialFeedbacks = [
  {
    id: 1,
    user: "John Doe",
    email: "john@example.com",
    subject: "App Performance",
    message: "The app has been really slow lately",
    status: "pending",
    priority: "high",
    date: "2024-02-13",
  },
  {
    id: 2,
    user: "Jane Smith",
    email: "jane@example.com",
    subject: "Feature Request",
    message: "Would love to see dark mode implemented",
    status: "in-progress",
    priority: "medium",
    date: "2024-02-12",
  },
];

export default function UserFeedback() {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [response, setResponse] = useState("");

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      "in-progress": "bg-blue-500",
      resolved: "bg-green-500",
      closed: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500",
    };
    return colors[priority] || "bg-gray-500";
  };

  const handleStatusChange = (feedbackId, newStatus) => {
    setFeedbacks(feedbacks.map(feedback =>
      feedback.id === feedbackId
        ? { ...feedback, status: newStatus }
        : feedback
    ));
  };

  const handleResponse = (feedbackId) => {
    // Here you would typically make an API call to save the response
    console.log(`Sending response for feedback ${feedbackId}:`, response);
    setIsDialogOpen(false);
    setResponse("");
    
    // Update the feedback status to in-progress
    handleStatusChange(feedbackId, "in-progress");
  };

  return (
    <AdminLayout>
      <Head title="User Feedback" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>User Feedback Management</CardTitle>
            <CardDescription>
              Manage and respond to user feedback and feature requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{feedback.user}</div>
                          <div className="text-sm text-gray-500">{feedback.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{feedback.subject}</TableCell>
                      <TableCell>
                        <Select
                          value={feedback.status}
                          onValueChange={(value) => handleStatusChange(feedback.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge className={`${getStatusColor(feedback.status)} text-white`}>
                                {feedback.status}
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
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(feedback.priority)} text-white`}>
                          {feedback.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{feedback.date}</TableCell>
                      <TableCell>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedFeedback(feedback)}
                            >
                              View & Respond
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Feedback Details</DialogTitle>
                              <DialogDescription>
                                View and respond to user feedback
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium">Message</h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  {selectedFeedback?.message}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Response</h4>
                                <Textarea
                                  className="mt-1"
                                  placeholder="Type your response here..."
                                  value={response}
                                  onChange={(e) => setResponse(e.target.value)}
                                />
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  onClick={() => handleResponse(selectedFeedback?.id)}
                                  disabled={!response.trim()}
                                >
                                  Send Response
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}