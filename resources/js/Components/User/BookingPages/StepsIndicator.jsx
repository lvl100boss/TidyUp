import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"



const StepsIndicator = ({ step }) => {
    const steps = [
        { number: 1, label: 'Choose Schedule', tooltip: 'Select the date and time for your appointment' },
        { number: 2, label: 'Choose Service', tooltip: 'Choose the service you want' },
        { number: 3, label: 'Confirmation', tooltip: 'Review and confirm your appointment' },
    ];

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                {steps.map((item, index) => (
                    <div key={item.number} className="flex flex-col items-center">

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div
                                        className={`size-10 font-bold rounded-full flex items-center justify-center 
                                            ${step >= item.number
                                                ? 'bg-foreground text-background'
                                                : 'bg-secondary text-foreground'}`}
                                    >
                                        {item.number}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <span className="text-sm mt-2">{item.label}</span>
                    </div>
                ))}

                {/* Progress line */}
                <div className="absolute top-4 h-[4px] bg-secondary w-full -z-10 mt-[3px] rounded-full"></div>
                <div
                    className="absolute top-4 h-[4px] bg-foreground -z-10 mt-[3px] rounded-full"
                    style={{ width: `${(step - 1) * 50}%` }}
                ></div>
            </div>
        </div>
    );
};

export default StepsIndicator;