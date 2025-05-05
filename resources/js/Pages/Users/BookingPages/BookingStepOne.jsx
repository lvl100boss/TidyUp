import UserLayout from "@/Layouts/UserLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, LogOut } from "lucide-react";
import AppointmentSummaryCard from "@/Components/User/BookingPages/AppointmentSummaryCard";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import BookingServiceTabs from "@/Components/Shop/ShopPage/BookingServiceTabs";

export default function BookingStepOne({ shop, shopStaff, data, isPreview = false }) {
    const { data: formData, setData, post, processing, errors } = useForm({
        shop_id: shop.id,
        service_id: data.service_id || [],
        total_price: data.total_price || 0,
        service_id: data?.service_id || [],
        total_price: data?.total_price || 0,
        attendees: data?.attendees || [],
        buffer_time_minutes: shop?.settings?.buffer_time_minutes || 30
    });

    const hasSelectedServices = formData.service_id && formData.service_id.length > 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use the appropriate route based on preview status
        if (isPreview) {
            post(`/${shop.id}/preview/booking/1`);
        } else {
            post(`/${shop.id}/booking/1`);
        }

        if (!hasSelectedServices) {
            alert("Please select at least one service");
            return;
        }

        post(`/${shop.id}/booking/1`);
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
            <Head title="Choose Services" />
            <UserLayout>
                <div className="min-h-screen">
                    <header className="flex justify-center relative ">
                        <Button className="absolute rounded-none border-b border-foreground left-0" variant="ghost" asChild>
                            <Link href={`/${shop.id}/shop`}>
                                <span><ChevronLeft className="mr-2" /></span>
                                Back
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">Appointment Processing</h1>
                        <Button className="absolute rounded-none border-b border-foreground right-0" variant="ghost" asChild>
                            <Link href={`/${shop.id}/shop`}>
                                Exit
                                <LogOut className="ml-2" />
                            </Link>
                        </Button>
                    </header>
                    <div className="mt-8 max-w-xl mx-auto">
                        <StepsIndicator step={1} />
                    </div>
                    <section className="mt-4 flex gap-5">
                        <div className="flex-1">
                            <div className="space-y-3">
                                <h1 className="text-2xl font-bold">Choose Service</h1>
                                <BookingServiceTabs
                                    categories={categories}
                                    groupedServices={groupedServices}
                                    setData={setData}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="sticky top-20 space-y-5">
                                <AppointmentSummaryCard
                                    shop={shop}
                                    shopStaff={shopStaff}
                                />
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="shop_id" value={formData.shop_id} />
                                    <Button
                                        className="w-full"
                                        type="submit"
                                        loading={processing}
                                        disabled={!formData.service_id || formData.service_id.length === 0}
                                    >
                                        Next
                                    </Button>
                                    {errors.service_id && (
                                        <p className="text-sm text-destructive mt-2 text-center">
                                            {errors.service_id}
                                        </p>
                                    )}
                                    {!hasSelectedServices && (
                                        <p className="text-sm text-muted-foreground mt-2 text-center">
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