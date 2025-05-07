import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import * as React from "react";

const AvailableDays = ({ businessDays, setSelectedDate, setData }) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDate = today.getDate();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedDay, setSelectedDay] = useState(null);
    const [calendarDate, setCalendarDate] = useState(today);
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

    // Map day names to numbers (0=Sunday ... 6=Saturday)
    const dayNameToNumber = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };

    // Convert businessDays array to numbers (if they come as strings)
    const businessDayNumbers = useMemo(() => {
        return businessDays.map(day =>
            typeof day === "string" ? dayNameToNumber[day.toLowerCase()] : parseInt(day)
        );
    }, [businessDays]);

    // Generate available dates for the selected month and year based on business days
    const getAvailableDates = (year, month, businessDayNumbers) => {
        const lastDay = new Date(year, month, 0).getDate();
        const available = [];
        for (let day = 1; day <= lastDay; day++) {
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay();

            // Only add the day if it matches a business day...
            if (!businessDayNumbers.includes(dayOfWeek)) continue;
            // ...and if we're in the current month/year, only allow today or future days.
            if (year === currentYear && month === currentMonth && day < currentDate) continue;

            available.push(day);
        }
        return available;
    };

    const availableDates = useMemo(() => {
        return getAvailableDates(selectedYear, selectedMonth, businessDayNumbers);
    }, [selectedYear, selectedMonth, businessDayNumbers]);

    // Format the month name for display
    const getMonthName = (month) => {
        return new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" });
    };

    // Create a function to check if a date should be disabled in the calendar
    const isDateDisabled = (date) => {
        const day = date.getDay();
        const isBusinessDay = businessDayNumbers.includes(day);
        
        // Disable if not a business day or if it's in the past
        return !isBusinessDay || date < new Date(today.setHours(0, 0, 0, 0));
    };

    // Update the form data and selectedDay when a date is clicked on the calendar
    const handleCalendarSelect = (date) => {
        if (!date) return;
        
        // Extract year, month, and day from the selected date
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript months are 0-indexed
        const day = date.getDate();
        
        // Update the state
        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedDay(day);
        setCalendarDate(date);
    };

    // Whenever selected year, month, or day changes, update the selected date
    useEffect(() => {
        if (selectedDay) {
            const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
            setSelectedDate(formattedDate);
            setData("date", formattedDate);
            
            // Also update the calendar date to reflect the selection
            setCalendarDate(new Date(selectedYear, selectedMonth - 1, selectedDay));
        }
    }, [selectedYear, selectedMonth, selectedDay, setSelectedDate, setData]);

    // Whenever availableDates changes, set selectedDay to the first available day if current selection is invalid
    useEffect(() => {
        if (!availableDates.includes(selectedDay)) {
            setSelectedDay(availableDates.length > 0 ? availableDates[0] : null);
        }
    }, [availableDates, selectedDay]);
    
    return (
        <div className="mb-6 sm:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Calendar Container - Now with interactive selection */}
                <div className="w-full max-w-md mx-auto md:mx-0">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <Calendar
                            mode="single"
                            selected={calendarDate}
                            onSelect={handleCalendarSelect}
                            className="w-full"
                            disabled={isDateDisabled}
                            fromMonth={today}
                            toMonth={new Date(currentYear + 1, 11, 31)}
                        />
                    </div>
                </div>

                {/* Available Dates Section */}
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">Available Dates</h3>
                    
                    {/* Year and Month Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            onValueChange={(value) => setSelectedYear(parseInt(value))}
                            value={selectedYear.toString()}
                        >
                            <SelectTrigger className="h-10 sm:h-12">
                                <SelectValue placeholder="Select a Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Year</SelectLabel>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select
                            onValueChange={(value) => setSelectedMonth(parseInt(value))}
                            value={selectedMonth.toString()}
                        >
                            <SelectTrigger className="h-10 sm:h-12">
                                <SelectValue placeholder="Select a Month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Month</SelectLabel>
                                    {Array.from({ length: 12 }, (_, i) => i + 1)
                                        .filter((month) => {
                                            // If the selected year is current, only show current or future months.
                                            if (selectedYear === currentYear) {
                                                return month >= currentMonth;
                                            }
                                            return true;
                                        })
                                        .map((month) => (
                                            <SelectItem key={month} value={month.toString()}>
                                                {getMonthName(month)}
                                            </SelectItem>
                                        ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Day Selection - Card-based design */}
                    <div className="mt-6">
                        {selectedMonth && selectedYear && (
                            <h4 className="text-base font-medium mb-3 text-muted-foreground">
                                {getMonthName(selectedMonth)} {selectedYear}
                            </h4>
                        )}
                        
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {availableDates.length > 0 ? (
                                availableDates.map((day) => (
                                    <Button
                                        key={day}
                                        variant={selectedDay === day ? "default" : "outline"}
                                        className="h-14 w-full hover:bg-primary/10 hover:text-foreground 
                                                 flex flex-col items-center justify-center p-2 gap-0"
                                        onClick={() => setSelectedDay(day)}
                                    >
                                        <span className="text-xl font-semibold">{day}</span>
                                        <span className="text-xs">{new Date(selectedYear, selectedMonth - 1, day).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    </Button>
                                ))
                            ) : (
                                <p className="col-span-full py-6 text-center text-muted-foreground">No available days</p>
                            )}
                        </div>
                    </div>

                    {selectedDay && (
                        <div className="mt-5 py-3 px-4 bg-primary/5 border rounded-lg">
                            <p className="text-center font-medium">
                                Selected: <span className="text-primary">{getMonthName(selectedMonth)} {selectedDay}, {selectedYear}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvailableDays;
