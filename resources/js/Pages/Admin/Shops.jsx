import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";
import React, { useState } from 'react';

export default function Shops() {
  const initialData = [
    { id: "01", shopName: "Paul's Style", shopOwner: "Paul Phoenix", categories: "Hairdresser", dateRegistered: "10/5/24", status: "Processing" },
    { id: "02", shopName: "Gupit ni John", shopOwner: "John Doe", categories: "Barber", dateRegistered: "10/5/24", status: "Verified" },
    { id: "03", shopName: "Linda Beauty", shopOwner: "Linda Batumbakal", categories: "Makeup Artist, Nail Artist", dateRegistered: "10/5/24", status: "Rejected" },
    // ... add more data as needed
  ];

  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Search functionality
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setData(initialData);
    } else {
      const filteredData = initialData.filter(item =>
        Object.values(item).some(value => 
          value.toLowerCase().includes(term)
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
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'processing':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <AdminLayout>
      <Head title="Shops" />
      <div className="p-6 space-y-4">
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
            Sort by
          </Button>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <table className="min-w-full divide-y divide-border ">
            <thead className="bg-background">
              <tr>
                {['ID', 'Shop Name', 'Shop Owner', 'Categories', 'Date Registered', 'Status'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                  >
                    <button
                      onClick={() => handleSort(header.toLowerCase().replace(' ', ''))}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>{header}</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  
                ))}
                
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-foreground hover:text-foreground">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.shopName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.shopOwner}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.categories}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.dateRegistered}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(row.status)}`}>
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
