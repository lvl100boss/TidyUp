import UserLayout from "@/Layouts/UserLayout";
import {
    StepOnePage,
    StepTwoPage,
    StepThreePage,
    StepFourPage,
} from "@/Components/User/BookingPages/BookingStepsPage";

export default function Booking({ shop, branch }) {
    return (
        <UserLayout>
            <StepOnePage shop={shop} branch={branch} />
            {/* <StepTwoPage />
            <StepThreePage />
            <StepFourPage /> */}
        </UserLayout>
    );
}
