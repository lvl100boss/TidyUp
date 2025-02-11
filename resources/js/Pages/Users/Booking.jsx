import UserLayout from "@/Layouts/UserLayout";
import {
    StepOnePage,
    StepTwoPage,
    StepThreePage,
    StepFourPage,
} from "@/Components/User/BookingPages/BookingStepsPage";
import { Head } from "@inertiajs/react";

export default function Booking({ shop, branch }) {
    return (
        <>
            <Head title="Booking" />
            <UserLayout>
                <StepOnePage shop={shop} branch={branch} />
                {/* <StepTwoPage />
                <StepThreePage />
                <StepFourPage /> */}
            </UserLayout>
        </>
    );
}
