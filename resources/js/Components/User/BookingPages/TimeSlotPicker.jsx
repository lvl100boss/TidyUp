import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/Components/ui/calendar";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";

export function TimeSlotPicker({ shop, onSelectTimeSlot }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        // Here you would fetch available slots based on:
        // - Selected date
        // - Shop's business hours
        // - Staff availability
        // - Existing appointments
        const fetchAvailableSlots = async () => {
            // Simulated slots for demo
            const slots = generateTimeSlots(
                shop.open_time,
                shop.close_time,
                30 // 30-minute intervals
            );
            setAvailableSlots(slots);
        };

        fetchAvailableSlots();
    }, [selectedDate, shop]);

    const generateTimeSlots = (openTime, closeTime, intervalMinutes) => {
        const slots = [];
        let currentTime = new Date(`2000-01-01 ${openTime}`);
        const endTime = new Date(`2000-01-01 ${closeTime}`);

        while (currentTime < endTime) {
            slots.push(format(currentTime, "HH:mm"));
            currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
        }

        return slots;
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            <div>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                />
            </div>
            <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                        <Button
                            key={slot}
                            variant="outline"
                            onClick={() => onSelectTimeSlot(selectedDate, slot)}
                            className="w-full"
                        >
                            {slot}
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
