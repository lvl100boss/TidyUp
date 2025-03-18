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
  CalendarIcon
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

export default function ShopVerificationIndex({ shops, stats }) {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShops, setFilteredShops] = useState(shops || []);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc"
  });

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
        shop.shop_name.toLowerCase().includes(term) ||
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

  return (
    <AdminLayout>
      <Head title="Shop Verification" />
      
      <h1 className="text-2xl font-bold mb-6">Shop Verification</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-600 flex items-center gap-2">
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
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Verified Shops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
            <p className="text-sm text-muted-foreground">Active on the platform</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600 flex items-center gap-2">
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
            <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="processing">
                    Pending <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">{stats.processing}</span>
                  </TabsTrigger>
                  <TabsTrigger value="verified">Verified</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2 w-1/3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search shops..." 
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <TabsContent value="all" className="m-0">
                <ShopTable 
                  shops={filteredShops} 
                  handleSort={handleSort} 
                  sortConfig={sortConfig}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </TabsContent>
              
              <TabsContent value="processing" className="m-0">
                <ShopTable 
                  shops={filteredShops} 
                  handleSort={handleSort} 
                  sortConfig={sortConfig}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </TabsContent>
              
              <TabsContent value="verified" className="m-0">
                <ShopTable 
                  shops={filteredShops} 
                  handleSort={handleSort} 
                  sortConfig={sortConfig}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </TabsContent>
              
              <TabsContent value="rejected" className="m-0">
                <ShopTable 
                  shops={filteredShops} 
                  handleSort={handleSort} 
                  sortConfig={sortConfig}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

// Table component to avoid repetition
function ShopTable({ shops, handleSort, sortConfig, getStatusBadge, formatDate }) {
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
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>
              <button 
                className="flex items-center space-x-1 hover:text-foreground/80"
                onClick={() => handleSort("shop_name")}
              >
                Shop Name {getSortIcon("shop_name")}
              </button>
            </TableHead>
            <TableHead>
              <button 
                className="flex items-center space-x-1 hover:text-foreground/80"
                onClick={() => handleSort("owner_name")}
              >
                Shop Owner {getSortIcon("owner_name")}
              </button>
            </TableHead>
            <TableHead>
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
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/${shop.shop_photo}`} alt={shop.shop_name} />
                      <AvatarFallback>{shop.shop_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{shop.shop_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {shop.user ? `${shop.user.first_name} ${shop.user.last_name}` : "Unknown"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{formatDate(shop.created_at)}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(shop.status)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/shops/${shop.id}`}>
                      <EyeIcon className="h-4 w-4 mr-1" /> 
                      View
                    </Link>
                  </Button>
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
