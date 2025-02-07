import { Button, buttonVariants } from "@/Components/ui/button";
import { ChevronLeft, LogOut, MapPin } from "lucide-react";
import { Link } from "@inertiajs/react";

function BookingHeader(props) {
    return (
        <div className="flex items-center justify-between">
            <Button className="figtree-medium  " variant="ghost">
                <ChevronLeft />
                Back
            </Button>
            <h1 className="figtree-medium text-xl">Appointment Processing</h1>
            <Link
                href={`/shop/${props.shop_id}/${props.branch_id}`}
                className={`figtree-medium ${buttonVariants({
                    variant: "ghost",
                })}`}
            >
                Back
                <LogOut />
            </Link>
        </div>
    );
}

function SummaryCard(props) {
    let total = (0).toFixed(2);
    return (
        <div>
            {/* col 1 */}
            <div className="border w-[20rem] p-5 rounded-md">
                {/* container of Img */}
                <div className="aspect-video overflow-hidden rounded-md mb-5">
                    <img
                        src={props.branch.gallery[0].url}
                        className="w-full h-full object-cover"
                        alt=""
                    />
                </div>
                {/* Container of Shop and Branch Detail */}
                <div className="mb-5">
                    <h1 className="figtree-medium text-xl">
                        {props.shop.shop_name}
                    </h1>
                    <div className="inline-flex items-center gap-1">
                        <MapPin
                            size={15}
                            className="mb-[0.1rem] stroke-muted-foreground"
                        />
                        <span className="text-sm text-muted-foreground">
                            {props.branch.branch_name}
                        </span>
                    </div>
                </div>
                {/* Container of Total Cost of Service */}
                <div className="flex items-center justify-between text-lg">
                    <h3>Total:</h3>
                    <p className="figtree-medium">Php {total}</p>
                </div>
            </div>
        </div>
    );
}

const StepOnePage = ({ shop, branch }) => {
    console.log("shop", shop);
    console.log("branch", branch);
    return (
        <>
            {/* Header */}
            <header className="mb-5">
                <BookingHeader shop_id={shop.id} branch_id={branch.id} />
            </header>
            {/* Section 1 */}
            <section className="mb-5 flex gap-5">
                <SummaryCard shop={shop} branch={branch} />
                <div className="flex-1">
                    <h3 className="text-xl figtree-semibold">
                        Available Time Slots
                    </h3>
                </div>
            </section>
        </>
    );
};

const StepTwoPage = ({ shop, branch }) => {
    return (
        <div>
            <h1>Step Two</h1>
            <BookingHeader shop_id={shop.id} branch_id={branch.id} />
        </div>
    );
};

const StepThreePage = ({ shop, branch }) => {
    return (
        <div>
            <h1>Step Three</h1>
            <BookingHeader shop_id={shop.id} branch_id={branch.id} />
        </div>
    );
};

const StepFourPage = ({ shop, branch }) => {
    return (
        <div>
            <h1>Step Four</h1>
            <BookingHeader shop_id={shop.id} branch_id={branch.id} />
        </div>
    );
};

export { StepOnePage, StepTwoPage, StepThreePage, StepFourPage };
