import { Button, buttonVariants } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Moon, Sun } from "lucide-react";

const ThemeButton = ({ isDarkTheme, ...props }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        className="size-9"
                        variant="outline"
                        size="icon"
                        {...props}
                    >
                        {isDarkTheme ? <Moon className="stroke-foreground" /> : <Sun className="stroke-foreground" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="mr-5">
                    <p>Switch Theme</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ThemeButton;
