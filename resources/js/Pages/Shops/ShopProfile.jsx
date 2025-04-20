import React from "react";
import ShopsLayout from "@/Layouts/ShopsLayout";
import ShopGalleryCard from "@/Components/Shop/ShopProfile/ShopGalleryCard";
import ShopBusinessHoursCard from "@/Components/Shop/ShopProfile/ShopBusinessHoursCard";
import ShopSocialMedia from "@/Components/Shop/ShopProfile/ShopSocialMedia";
import ShopContactInfoCard from "@/Components/Shop/ShopProfile/ShopContactInfoCard";
import StaffSectionCard from "@/Components/Shop/ShopProfile/StaffSectionCard";
import ServiceSectionCard from "@/Components/Shop/ShopProfile/ServiceSectionCard";
import ShopProfileHeader from "@/Components/Shop/ShopProfile/ShopProfileHeader";
import { Head, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

const ShopProfile = ({ shop, isOwnerOrManager }) => {
    // Sample shop data structure
    const sampleShop = {
        social: {
            instagram: "@glamoursalon",
            facebook: "GlamourSalonPH",
            website: "www.glamoursalon.com",
        },
    };

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.message) {
            if (flash.success) {
                toast("Heads up!", {
                    description: flash.message,
                    duration: 5000,
                });
            } else {
                toast.error("Uh oh! Something went wrong.", {
                    description: flash.message,
                    duration: 5000,
                });
            }
        }
    }, [flash.message]);
    return (
        <ShopsLayout>
            <Head title="Shop Profile" />
            <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-full md:w-2/3 space-y-5">
                        {/* Shop Profile Header */}
                        <ShopProfileHeader shop={shop} isOwnerOrManager={isOwnerOrManager} />
                        {/* Services Section */}
                        <ServiceSectionCard shop={shop} />
                        {/* Staff Section */}
                        <StaffSectionCard shop={shop} />
                    </div>
                    <div className="w-full md:w-1/3 space-y-5">
                        {/* Business Hours */}
                        <ShopBusinessHoursCard shop={shop} isOwnerOrManager={isOwnerOrManager} />
                        {/* Contact Information */}
                        <ShopContactInfoCard shop={shop} isOwnerOrManager={isOwnerOrManager} />
                        {/* Social Media */}
                        <ShopSocialMedia shop={shop} isOwnerOrManager={isOwnerOrManager} />
                    </div>
                </div>
                {/* Shop Gallery */}
                <ShopGalleryCard shop_gallery={shop.shop_gallery} isOwnerOrManager={isOwnerOrManager} />
            </div>
        </ShopsLayout>
    );
};

export default ShopProfile;
