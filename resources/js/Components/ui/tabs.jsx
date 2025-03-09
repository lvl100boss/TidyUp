import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Root
        ref={ref}
        className={cn("w-full", className)}
        {...props}
    />
));
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "flex gap-6 border-b border-border",
            className
        )}
        {...props}
    />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "relative py-3 px-1 font-medium text-muted-foreground transition-colors",
            "data-[state=active]:text-foreground",
            "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
            "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground",
            "after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-6 focus-visible:outline-none",
            "transition-opacity duration-200 ease-in-out",
            "data-[state=inactive]:opacity-0 data-[state=active]:opacity-100",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
