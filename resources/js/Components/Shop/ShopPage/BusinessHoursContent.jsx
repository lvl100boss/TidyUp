import React from "react";
import { DialogDescription } from "@/Components/ui/dialog";
import { buttonVariants } from "@/Components/ui/button";

function BusinessHoursContent(props) {
    const formatTime = (time) => {
        if (!time) return "Closed";

        const [hours, minutes] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes);

        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="">
            <div className="grid grid-cols-2">
                <DialogDescription>AVAILABLE DAYS</DialogDescription>
                <DialogDescription>AVAILABLE TIMES</DialogDescription>
            </div>
            <div className="mt-3 space-y-3">
                {props.shop?.shop_operation_hours.map((day) => (
                    <div
                        key={day.day}
                        className="grid grid-cols-2 items-center gap-5"
                    >
                        <div className="w-full ">
                            <div
                                className={`figtree-bold uppercase w-full ${buttonVariants(
                                    {
                                        variant: day.is_open
                                            ? "default"
                                            : "secondary",
                                    }
                                )}`}
                            >
                                {day.day}
                            </div>
                        </div>
                        <div
                            className={
                                !day.is_open &&
                                "text-muted-foreground uppercase"
                            }
                        >
                            {day.is_open
                                ? `${formatTime(day.open_time)} - ${formatTime(
                                      day.close_time
                                  )}`
                                : "Closed"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default BusinessHoursContent;
