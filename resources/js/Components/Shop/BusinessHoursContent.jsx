import React from "react";
import { ScrollArea } from "@/Components/ui/scroll-area";

export default function BusinessHoursContent({ shop }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <ScrollArea className="h-[300px] w-full px-4">
      <div className="space-y-4">
        {days.map(day => {
          const schedule = shop.shop_operation_hours?.find(
            h => h.day.toLowerCase() === day.toLowerCase()
          );
          
          return (
            <div key={day} className="flex justify-between items-center py-2 border-b last:border-0">
              <span className="font-medium">{day}</span>
              <span className="text-muted-foreground">
                {schedule?.is_open 
                  ? `${schedule.opening_time} - ${schedule.closing_time}`
                  : 'Closed'}
              </span>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
