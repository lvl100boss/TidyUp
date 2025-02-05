import { AspectRatio } from "@/Components/ui/aspect-ratio";

const AppointmentCard = ({ appointment }) => {
    const branchImg = appointment.branch.gallery[0].url;
    const branchName = appointment.branch.branch_name;
    const shopName = appointment.shop.shop_name;
    const location = appointment.branch.detailed_address;
    const totalPrice = appointment.total_price;
    const date = new Date(appointment.appointment_date).toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
        }
    );
    const time = new Date(
        `1970-01-01T${appointment.appointment_time}Z`
    ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <div className="card border p-4 rounded-lg flex flex-col md:flex-row gap-4 md:gap-8 md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-full md:w-[12rem]">
                    <img
                        className="w-full h-[12rem] md:h-[7rem] object-cover rounded-md"
                        src={branchImg}
                        alt={branchName}
                    />
                </div>
                <div className="space-y-2 md:space-y-3 w-full md:w-auto">
                    <h6 className="figtree-semibold text-lg">{shopName}</h6>
                    <p className="text-sm text-muted-foreground">
                        {branchName}
                    </p>
                    <p className="text-sm text-muted-foreground">{location}</p>
                </div>
            </div>

            <div className="flex md:flex-col justify-between md:text-right mt-4 md:mt-0">
                <h6 className="figtree-semibold text-lg">Php {totalPrice}</h6>
                <div className="text-right md:mt-3">
                    <p className="text-sm text-muted-foreground">{date}</p>
                    <p className="text-sm text-muted-foreground">{time}</p>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCard;
