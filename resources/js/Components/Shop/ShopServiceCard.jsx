import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Clock, DollarSign } from "lucide-react";

export default function ShopServiceCard({ service }) {
  // Handle empty or missing data
  if (!service) {
    return null;
  }
  
  // Format price display
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    });
  };
  
  // Format duration display
  const formatDuration = (hours, minutes) => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    
    if (h === 0 && m === 0) return "Duration not specified";
    if (h === 0) return `${m} minutes`;
    if (m === 0) return `${h} hour${h > 1 ? 's' : ''}`;
    
    return `${h} hour${h > 1 ? 's' : ''} ${m} min`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{service.service_name}</CardTitle>
        <CardDescription>
          {service.serviceCategories?.name || service.service_categories?.name || "Uncategorized"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            Price:
          </div>
          <div className="text-sm font-medium text-right">
            {formatPrice(service.cost)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Duration:
          </div>
          <div className="text-sm text-right">
            {formatDuration(service.duration_hour, service.duration_minute)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
