import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
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
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
    setSelectedDate(`${selectedYear}-${selectedMonth}-${selectedDay}`);

    useEffect(() => {
        setData("date", `${selectedYear}-${selectedMonth}-${selectedDay}`);
    }, [selectedYear, selectedMonth, selectedDay]);

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
    const businessDayNumbers = businessDays.map(day =>
        typeof day === "string" ? dayNameToNumber[day.toLowerCase()] : parseInt(day)
    );

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

    const availableDates = getAvailableDates(selectedYear, selectedMonth, businessDayNumbers);

    // Whenever availableDates changes, set selectedDay to the first available day if current selection is invalid.
    useEffect(() => {
        if (!availableDates.includes(selectedDay)) {
            setSelectedDay(availableDates.length > 0 ? availableDates[0] : null);
        }
    }, [availableDates, selectedDay]);

    const [date, setDate] = useState(new Date());
    return (
        <div className="mb-10 flex gap-5">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow"
                disabled
            />
            <div>
                <h1 className="text-2xl font-bold mb-3">Available Dates</h1>
                <div className="inline-flex space-x-4">
                    <Select
                        onValueChange={(value) => setSelectedYear(parseInt(value))}
                        value={selectedYear.toString()}
                    >
                        <SelectTrigger className="w-[180px]">
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
                        <SelectTrigger className="w-[180px]">
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
                                            {new Date(2000, month - 1, 1).toLocaleString("default", {
                                                month: "long",
                                            })}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mt-4 flex gap-4 flex-wrap">
                    {availableDates.length > 0 ? (
                        availableDates.map((day) => (
                            <Button
                                key={day}
                                className="size-12 flex items-center justify-center rounded-full"
                                variant={selectedDay === day ? "default" : "outline"}
                                onClick={() => setSelectedDay(day)}
                            >
                                <p className="font-medium text-2xl">{day}</p>
                            </Button>
                        ))
                    ) : (
                        <p>No available days</p>
                    )}
                </div>
            </div>
            {/* {`${selectedYear}-${selectedMonth}-${selectedDay}`} */}
        </div >
    );
};

export default AvailableDays;
