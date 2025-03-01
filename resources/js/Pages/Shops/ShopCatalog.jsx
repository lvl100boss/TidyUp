import ShopsLayout from "@/Layouts/ShopsLayout";
import React, { useState, useEffect } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Save, X, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast, Toaster } from 'sonner';

export default function ShopCatalog({ shopServiceCategories, serviceCategories }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.message) {
            if (flash?.success) {
                toast.success("Success", {
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
    }, [flash]); // Track flash as a whole instead of flash.message



    return (
        <ShopsLayout>
            <Head title="Shop Services" />
            <Toaster />
            <h2 className="text-3xl font-semibold tracking-tight">Shop Catalog</h2>
        </ShopsLayout >
    );
}