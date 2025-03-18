import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast, Toaster } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download,
  Eye,
  ArrowLeft
} from "lucide-react";
import ShopServiceCard from "@/Components/Shop/ShopServiceCard";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/Components/ui/dialog";
import ShopGallery from "@/Components/Shop/ShopGallery";

// Add this helper function at the top level
const formatDuration = (hours, minutes) => {
  const parts = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  return parts.join(' ');
};

export default function ShopDetails({ shop, categories, setupData }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Update useEffect with more detailed logging
  useEffect(() => {
    if (activeTab === "services") {
      console.log("Full Shop Data:", shop);
      console.log("Services Data:", {
        hasServices: Array.isArray(shop.shop_service_categories),
        servicesCount: shop.shop_service_categories?.length || 0,
        services: shop.shop_service_categories
      });
    }
  }, [activeTab, shop]);

  const { data, setData, post, processing, errors, reset } = useForm({
    status: shop.status || 'processing',
    rejection_reason: shop.rejection_reason || '',
  });

  const handleStatusChange = (status) => {
    setData('status', status);
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    
    // Show confirmation toast before submitting
    if (data.status === 'verified') {
      toast.info('Verifying shop and sending notification to owner...');
    } else if (data.status === 'rejected') {
      toast.info('Rejecting shop and notifying owner...');
    } else {
      toast.info('Updating shop status...');
    }
    
    post(route('admin.shops.update-status', shop.id), {
      onSuccess: (response) => {
        // Get response message or use default
        const message = response?.props?.flash?.success || 'Shop status updated successfully';
        
        if (data.status === 'verified') {
          toast.success('Shop verified! Owner has been notified.');
        } else if (data.status === 'rejected') {
          toast.success('Shop rejected. Owner has been notified with the reason.');
        } else {
          toast.success(message);
        }
        
        // Reload the page after 1.5 seconds to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      onError: (errors) => {
        const errorMessage = errors.message || Object.values(errors).flat().join(', ') || 'An error occurred';
        toast.error(errorMessage);
      }
    });
  };

  const downloadDocument = (type) => {
    window.location.href = route('admin.shops.download-document', { 
      id: shop.id, 
      type: type 
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'processing':
      default:
        return <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600 text-white">Processing</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Create a component to display setup data details
  const SetupDetails = ({ data }) => {
    // Check if data and data.basicInfo exist before rendering
    if (!data || !data.basicInfo) {
      return <p>No setup data available</p>;
    }
    
    return (
      <div>
        <h3 className="font-semibold mb-3">Setup Information</h3>
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-gray-500">Shop Name:</dt>
              <dd>{data.basicInfo.shop_name}</dd>
              <dt className="text-gray-500">Email:</dt>
              <dd>{data.basicInfo.email}</dd>
              <dt className="text-gray-500">Contact:</dt>
              <dd>{data.basicInfo.contact_number}</dd>
            </dl>
            {data.basicInfo.bio && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-500">Bio:</h5>
                <p className="text-sm mt-1 bg-white dark:bg-gray-800 p-2 rounded">{data.basicInfo.bio}</p>
              </div>
            )}
          </div>
          
          {/* Location */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-gray-500">Region:</dt>
              <dd>{data.location.region}</dd>
              <dt className="text-gray-500">Province:</dt>
              <dd>{data.location.province}</dd>
              <dt className="text-gray-500">City:</dt>
              <dd>{data.location.city}</dd>
              <dt className="text-gray-500">Barangay:</dt>
              <dd>{data.location.barangay}</dd>
              <dt className="text-gray-500">Address:</dt>
              <dd>{data.location.detailed_address}</dd>
            </dl>
          </div>
          
          {/* Categories */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Selected Categories</h4>
            {data.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.categories.map((cat, idx) => (
                  <Badge key={idx} variant="outline">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No categories selected</p>
            )}
          </div>
          
          {/* Operating Hours */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Operating Hours</h4>
            <dl className="space-y-1 text-sm">
              {data.operationHoursFormatted && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const hours = data.operationHoursFormatted[day];
                return (
                  <div key={day} className="flex justify-between py-1 border-b last:border-0">
                    <dt>{day}</dt>
                    <dd>
                      {hours && hours.isOpen
                        ? `${hours.openTime} - ${hours.closeTime}`
                        : <span className="text-gray-500">Closed</span>
                      }
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    );
  };

  // Update services section to use correct property name
  const renderServices = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Service Catalog</h3>
      {Array.isArray(shop.shop_service_categories) && shop.shop_service_categories.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shop.shop_service_categories.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">
                  {service.service_name}
                </CardTitle>
                <CardDescription>
                  {service.service_categories?.name || 'Uncategorized'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <Badge variant="outline">
                      {service.service_categories?.name || 'Uncategorized'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cost:</span>
                    <Badge variant="secondary">
                      ₱{parseFloat(service.cost).toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="text-sm">
                      {service.duration_hour > 0 && `${service.duration_hour}h `}
                      {service.duration_minute > 0 && `${service.duration_minute}m`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded bg-gray-50 flex flex-col items-center justify-center">
          <FileText className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-muted-foreground">No services have been added to this shop yet.</p>
          {shop.status === 'processing' && (
            <p className="text-sm text-amber-600 mt-2">
              The shop owner may add services after verification.
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <Head title={`Shop Details - ${shop.shop_name}`} />
      <Toaster />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link 
              href={route('admin.shops')} 
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Shops
            </Link>
            <h1 className="text-2xl font-bold">{shop.shop_name}</h1>
          </div>
          {getStatusBadge(shop.status)}
        </div>
        
        {/* Status info cards - New addition to show detailed status information */}
        {shop.status === 'verified' && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-semibold text-green-800">Verified Shop</h3>
                  <p className="text-green-700">This shop has been verified and is visible to customers.</p>
                  {shop.verified_at && (
                    <p className="text-sm text-green-600 mt-1">Verified on: {formatDate(shop.verified_at)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {shop.status === 'rejected' && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-semibold text-red-800">Rejected Shop</h3>
                  <p className="text-red-700 mb-2">This shop has been rejected and is not visible to customers.</p>
                  <div className="bg-white/50 p-3 rounded border border-red-200">
                    <h4 className="font-medium text-red-800">Rejection Reason:</h4>
                    <p className="text-red-700">{shop.rejection_reason}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {shop.status === 'processing' && (
          <Card className="mb-6 bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-semibold text-amber-800">Shop Under Review</h3>
                  <p className="text-amber-700">This shop is awaiting verification and is not visible to customers yet.</p>
                  <p className="text-sm text-amber-600 mt-1">Submitted on: {formatDate(shop.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Shop Details</CardTitle>
                <CardDescription>ID: {shop.id} | Created: {formatDate(shop.created_at)}</CardDescription>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>Update Status</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <form onSubmit={handleUpdateStatus}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Update Shop Status</AlertDialogTitle>
                      <AlertDialogDescription>
                        Change the verification status of this shop.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={data.status} 
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {data.status === 'rejected' && (
                        <div className="space-y-2">
                          <Label htmlFor="rejection_reason">Rejection Reason</Label>
                          <Textarea
                            id="rejection_reason"
                            value={data.rejection_reason}
                            onChange={(e) => setData('rejection_reason', e.target.value)}
                            placeholder="Enter reason for rejection"
                            required
                          />
                        </div>
                      )}
                    </div>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button 
                        type="submit" 
                        disabled={processing}
                        variant={data.status === 'rejected' ? 'destructive' : 'default'}
                      >
                        Update Status
                      </Button>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="setup">Setup Info</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={`/${shop.shop_photo}`} alt={shop.shop_name} />
                        <AvatarFallback>{shop.shop_name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{shop.shop_name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {shop.shopCategories && shop.shopCategories.map(cat => 
                            cat.categories && <Badge key={cat.id} variant="outline" className="mr-1">{cat.categories.name}</Badge>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">Bio</h3>
                      <p className="text-sm">{shop.bio}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">Contact Information</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{shop.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{shop.contact_number}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">Address</h3>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>
                          {shop.detailed_address}, {shop.barangay}, {shop.city}, {shop.province}, {shop.region}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Owner Information</h3>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={shop.user?.profile_photo_path ? `/storage/${shop.user.profile_photo_path}` : null} 
                            alt={shop.user?.username} 
                          />
                          <AvatarFallback>
                            {shop.user?.first_name?.charAt(0)}{shop.user?.last_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {shop.user?.first_name} {shop.user?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">@{shop.user?.username}</p>
                        </div>
                      </div>
                    </div>

                    <ShopGallery shop={shop} />
                    

                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="setup" className="space-y-8">
                <SetupDetails data={setupData} />
              </TabsContent>
              
              <TabsContent value="services">
                {renderServices()}
              </TabsContent>
              
              <TabsContent value="documents">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Legal Documents</h3>
                  {shop.legalDocuments ? (
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Business Permit */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Business Permit</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex justify-center mb-4">
                            {shop.legalDocuments.business_permit_url ? (
                              <div className="relative h-40 w-full rounded overflow-hidden">
                                <img 
                                  src={`/storage/${shop.legalDocuments.business_permit_url}`}
                                  alt="Business Permit" 
                                  className="h-full w-full object-contain"
                                  onError={(e) => {
                                    console.error('Failed to load image:', shop.legalDocuments.business_permit_url);
                                    e.target.onerror = null;
                                    e.target.parentNode.innerHTML = `
                                      <div class="h-40 w-full bg-gray-100 rounded flex flex-col items-center justify-center">
                                        <FileText class="h-12 w-12 text-gray-400" />
                                        <p class="text-xs text-gray-500 mt-1">Document cannot be displayed</p>
                                      </div>
                                    `;
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-40 w-full bg-gray-100 rounded flex items-center justify-center">
                                <FileText className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => window.open(`/storage/${shop.legalDocuments.business_permit_url}`, '_blank')}
                            disabled={!shop.legalDocuments?.business_permit_url}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => downloadDocument('business-permit')}
                            disabled={!shop.legalDocuments}
                          >
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      {/* DTI Registration */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">DTI Registration</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex justify-center mb-4">
                            {shop.legalDocuments.dti_registration_url ? (
                              <div className="relative h-40 w-full rounded overflow-hidden">
                                <img 
                                  src={`/storage/${shop.legalDocuments.dti_registration_url}`}
                                  alt="DTI Registration" 
                                  className="h-full w-full object-contain"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentNode.innerHTML = `
                                      <div class="h-40 w-full bg-gray-100 rounded flex flex-col items-center justify-center">
                                        <svg class="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                          <polyline points="14 2 14 8 20 8"></polyline>
                                          <line x1="16" y1="13" x2="8" y2="13"></line>
                                          <line x1="16" y1="17" x2="8" y2="17"></line>
                                          <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                        <p class="text-xs text-gray-500 mt-1">Document cannot be displayed</p>
                                      </div>
                                    `;
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-40 w-full bg-gray-100 rounded flex items-center justify-center">
                                <FileText className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => window.open(`/storage/${shop.legalDocuments.dti_registration_url}`, '_blank')}
                            disabled={!shop.legalDocuments.dti_registration_url}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => downloadDocument('dti-registration')}
                            disabled={!shop.legalDocuments}
                          >
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      {/* Valid ID */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Valid ID</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex justify-center mb-4">
                            {shop.legalDocuments.valid_id_url ? (
                              <div className="relative h-40 w-full rounded overflow-hidden">
                                <img 
                                  src={`/storage/${shop.legalDocuments.valid_id_url}`}
                                  alt="Valid ID" 
                                  className="h-full w-full object-contain"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentNode.innerHTML = `
                                      <div class="h-40 w-full bg-gray-100 rounded flex flex-col items-center justify-center">
                                        <svg class="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                          <polyline points="14 2 14 8 20 8"></polyline>
                                          <line x1="16" y1="13" x2="8" y2="13"></line>
                                          <line x1="16" y1="17" x2="8" y2="17"></line>
                                          <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                        <p class="text-xs text-gray-500 mt-1">Document cannot be displayed</p>
                                      </div>
                                    `;
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-40 w-full bg-gray-100 rounded flex items-center justify-center">
                                <FileText className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => window.open(`/storage/${shop.legalDocuments.valid_id_url}`, '_blank')}
                            disabled={!shop.legalDocuments.valid_id_url}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => downloadDocument('valid-id')}
                            disabled={!shop.legalDocuments}
                          >
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-2 text-muted-foreground/60" />
                      <p>No legal documents found for this shop.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="staff">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Staff & Management</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Always show shop owner first */}
                    {shop.user && (
                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage 
                                src={shop.user.profile_photo_path ? `/storage/${shop.user.profile_photo_path}` : null} 
                                alt={shop.user.username}
                              />
                              <AvatarFallback>
                                {shop.user.first_name?.[0]}{shop.user.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">
                                {shop.user.first_name} {shop.user.last_name}
                              </CardTitle>
                              <CardDescription>@{shop.user.username}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Role:</span>
                              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                                Shop Owner
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Show other staff members */}
                    {shop.shopStaffs?.filter(staff => staff.staff_id !== shop.user.id).map((staffMember) => (
                      <Card key={staffMember.id} className={staffMember.role === 'Shop Owner' ? 'border-blue-200' : ''}>
                        <CardHeader className={staffMember.role === 'Shop Owner' ? 'bg-blue-50' : ''}>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage 
                                src={staffMember.staff?.profile_photo_path 
                                  ? `/storage/${staffMember.staff.profile_photo_path}` 
                                  : null} 
                                alt={staffMember.staff?.username || 'Staff Member'}
                              />
                              <AvatarFallback>
                                {staffMember.staff?.first_name?.charAt(0)}
                                {staffMember.staff?.last_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">
                                {staffMember.staff ? 
                                  `${staffMember.staff.first_name || ''} ${staffMember.staff.last_name || ''}` : 
                                  'Staff Member'
                                }
                              </CardTitle>
                              <CardDescription>@{staffMember.staff?.username}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Role:</span>
                              <span className="font-medium">{staffMember.role}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Position:</span>
                              <span>{staffMember.position || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant={staffMember.is_active ? "success" : "secondary"}>
                                {staffMember.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            {staffMember.started_at && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Started:</span>
                                <span>{new Date(staffMember.started_at).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
