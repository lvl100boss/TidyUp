import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from "@/Components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";

const DayBusinessHours = React.memo(({ day, dayData, errors, timeslots, formatTimeSlot, handleSwitchChange, handleTimeChange }) => {
    if (!dayData) {
        console.error(`Data for day "${day}" is missing.`);
        return null;
    }
    const isOpen = dayData.is_open;
    const openTimeError = errors[`business_hours.${day}.open_time`] || errors[`${day}_time`];
    const closeTimeError = errors[`business_hours.${day}.close_time`] || errors[`${day}_time`];

    return (
        <div className='border p-4 mt-4 rounded-lg'>
            <div className='flex justify-between items-center'>
                <h1 className='text-sm font-medium capitalize'>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                </h1>
                <div className='flex gap-2 items-center'>
                    <p className='text-sm'>
                        {isOpen ? 'Open' : 'Closed'}
                    </p>
                    <Switch
                        id={`${day}_switch`}
                        checked={isOpen}
                        onCheckedChange={(checked) => handleSwitchChange(day, checked)}
                        aria-label={`Toggle ${day} open/closed`}
                    />
                </div>
            </div>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className='grid sm:grid-cols-2 gap-2 mt-2 overflow-hidden'
                >
                    <div>
                        <Label htmlFor={`${day}_open`} className="text-sm font-medium">
                            Open Time
                        </Label>
                        <Select
                            value={dayData.open_time}
                            onValueChange={(value) => handleTimeChange(day, 'open', value)}
                        >
                            <SelectTrigger id={`${day}_open`} className="w-full">
                                <SelectValue placeholder="Select time">
                                    {formatTimeSlot(dayData.open_time)}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {timeslots.map((slot) => (
                                    <SelectItem key={`${day}_open_${slot}`} value={slot}>
                                        {formatTimeSlot(slot)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {openTimeError && <p className="text-red-500 text-xs mt-1">{openTimeError}</p>}
                    </div>
                    <div>
                        <Label htmlFor={`${day}_close`} className="text-sm font-medium">
                            Close Time
                        </Label>
                        <Select
                            value={dayData.close_time}
                            onValueChange={(value) => handleTimeChange(day, 'close', value)}
                        >
                            <SelectTrigger id={`${day}_close`} className="w-full">
                                <SelectValue placeholder="Select time">
                                    {formatTimeSlot(dayData.close_time)}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {timeslots.map((slot) => (
                                    <SelectItem key={`${day}_close_${slot}`} value={slot}>
                                        {formatTimeSlot(slot)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {closeTimeError && <p className="text-red-500 text-xs mt-1">{closeTimeError}</p>}
                    </div>
                </motion.div>
            )}
            {errors[`business_hours.${day}.is_open`] && <p className="text-red-500 text-xs mt-1">{errors[`business_hours.${day}.is_open`]}</p>}
        </div>
    );
});

export default DayBusinessHours;
