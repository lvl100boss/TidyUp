import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-transparent px-6 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-[none] focus-visible:ring-[none] !focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

const PInput = React.forwardRef(
    ({ className, type = "password", ...props }, ref) => {
        const [inputType, setInputType] = useState(type);

        const toggleVisibility = () => {
            setInputType((prevType) =>
                prevType === "password" ? "text" : "password"
            );
        };

        return (
            <div className="relative flex items-center">
                <input
                    type={inputType}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-transparent px-6 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-[none] focus-visible:ring-[none] !focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {inputType === "password" ? (
                    <EyeOff
                        onClick={toggleVisibility}
                        className="absolute right-4 text-muted-foreground stroke-1 hover:stroke-2 hover:text-foreground cursor-pointer"
                    />
                ) : (
                    <Eye
                        onClick={toggleVisibility}
                        className="absolute right-4 text-muted-foreground stroke-1 hover:stroke-2 hover:text-foreground cursor-pointer"
                    />
                )}
            </div>
        );
    }
);
PInput.displayName = "PInput";

export { Input, PInput };
