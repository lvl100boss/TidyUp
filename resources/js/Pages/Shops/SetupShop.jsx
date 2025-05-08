import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
import Header from "@/Components/User/Header";
import GradientBackground from "@/Components/GradientBackground";
import SetupShopHeader from "./SetupShopPartials/SetupShopHeader";
import BasicDetails from "./SetupShopPartials/BasicDetails";
import LocationDetails from "./SetupShopPartials/LocationDetails";
import BusinessHours from "./SetupShopPartials/BusinessHours";
import ShopServices from "./SetupShopPartials/ShopServices";
import LazyLoadSection from "@/Components/LazyLoadSection";
import LegalDocumentsPartial from "./SetupShopPartials/LegalDocumentsPartial";
import ShopGalleryPartial from "./SetupShopPartials/ShopGalleryPartial";
import { Button } from "@/Components/ui/button";

const SetupShop = ({ serviceCategories }) => {

    const { data, setData, errors, post, processing } = useForm({
        shop_name: "",
        bio: "",
        email: "",
        contact_number: "",
        shop_categories: [],
        region: "",
        province: "",
        city: "",
        barangay: "",
        detailed_address: "",
        business_hours: null,
        shop_services: [],
        legal_documents: null,
        shop_gallery: null,
    });

    // Simple form submission - let Laravel handle validation
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData for file uploads
        const formData = new FormData();

        // Add basic shop details
        formData.append('shop_name', data.shop_name);
        formData.append('bio', data.bio || '');
        formData.append('email', data.email);
        formData.append('contact_number', data.contact_number);

        // Add address details
        formData.append('region', data.region);
        formData.append('province', data.province);
        formData.append('city', data.city);
        formData.append('barangay', data.barangay);
        formData.append('detailed_address', data.detailed_address);

        // Add shop categories
        if (data.shop_categories && data.shop_categories.length > 0) {
            data.shop_categories.forEach((categoryId, index) => {
                formData.append(`shop_categories[${index}]`, categoryId);
            });
        }

        // Format business hours
        if (data.business_hours && typeof data.business_hours === 'object') {
            const businessHoursArray = Object.values(data.business_hours)
                .filter(day => day && typeof day === 'object');

            businessHoursArray.forEach((hours, index) => {
                formData.append(`business_hours[${index}][day]`, hours.day);
                formData.append(`business_hours[${index}][is_open]`, hours.is_open ? 1 : 0);
                formData.append(`business_hours[${index}][open_time]`, hours.is_open ? hours.open_time : null);
                formData.append(`business_hours[${index}][close_time]`, hours.is_open ? hours.close_time : null);
            });
        }

        // Add shop services
        if (data.shop_services && data.shop_services.length > 0) {
            data.shop_services.forEach((service, index) => {
                formData.append(`shop_services[${index}][service_name]`, service.service_name);
                formData.append(`shop_services[${index}][cost]`, service.cost);
                formData.append(`shop_services[${index}][duration_hour]`, service.duration_hour);
                formData.append(`shop_services[${index}][duration_minute]`, service.duration_minute);
                formData.append(`shop_services[${index}][service_category_id]`, service.service_category_id);
            });
        }

        // Add legal documents
        if (data.legal_documents) {
            if (data.legal_documents.business_permit && data.legal_documents.business_permit.file) {
                formData.append('legal_documents[business_permit][file]', data.legal_documents.business_permit.file);
            }

            if (data.legal_documents.dti_registration && data.legal_documents.dti_registration.file) {
                formData.append('legal_documents[dti_registration][file]', data.legal_documents.dti_registration.file);
            }

            if (data.legal_documents.valid_id && data.legal_documents.valid_id.file) {
                formData.append('legal_documents[valid_id][file]', data.legal_documents.valid_id.file);
            }
        }

        // Add shop gallery
        if (data.shop_gallery) {
            // Main photo
            if (data.shop_gallery.main_photo && data.shop_gallery.main_photo.file) {
                formData.append('shop_gallery[main_photo][file]', data.shop_gallery.main_photo.file);
            }

            // Gallery photos
            if (data.shop_gallery.gallery_photos && data.shop_gallery.gallery_photos.length > 0) {
                data.shop_gallery.gallery_photos.forEach((photo, index) => {
                    if (photo.file) {
                        formData.append(`shop_gallery[gallery_photos][${index}][file]`, photo.file);
                    }
                });
            }
        }

        // Log the FormData keys for debugging
        console.log("Form data keys:", [...formData.entries()].map(entry => entry[0]));

        // Submit the form
        post(route('shop.store'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Shop created successfully!");
            },
            onError: (errors) => {
                toast.error("Please correct the errors in the form");
                console.error("Form validation errors:", errors);
            }
        });
    };

    return (
        <>
            <Head title="Setup Shop" />
            <Toaster richColors />
            <Header />
            <GradientBackground />
            <section className="py-24 px-5 relative min-h-screen pb-40">
                <div className="max-w-screen-md mx-auto">
                    <SetupShopHeader />
                    <form onSubmit={handleSubmit}>
                        <LazyLoadSection minHeight="300px">
                            <BasicDetails
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </LazyLoadSection>

                        <LazyLoadSection minHeight="300px">
                            <LocationDetails
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </LazyLoadSection>

                        <LazyLoadSection minHeight="300px">
                            <BusinessHours
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </LazyLoadSection>

                        <LazyLoadSection minHeight="300px">
                            <ShopServices
                                data={data}
                                setData={setData}
                                errors={errors}
                                serviceCategories={serviceCategories}
                            />
                        </LazyLoadSection>

                        <LazyLoadSection minHeight="300px">
                            <LegalDocumentsPartial
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </LazyLoadSection>

                        <LazyLoadSection minHeight="300px">
                            <ShopGalleryPartial
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </LazyLoadSection>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default SetupShop;
