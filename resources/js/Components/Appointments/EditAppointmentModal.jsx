import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditAppointmentModal({ isOpen, setIsOpen, appointment }) {
    const [date, setDate] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);

    const { data, setData, put, processing, errors, reset } = useForm({
        customer_id: "",
        date: "",
        time: "",
        service_ids: [],
        notes: "",
        status: "",
    });

    // Mock services - in a real app, these would come from props or an API call
    const services = [
        { id: 29, name: "Buzz Cut", cost: "60.00" },
        { id: 30, name: "Tom Holland Inspired", cost: "100.00" },
        // Add more services as needed
    ];

    // Initialize form with appointment data
    useEffect(() => {
        if (appointment) {
            setDate(parseISO(appointment.date));
            setSelectedServices(appointment.services);
            setData({
                customer_id: appointment.customer.id.toString(),
                date: appointment.date,
                time: appointment.time,
                service_ids: appointment.services.map(s => s.id),
                notes: appointment.notes || "",
                status: appointment.status,
            });
        }
    }, [appointment]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("appointments.update", appointment.id), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            }
        });
    };

    const handleServiceChange = (serviceId) => {
        const service = services.find(s => s.id === parseInt(serviceId));
        if (!selectedServices.some(s => s.id === service.id)) {
            const newSelectedServices = [...selectedServices, service];
            setSelectedServices(newSelectedServices);
            setData("service_ids", newSelectedServices.map(s => s.id));
        }
    };

    const removeService = (serviceId) => {
        const newSelectedServices = selectedServices.filter(s => s.id !== serviceId);
        setSelectedServices(newSelectedServices);
        setData("service_ids", newSelectedServices.map(s => s.id));
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setData("date", format(newDate, "yyyy-MM-dd"));
    };

    const timeSlots = [
        "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00",
        "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00", "15:30:00",
        "16:00:00", "16:30:00", "17:00:00"
    ];

    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "upcoming", label: "Upcoming" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "no-show", label: "No Show" },
        { value: "rejected", label: "Rejected" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Appointment</DialogTitle>
                    <DialogDescription>
                        Update the appointment details below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Customer Details (read-only in edit mode) */}
                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label className="text-right">Customer</Label>
                            <div className="col-span-3">
                                <Input value={appointment?.customer.name || ""} disabled />
                            </div>
                        </div>

                        {/* Status Selection */}
                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="status" className="text-right">Status</Label>
                            <div className="col-span-3">
                                <Select
                                    onValueChange={(value) => setData("status", value)}
                                    value={data.status}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>
                        </div>

                        {/* Services Selection */}
                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="services" className="text-right">Services</Label>
                            <div className="col-span-3">
                                <Select onValueChange={handleServiceChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add a service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map(service => (
                                            <SelectItem key={service.id} value={service.id.toString()}>
                                                {service.name} (${service.cost})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.service_ids && <p className="text-sm text-red-500">{errors.service_ids}</p>}
                            </div>
                        </div>

                        {/* Selected Services */}
                        {selectedServices.length > 0 && (
                            <div className="grid grid-cols-4 items-start gap-2">
                                <div className="text-right">Selected:</div>
                                <div className="col-span-3 flex flex-col gap-2">
                                    {selectedServices.map(service => (
                                        <div key={service.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                            <span>{service.name} - ${service.cost}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeService(service.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="notes" className="text-right">Notes</Label>
                            <div className="col-span-3">
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    placeholder="Add any notes or special requests"
                                    rows={3}
                                />
                                {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}