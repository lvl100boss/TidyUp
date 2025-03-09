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
import axios from "axios";

export default function AddAppointmentModal({ isOpen, setIsOpen }) {
    const [date, setDate] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: "",
        date: "",
        time: "",
        service_ids: [],
        notes: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchCustomers();
            fetchServices();
        }
    }, [isOpen]);

    const fetchCustomers = async () => {
        setLoadingCustomers(true);
        try {
            const response = await axios.get(route("api.customers.index"));
            setCustomers(response.data);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoadingCustomers(false);
        }
    };

    const fetchServices = async () => {
        setLoadingServices(true);
        try {
            const response = await axios.get(route("api.services.index"));
            setServices(response.data);
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setLoadingServices(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("appointments.store"), {
            onSuccess: () => {
                reset();
                setDate(null);
                setSelectedServices([]);
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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Appointment</DialogTitle>
                    <DialogDescription>
                        Fill in the details to schedule a new appointment.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Customer Selection */}
                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="customer_id" className="text-right">Customer</Label>
                            <div className="col-span-3">
                                <Select
                                    onValueChange={(value) => setData("customer_id", value)}
                                    value={data.customer_id}
                                    disabled={loadingCustomers}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map(customer => (
                                            <SelectItem key={customer.id} value={customer.id.toString()}>
                                                {customer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.customer_id && <p className="text-sm text-red-500">{errors.customer_id}</p>}
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="date" className="text-right">Date</Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Select a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={handleDateChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                            </div>
                        </div>

                        {/* Time Selection */}
                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="time" className="text-right">Time</Label>
                            <div className="col-span-3">
                                <Select
                                    onValueChange={(value) => setData("time", value)}
                                    value={data.time}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.map(time => (
                                            <SelectItem key={time} value={time}>
                                                {format(parseISO(`2023-01-01T${time}`), "h:mm a")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
                            </div>
                        </div>

                        {/* Services Selection */}
                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="services" className="text-right">Services</Label>
                            <div className="col-span-3">
                                <Select
                                    onValueChange={handleServiceChange}
                                    disabled={loadingServices}
                                >
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
                                        <div key={service.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
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
                            Create Appointment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
