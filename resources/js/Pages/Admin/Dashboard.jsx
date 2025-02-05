import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

// Data for charts
const revenueData = [
  { day: 1, value: 2000 },
  { day: 2, value: 3000 },
  { day: 3, value: 8000 },
  { day: 4, value: 8500 },
  { day: 5, value: 9000 },
  { day: 6, value: 9500 },
  { day: 7, value: 10000 },
];

const accountsData = [
  { day: 1, value: 2000 },
  { day: 2, value: 8000 },
  { day: 3, value: 9000 },
  { day: 4, value: 8500 },
  { day: 5, value: 9000 },
  { day: 6, value: 9500 },
  { day: 7, value: 15312 },
];

// Data for reports and tables
const reports = [
  { name: 'Ian Cazelli', message: 'Great app, easy to talk', color: 'bg-green-600' },
  { name: 'Hervoyne Alano', message: 'User-friendly interface, really easy to navigate.', color: 'bg-yellow-500' },
  { name: 'Myke Tuminbang', message: 'Convenient appointment booking, will use again.', color: 'bg-blue-400' }
];

const customers = [
  { username: 'Anthony Labong', dateCreated: '10/14/24' },
  { username: 'Zachary Saturrbukol', dateCreated: '10/13/24' }
];

const shops = [
  { shopName: 'Antonello', dateCreated: '10/14/24' },
  { shopName: 'Dean Wong', dateCreated: '10/13/24' }
];

const categories = [
  { category: 'Haircut', totalAppointments: 4500 },
  { category: 'Beard Grooming', totalAppointments: 2700 }
];

const popularShops = [
  { sellers: 'Dean Wong', successfulAppointments: 300 },
  { sellers: 'Elso 7', successfulAppointments: 271 }
];

export default function Dashboard() {
  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />

      <div className=" space-y-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-lg">Super Admin</h2>
          <p className="text-2xl">Dave Jamir Basa</p>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">₱ 20400.00</CardTitle>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-xs text-gray-400">7 days</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Accounts Chart */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">15,312</CardTitle>
                <p className="text-sm text-gray-500">Accounts Registered</p>
                <p className="text-xs text-gray-400">7 days</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accountsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Section */}
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full ${report.color}`} />
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customers Table */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Customers</CardTitle>
              <button className="text-sm">Sort by</button>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Username</th>
                    <th className="text-right">Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={index}>
                      <td className="py-2">{customer.username}</td>
                      <td className="text-right">{customer.dateCreated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Shops Table */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Shops</CardTitle>
              <button className="text-sm">Sort by</button>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Shop Name</th>
                    <th className="text-right">Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((shop, index) => (
                    <tr key={index}>
                      <td className="py-2">{shop.shopName}</td>
                      <td className="text-right">{shop.dateCreated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Popular Categories</CardTitle>
              <button className="text-sm">Sort by</button>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Category</th>
                    <th className="text-right">Total Appointments</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={index}>
                      <td className="py-2">{category.category}</td>
                      <td className="text-right">{category.totalAppointments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Popular Shops Table */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Popular Shops</CardTitle>
              <button className="text-sm">Sort by</button>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Sellers</th>
                    <th className="text-right">Successful Appointments</th>
                  </tr>
                </thead>
                <tbody>
                  {popularShops.map((shop, index) => (
                    <tr key={index}>
                      <td className="py-2">{shop.sellers}</td>
                      <td className="text-right">{shop.successfulAppointments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
