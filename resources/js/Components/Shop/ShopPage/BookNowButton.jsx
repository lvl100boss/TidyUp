import React from "react";
import { buttonVariants } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react";

const BookNowButton = ({ shop_id }) => {
    const { auth } = usePage().props;
    const isAuthenticated = auth.user !== null;

    return (
        <Link
            href={isAuthenticated ? `/${shop_id}/booking/1` : `/${shop_id}/preview/booking/1`}
            className={`${buttonVariants({
                variant: "default",
            })} w-full rounded-sm mt-3 figtree-semibold`}
        >
            Book Now!
        </Link>
    );
};

export default BookNowButton;