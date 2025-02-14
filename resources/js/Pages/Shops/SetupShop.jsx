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
import Summary from "@/Components/ShopSetup/Summary";
import Success from "@/Components/ShopSetup/Success";

const STEPS = {
    SHOP_INFO: 0,
    CATEGORIES: 1,
    CONTACT: 2,
    LOCATION: 3,
    OPERATION_HOURS: 4,
    CATALOG: 5,
    BUSINESS_PERMIT: 6,
    GALLERY: 7,
    SUMMARY: 8,
    SUCCESS: 9,
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

export default function SetupShop({ categories, serviceCategories }) {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [currentStep, setCurrentStep] = useState(STEPS.SHOP_INFO);
    const [previewMainImage, setPreviewMainImage] = useState(null);
    const [previewGalleryImages, setPreviewGalleryImages] = useState([]);
    const [previewPermitImage, setPreviewPermitImage] = useState(null);
    const [previewDtiRegistrationImage, setPreviewDtiRegistrationImage] =
        useState(null);
    const [previewValidIdImage, setPreviewValidIdImage] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [allFieldsFilled, setAllFieldsFilled] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        shop_name: "",
        bio: "",
        email: "",
        phone: "",
        region: "",
        province: "",
        city: "",
        barangay: "",
        detailed_address: "",
        categories: [],
        shop_photo: null,
        shop_gallery: [],
        operation_hours: INITIAL_OPERATION_HOURS,
        catalog_items: [],
        business_permit: null,
        dti_registration: null,
        valid_id: null,
    });

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("shop_photo", file);
            setPreviewMainImage(URL.createObjectURL(file));
        }
    };

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setData("shop_gallery", [...data.shop_gallery, ...files]);
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

    const handleValidIdImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("valid_id", file);
            setPreviewValidIdImage(URL.createObjectURL(file));
        }
    };

    const handleDtiRegistrationImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("dti_registration", file);
            setPreviewDtiRegistrationImage(URL.createObjectURL(file));
        }
    };

    const removeGalleryImage = (index) => {
        const newGalleryImages = [...data.shop_gallery];
        newGalleryImages.splice(index, 1);
        setData("shop_gallery", newGalleryImages);

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
        post("/shop/setup", {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitted(true);
                setCurrentStep(STEPS.SUCCESS);
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep === STEPS.SUMMARY) {
            submitForm(e);
        } else {
            nextStep();
        }
    };

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 9));
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
                    <ShopInfo
                        setData={setData}
                        data={data}
                        errors={errors}
                        allFieldsFilled={allFieldsFilled}
                        setAllFieldsFilled={setAllFieldsFilled}
                    />
                );
            case STEPS.CATEGORIES:
                return (
                    <Categories
                        data={data}
                        handleCategoryChange={handleCategoryChange}
                        categories={categories}
                        allFieldsFilled={allFieldsFilled}
                        setAllFieldsFilled={setAllFieldsFilled}
                    />
                );
            case STEPS.CONTACT:
                return (
                    <Contact
                        data={data}
                        setData={setData}
                        errors={errors}
                        allFieldsFilled={allFieldsFilled}
                        setAllFieldsFilled={setAllFieldsFilled}
                    />
                );
            case STEPS.LOCATION:
                return (
                    <Location
                        data={data}
                        setData={setData}
                        handleLocationChange={handleLocationChange}
                        errors={errors}
                        allFieldsFilled={allFieldsFilled}
                        setAllFieldsFilled={setAllFieldsFilled}
                    />
                );
            case STEPS.OPERATION_HOURS:
                return (
                    <OperationHours
                        data={data}
                        handleOperationHoursChange={handleOperationHoursChange}
                        allFieldsFilled={allFieldsFilled}
                        setAllFieldsFilled={setAllFieldsFilled}
                    />
                );
            case STEPS.CATALOG:
                return (
                    <Catalog
                        serviceCategories={serviceCategories}
                        data={data}
                        setData={setData}
                        allFieldsFilled={allFieldsFilled}
                        setAllFieldsFilled={setAllFieldsFilled}
                    />
                );
            case STEPS.BUSINESS_PERMIT:
                return (
                    <BusinessPermit
                        handlePermitImageChange={handlePermitImageChange}
                        handleDtiRegistrationImageChange={
                            handleDtiRegistrationImageChange
                        }
                        handleValidIdImageChange={handleValidIdImageChange}
                        previewPermitImage={previewPermitImage}
                        previewDtiRegistrationImage={
                            previewDtiRegistrationImage
                        }
                        previewValidIdImage={previewValidIdImage}
                        errors={errors}
                        allFieldsFilled={allFieldsFilled}
                        setAllFieldsFilled={setAllFieldsFilled}
                        data={data}
                    />
                );
            case STEPS.GALLERY:
                return (
                    <Gallery
                        data={data}
                        handleMainImageChange={handleMainImageChange}
                        handleGalleryImagesChange={handleGalleryImagesChange}
                        removeGalleryImage={removeGalleryImage}
                        previewMainImage={previewMainImage}
                        previewGalleryImages={previewGalleryImages}
                        allFieldsFilled={allFieldsFilled}
                        setAllFieldsFilled={setAllFieldsFilled}
                        errors={errors}
                    />
                );
            case STEPS.SUMMARY:
                return <Summary data={data} categories={categories} />;
            // return <Success />;
            case STEPS.SUCCESS:
                return <Success />;
            default:
                return null;
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
                            {currentStep !== STEPS.SUCCESS && (
                                <StepIndicator
                                    currentStep={currentStep}
                                    totalSteps={9}
                                />
                            )}
                            {renderStepContent()}
                            {currentStep !== STEPS.SUCCESS && (
                                <div className="mt-6 flex justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={
                                            currentStep === STEPS.SHOP_INFO
                                        }
                                    >
                                        Previous
                                    </Button>
                                    {currentStep === STEPS.SUMMARY ? (
                                        <Button
                                            type="button"
                                            onClick={submitForm}
                                            disabled={processing}
                                            className="figtree-semibold"
                                        >
                                            {processing
                                                ? "Submitting..."
                                                : "Submit Application"}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="figtree-semibold"
                                            disabled={!allFieldsFilled}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
