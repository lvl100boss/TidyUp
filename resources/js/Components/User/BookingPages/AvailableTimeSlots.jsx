import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react";


export default function AvailableTimeSlots({
    shop,
    shopStaff,
    selectedDate,
    shopServiceCategories,
    selectedStaff,
    setSelectedStaff,
    setSelectedTime,
    selectedTime,
    setData
}) {
    useEffect(() => {
        setData("staff_id", shopStaff[selectedStaff]?.id);
        setData("staff_index", selectedStaff);
        setData("time", selectedTime);
    }, [selectedStaff, selectedTime]);


    const businessHours = shop.shop_operation_hours;
    const timeSlots = [
        "00:00:00", "00:30:00", "01:00:00", "01:30:00", "02:00:00", "02:30:00", "03:00:00", "03:30:00", "04:00:00", "04:30:00", "05:00:00", "05:30:00", "06:00:00", "06:30:00", "07:00:00", "07:30:00", "08:00:00", "08:30:00", "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00", "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00", "18:00:00", "18:30:00", "19:00:00", "19:30:00", "20:00:00", "20:30:00", "21:00:00", "21:30:00", "22:00:00", "22:30:00", "23:00:00", "23:30:00"
    ];

    // Helper to parse "HH:MM:SS" into total minutes
    function parseTimeToMinutes(time) {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    }

    // console.log("shopStaff", shopStaff[selectedStaff]?.appointments.map(({ appointment }) => appointment.appointment_services.map(service => service.service_id)));
    //get selectedDate day of the week fort example "monday"
    const selectedDay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const openingTime = businessHours.find(hour => hour.day === selectedDay)?.open_time || null;
    const closingTime = businessHours.find(hour => hour.day === selectedDay)?.close_time || null;
    const isOpen = businessHours.find(hour => hour.day === selectedDay)?.is_open || 0;

    const service_ids = shopStaff[selectedStaff]?.appointments?.map(({ appointment }) =>
        appointment.appointment_services.map(service => service.service_id)
    ) || [];

    // Flatten the nested arrays of service_ids
    const flattenedServiceIds = service_ids.flat();

    const appointmentServices = shopServiceCategories?.filter(service =>
        flattenedServiceIds.includes(service.id)
    )?.map(service => ({
        id: service.id,
        name: service.service_name,
        category: service.service_categories.name,
        duration_hours: service.duration_hour,
        duration_minutes: service.duration_minute
    })) || [];

    // Filter time slots to only show those within business hours
    const businessHourTimeSlots = isOpen ? timeSlots.filter(time => {
        return time >= openingTime && time <= closingTime;
    }) : [];

    // Check if a specific time slot is available (not booked)
    const isTimeSlotAvailable = (time) => {
        const staffAppointments = shopStaff[selectedStaff]?.appointments || [];
        const bookedRanges = staffAppointments
            .filter(appointment =>
                new Date(appointment.appointment.date).toLocaleDateString() ===
                new Date(selectedDate).toLocaleDateString() &&
                appointment.appointment.status === "upcoming"
            )
            .map(appointment => {
                const totalDuration = appointment.appointment.appointment_services.reduce(
                    (sum, svc) => {
                        const serviceInfo = shopServiceCategories.find(
                            s => s.id === svc.service_id
                        );
                        if (!serviceInfo) return sum;
                        const serviceMinutes = serviceInfo.duration_hour * 60 + serviceInfo.duration_minute;
                        return sum + serviceMinutes;
                    },
                    0
                );
                const startMinutes = parseTimeToMinutes(appointment.appointment.time);
                const endMinutes = startMinutes + totalDuration;
                return [startMinutes, endMinutes];
            });

        const currentMinutes = parseTimeToMinutes(time);

        // Check if this time falls within any booked range
        return !bookedRanges.some(([startM, endM]) =>
            currentMinutes >= startM && currentMinutes < endM
        );
    };

    const staffAppointmentDates = shopStaff[selectedStaff]?.appointments.map(appointment => {
        return appointment.appointment.date;
    });

    return (
        <div>
            <h1 className="font-bold text-2xl mb-4">Select Stylist/Barber</h1>
            {selectedStaff !== null && (
                <div className="max-w-fit mb-4">
                    <Card>
                        <CardHeader >
                            <div className="flex items-start gap-5">
                                <div className="overflow-hidden rounded-full aspect-square size-24">
                                    {shopStaff[selectedStaff].staff.profile_photo_path ? (
                                        <img
                                            src={`/storage/${shopStaff[selectedStaff].staff.profile_photo_path}`}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="size-full bg-secondary grid place-items-center uppercase text-3xl">
                                            {shopStaff[selectedStaff].staff.first_name[0] + shopStaff[selectedStaff].staff.last_name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="pt-3">
                                    <CardTitle className="text-xl">
                                        {shopStaff[selectedStaff].staff.first_name + ' ' + shopStaff[selectedStaff].staff.last_name}
                                    </CardTitle>
                                    <CardDescription className="">
                                        {shopStaff[selectedStaff].role[0].toUpperCase() + shopStaff[selectedStaff].role.slice(1)}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            )}
            <div className="">
                <ToggleGroup
                    type="single"
                    variant="outline"
                    className="flex flex-wrap justify-start gap-3"
                >
                    {shopStaff
                        .map((staff, index) => (
                            <ToggleGroupItem
                                key={staff.id}
                                value={staff.id}
                                aria-label={`Select ${staff.staff.first_name} ${staff.staff.last_name}`}
                                className="data-[state=on]:bg-foreground data-[state=on]:text-background"
                                onClick={() => setSelectedStaff(index)}
                            >
                                <h1 className="font-bold">
                                    {`${staff.staff.first_name} ${staff.staff.last_name}`}
                                </h1>
                            </ToggleGroupItem>
                        ))
                    }
                </ToggleGroup>
            </div>
            <div className="my-10">
                <div className="my-4">
                    <h1 className="font-bold text-2xl ">Select Time</h1>
                    <p className="text-sm text-muted-foreground">Unavailable time slots are shown in gray</p>
                </div>
                <div className="">
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        className="block space-y-3"
                    >
                        {businessHourTimeSlots.map((time, index) => {
                            const isAvailable = isTimeSlotAvailable(time);
                            return (
                                <ToggleGroupItem
                                    key={index}
                                    value={time}
                                    aria-label={`Select ${time}`}
                                    className={`block w-full text-left pl-6 h-14 font-bold 
                                               data-[state=on]:bg-foreground data-[state=on]:text-background
                                               ${!isAvailable ? 'bg-secondary text-muted-foreground' : ''}`}
                                    onClick={() => { if (isAvailable) setSelectedTime(time); }}
                                    disabled={selectedStaff === null || !isAvailable}
                                >
                                    {/* Make the time into 10:00AM or 10:30PM */}
                                    {new Date(`2021-01-01T${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    {!isAvailable && <span className="ml-3 text-sm">(Unavailable)</span>}
                                </ToggleGroupItem>
                            );
                        })}
                    </ToggleGroup>
                </div>
            </div>
        </div >
    )
}