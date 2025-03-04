import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, LogOut } from "lucide-react";
import AppointmentSummaryCard from "@/Components/User/BookingPages/AppointmentSummaryCard";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import BookingServiceTabs from "@/Components/Shop/ShopPage/BookingServiceTabs";

export default function BookingStepOne({ shop, shopStaff, data }) {
    const { data: formData, setData, post, processing, errors } = useForm({
        shop_id: shop.id,
        service_id: [],
        total_price: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
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
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </UserLayout>
        </>
    );
}
