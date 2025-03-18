import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Maximize, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import DocumentImage from '@/Components/DocumentImage';
import ShopGalleryImage from '@/Components/Shop/ShopGalleryImage';

export default function ShopDetail({ shop, categories, rawCategoriesData }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  
  // Handle shop verification
  const handleVerifyShop = () => {
    fetch(`/admin/shops/${shop.id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      }
    })
    .then(response => response.json())
    .then(data => {
      toast.success("Shop has been verified successfully");
      setTimeout(() => {
        router.visit(`/admin/shops`);
      }, 1500);
    })
    .catch(error => {
      toast.error("Failed to verify shop");
      console.error('Error:', error);
    });
  };

  // Handle shop rejection
  const handleRejectShop = () => {
    fetch(`/admin/shops/${shop.id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ reason: rejectionReason })
    })
    .then(response => response.json())
    .then(data => {
      toast.success("Shop has been rejected");
      setTimeout(() => {
        router.visit(`/admin/shops`);
      }, 1500);
    })
    .catch(error => {
      toast.error("Failed to reject shop");
      console.error('Error:', error);
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

  // Function to get categories data from different sources
  const getCategoriesData = () => {
    // Try to get categories from the relationship
    if (shop.shopCategories && Array.isArray(shop.shopCategories)) {
      const validCategories = shop.shopCategories
        .filter(category => category && category.categories)
        .map(category => category.categories);
        
      if (validCategories.length > 0) {
        return validCategories;
      }
    }
    
    // Try to get from raw categories
    if (shop.rawCategories && shop.rawCategories.length > 0) {
      return shop.rawCategories;
    }
    
    // Try from raw data passed to component
    if (rawCategoriesData && rawCategoriesData.length > 0) {
      return rawCategoriesData;
    }
    
    return [];
  };

  // Handle status change - FIXED with safer CSRF token handling
  const handleStatusChange = () => {
    if (!newStatus || newStatus === shop.status) {
      setStatusChangeDialogOpen(false);
      return;
    }
  
    toast.info(`Updating shop status from ${shop.status} to ${newStatus}...`);
    console.log("Current shop data:", shop);
    console.log("Attempting status change:", {from: shop.status, to: newStatus});
  
    // Get CSRF token safely
    let csrfToken;
    try {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      csrfToken = metaTag ? metaTag.getAttribute('content') : '';
      
      if (!csrfToken) {
        console.warn('CSRF token not found, trying to get it from page.props.csrf');
        // Try to get it from Inertia page props if available (sometimes available this way)
        if (window.page && window.page.props && window.page.props.csrf) {
          csrfToken = window.page.props.csrf;
        } else {
          console.error('CSRF token not available');
        }
      }
    } catch (error) {
      console.error('Error getting CSRF token:', error);
      csrfToken = '';
    }
    
    let endpoint, payload = {};
    
    if (newStatus === 'rejected') {
      if (!rejectionReason.trim()) {
        toast.error("Please provide a rejection reason");
        return;
      }
      endpoint = `/admin/shops/${shop.id}/reject`;
      payload = { reason: rejectionReason };
    } else if (newStatus === 'verified') {
      endpoint = `/admin/shops/${shop.id}/verify`;
    } else {
      endpoint = `/admin/shops/${shop.id}/update-status`;
      payload = { status: newStatus };
    }
  
    console.log(`Making request to ${endpoint} with:`, payload);
    
    // Use Inertia router.post instead of fetch for better CSRF handling
    if (endpoint === `/admin/shops/${shop.id}/update-status`) {
      router.post(endpoint, payload, {
        preserveState: false,
        onSuccess: () => {
          toast.success(`Shop status updated to ${newStatus}`);
          setTimeout(() => window.location.reload(), 1500);
        },
        onError: (errors) => {
          console.error('Status update error:', errors);
          toast.error(`Failed to update status: ${errors.message || 'Unknown error'}`);
        },
        onFinish: () => {
          setStatusChangeDialogOpen(false);
        }
      });
    } 
    else if (endpoint === `/admin/shops/${shop.id}/reject`) {
      router.post(endpoint, { reason: rejectionReason }, {
        preserveState: false,
        onSuccess: () => {
          toast.success(`Shop has been rejected`);
          setTimeout(() => window.location.reload(), 1500);
        },
        onError: (errors) => {
          console.error('Rejection error:', errors);
          toast.error(`Failed to reject shop: ${errors.message || 'Unknown error'}`);
        },
        onFinish: () => {
          setStatusChangeDialogOpen(false);
        }
      });
    }
    else {
      router.post(endpoint, {}, {
        preserveState: false,
        onSuccess: () => {
          toast.success(`Shop has been verified`);
          setTimeout(() => window.location.reload(), 1500);
        },
        onError: (errors) => {
          console.error('Verification error:', errors);
          toast.error(`Failed to verify shop: ${errors.message || 'Unknown error'}`);
        },
        onFinish: () => {
          setStatusChangeDialogOpen(false);
        }
      });
    }
  };

  // Added initialization for newStatus when dialog opens
  const openStatusDialog = () => {
    setNewStatus(shop.status || 'processing');
    setRejectionReason('');
    setStatusChangeDialogOpen(true);
    
    // Log the current shop status
    console.log("Current shop status:", shop.status);
  };

  return (
    <AdminLayout>
      <Head title={`Shop: ${shop.shop_name}`} />
      <Toaster />
      
      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-2">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Full size preview" 
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => window.open(selectedImage, '_blank')}
              className="mr-2"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
            <Button 
              onClick={() => setImageDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Status Change Dialog */}
      <Dialog open={statusChangeDialogOpen} onOpenChange={(open) => {
        if (open) {
          setNewStatus(shop.status || 'processing');
          console.log("Opening dialog with status:", shop.status);
        }
        setStatusChangeDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Shop Verification Status</DialogTitle>
            <DialogDescription>
              Select a new status for this shop. This will determine whether the shop is visible to customers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            {['processing', 'verified', 'rejected'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id={`status-${status}`} 
                  name="status" 
                  value={status}
                  checked={newStatus === status} 
                  onChange={(e) => {
                    setNewStatus(e.target.value);
                    if (e.target.value !== 'rejected') setRejectionReason('');
                  }}
                />
                <label htmlFor={`status-${status}`} className="flex items-center">
                  <Badge className={status === 'processing' ? 'bg-orange-500' : status === 'verified' ? 'bg-green-500' : 'bg-red-500'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
                  <span className="ml-2">{status === 'processing' ? 'Under review' : status === 'verified' ? 'Approved and visible to customers' : 'Not approved'}</span>
                </label>
              </div>
            ))}
            
            {newStatus === 'rejected' && (
              <Textarea
                placeholder="Provide a reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setStatusChangeDialogOpen(false);
                setNewStatus(shop.status);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStatusChange}
              disabled={!newStatus || 
                (newStatus === 'rejected' && !rejectionReason.trim()) || 
                newStatus === shop.status}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/shops">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shops
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{shop.shop_name}</h1>
          {getStatusBadge(shop.status)}
        </div>
        
        {/* Replace the conditional buttons with a single status change button */}
        <Button
          variant="outline"
          onClick={openStatusDialog}
        >
          Change Status
        </Button>
      </div>
      
      {shop.status === 'rejected' && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-red-800">Rejection Reason:</h3>
            <p className="text-red-700">{shop.rejection_reason}</p>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Shop Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="divide-y">
                  <div className="py-2 flex justify-between">
                    <dt className="font-medium">Shop Name</dt>
                    <dd>{shop.shop_name}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="font-medium">Registration Date</dt>
                    <dd>{new Date(shop.created_at).toLocaleDateString()}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="font-medium">Owner</dt>
                    <dd>{shop.user ? `${shop.user.first_name} ${shop.user.last_name}` : 'Unknown'}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="font-medium">Email</dt>
                    <dd>{shop.email}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="font-medium">Phone</dt>
                    <dd>{shop.phone}</dd>
                  </div>
                  <div className="py-2">
                    <dt className="font-medium">Bio</dt>
                    <dd className="mt-1">{shop.bio}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="divide-y">
                  <div className="py-2 flex justify-between">
                    <dt className="font-medium">Region</dt>
                    <dd>{shop.region}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="font-medium">Province</dt>
                    <dd>{shop.province}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="font-medium">City</dt>
                    <dd>{shop.city}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="font-medium">Barangay</dt>
                    <dd>{shop.barangay}</dd>
                  </div>
                  <div className="py-2">
                    <dt className="font-medium">Detailed Address</dt>
                    <dd className="mt-1">{shop.detailed_address}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const categoriesData = getCategoriesData();
                  
                  if (categoriesData.length > 0) {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {categoriesData.map((category, index) => (
                          <Badge key={index} variant="secondary">
                            {category.name || 'Unknown Category'}
                          </Badge>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <p className="text-gray-500">No categories found for this shop</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            console.log('Debug shop data:', shop);
                            console.log('Debug categories:', categories);
                            console.log('Debug raw data:', rawCategoriesData);
                          }}
                        >
                          Debug Data
                        </Button>
                      </div>
                    );
                  }
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Permit</CardTitle>
              </CardHeader>
              <CardContent>
                {shop.business_permit ? (
                  <div className="flex flex-col gap-2">
                    <div className="border rounded p-2 bg-gray-50 mb-2 min-h-[200px] flex items-center justify-center">
                      <DocumentImage 
                        src={shop.business_permit}
                        alt="Business Permit" 
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Try both possible locations
                        const url = shop.business_permit;
                        window.open(url, '_blank');
                      }}
                    >
                      View Full Size
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded bg-gray-50 flex flex-col items-center justify-center h-[200px]">
                    <p className="text-muted-foreground mb-2">No business permit uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Similar updates for other document cards */}
            <Card>
              <CardHeader>
                <CardTitle>DTI Registration</CardTitle>
              </CardHeader>
              <CardContent>
                {shop.dti_registration ? (
                  <div className="flex flex-col gap-2">
                    <div className="border rounded p-2 bg-gray-50 mb-2 min-h-[200px] flex items-center justify-center">
                      <DocumentImage 
                        src={shop.dti_registration}
                        alt="DTI Registration" 
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(shop.dti_registration, '_blank')}
                    >
                      View Full Size
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded bg-gray-50 flex items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">No DTI registration uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Similar updates for Valid ID */}
            <Card>
              <CardHeader>
                <CardTitle>Valid ID</CardTitle>
              </CardHeader>
              <CardContent>
                {shop.valid_id ? (
                  <div className="flex flex-col gap-2">
                    <div className="border rounded p-2 bg-gray-50 mb-2 min-h-[200px] flex items-center justify-center">
                      <DocumentImage 
                        src={shop.valid_id}
                        alt="Valid ID" 
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(shop.valid_id, '_blank')}
                    >
                      View Full Size
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded bg-gray-50 flex items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">No valid ID uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Gallery Tab - FIXED */}
        <TabsContent value="gallery">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Shop Gallery</CardTitle>
              <div>
                <span className="text-muted-foreground text-sm">
                  {shop.shopGallery ? shop.shopGallery.length : 0} images
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Main shop photo */}
                <div className="col-span-2 row-span-2 aspect-square rounded-md overflow-hidden border">
                  <div className="relative h-full group cursor-pointer"
                    onClick={() => {
                      setSelectedImage(shop.shop_photo);
                      setImageDialogOpen(true);
                    }}>
                    <ShopGalleryImage 
                      src={shop.shop_photo}
                      alt="Shop main photo"
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Maximize className="h-10 w-10 text-white" />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-blue-500">Main Photo</Badge>
                  </div>
                </div>
                
                {/* Shop gallery photos */}
                {shop.shopGallery && shop.shopGallery.map((image, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden border">
                    <div className="relative h-full group cursor-pointer"
                      onClick={() => {
                        setSelectedImage(image.url);
                        setImageDialogOpen(true);
                      }}>
                      <ShopGalleryImage 
                        src={image.url}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show placeholder if no gallery images */}
                {(!shop.shopGallery || shop.shopGallery.length === 0) && (
                  <div className="col-span-2 aspect-square rounded-md overflow-hidden border bg-gray-50 flex items-center justify-center">
                    <p className="text-gray-400">No gallery images available</p>
                  </div>
                )}
              </div>
              
              {/* Image metadata section */}
              {shop.shopGallery && shop.shopGallery.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Gallery Images Details</h3>
                  <div className="border rounded-md overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="py-2 px-4 text-left">#</th>
                          <th className="py-2 px-4 text-left">Preview</th>
                          <th className="py-2 px-4 text-left">File Name</th>
                          <th className="py-2 px-4 text-left">Path</th>
                          <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {shop.shopGallery.map((image, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 px-4">{index + 1}</td>
                            <td className="py-2 px-4">
                              <div className="w-12 h-12 relative">
                                <ShopGalleryImage 
                                  src={image.url} 
                                  alt={`Thumbnail ${index + 1}`} 
                                />
                              </div>
                            </td>
                            <td className="py-2 px-4 font-mono text-xs">
                              {image.url?.split('/').pop() || 'Unknown'}
                            </td>
                            <td className="py-2 px-4 font-mono text-xs truncate max-w-[200px]">
                              {image.url || 'No path available'}
                            </td>
                            <td className="py-2 px-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedImage(image.url);
                                  setImageDialogOpen(true);
                                }}
                              >
                                <Maximize className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Shop Services</CardTitle>
            </CardHeader>
            <CardContent>
              {shop.shopServiceCategories && shop.shopServiceCategories.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shop.shopServiceCategories.map((service, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="p-4">
                        <h3 className="font-semibold">{service.service_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.service_categories?.name || 'Uncategorized'}
                        </p>
                        <div className="mt-2 flex justify-between">
                          <span className="text-green-600 font-medium">₱{service.cost}</span>
                          <span className="text-sm text-muted-foreground">
                            {service.duration_hour > 0 ? `${service.duration_hour}h ` : ''}
                            {service.duration_minute > 0 ? `${service.duration_minute}min` : ''}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-10">No services added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
