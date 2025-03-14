import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, Eye } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/components/ui/badge";
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

export default function Shops({ shops, categories, rawCategoriesData }) {
  const [data, setData] = useState(shops || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Add more detailed console logging
  useEffect(() => {
    if (shops) {
      console.log('Shops data:', shops);
      console.log('Raw categories data:', rawCategoriesData);
      
      // Check each shop's categories
      shops.forEach((shop) => {
        const shopCategoriesData = rawCategoriesData ? 
          rawCategoriesData.filter(cat => cat.shop_id === shop.id) : [];
          
        console.log(`Shop ${shop.id} (${shop.shop_name}):`);
        console.log('- Categories from relationship:', shop.shopCategories || []);
        console.log('- Categories from raw data:', shopCategoriesData);
        console.log('- Raw categories added to shop:', shop.shopCategoriesRaw || []);
      });
    }
  }, [shops, rawCategoriesData]);

  // Search functionality
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setData(shops);
    } else {
      const filteredData = shops.filter(item =>
        Object.values({
          id: item.id,
          shop_name: item.shop_name,
          user_name: item.user ? `${item.user.first_name} ${item.user.last_name}` : '',
          // Use shopCategories instead of shop_categories
          categories: item.shopCategories && item.shopCategories.map(c => c.categories?.name).join(', '),
          created_at: new Date(item.created_at).toLocaleDateString()
        }).some(value => 
          String(value).toLowerCase().includes(term)
        )
      );
      setData(filteredData);
    }
  };

  // Sorting functionality
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      let aValue, bValue;
      
      // Handle nested properties and special cases
      switch(key) {
        case 'user_name':
          aValue = a.user ? `${a.user.first_name} ${a.user.last_name}` : '';
          bValue = b.user ? `${b.user.first_name} ${b.user.last_name}` : '';
          break;
        case 'categories':
          // Use shopCategories instead of shop_categories
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

  // Status color mapping
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
  
  // Function to get categories for a shop
  const getShopCategories = (shop) => {
    // Try to get categories from the relationship
    if (shop.shopCategories && Array.isArray(shop.shopCategories) && shop.shopCategories.length > 0) {
      return shop.shopCategories
        .filter(cat => cat && cat.categories)
        .map(cat => cat.categories);
    }
    
    // Try to get from the raw categories we added
    if (shop.shopCategoriesRaw && shop.shopCategoriesRaw.length > 0) {
      return shop.shopCategoriesRaw.map(cat => ({
        name: cat.category_name
      }));
    }
    
    // Try to match from the raw data passed to component
    if (rawCategoriesData) {
      const matchingCategories = rawCategoriesData
        .filter(cat => cat.shop_id === shop.id)
        .map(cat => ({ name: cat.category_name }));
      
      if (matchingCategories.length > 0) {
        return matchingCategories;
      }
    }
    
    return [];
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
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  {key: 'id', label: 'ID'}, 
                  {key: 'shop_name', label: 'Shop Name'}, 
                  {key: 'user_name', label: 'Shop Owner'}, 
                  {key: 'categories', label: 'Categories'}, 
                  {key: 'date_registered', label: 'Date Registered'}, 
                  {key: 'status', label: 'Status'},
                  {key: 'actions', label: 'Actions'}
                ].map((header) => (
                  <TableHead key={header.key}>
                    <button
                      onClick={() => header.key !== 'actions' && handleSort(header.key)}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>{header.label}</span>
                      {header.key !== 'actions' && <ArrowUpDown className="h-4 w-4" />}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((shop) => (
                <TableRow key={shop.id} className="hover:bg-background hover:text-foreground transition-colors">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{shop.id}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{shop.shop_name}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {shop.user ? `${shop.user.first_name} ${shop.user.last_name}` : 'Unknown'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {(() => {
                      const shopCategories = getShopCategories(shop);
                      
                      if (shopCategories.length > 0) {
                        return (
                          <div className="flex flex-wrap gap-1">
                            {shopCategories.map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="mr-1">
                                {cat.name || 'Unknown'}
                              </Badge>
                            ))}
                          </div>
                        );
                      } else if (shop.shopCategoriesRaw) {
                        return (
                          <div className="flex flex-wrap gap-1">
                            {shop.shopCategoriesRaw.map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="mr-1">
                                {cat.category_name || 'Unknown'}
                              </Badge>
                            ))}
                          </div>
                        );
                      } else {
                        return <span className="text-amber-600">No categories available</span>;
                      }
                    })()}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Date(shop.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(shop.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Link href={`/admin/shops/${shop.id}`}>
                        <Button size="sm" variant="outline" className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" /> View Details
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
