import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react";


export default function AvailableTimeSlots({ shop, shopStaff, businessDays, selectedDate }) {

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const businessHours = shop.shop_operation_hours;
    const timeSlots = [
        "00:00:00", "00:30:00", "01:00:00", "01:30:00", "02:00:00", "02:30:00", "03:00:00", "03:30:00", "04:00:00", "04:30:00", "05:00:00", "05:30:00", "06:00:00", "06:30:00", "07:00:00", "07:30:00", "08:00:00", "08:30:00", "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00", "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00", "18:00:00", "18:30:00", "19:00:00", "19:30:00", "20:00:00", "20:30:00", "21:00:00", "21:30:00", "22:00:00", "22:30:00", "23:00:00", "23:30:00"
    ];

    //get selectedDate day of the week fort example "monday"
    const selectedDay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const openingTime = businessHours.find(hour => hour.day === selectedDay)?.open_time || null;
    const closingTime = businessHours.find(hour => hour.day === selectedDay)?.close_time || null;
    const isOpen = businessHours.find(hour => hour.day === selectedDay)?.is_open || 0;



    const availableTimeSlots = timeSlots.filter(time => {
        if (isOpen) {
            return time >= openingTime && time <= closingTime;
        }
        return false;
    });

    console.log(shopStaff[selectedStaff]?.appointments[0]?.appointment?.time);
    console.log(shopStaff[selectedStaff])

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
                        .filter(staff => staff.is_active)
                        .map((staff, index) => (
                            <ToggleGroupItem
                                key={staff.id}
                                value={staff.id}
                                aria-label={`Select ${staff.staff.first_name} ${staff.staff.last_name}`}
                                className="data-[state=on]:bg-foreground data-[state=on]:text-background"
                                onClick={(e) => setSelectedStaff(index)}
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
                    <p className="text-sm text-muted-foreground">Only Available Time Slot will be shown here</p>
                </div>
                <div className="">
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        className="block space-y-3"

                    >
                        {availableTimeSlots.map((time, index) => (
                            <ToggleGroupItem
                                key={index}
                                value={time}
                                aria-label={`Select ${time}`}
                                className="data-[state=on]:bg-foreground data-[state=on]:text-background block w-full text-left h-14 font-bold"
                                onClick={(e) => setSelectedTime(time)}
                                disabled={selectedStaff === null}
                            >
                                {/* Make the time into 10:00AM or 10:30PM */}
                                {new Date(`2021-01-01T${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>
            </div>
        </div >
    )
}