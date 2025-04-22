import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { AlertCircle, Clock } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Link } from "@inertiajs/react";
import { toast } from "sonner";

export default function ShopStatusWarning({ statusMessage, shop }) {
    if (!statusMessage) return null;

    const { status, message, reason } = statusMessage;
    const [maxResubmitCountReached, setMaxResubmitCountReached] = React.useState(false);
    useEffect(() => {
        if (shop.resubmit_count >= 3) {
            setMaxResubmitCountReached(true);
        } else {
            setMaxResubmitCountReached(false);
        }
    }, [])

    const handleResubmit = () => {
        if (maxResubmitCountReached) {
            toast.error("You have reached the maximum number of resubmissions. Please contact support for further assistance.");
            return;
        }
    };

    return (
        <Alert variant={status === 'rejected' ? "destructive" : "warning"} className="mb-4">
            <div className="flex items-start gap-2">
                {status === 'processing' ? (
                    <Clock className="h-5 w-5" />
                ) : (
                    <AlertCircle className="h-5 w-5" />
                )}
                <div className="w-full">
                    <AlertTitle className="mb-2">
                        {status === 'processing' ? 'Shop Under Review' : 'Shop Registration Rejected'}
                    </AlertTitle>

                    <p className="mb-2">{message} </p>
                    {reason && (
                        <div className="my-2 p-4 w-full border-b dark:border-red-300 border-red-200">
                            <strong>Reason:</strong> {reason}
                        </div>
                    )}
                </div>
            </div>
            {
                status === 'rejected' && (
                    <div className="w-full flex justify-end mt-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>

                                    {maxResubmitCountReached ? (
                                        <Button onClick={handleResubmit} variant="ghost" className="hover:bg-transparent hover:text-red-500">
                                            Resubmit Form
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" className="hover:bg-transparent hover:text-red-500" asChild>
                                            <Link href="/shop/resubmission">
                                                Resubmit Form
                                            </Link>
                                        </Button>
                                    )}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Try to resubmit a new shop registration</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )
            }

        </Alert>
    );
}
