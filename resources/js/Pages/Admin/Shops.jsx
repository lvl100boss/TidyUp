import React, { useState, useEffect } from "react";
import { router, Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown, Search, Eye, Store } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Toaster } from "sonner";

export default function Shops({ shops, filters }) {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(filters?.status || "all");

  useEffect(() => {
    // Check if shops is an array before setting the data
    if (Array.isArray(shops)) {
      setData(shops);
    } else {
      // Log if shops is missing or is not an array
      console.warn("Shops data is missing or is not an array:", shops);
      setData([]); // Ensure data is an empty array to prevent errors
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

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      let aValue, bValue;

      switch (key) {
        case 'user_name':
          aValue = a.user ? `${a.user.first_name} ${a.user.last_name}` : '';
          bValue = b.user ? `${b.user.first_name} ${b.user.last_name}` : '';
          break;
        case 'categories':
          aValue = a.shopCategories && a.shopCategories.length > 0
            ? a.shopCategories.map(c => c.categories?.name || '').join(', ')
            : '';
          bValue = b.shopCategories && b.shopCategories.length > 0
            ? b.shopCategories.map(c => c.categories?.name || '').join(', ')
            : '';
          break;
        case 'date_registered':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = a[key];
          bValue = b[key];
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
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

  return (
    <AdminLayout>
      <Head title="Shops" />
      <Toaster />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Shop Registration</h1>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Shop"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { key: 'no', label: 'No.' },
                  { key: 'shop_name', label: 'Shop Name' },
                  { key: 'user_name', label: 'Shop Owner' },
                  { key: 'categories', label: 'Categories' },
                  { key: 'date_registered', label: 'Date Registered' },
                  { key: 'status', label: 'Status' },
                  { key: 'actions', label: 'Actions' },
                ].map((header) => (
                  <TableHead key={header.key}>
                    <button
                      onClick={() => header.key !== 'actions' && header.key !== 'no' && handleSort(header.key)}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>{header.label}</span>
                      {header.key !== 'actions' && header.key !== 'no' && <ArrowUpDown className="h-4 w-4" />}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((shop, index) => (
                  <TableRow key={shop.id} className="hover:bg-background hover:text-foreground transition-colors">
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{index + 1}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{shop.shop_name}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {shop.user ? `${shop.user.first_name} ${shop.user.last_name}` : 'Unknown'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
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
                        <span className="text-muted-foreground">No categories</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(shop.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(shop.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.visit(route('admin.shops.show', shop.id))}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Details
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

        {shops.links && (
          <div className="flex justify-center mt-4">
            {shops.links.map((link, key) => (
              link.url ? (
                <Button
                  key={key}
                  variant={link.active ? "default" : "outline"}
                  onClick={() => {
                    router.get(link.url, {
                      preserveScroll: true,
                      preserveState: true,
                      only: ['shops']
                    });
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Button>
              ) : (
                <Button key={key} variant="outline" disabled>
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Button>
              )
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
