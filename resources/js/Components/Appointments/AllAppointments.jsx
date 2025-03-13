import { useMemo } from "react";
import { DataTable } from "@/Components/ui/data-table";
import { columns } from "@/Components/Appointments/columns";

export default function AllAppointments({ appointments }) {
    // Extract unique statuses and stylists for filters
    const statusOptions = useMemo(() => {
        const statuses = new Set(appointments.map(appointment => appointment.status));
        return Array.from(statuses);
    }, [appointments]);

    const stylistOptions = useMemo(() => {
        const stylistMap = new Map();
        appointments.forEach(appointment => {
            if (appointment.stylist) {
                stylistMap.set(appointment.stylist.id, appointment.stylist);
            }
        });
        return Array.from(stylistMap.values());
    }, [appointments]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">All Appointments</h2>
            </div>
            <DataTable
                columns={columns}
                data={appointments}
                statusOptions={statusOptions}
                stylistOptions={stylistOptions}
            />
        </div>
    );
}
