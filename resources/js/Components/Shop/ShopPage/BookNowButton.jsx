import React from "react";
import { buttonVariants } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

const BookNowButton = ({ shop_id }) => {
    return (
        <Link
            href={`/${shop_id}/booking/1`}
            className={`${buttonVariants({
                variant: "default",
            })} w-full rounded-sm mt-3 figtree-semibold `}
        >
            Book Now!
        </Link>
    );
};

export default BookNowButton;
