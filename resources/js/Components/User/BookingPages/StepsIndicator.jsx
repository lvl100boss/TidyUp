import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const StepsIndicator = ({ step }) => {
    const steps = [
        { number: 1, label: 'Choose Service', tooltip: 'Select the services you want' },
        { number: 2, label: 'Choose Schedule', tooltip: 'Select the date and time for your appointment (includes buffer time)' },
        { number: 3, label: 'Add Attendees', tooltip: 'Add additional people to your booking' },
        { number: 4, label: 'Assign Services', tooltip: 'Assign services to each attendee' },
        { number: 5, label: 'Confirmation', tooltip: 'Review and confirm your appointment details including buffer time' },
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
                    style={{ width: `${(step - 1) * 25}%` }}
                ></div>
            </div>
        </div>
    );
};

export default StepsIndicator;