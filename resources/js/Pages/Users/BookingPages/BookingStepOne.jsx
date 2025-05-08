import UserLayout from "@/Layouts/UserLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, LogOut } from "lucide-react";
import AppointmentSummaryCard from "@/Components/User/BookingPages/AppointmentSummaryCard";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import BookingServiceTabs from "@/Components/Shop/ShopPage/BookingServiceTabs";

export default function BookingStepOne({ shop, shopStaff, data, isPreview = false }) {
    // Safely get URL parameters with fallbacks
    const pageProps = usePage().props;

    // Extract query parameters safely
    const getQueryParam = (paramName, defaultValue = 'false') => {
        // Check if we have ziggy and query in the props
        if (pageProps && pageProps.ziggy && pageProps.ziggy.query) {
            return pageProps.ziggy.query[paramName] || defaultValue;
        }

        // Fallback to manually parsing URL if ziggy.query is unavailable
        const url = new URL(window.location.href);
        return url.searchParams.get(paramName) || defaultValue;
    };

    // Get query parameters with safe fallbacks
    const isWalkin = getQueryParam('walkin') === 'true';
    const isGuestBooking = getQueryParam('guest') === 'true';

    const { data: formData, setData, post, processing, errors } = useForm({
        shop_id: shop.id,
        service_id: data.service_id || [],
        total_price: data.total_price || 0,
        is_walkin: isWalkin,
        is_guest: isGuestBooking,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use the appropriate route based on preview status
        if (isPreview) {
            post(`/${shop.id}/preview/booking/1`);
        } else {
            post(`/${shop.id}/booking/1`, {
                data: {
                    ...formData,
                    is_walkin: isWalkin,
                    is_guest: isGuestBooking,
                }
            });
        }
    };

    const categories = [
        ...new Set(
            shop?.shop_service_categories?.map(
                (service) => service.service_categories?.name
            ) || []
        ),
    ];

    const groupedServices = categories.map((category) => ({
        category,
        services:
            shop?.shop_service_categories?.filter(
                (service) => service.service_categories?.name === category
            ) || [],
    }));

    return (
        <>
            <Head title={isWalkin ? (isGuestBooking ? "Book for Guest" : "Book Walk-in Appointment") : "Choose Services"} />
            <UserLayout>
                <div className="min-h-screen max-w-7xl mx-auto px-4 pb-8 sm:pb-12">
                    <header className="border-b mb-6 sm:mb-8">
                        <div className="py-3 sm:py-4 flex items-center justify-between">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={isWalkin ? "/shop/appointments" : `/${shop.id}/shop`} className="flex items-center">
                                    <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="text-sm sm:text-base">
                                        {isWalkin ? "Back to Appointments" : "Back to Shop"}
                                    </span>
                                </Link>
                            </Button>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                                {isWalkin ? (isGuestBooking ? "Book for Guest Customer" : "Book Walk-in Appointment") : "Book an Appointment"}
                            </h1>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={isWalkin ? "/shop/appointments" : `/${shop.id}/shop`} className="flex items-center">
                                    <span className="hidden sm:inline-block mr-2">Cancel</span>
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </header>

                    {/* Add appropriate indicator based on booking type */}
                    {isWalkin && (
                        <div className="max-w-xl mx-auto mb-4 bg-muted p-3 rounded-md">
                            <p className="text-center text-sm font-medium">
                                {isGuestBooking
                                    ? "You are booking an appointment for a guest customer (no account)"
                                    : "You are booking a walk-in appointment"}
                            </p>
                        </div>
                    )}

                    <div className="max-w-xl mx-auto mb-6 sm:mb-10">
                        <StepsIndicator step={1} />
                    </div>

                    <section className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
                        {/* Left side: Service selection */}
                        <div className="lg:col-span-3 order-2 lg:order-1">
                            <div className="space-y-3 sm:space-y-4">
                                <h2 className="text-xl sm:text-2xl font-bold">Choose Services</h2>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Select one or more services for your appointment at {shop.shop_name}.
                                </p>
                                <BookingServiceTabs
                                    categories={categories}
                                    groupedServices={groupedServices}
                                    setData={setData}
                                />
                            </div>
                        </div>

                        {/* Right side: Appointment Summary */}
                        <div className="lg:col-span-2 order-1 lg:order-2">
                            <div className="sticky top-4 sm:top-8">
                                <div className="bg-card rounded-lg p-4 sm:p-6 shadow border mb-4">
                                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Appointment Summary</h2>
                                    <AppointmentSummaryCard
                                        shop={shop}
                                        shopStaff={shopStaff}
                                    />
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="shop_id" value={formData.shop_id} />
                                    <Button
                                        className="w-full py-4 sm:py-6 text-sm sm:text-base font-medium"
                                        type="submit"
                                        size="lg"
                                        variant="default"
                                        disabled={!formData.service_id || formData.service_id.length === 0}
                                    >
                                        {processing ? "Processing..." : "Continue to Schedule"}
                                    </Button>
                                    {(!formData.service_id || formData.service_id.length === 0) && (
                                        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-2">
                                            Please select at least one service to continue
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </UserLayout>
        </>
    );
}