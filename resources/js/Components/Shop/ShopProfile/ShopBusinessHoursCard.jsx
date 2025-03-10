import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

const ShopBusinessHoursCard = ({ shop }) => {
    const [open, setOpen] = useState(false);
    const [hours, setHours] = useState([]);
    const [editedHours, setEditedHours] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate time slots for the dropdown (30-minute intervals)
    const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return {
            display: `${displayHour}:${minute} ${period}`,
            value: `${hour.toString().padStart(2, '0')}:${minute}:00`
        };
    });

    // Initialize hours when component loads or shop data changes
    useEffect(() => {
        if (shop?.shop_operation_hours) {
            setHours([...shop.shop_operation_hours]);
        }
    }, [shop]);

    // Initialize edited hours when dialog opens
    useEffect(() => {
        if (open && hours.length > 0) {
            setEditedHours(JSON.parse(JSON.stringify(hours)));
        }
    }, [open, hours]);

    // Handle business hours toggling
    const handleToggleDay = (index) => {
        const newHours = [...editedHours];
        newHours[index].is_open = newHours[index].is_open ? 0 : 1;
        setEditedHours(newHours);
    };

    // Handle time change for opening hours
    const handleOpenTimeChange = (index, value) => {
        const newHours = [...editedHours];
        newHours[index].open_time = value;
        setEditedHours(newHours);
    };

    // Handle time change for closing hours
    const handleCloseTimeChange = (index, value) => {
        const newHours = [...editedHours];
        newHours[index].close_time = value;
        setEditedHours(newHours);
    };

    // Format time for display in readable format
    const formatTime = (timeString) => {
        if (!timeString) return "";

        try {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));

            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error("Error formatting time:", error);
            return timeString;
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        setIsSubmitting(true);

        router.post(route('shop.profile.update-hours'), {
            operation_hours: editedHours
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Only update the displayed hours after successful save
                setHours([...editedHours]);
                setOpen(false);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error(errors);
                setIsSubmitting(false);
            }
        });
    };

    // Find the display text for a time value
    const getTimeDisplay = (timeValue) => {
        const slot = TIME_SLOTS.find(slot => slot.value === timeValue);
        return slot ? slot.display : formatTime(timeValue);
    };

    // Handle dialog close - discard unsaved changes
    const handleDialogClose = (isOpen) => {
        if (!isOpen) {
            // Reset edited hours when dialog is closed without saving
            setEditedHours([]);
        }
        setOpen(isOpen);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle>Business Hours</CardTitle>
                    <Dialog open={open} onOpenChange={handleDialogClose}>
                        <DialogTrigger asChild>
                            <button type="button" className="focus:outline-none">
                                <Pencil className="size-4 cursor-pointer hover:scale-125 transition-transform" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Edit Business Hours</DialogTitle>
                                <DialogDescription>
                                    Update the days and times your shop is open for business.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {editedHours.map((day, index) => (
                                    <div key={`edit-${day.id}`} className="rounded-lg border p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium capitalize">{day.day}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {day.is_open ? "Open" : "Closed"}
                                                </span>
                                                <Switch
                                                    checked={day.is_open === 1}
                                                    onCheckedChange={() => handleToggleDay(index)}
                                                />
                                            </div>
                                        </div>

                                        {day.is_open === 1 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                <div>
                                                    <label className="text-sm text-muted-foreground mb-1 block">
                                                        Opening Time
                                                    </label>
                                                    <Select
                                                        value={day.open_time}
                                                        onValueChange={(value) => handleOpenTimeChange(index, value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select opening time">
                                                                {getTimeDisplay(day.open_time)}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_SLOTS.map((slot) => (
                                                                <SelectItem key={`open-${day.id}-${slot.value}`} value={slot.value}>
                                                                    {slot.display}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="text-sm text-muted-foreground mb-1 block">
                                                        Closing Time
                                                    </label>
                                                    <Select
                                                        value={day.close_time}
                                                        onValueChange={(value) => handleCloseTimeChange(index, value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select closing time">
                                                                {getTimeDisplay(day.close_time)}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_SLOTS.map((slot) => (
                                                                <SelectItem key={`close-${day.id}-${slot.value}`} value={slot.value}>
                                                                    {slot.display}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <DialogFooter className="mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="mr-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {/* Always use shop data directly for the display section */}
                {shop.shop_operation_hours.map((hours) => (
                    <div key={hours.id}>
                        <div className="flex justify-between text-sm p-2 hover:bg-muted rounded-md">
                            <span className="capitalize">
                                {hours.day}
                            </span>
                            <span className={hours.is_open ? "font-bold" : "text-red-600 font-bold"}>
                                {hours.is_open
                                    ? `${formatTime(hours.open_time)} - ${formatTime(hours.close_time)}`
                                    : "Closed"
                                }
                            </span>
                        </div>
                        <div className="mt-2">
                            <Separator />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default ShopBusinessHoursCard;