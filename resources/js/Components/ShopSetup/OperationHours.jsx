import React from "react";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${period}`;
});

export default function OperationHours({ data, handleOperationHoursChange }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Operation Hours</h2>
            <div className="space-y-4">
                {DAYS.map((day) => (
                    <div key={day} className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor={`${day}-switch`}
                                className="text-lg font-medium"
                            >
                                {day}
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`${day}-switch`}>Closed</Label>
                                <Switch
                                    id={`${day}-switch`}
                                    checked={data.operation_hours[day].isOpen}
                                    onCheckedChange={(checked) =>
                                        handleOperationHoursChange(
                                            day,
                                            "isOpen",
                                            checked
                                        )
                                    }
                                />
                                <Label htmlFor={`${day}-switch`}>Open</Label>
                            </div>
                        </div>

                        {data.operation_hours[day].isOpen && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`${day}-open`}>
                                        Opening Time
                                    </Label>
                                    <Select
                                        value={
                                            data.operation_hours[day].openTime
                                        }
                                        onValueChange={(value) =>
                                            handleOperationHoursChange(
                                                day,
                                                "openTime",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select opening time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIME_SLOTS.map((time) => (
                                                <SelectItem
                                                    key={time}
                                                    value={time}
                                                >
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor={`${day}-close`}>
                                        Closing Time
                                    </Label>
                                    <Select
                                        value={
                                            data.operation_hours[day].closeTime
                                        }
                                        onValueChange={(value) =>
                                            handleOperationHoursChange(
                                                day,
                                                "closeTime",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select closing time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIME_SLOTS.map((time) => (
                                                <SelectItem
                                                    key={time}
                                                    value={time}
                                                >
                                                    {time}
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
        </div>
    );
}
