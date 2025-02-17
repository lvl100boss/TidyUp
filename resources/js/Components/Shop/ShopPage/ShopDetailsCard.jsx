import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import BookNowButton from "@/Components/Shop/ShopPage/BookNowButton";

const ShopDetailsCard = (props) => {
    return (
        <div className="my-10">
            <div className="figtree-bold text-2xl mb-3">Shop Details</div>
            <div className="space-y-2">
                <div className="">
                    <div className="inline-flex gap-2 items-center">
                        <div className="inline-flex items-center gap-3">
                            <MapPin size={18} className="mb-[0.1rem]" />
                            <h1 className="figtree-semibold text-lg">
                                Location
                            </h1>
                        </div>
                        <p className="figtree-light text-muted-foreground text-sm mt-1">
                            {props.shop?.detailed_address}
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className="inline-flex gap-2 items-center">
                        <div className="inline-flex items-center gap-3">
                            <Phone size={18} className="mb-[0.1rem]" />
                            <h1 className="figtree-semibold text-lg">
                                Contact
                            </h1>
                        </div>
                        <p className="figtree-light text-muted-foreground text-sm mt-1">
                            {props.shop?.contact_number}
                        </p>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="inline-flex gap-2 items-center">
                        <div className="inline-flex items-center gap-3">
                            <Mail size={18} className="mb-[0.1rem]" />
                            <h1 className="figtree-semibold text-lg">Email</h1>
                        </div>
                        <p className="figtree-light text-muted-foreground text-sm mt-1">
                            {props.shop?.email}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mb-3 lg:hidden">
                <BookNowButton shop_id={props.shop?.id} />
            </div>
        </div>
    );
};

export default ShopDetailsCard;
