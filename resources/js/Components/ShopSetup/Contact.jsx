import React, { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import axios from "axios";
import { debounce } from "lodash";

export default function Contact({
    data,
    setData,
    errors,
    allFieldsFilled,
    setAllFieldsFilled,
}) {
    const [emailValidationMsg, setEmailValidationMsg] = useState("");
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    
    // Check if required fields are filled
    useEffect(() => {
        if (data.email && data.phone && !emailValidationMsg && !allFieldsFilled) {
            setAllFieldsFilled(true);
        } else if ((!data.email || !data.phone || emailValidationMsg) && allFieldsFilled) {
            setAllFieldsFilled(false);
        }
    }, [data.email, data.phone, emailValidationMsg, allFieldsFilled]);

    // Create a debounced function to check email availability
    const checkEmailAvailability = debounce(async (email) => {
        if (!email || email.trim() === '') {
            setEmailValidationMsg("");
            return;
        }
        
        try {
            setIsCheckingEmail(true);
            const response = await axios.post(route('shop.check-email'), { email });
            
            if (response.data.exists) {
                setEmailValidationMsg("This email address is already registered with another shop. Please use a different email.");
            } else {
                setEmailValidationMsg("");
            }
        } catch (error) {
            console.error('Email validation error:', error);
            // Don't set error message on network errors to avoid blocking valid submissions
        } finally {
            setIsCheckingEmail(false);
        }
    }, 500);

    // Handle email change
    const handleEmailChange = (e) => {
        const email = e.target.value;
        setData("email", email);
        checkEmailAvailability(email);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            
            {emailValidationMsg && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {emailValidationMsg}
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="flex flex-col gap-4">
                <div>
                    <Label htmlFor="email">Business Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={handleEmailChange}
                        placeholder="Enter your Shop's email address"
                        className={isCheckingEmail ? "opacity-70" : ""}
                    />
                    {isCheckingEmail && <p className="text-xs text-muted-foreground mt-1">Checking email availability...</p>}
                    <InputError field="email" errors={errors} />
                </div>
                <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        placeholder="Enter your Shop's phone number"
                    />
                    <InputError field="phone" errors={errors} />
                </div>
            </div>
        </div>
    );
}
