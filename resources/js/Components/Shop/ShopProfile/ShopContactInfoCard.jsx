import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { MapPin, Phone, Mail, Pencil } from "lucide-react";
import EditContactInfoForm from "./EditContactInfoForm";
import { useState } from "react";

export default function ShopContactInfoCard({ shop }) {
    const [open, setOpen] = useState(false);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center w-full">
                    <CardTitle>Contact Information</CardTitle>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger>
                            <button type="button" className="focus:outline-none">
                                <Pencil className="size-4 cursor-pointer hover:scale-125 transition-transform" />
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Contact Information</DialogTitle>
                                <DialogDescription>
                                    Update your shop's contact details such as address, phone number, and email.
                                </DialogDescription>
                            </DialogHeader>
                            <EditContactInfoForm shop={shop} onClose={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>

            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{shop.email}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                        {shop.contact_number}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                        {shop.detailed_address}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}