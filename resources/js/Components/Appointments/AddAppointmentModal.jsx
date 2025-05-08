import { useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function AddAppointmentModal({ isOpen, setIsOpen }) {
    // Get staffData safely with fallback
    const pageProps = usePage().props;
    const staffData = pageProps?.staffData;
    
    // When component is "opened", redirect to walk-in booking page
    useEffect(() => {
        if (isOpen) {
            try {
                // Get shop ID directly from staffData in props
                const shopId = staffData?.shop_id;
                
                if (shopId) {
                    // Navigate directly to the booking step one page with walkin and guest flags
                    window.location.href = `/${shopId}/booking/1?walkin=true&guest=true`;
                } else {
                    console.error("Could not find shop ID in staff data");
                    // Try to get shop ID from other page props
                    const alternativeShopId = pageProps?.myAppointments?.[0]?.shop_id || 
                                             pageProps?.shopAppointments?.[0]?.shop_id;
                    
                    if (alternativeShopId) {
                        window.location.href = `/${alternativeShopId}/booking/1?walkin=true&guest=true`;
                    } else {
                        // Fallback to appointments page
                        window.location.href = "/shop/appointments";
                    }
                }
            } catch (error) {
                console.error("Error redirecting to walk-in booking", error);
                // Fallback to appointments page on error
                window.location.href = "/shop/appointments";
            } finally {
                // Reset the open state
                setIsOpen(false);
            }
        }
    }, [isOpen, setIsOpen, staffData, pageProps]);

    // Return null as we don't need to render anything - we're redirecting instead
    return null;
}
