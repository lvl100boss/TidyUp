import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import Header from "@/Components/User/Header";
import StepIndicator from "@/Components/ShopSetup/StepIndicator";
import ShopInfo from "@/Components/ShopSetup/ShopInfo";
import Categories from "@/Components/ShopSetup/Categories";
import Contact from "@/Components/ShopSetup/Contact";
import Location from "@/Components/ShopSetup/Location";
import OperationHours from "@/Components/ShopSetup/OperationHours";
import Catalog from "@/Components/ShopSetup/Catalog";
import BusinessPermit from "@/Components/ShopSetup/BusinessPermit";
import Gallery from "@/Components/ShopSetup/Gallery";

const STEPS = {
    SHOP_INFO: 0,
    CATEGORIES: 1,
    CONTACT: 2,
    LOCATION: 3,
    OPERATION_HOURS: 4,
    CATALOG: 5,
    BUSINESS_PERMIT: 6,
    GALLERY: 7,
};

const INITIAL_OPERATION_HOURS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
].reduce(
    (acc, day) => ({
        ...acc,
        [day]: {
            isOpen: false,
            openTime: "9:00 AM",
            closeTime: "5:00 PM",
        },
    }),
    {}
);

export default function SetupShop({ categories }) {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [currentStep, setCurrentStep] = useState(STEPS.SHOP_INFO);
    const [previewMainImage, setPreviewMainImage] = useState(null);
    const [previewGalleryImages, setPreviewGalleryImages] = useState([]);
    const [previewPermitImage, setPreviewPermitImage] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        shop_name: "",
        email: "",
        phone: "",
        region: "",
        province: "",
        city: "",
        barangay: "",
        detailed_address: "",
        categories: [],
        main_image: null,
        gallery_images: [],
        operation_hours: INITIAL_OPERATION_HOURS,
        catalog_items: [],
        business_permit: null,
    });

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("main_image", file);
            setPreviewMainImage(URL.createObjectURL(file));
        }
    };

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setData("gallery_images", [...data.gallery_images, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewGalleryImages((prev) => [...prev, ...newPreviews]);
    };

    const handlePermitImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("business_permit", file);
            setPreviewPermitImage(URL.createObjectURL(file));
        }
    };

    const removeGalleryImage = (index) => {
        const newGalleryImages = [...data.gallery_images];
        newGalleryImages.splice(index, 1);
        setData("gallery_images", newGalleryImages);

        const newPreviews = [...previewGalleryImages];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewGalleryImages(newPreviews);
    };

    const handleOperationHoursChange = (day, field, value) => {
        setData("operation_hours", {
            ...data.operation_hours,
            [day]: {
                ...data.operation_hours[day],
                [field]: value,
            },
        });
    };

    const handleCategoryChange = (values) => {
        setData("categories", values);
    };

    const handleLocationChange = (locationData) => {
        setData({
            ...data,
            region: locationData.region.name,
            province: locationData.province.name,
            city: locationData.city.name,
            barangay: locationData.barangay.name,
        });
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (currentStep === STEPS.GALLERY) {
            post("/shop/setup", {
                preserveScroll: true,
                forceFormData: true,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep !== STEPS.GALLERY) {
            nextStep();
        }
    };

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 7));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            setIsDarkTheme(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkTheme) {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setIsDarkTheme(!isDarkTheme);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case STEPS.SHOP_INFO:
                return (
                    <ShopInfo data={data} setData={setData} errors={errors} />
                );
            case STEPS.CATEGORIES:
                return (
                    <Categories
                        data={data}
                        handleCategoryChange={handleCategoryChange}
                        categories={categories}
                    />
                );
            case STEPS.CONTACT:
                return (
                    <Contact data={data} setData={setData} errors={errors} />
                );
            case STEPS.LOCATION:
                return (
                    <Location
                        data={data}
                        setData={setData}
                        handleLocationChange={handleLocationChange}
                        errors={errors}
                    />
                );
            case STEPS.OPERATION_HOURS:
                return (
                    <OperationHours
                        data={data}
                        handleOperationHoursChange={handleOperationHoursChange}
                    />
                );
            case STEPS.CATALOG:
                return <Catalog />;
            case STEPS.BUSINESS_PERMIT:
                return (
                    <BusinessPermit
                        handlePermitImageChange={handlePermitImageChange}
                        previewPermitImage={previewPermitImage}
                        errors={errors}
                    />
                );
            case STEPS.GALLERY:
                return (
                    <Gallery
                        handleMainImageChange={handleMainImageChange}
                        handleGalleryImagesChange={handleGalleryImagesChange}
                        removeGalleryImage={removeGalleryImage}
                        previewMainImage={previewMainImage}
                        previewGalleryImages={previewGalleryImages}
                        errors={errors}
                    />
                );
        }
    };

    return (
        <>
            <Head title="Shop Setup" />
            <section className="py-2 px-5 relative min-h-screen">
                <Header onClick={toggleTheme} isDarkTheme={isDarkTheme} />
                <div className="max-w-screen-md mx-auto">
                    <div>
                        <div className="mb-5">
                            <h1 className="figtree-semibold text-2xl">
                                Register your Shop
                            </h1>
                            <p className="text-muted-foreground">
                                Fill up your Shop's Information
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <StepIndicator
                                currentStep={currentStep}
                                totalSteps={8}
                            />
                            {renderStepContent()}
                            <div className="mt-6 flex justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === STEPS.SHOP_INFO}
                                >
                                    Previous
                                </Button>
                                {currentStep === STEPS.GALLERY ? (
                                    <Button
                                        type="button"
                                        onClick={submitForm}
                                        disabled={processing}
                                        className="figtree-semibold"
                                    >
                                        {processing
                                            ? "Submitting..."
                                            : "Submit"}
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="figtree-semibold"
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
