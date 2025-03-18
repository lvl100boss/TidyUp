import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { AlertCircle, Clock } from "lucide-react";

export default function ShopStatusWarning({ statusMessage }) {
    if (!statusMessage) return null;

    const { status, message, reason } = statusMessage;

    return (
        <Alert variant={status === 'rejected' ? "destructive" : "warning"} className="mb-4">
            <div className="flex items-start gap-2">
                {status === 'processing' ? (
                    <Clock className="h-5 w-5" />
                ) : (
                    <AlertCircle className="h-5 w-5" />
                )}
                <div>
                    <AlertTitle className="mb-2">
                        {status === 'processing' ? 'Shop Under Review' : 'Shop Registration Rejected'}
                    </AlertTitle>
                    <AlertDescription>
                        <p className="mb-2">{message}</p>
                        {reason && (
                            <div className="mt-2 p-2 bg-background rounded">
                                <strong>Reason:</strong> {reason}
                            </div>
                        )}
                    </AlertDescription>
                </div>
            </div>
        </Alert>
    );
}
