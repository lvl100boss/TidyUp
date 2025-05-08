import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

const Summary = ({ data, categories, onSubmit, isSubmitting, errors }) => {
    const formatOperationHours = (hours) => {
        return Object.entries(hours)
            .filter(([_, value]) => value.isOpen)
            .map(
                ([day, value]) =>
                    `${day}: ${value.openTime} - ${value.closeTime}`
            )
            .join("\n");
    };

    // Check for the specific email duplication error
    const hasEmailDuplicationError = errors && errors.email && errors.email.includes('already registered');
    
    // Check if we have any submission errors to display
    const hasErrors = errors && Object.keys(errors).length > 0;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">
                Review Your Shop Information
            </h2>

            {hasEmailDuplicationError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {errors.email}
                    </AlertDescription>
                </Alert>
            )}

            {hasErrors && !hasEmailDuplicationError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        There was a problem submitting your shop information. 
                        Please check the information and try again.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 p-6 border rounded-lg">
                <div>
                    <h3 className="font-semibold mb-2">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Shop Name:</p>
                        <p>{data.shop_name}</p>
                        <p className="text-muted-foreground">Email:</p>
                        <p>{data.email}</p>
                        <p className="text-muted-foreground">Phone:</p>
                        <p>{data.phone}</p>
                        <p className="text-muted-foreground">Bio:</p>
                        <p className="truncate">{data.bio}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Shop Categories</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.categories.map((categoryId) => {
                            const category = categories.find(c => c.id.toString() === categoryId.toString());
                            return (
                                <Badge key={categoryId} variant={"secondary"}>
                                    {category?.name || categoryId}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Location</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Region:</p>
                        <p>{data.region}</p>
                        <p className="text-muted-foreground">Province:</p>
                        <p>{data.province}</p>
                        <p className="text-muted-foreground">City:</p>
                        <p>{data.city}</p>
                        <p className="text-muted-foreground">Barangay:</p>
                        <p>{data.barangay}</p>
                        <p className="text-muted-foreground">Address:</p>
                        <p>{data.detailed_address}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Operation Hours</h3>
                    <pre className="text-sm whitespace-pre-line">
                        {formatOperationHours(data.operation_hours)}
                    </pre>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">
                        Services ({data.catalog_items.length})
                    </h3>
                    <div className="grid gap-2">
                        {data.catalog_items.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between text-sm"
                            >
                                <span>{item.service_name}</span>
                                <span className="font-semibold">
                                    ₱{item.cost}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {hasErrors && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-destructive mb-2">Submission Errors</h3>
                        <ul className="text-sm list-disc pl-5 text-destructive">
                            {Object.entries(errors).map(([field, message]) => (
                                <li key={field}>{typeof message === 'string' ? `${field}: ${message}` : `${field}: Please fix this field`}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Summary;
