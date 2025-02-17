import AdminLayout from "@/Layouts/AdminLayout";
import React from 'react';
import { Head } from "@inertiajs/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, ShoppingBag, CalendarCheck, ChevronDown } from 'lucide-react';

const salesData = [
    { week: 24, value: 4000 },
    { week: 25, value: 3500 },
    { week: 26, value: 7000 },
    { week: 27, value: 6500 },
    { week: 28, value: 5000 },
    { week: 29, value: 5500 },
    { week: 30, value: 10000 },
    { week: 31, value: 10500 },
    { week: 32, value: 14000 },
    { week: 33, value: 15000 },
    { week: 34, value: 16000 },
    { week: 35, value: 16500 }
];

const categories = [
    { name: 'Haircut', earnings: '₱8.6k', appointments: '4,500' },
    { name: 'Beard Grooming', earnings: '₱3.1k', appointments: '3,700' },
    { name: 'Hairstyling', earnings: '₱2.9k', appointments: '2,300' }
];

const topShops = [
    { name: 'Dean Wong', appointments: 300, avatar: '/api/placeholder/32/32' },
    { name: 'Elou T', appointments: 271, avatar: '/api/placeholder/32/32' },
    { name: "Jamir's Beauty Lounge", appointments: 264, avatar: '/api/placeholder/32/32' },
    { name: "Paul's Barbershop", appointments: 223, avatar: '/api/placeholder/32/32' },
    { name: 'Gusti n john', appointments: 190, avatar: '/api/placeholder/32/32' }
];

const BestCategoriesCard = ({ categories }) => {
    return (
        <Card className="w-full ">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Best Categories</CardTitle>
                <div className="flex items-center gap-2 px-3 py-1 bg-background border rounded-lg text-sm">
                    28 June - 10 Jul
                    <ChevronDown className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-3 text-sm text-foreground">
                        <div>Categories</div>
                        <div>Earnings</div>
                        <div>Completed Appointments</div>
                    </div>

                    {categories.map((category) => (
                        <div key={category.name} className="grid grid-cols-3 items-center">
                            <div className="font-medium">{category.name}</div>
                            <div className="font-medium">{category.earnings}</div>
                            <div className="text-foreground">{category.appointments}</div>
                        </div>
                    ))}

                    <div className="text-right">
                        <button className="text-gray-500 text-sm">View More</button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


export default function Analytics() {
    return (
        <AdminLayout>
            <Head title="Analytics" />
            <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
            </div>
            <div className="figtree-medium  space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-background rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">₱ 20,400.00</h2>
                                <span className="text-green-500 text-sm">↗ 13.02%</span>
                            </div>
                            <select className="border rounded-md px-2 py-1 bg-background text-foreground figtree-light">
                                <option>This Week</option>
                                <option>Last Week</option>
                                <option>Last Month</option>
                            </select>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData}>
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip
                                        content={({ payload, label }) => {
                                            return (
                                            <div style={{ backgroundColor: 'transparent', border: 'none', padding: '5px' }}> {/* Style the outer div */}
                                                {/* Tooltip content here (label, data items, etc.) */}
                                                <p>{label}</p>
                                                {payload && payload.length > 0 && (
                                                    <ul>
                                                        {payload.map((item, index) => (
                                                            <li key={index}>
                                                                {item.name}: {item.value}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            );
                                        }}
                                        />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-sm text-gray-600">Total Sales</span>
              </div>
              <div className="mt-2">
                <h3 className="text-2xl figtree-bold">₱ 20,400.00</h3>
                <span className="text-green-500 text-sm">↗ 13.02% From May</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm text-gray-600">Registered shops</span>
              </div>
              <div className="mt-2">
                <h3 className="text-2xl figtree-bold">230</h3>
                <span className="text-sm text-foreground cursor-pointer">View More</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CalendarCheck className="w-4 h-4" />
                <span className="text-sm text-gray-600">Successful Appointments</span>
              </div>
              <div className="mt-2">
                <h3 className="text-2xl figtree-bold">607</h3>
                <span className="text-green-500 text-sm">↗ 6.02% From May</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm text-gray-600">Registered Users</span>
              </div>
              <div className="mt-2">
                <h3 className="text-2xl figtree-bold">3,600</h3>
                <span className="text-sm text-foreground cursor-pointer">View More</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

                {/* Categories and Top Shops */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BestCategoriesCard categories={categories} /> {/* Use the new component */}

                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg figtree-medium mb-6">Top Shops</h3>
                            <div className="space-y-4">
                                {topShops.map((shop, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-gray-500">{index + 1}</span>
                                            <img
                                                src={shop.avatar}
                                                alt={shop.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span>{shop.name}</span>
                                        </div>
                                        <span className="text-gray-600">{shop.appointments}</span>
                                    </div>
                                ))}
                                <button className="w-full text-center text-gray-500 mt-4">
                                    Load More
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}