import React from "react";
import { CheckCircle2 } from "lucide-react";

const Success = () => {
    return (
        <div className="text-center space-y-4">
            <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold">
                Application Submitted Successfully!
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
                Thank you for registering your shop. We'll review your
                application and send you an email once your shop is verified.
                This usually takes 1-2 business days.
            </p>
            <div className="p-4 bg-muted/30 rounded-lg mt-6 text-sm text-muted-foreground">
                <p>
                    Don't forget to check your email for updates about your shop
                    verification status.
                </p>
            </div>
        </div>
    );
};

export default Success;
