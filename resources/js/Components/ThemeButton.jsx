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
                        className={`fixed bottom-[4.3rem] lg:bottom-5 right-5 ${buttonVariants(
                            {
                                size: "icon",
                            }
                        )}`}
                        {...props}
                    >
                        {isDarkTheme ? <Moon /> : <Sun />}
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
