import { BookingProvider } from "@/Components/User/BookingPages/BookingContext";
import {
    StepOnePage,
    StepTwoPage,
    StepThreePage,
} from "@/Components/User/BookingPages/BookingStepsPage";
import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import { useBooking } from "@/Components/User/BookingPages/BookingContext";

function BookingSteps({ shop }) {
    const { state } = useBooking();

    switch (state.step) {
        case 1:
            return <StepOnePage shop={shop} />;
        case 2:
            return <StepTwoPage shop={shop} />;
        case 3:
            return <StepThreePage shop={shop} />;
        default:
            return <StepOnePage shop={shop} />;
    }
}

export default function Booking({ shop }) {
    return (
        <>
            <Head title="Booking" />
            <UserLayout>
                <BookingProvider>
                    <BookingSteps shop={shop} />
                </BookingProvider>
            </UserLayout>
        </>
    );
}
