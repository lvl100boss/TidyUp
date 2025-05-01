import React, { useState, useEffect } from "react";
import { router, Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, Eye, Store, CalendarIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { toast, Toaster } from "sonner";
import { addDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";
import { Label } from "@/Components/ui/label";

export default function Shops({ shops, filters }) {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(filters?.status || "all");
  const [dateRange, setDateRange] = useState({
    from: filters?.dateFrom ? new Date(filters.dateFrom) : null,
    to: filters?.dateTo ? new Date(filters.dateTo) : null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    // Filter out future-dated shops and set initial data
    if (Array.isArray(shops)) {
      const currentDate = new Date();
      const filteredShops = shops.filter(shop => {
        const shopDate = new Date(shop.created_at);
        return shopDate <= currentDate;
      });
      setData(filteredShops);
    } else {
      console.warn("Shops data is missing or is not an array:", shops);
      setData([]);
    }
  }, [shops]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    router.get(
      route('admin.shops'),
      { search: term, status: statusFilter, page: 1 },
      { 
        preserveState: true,
        replace: true,
        only: ['shops']
      }
    );
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);

    router.get(
      route('admin.shops'),
      { search: searchTerm, status: value, page: 1 },
      { 
        preserveState: true,
        replace: true,
        only: ['shops']
      }
    );
  };

  const handleDateFilter = (newRange) => {
    const currentDate = new Date();
    
    // Validate the date range
    if (newRange.from && newRange.to && newRange.to < newRange.from) {
      newRange.to = newRange.from;
    }
    
    setDateRange(newRange);
    
    // Filter the data based on the validated date range and current date
    const filteredData = shops.filter(shop => {
      const shopDate = new Date(shop.created_at);
      
      // Skip future dates
      if (shopDate > currentDate) return false;
      
      if (newRange.from && newRange.to) {
        return shopDate >= newRange.from && shopDate <= newRange.to;
      } else if (newRange.from) {
        return shopDate >= newRange.from;
      } else if (newRange.to) {
        return shopDate <= newRange.to;
      }
      return true;
    });

    setData(filteredData);
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange({ from: null, to: null });
    setData(shops);
    setCurrentPage(1);
    
    router.get(
        route('admin.shops'),
        { page: 1 },
        { 
            preserveState: true,
            replace: true,
            only: ['shops']
        }
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    router.get(
        route('admin.shops'),
        { 
            search: searchTerm, 
            status: statusFilter,
            page: page,
            dateFrom: dateRange.from?.toISOString() || null,
            dateTo: dateRange.to?.toISOString() || null,
        },
        { 
            preserveState: true,
            preserveScroll: true,
            only: ['shops']
        }
    );
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

  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return "Filter by Date";
    if (dateRange.from && dateRange.to) {
        return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
    }
    return dateRange.from ? 
        `From ${dateRange.from.toLocaleDateString()}` : 
        `Until ${dateRange.to.toLocaleDateString()}`;
  };

  return (
    <AdminLayout>
      <Head title="Shops" />
      <Toaster />
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">Shop Registration</h1>
          
          {/* Mobile filter button */}
          <div className="md:hidden">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Filter shops by different criteria
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="mobile-search"
                        placeholder="Search Shop"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['all', 'processing', 'verified', 'rejected'].map((status) => (
                        <Button 
                          key={status}
                          variant={statusFilter === status ? "default" : "outline"}
                          onClick={() => handleStatusFilter(status)}
                          className="capitalize"
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">From</p>
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => handleDateFilter({ ...dateRange, from: date })}
                        disabled={(date) => date > new Date()}
                        className="rounded-md border"
                      />
                      
                      <p className="text-sm font-medium mt-4">To</p>
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => handleDateFilter({ ...dateRange, to: date })}
                        disabled={(date) => 
                          (dateRange.from && date < dateRange.from) || 
                          date > new Date()
                        }
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleReset();
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full mt-4"
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Shop"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          
          <div className="flex space-x-2">
            {['all', 'processing', 'verified', 'rejected'].map((status) => (
              <Button 
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => handleStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[190px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="flex flex-col md:flex-row gap-4 p-3">
                <div>
                  <p className="text-sm font-medium mb-2">From</p>
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => handleDateFilter({ ...dateRange, from: date })}
                    disabled={(date) => date > new Date()} // Prevent future dates
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
                      (dateRange.from && date < dateRange.from) || // Prevent dates before start date
                      date > new Date() // Prevent future dates
                    }
                    initialFocus
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="px-4"
          >
            Reset
          </Button>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">No.</TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Shop Name</TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider hidden md:table-cell">Shop Owner</TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider hidden lg:table-cell">Categories</TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider hidden sm:table-cell">Date</TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-medium text-foreground uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((shop, index) => (
                  <TableRow key={shop.id} className="hover:bg-background hover:text-foreground transition-colors">
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm">{((currentPage - 1) * itemsPerPage) + index + 1}</TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm">{shop.shop_name}</TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm hidden md:table-cell">
                      {shop.user ? `${shop.user.first_name} ${shop.user.last_name}` : 'Unknown'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm hidden lg:table-cell">
                      {shop.shop_categories && shop.shop_categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {shop.shop_categories
                            .filter(cat => cat.categories)
                            .map((cat) => (
                              <Badge key={cat.id} variant="outline" className="mr-1">
                                {cat.categories.name}
                              </Badge>
                            ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm hidden sm:table-cell">
                      {new Date(shop.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm">
                      {getStatusBadge(shop.status)}
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.visit(route('admin.shops.show', shop.id))}
                        >
                          <Eye className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Store className="h-8 w-8 mb-2" />
                      <p>No shops found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center mt-4 flex-wrap gap-2">
          {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => handlePageChange(page)}
              size="sm"
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
