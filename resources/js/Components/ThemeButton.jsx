import { Button, buttonVariants } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

const ThemeButton = ({ isDarkTheme, ...props }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        className={`fixed bottom-[4.3rem] right-5 ${buttonVariants(
                            {
                                size: "icon",
                                radius: "round",
                            }
                        )}`}
                        {...props}
                    >
                        {isDarkTheme ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 2a8 8 0 015.657 13.657A8 8 0 018 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 2a8 8 0 015.657 13.657A8 8 0 018 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
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
