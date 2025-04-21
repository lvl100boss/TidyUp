import React, { useEffect, useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { Toaster, toast } from 'sonner';
import { Button } from '@/Components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"
import { AlertCircle } from "lucide-react"
import Header from '@/Components/Shop/Header'
import ResubmissionHeader from './ResubmitShopInfoPartials/ResubmissionHeader'
import BasicDetails from './ResubmitShopInfoPartials/BasicDetails'
import LocationDetails from './ResubmitShopInfoPartials/LocationDetails'
import BusinessHours from './ResubmitShopInfoPartials/BusinessHours';
import ShopServices from './ResubmitShopInfoPartials/ShopServices';
import LegalDocumentsPartial from './ResubmitShopInfoPartials/LegalDocumentsPartial';
import ShopGalleryPartial from './ResubmitShopInfoPartials/ShopGalleryPartial';
import GradientBackground from '@/Components/GradientBackground'
import LazyLoadSection from '@/Components/LazyLoadSection'; // Import LazyLoadSection
import axios from 'axios';

const ResubmitShopInfo = ({ shop, serviceCategories }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [changeDetected, setChangeDetected] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { post, processing } = useForm({
        shop_id: shop.id
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    }

    const handleConfirmSubmit = () => {
        post(route('shop.resubmission.submit'), {
            onSuccess: () => {
                toast.success('Shop resubmission request submitted successfully');
                setChangeDetected(false);
            },
            onError: (errors) => {
                toast.error(errors.message || 'Failed to submit resubmission request');
            }
        });
        setShowConfirmation(false);
    }

    const remainingAttempts = 3 - shop.resubmit_count;

    return (
        <>
            <Head title="Resubmit Request" />
            <Toaster richColors />
            <Header onClick={toggleTheme} isDarkTheme={isDarkTheme} />
            <GradientBackground />
            <section className="py-24 px-5 relative min-h-screen pb-40">
                <div className="max-w-screen-md mx-auto">
                    <ResubmissionHeader rejection_reason={shop.rejection_reason} />

                    <LazyLoadSection minHeight="300px">
                        <BasicDetails
                            shop={shop}
                            changeDetected={changeDetected}
                            setChangeDetected={setChangeDetected}
                        />
                    </LazyLoadSection>

                    <LazyLoadSection minHeight="400px">
                        <LocationDetails
                            shop={shop}
                            changeDetected={changeDetected}
                            setChangeDetected={setChangeDetected}
                        />
                    </LazyLoadSection>

                    <LazyLoadSection minHeight="300px">
                        <BusinessHours
                            shop={shop}
                            changeDetected={changeDetected}
                            setChangeDetected={setChangeDetected}
                        />
                    </LazyLoadSection>

                    <LazyLoadSection minHeight="300px">
                        <ShopServices
                            shop={shop}
                            serviceCategories={serviceCategories}
                            changeDetected={changeDetected}
                            setChangeDetected={setChangeDetected}
                        />
                    </LazyLoadSection>

                    <LazyLoadSection minHeight="300px">
                        <LegalDocumentsPartial
                            legalDocuments={shop.legal_documents.formatted_urls}
                            shopId={shop.id}
                            changeDetected={changeDetected}
                            setChangeDetected={setChangeDetected}
                        />
                    </LazyLoadSection>

                    <LazyLoadSection minHeight="300px">
                        <ShopGalleryPartial
                            shop={shop}
                            changeDetected={changeDetected}
                            setChangeDetected={setChangeDetected}
                        />
                    </LazyLoadSection>

                    <form onSubmit={handleSubmit}>
                        <Button
                            className="w-full"
                            disabled={!changeDetected || processing}
                        >
                            {processing ? 'Submitting...' : 'Submit Resubmission Request'}
                        </Button>
                    </form>

                    <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-destructive">⚠️ Important: Confirm Resubmission</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Alert variant="destructive" className="border-2">
                                    <AlertCircle className="h-6 w-6" />
                                    <AlertTitle className="text-lg font-semibold">Limited Attempts Warning</AlertTitle>
                                    <AlertDescription className="text-base">
                                        You have <span className="font-bold text-destructive">{remainingAttempts}</span> {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining out of 3 total attempts.
                                        <br />
                                        <br />
                                        This action cannot be undone. Please ensure all your information is correct before proceeding.
                                    </AlertDescription>
                                </Alert>
                            </div>
                            <DialogFooter className="mt-4">
                                <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleConfirmSubmit}
                                    disabled={processing}
                                    className="font-semibold"
                                >
                                    {processing ? 'Processing...' : 'Confirm Resubmission'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </section>
        </>
    )
}

export default ResubmitShopInfo