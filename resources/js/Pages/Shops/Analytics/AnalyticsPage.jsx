import React, { useState, useMemo, useEffect, useCallback } from 'react'
import ShopsLayout from '@/Layouts/ShopsLayout'
import { Head, router } from '@inertiajs/react'
import { Button } from "@/Components/ui/button"
import { Download } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import { format } from 'date-fns'
import { DollarSign, CalendarDays, Activity } from 'lucide-react'
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
} from 'recharts'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select"

const AnalyticsPage = ({ shop, analytics }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount || 0);
    };

    const STATUS_CHART_COLORS = {
        completed: "hsl(var(--chart-1))",
        pending: "hsl(var(--chart-2))",
        upcoming: "hsl(var(--chart-3))",
        cancelled: "hsl(var(--chart-4))",
        declined: "hsl(var(--chart-5))",
        no_show: "hsl(var(--chart-6))"
    };

    const STATUS_LABELS = {
        completed: 'Completed',
        pending: 'Pending',
        upcoming: 'Upcoming',
        cancelled: 'Cancelled',
        declined: 'Declined',
        no_show: 'No Show'
    };

    const appointmentStatusData = useMemo(() => Object.entries(analytics.basicStats.appointmentStats || {})
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({
            status: status,
            name: STATUS_LABELS[status],
            value: count,
            fill: STATUS_CHART_COLORS[status]
        })), [analytics.basicStats.appointmentStats]);

    const revenueStats = analytics?.revenueStats || {
        totalRevenue: 0,
        monthlyRevenue: 0,
        yearlyRevenue: [],
        monthlyRevenueByWeek: [],
        weeklyRevenue: [],
        yearlyTotals: []
    };

    const testData = [
        { year: 2020, revenue: 50000 },
        { year: 2021, revenue: 75000 },
        { year: 2022, revenue: 100000 },
        { year: 2023, revenue: 125000 },
        { year: 2024, revenue: 80000 },
    ];

    const yearlyTotalsData = revenueStats.yearlyTotals?.length > 0
        ? revenueStats.yearlyTotals
        : testData;

    const CHART_COLORS = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
        "hsl(var(--chart-6))",
    ];

    const peakHoursData = useMemo(() => analytics.peakHours.map(hour => ({
        name: format(new Date().setHours(hour.hour), 'h a'),
        appointments: hour.count,
        fill: "hsl(var(--chart-1))"
    })), [analytics.peakHours]);

    const popularServicesData = useMemo(() => analytics.popularServices.map((service, index) => ({
        name: service.service_name,
        bookings: service.service_count,
        fill: CHART_COLORS[index % CHART_COLORS.length]
    })), [analytics.popularServices]);

    const getMonthNames = () => [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const initialYear = analytics.revenueStats.selectedYear || (analytics.revenueStats.availableYears?.length > 0
        ? analytics.revenueStats.availableYears[analytics.revenueStats.availableYears.length - 1]
        : new Date().getFullYear());
    const [selectedYear, setSelectedYear] = useState(initialYear);

    useEffect(() => {
        if (selectedYear !== analytics.revenueStats.selectedYear) {
            router.get(route('shop.analytics'), { year: selectedYear }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['analytics'],
            });
        }
    }, [selectedYear, analytics.revenueStats.selectedYear]);

    const monthlyRevenueData = useMemo(() => {
        const monthNames = getMonthNames().map((name, index) => ({
            name: name,
            shortName: name.substring(0, 3),
            index: index + 1
        }));

        const monthlyDataFromProps = analytics?.revenueStats?.monthlyRevenueByMonth;

        if (!monthlyDataFromProps || !Array.isArray(monthlyDataFromProps)) {
            console.warn("Monthly revenue data from props is missing or invalid for the selected year.", analytics?.revenueStats);
            return monthNames.map(month => ({
                month: month.shortName,
                revenue: 0
            }));
        }

        return monthNames.map(monthInfo => {
            const monthData = monthlyDataFromProps.find(
                m => m.month === monthInfo.index
            );

            return {
                month: monthInfo.shortName,
                revenue: monthData ? monthData.revenue : 0
            };
        });
    }, [analytics?.revenueStats?.monthlyRevenueByMonth]);

    useEffect(() => {
        console.log("Weekly Revenue Data (Frontend):", analytics?.revenueStats?.weeklyRevenue);
    }, [analytics?.revenueStats?.weeklyRevenue]);

    const handleDownloadPdf = useCallback(() => {
        const downloadUrl = route('shop.analytics.downloadPdf', { year: selectedYear });
        window.location.href = downloadUrl;
    }, [selectedYear]);

    return (
        <ShopsLayout>
            <Head title="Analytics" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Analytics</h1>
                    <Button onClick={handleDownloadPdf} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Appointments</CardTitle>
                            <CardDescription>All time appointments with status breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row items-start gap-6">
                            <div className="flex-1">
                                <p className="text-4xl font-bold">{analytics.basicStats.totalAppointments}</p>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    {Object.entries(analytics.basicStats.appointmentStats || {}).map(([status, count]) => (
                                        <div key={status} className="space-y-1">
                                            <p className="text-sm text-muted-foreground">{STATUS_LABELS[status]}</p>
                                            <p className="text-xl font-semibold" style={{ color: STATUS_CHART_COLORS[status] }}>
                                                {count}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1">
                                <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent nameKey="name" hideLabel />}
                                        />
                                        <Pie
                                            data={appointmentStatusData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={80}
                                            strokeWidth={2}
                                            paddingAngle={5}
                                        >
                                            {appointmentStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                            <Label
                                                content={({ viewBox }) => {
                                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                        return (
                                                            <text
                                                                x={viewBox.cx}
                                                                y={viewBox.cy}
                                                                textAnchor="middle"
                                                                dominantBaseline="middle"
                                                            >
                                                                <tspan
                                                                    x={viewBox.cx}
                                                                    y={viewBox.cy}
                                                                    fill="hsl(var(--foreground))"
                                                                    style={{
                                                                        fontSize: "1.875rem",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                >
                                                                    {analytics.basicStats.totalAppointments.toLocaleString()}
                                                                </tspan>
                                                                <tspan
                                                                    x={viewBox.cx}
                                                                    y={(viewBox.cy || 0) + 20}
                                                                    fill="hsl(var(--muted-foreground))"
                                                                    style={{
                                                                        fontSize: "0.875rem",
                                                                    }}
                                                                >
                                                                    Appointments
                                                                </tspan>
                                                            </text>
                                                        );
                                                    }
                                                }}
                                            />
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Overview</CardTitle>
                            <CardDescription>Financial performance summary</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-6 w-6 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                                        <p className="text-2xl font-bold">{formatCurrency(revenueStats.totalRevenue)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CalendarDays className="h-6 w-6 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">This Month's Revenue</p>
                                        <p className="text-2xl font-bold">{formatCurrency(revenueStats.monthlyRevenue)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Activity className="h-6 w-6 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Average Daily Revenue (Last 7 Days)</p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(
                                                revenueStats.weeklyRevenue?.length
                                                    ? revenueStats.weeklyRevenue.reduce((acc, curr) => acc + (curr.revenue || 0), 0) / revenueStats.weeklyRevenue.length
                                                    : 0
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Yearly Revenue</CardTitle>
                            <CardDescription>Total revenue by year</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[400px] w-full">
                                <AreaChart
                                    data={revenueStats.yearlyTotals}
                                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                                    accessibilityLayer
                                >
                                    <defs>
                                        <linearGradient id="yearlyRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.3} />
                                    <XAxis
                                        dataKey="year"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => formatCurrency(value)}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        width={80}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                indicator="line"
                                                labelFormatter={(value) => `Year ${value}`}
                                                formatter={(value) => formatCurrency(value)}
                                            />
                                        }
                                    />
                                    <Area
                                        dataKey="revenue"
                                        type="monotone"
                                        stroke="hsl(var(--chart-1))"
                                        strokeWidth={2}
                                        fill="url(#yearlyRevenueGradient)"
                                        fillOpacity={1}
                                        dot={false}
                                        name="Revenue"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            {revenueStats.yearlyTotals?.length > 0 ? (
                                <div className="mt-4 space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing revenue data from {Math.min(...revenueStats.yearlyTotals.map(d => d.year))} to {Math.max(...revenueStats.yearlyTotals.map(d => d.year))}
                                    </p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Year</TableHead>
                                                <TableHead className="text-right">Total Revenue</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[...revenueStats.yearlyTotals]
                                                .sort((a, b) => b.year - a.year)
                                                .map((yearData) => (
                                                    <TableRow key={yearData.year}>
                                                        <TableCell>{yearData.year}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(yearData.revenue)}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground mt-4">
                                    No revenue data available yet
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Monthly Revenue</CardTitle>
                                <CardDescription>Revenue by month for {selectedYear}</CardDescription>
                            </div>
                            <Select
                                value={selectedYear?.toString()}
                                onValueChange={(value) => setSelectedYear(parseInt(value))}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {analytics.revenueStats.availableYears?.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[350px] w-full">
                                <AreaChart
                                    data={monthlyRevenueData}
                                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                                    accessibilityLayer
                                >
                                    <defs>
                                        <linearGradient id="monthlyRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.3} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        tickFormatter={formatCurrency}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        width={80}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                indicator="line"
                                                formatter={(value) => [formatCurrency(value), "Revenue"]}
                                            />
                                        }
                                    />
                                    <Area
                                        dataKey="revenue"
                                        type="monotone"
                                        stroke="hsl(var(--chart-2))"
                                        strokeWidth={2}
                                        fill="url(#monthlyRevenueGradient)"
                                        fillOpacity={1}
                                        dot={false}
                                        name="Revenue"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Revenue</CardTitle>
                            <CardDescription>Last 7 days revenue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {revenueStats.weeklyRevenue && revenueStats.weeklyRevenue.length > 0 ? (
                                <ChartContainer config={{}} className="h-[300px] w-full">
                                    <LineChart
                                        data={revenueStats.weeklyRevenue}
                                        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                                        accessibilityLayer
                                    >
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.3} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <YAxis
                                            tickFormatter={(value) => formatCurrency(value)}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            width={80}
                                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={
                                                <ChartTooltipContent
                                                    indicator="line"
                                                    formatter={(value) => formatCurrency(value)}
                                                />
                                            }
                                        />
                                        <Line
                                            dataKey="revenue"
                                            type="monotone"
                                            stroke="hsl(var(--chart-3))"
                                            strokeWidth={2}
                                            dot={false}
                                            name="Revenue"
                                        />
                                    </LineChart>
                                </ChartContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                    No weekly revenue data available for the last 7 days.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Peak Hours Analysis</CardTitle>
                        <CardDescription>Most popular appointment times</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <BarChart data={peakHoursData} accessibilityLayer>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.3} />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Bar dataKey="appointments" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Popular Services</CardTitle>
                        <CardDescription>Most booked services</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <BarChart data={popularServicesData} accessibilityLayer layout="vertical">
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" strokeOpacity={0.3} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    width={120}
                                />
                                <XAxis type="number" hide />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Bar dataKey="bookings" layout="vertical" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Staff Performance</CardTitle>
                        <CardDescription>Completed appointments and average ratings per staff member</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Completed Appointments</TableHead>
                                    <TableHead>Average Rating</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analytics.staffPerformance.map((staff) => (
                                    <TableRow key={staff.id}>
                                        <TableCell>{`${staff.first_name} ${staff.last_name}`}</TableCell>
                                        <TableCell>{staff.role}</TableCell>
                                        <TableCell>{staff.completed_appointments}</TableCell>
                                        <TableCell>{staff.rating.toFixed(1)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ShopsLayout>
    )
}

export default AnalyticsPage