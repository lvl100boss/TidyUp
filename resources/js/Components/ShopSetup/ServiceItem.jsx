import React from 'react';
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Pencil, Trash2, PhilippinePeso, Clock } from 'lucide-react';

const formatDuration = (hours, minutes) => {
    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
};

const ServiceItem = ({ service, onEdit, onDelete }) => {
    return (
        <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                    <Label className="font-semibold">{service.service_name}</Label>
                    <Badge variant="outline" className="text-xs">
                        {service.service_categories?.name || 'N/A'}
                    </Badge>
                </div>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span className="flex items-center">
                        <PhilippinePeso className="h-3 w-3 mr-1" />
                        {parseFloat(service.cost).toFixed(2)}
                    </span>
                    <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(service.duration_hour, service.duration_minute)}
                    </span>
                </div>
            </div>
            <div className="flex space-x-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(service)}
                    className="h-7 w-7"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit Service</span>
                </Button>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(service)}
                    className="h-7 w-7"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete Service</span>
                </Button>
            </div>
        </div>
    );
};

export default ServiceItem;
