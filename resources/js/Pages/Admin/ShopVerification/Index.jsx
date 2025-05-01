import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Separator } from "@/Components/ui/separator";
import { 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter, 
  EyeIcon,
  CalendarIcon,
  Loader2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { toast, Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";
import axios from "axios";

export default function ShopVerificationIndex({ shops, stats }) {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShops, setFilteredShops] = useState(shops || []);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc"
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Filter shops based on tab and search term
  useEffect(() => {
    let filtered = [...shops];
    
    // Filter by status tab
    if (tab !== "all") {
      filtered = filtered.filter(shop => shop.status === tab);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(shop => 
        shop.shop_name?.toLowerCase().includes(term) ||
        shop.user?.first_name?.toLowerCase().includes(term) ||
        shop.user?.last_name?.toLowerCase().includes(term) ||
        shop.email?.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      // Special handling for nested properties
      if (sortConfig.key === "owner_name") {
        aVal = a.user ? `${a.user.first_name} ${a.user.last_name}` : "";
        bVal = b.user ? `${b.user.first_name} ${b.user.last_name}` : "";
      }
      
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    
    setFilteredShops(filtered);
  }, [tab, searchTerm, shops, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'processing':
      default:
        return <Badge variant="secondary" className="bg-amber-500 text-white">Processing</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const openVerifyDialog = (shop) => {
    // Check if the shop is already verified or rejected
    if (shop.status !== 'processing') {
      toast.error("This shop's status cannot be modified as it has already been processed.", {
        description: "Only shops in 'processing' status can be verified or rejected."
      });
      return;
    }
    
    setSelectedShop(shop);
    setIsVerifyDialogOpen(true);
  };

  const handleVerify = () => {
    if (!selectedShop) return;
    
    // Double-check status before proceeding
    if (selectedShop.status !== 'processing') {
      toast.error("This shop's status cannot be modified as it has already been processed.");
      setIsVerifyDialogOpen(false);
      return;
    }
    
    setIsProcessing(true);
    
    // Use Axios directly to handle the request instead of Inertia post
    axios.post(route('admin.shops.update-status', selectedShop.id), {
      _method: 'PATCH',
      status: 'verified',
    })
    .then(response => {
      toast.success("Shop verified successfully!", {
        description: "The shop is now visible to customers and can receive bookings."
      });
      setIsVerifyDialogOpen(false);
      setIsProcessing(false);
      
      // Refresh the page to show updated shop status
      window.location.reload();
    })
    .catch(error => {
      toast.error("Failed to verify shop.", {
        description: error?.response?.data?.message || "Please try again or contact support if the issue persists."
      });
      setIsProcessing(false);
    });
  };

  const openRejectionDialog = (shop) => {
    // Check if the shop is already verified or rejected
    if (shop.status !== 'processing') {
      toast.error("This shop's status cannot be modified as it has already been processed.", {
        description: "Only shops in 'processing' status can be verified or rejected."
      });
      return;
    }
    
    setSelectedShop(shop);
    setRejectionReason("");
    setIsRejectionDialogOpen(true);
  };
  
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    // Double-check status before proceeding
    if (selectedShop.status !== 'processing') {
      toast.error("This shop's status cannot be modified as it has already been processed.");
      setIsRejectionDialogOpen(false);
      return;
    }
    
    setIsProcessing(true);
    
    // Use Axios directly to handle the request instead of Inertia post
    axios.post(route('admin.shops.update-status', selectedShop.id), {
      _method: 'PATCH',
      status: 'rejected',
      rejection_reason: rejectionReason,
    })
    .then(response => {
      toast.success("Shop rejected successfully", {
        description: "The shop owner has been notified of the rejection reason."
      });
      setIsRejectionDialogOpen(false);
      setRejectionReason("");
      setIsProcessing(false);
      
      // Refresh the page to show updated shop status
      window.location.reload();
    })
    .catch(error => {
      toast.error("Failed to reject shop.", {
        description: error?.response?.data?.message || "Please try again or contact support if the issue persists."
      });
      setIsProcessing(false);
    });
  };

  return (
    <AdminLayout>
      <Head title="Shop Verification" />
      <Toaster />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shop Verification</h1>

        {/* Mobile filter button */}
        <div className="md:hidden mt-2">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filter Shops</SheetTitle>
                <SheetDescription>
                  Filter shop registrations by status
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'processing', 'verified', 'rejected'].map((status) => (
                      <Button 
                        key={status}
                        variant={tab === status ? "default" : "outline"}
                        onClick={() => {
                          setTab(status);
                          setMobileFiltersOpen(false);
                        }}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile-search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="mobile-search"
                      placeholder="Search Shop"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-600 flex items-center gap-2 text-sm md:text-base">
              <Clock className="h-4 w-4" />
              Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
            <p className="text-sm text-muted-foreground">Shops awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-green-600 flex items-center gap-2 text-sm md:text-base">
              <CheckCircle2 className="h-4 w-4" />
              Verified Shops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
            <p className="text-sm text-muted-foreground">Active on the platform</p>
          </CardContent>
        </Card>
        
        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600 flex items-center gap-2 text-sm md:text-base">
              <XCircle className="h-4 w-4" />
              Rejected Shops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-sm text-muted-foreground">Not meeting requirements</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Registrations</CardTitle>
          <CardDescription>Manage and verify shop registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Tabs defaultValue="all" value={tab} onValueChange={setTab} className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <TabsList className="hidden md:flex">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="processing">
                    Pending <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">{stats.processing}</span>
                  </TabsTrigger>
                  <TabsTrigger value="verified">Verified</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-1/3">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search shops..." 
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <TabsContent value="all" className="m-0">
                <div className="overflow-x-auto">
                  <ShopTable 
                    shops={filteredShops} 
                    handleSort={handleSort} 
                    sortConfig={sortConfig}
                    getStatusBadge={getStatusBadge}
                    formatDate={formatDate}
                    handleVerify={handleVerify}
                    openRejectionDialog={openRejectionDialog}
                    openVerifyDialog={openVerifyDialog}
                    isProcessing={isProcessing}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="processing" className="m-0">
                <div className="overflow-x-auto">
                  <ShopTable 
                    shops={filteredShops} 
                    handleSort={handleSort} 
                    sortConfig={sortConfig}
                    getStatusBadge={getStatusBadge}
                    formatDate={formatDate}
                    handleVerify={handleVerify}
                    openRejectionDialog={openRejectionDialog}
                    openVerifyDialog={openVerifyDialog}
                    isProcessing={isProcessing}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="verified" className="m-0">
                <div className="overflow-x-auto">
                  <ShopTable 
                    shops={filteredShops} 
                    handleSort={handleSort} 
                    sortConfig={sortConfig}
                    getStatusBadge={getStatusBadge}
                    formatDate={formatDate}
                    handleVerify={handleVerify}
                    openRejectionDialog={openRejectionDialog}
                    openVerifyDialog={openVerifyDialog}
                    isProcessing={isProcessing}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="rejected" className="m-0">
                <div className="overflow-x-auto">
                  <ShopTable 
                    shops={filteredShops} 
                    handleSort={handleSort} 
                    sortConfig={sortConfig}
                    getStatusBadge={getStatusBadge}
                    formatDate={formatDate}
                    handleVerify={handleVerify}
                    openRejectionDialog={openRejectionDialog}
                    openVerifyDialog={openVerifyDialog}
                    isProcessing={isProcessing}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={(open) => {
        // Only allow closing the dialog if not processing
        if (!isProcessing) setIsVerifyDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Shop</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this shop? This will make it visible to all users and cannot be easily reversed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVerifyDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Verification"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isRejectionDialogOpen} onOpenChange={(open) => {
        // Only allow closing the dialog if not processing
        if (!isProcessing) setIsRejectionDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Shop</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this shop. This will be shown to the shop owner.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              className="mt-2"
              rows={4}
              disabled={isProcessing}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectionDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Reject Shop"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

// Table component to avoid repetition
function ShopTable({ 
  shops, 
  handleSort, 
  sortConfig, 
  getStatusBadge, 
  formatDate, 
  handleVerify, 
  openRejectionDialog,
  openVerifyDialog,
  isProcessing 
}) {
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>
              <button 
                className="flex items-center space-x-1 hover:text-foreground/80"
                onClick={() => handleSort("shop_name")}
              >
                Shop Name {getSortIcon("shop_name")}
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <button 
                className="flex items-center space-x-1 hover:text-foreground/80"
                onClick={() => handleSort("owner_name")}
              >
                Shop Owner {getSortIcon("owner_name")}
              </button>
            </TableHead>
            <TableHead className="hidden sm:table-cell">
              <button 
                className="flex items-center space-x-1 hover:text-foreground/80"
                onClick={() => handleSort("created_at")}
              >
                Submitted {getSortIcon("created_at")}
              </button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops.length > 0 ? (
            shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">{shop.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 hidden sm:flex">
                      <AvatarImage src={`/${shop.shop_photo}`} alt={shop.shop_name} />
                      <AvatarFallback>{shop.shop_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="line-clamp-1">{shop.shop_name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {shop.user ? `${shop.user.first_name} ${shop.user.last_name}` : "Unknown"}
                </TableCell>
                <TableCell className="hidden sm:table-cell whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{formatDate(shop.created_at)}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(shop.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col sm:flex-row gap-2 justify-end items-end sm:items-center">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/shops/${shop.id}`}>
                        <EyeIcon className="h-4 w-4 sm:mr-1" /> 
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </Button>
                    
                    {shop.status === 'processing' && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => openVerifyDialog(shop)}
                          disabled={isProcessing}
                        >
                          <CheckCircle2 className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Verify</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectionDialog(shop)}
                          disabled={isProcessing}
                        >
                          <XCircle className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                      </>
                    )}
                    
                    {shop.status === 'verified' && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Verified on {formatDate(shop.verified_at || shop.updated_at)}
                      </Badge>
                    )}
                    
                    {shop.status === 'rejected' && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        Rejected on {formatDate(shop.updated_at)}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No shops found matching the criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
