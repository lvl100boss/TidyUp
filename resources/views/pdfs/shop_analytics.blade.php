{{-- filepath: c:\Codes\Github Clones\TidyUp2\TidyUp\resources\views\pdfs\shop_analytics.blade.php --}}
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Shop Analytics Report</title>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.5;
        }

        h1,
        h2,
        h3 {
            margin-bottom: 0.5em;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1em;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .currency {
            text-align: right;
        }

        .section {
            margin-bottom: 2em;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>
    <h1>Analytics Report - {{ $shop->shop_name }}</h1>
    <p>Generated on: {{ now()->format('Y-m-d H:i:s') }}</p>

    <div class="section">
        <h2>Basic Stats</h2>
        <p>Total Appointments: {{ $analytics['basicStats']['totalAppointments'] ?? 'N/A' }}</p>
        <ul>
            @foreach ($analytics['basicStats']['appointmentStats'] ?? [] as $status => $count)
                <li>{{ ucfirst(str_replace('_', ' ', $status)) }}: {{ $count }}</li>
            @endforeach
        </ul>
        <p>Total Active Staff: {{ $analytics['basicStats']['totalStaff'] ?? 'N/A' }}</p>
        <p>Total Services: {{ $analytics['basicStats']['totalServices'] ?? 'N/A' }}</p>
    </div>

    <div class="section">
        <h2>Revenue Overview</h2>
        <p>Total Revenue (All Time): {{ number_format($analytics['revenueStats']['totalRevenue'] ?? 0, 2) }} PHP</p>
        <p>This Month's Revenue: {{ number_format($analytics['revenueStats']['monthlyRevenue'] ?? 0, 2) }} PHP</p>
        {{-- Add more revenue stats as needed --}}
    </div>

    <div class="section">
        <h2>Yearly Revenue</h2>
        @if (!empty($analytics['revenueStats']['yearlyTotals']))
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th class="currency">Revenue (PHP)</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($analytics['revenueStats']['yearlyTotals'] as $yearData)
                        <tr>
                            <td>{{ $yearData['year'] }}</td>
                            <td class="currency">{{ number_format($yearData['revenue'], 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No yearly revenue data available.</p>
        @endif
    </div>

    {{-- Add sections for Monthly, Weekly, Peak Hours, Popular Services, Staff Performance similarly --}}
    {{-- Example for Staff Performance --}}
    <div class="section">
        <h2>Staff Performance</h2>
        @if (!empty($analytics['staffPerformance']))
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Completed Appointments</th>
                        <th>Avg. Rating</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($analytics['staffPerformance'] as $staff)
                        <tr>
                            <td>{{ $staff['name'] }}</td>
                            <td>{{ $staff['role'] }}</td>
                            <td>{{ $staff['completed_appointments'] }}</td>
                            <td>{{ number_format($staff['rating'], 1) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No staff performance data available.</p>
        @endif
    </div>

</body>

</html>
