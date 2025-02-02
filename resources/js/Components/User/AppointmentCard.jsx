import { AspectRatio } from "@/Components/ui/aspect-ratio";

AspectRatio;

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
        <div className="card border p-4 rounded-lg flex gap-8 items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="">
                    <img
                        className="w-[12rem] h-[7rem] object-cover rounded-md"
                        src={branchImg}
                        alt={branchName}
                    />
                </div>
                <div className="space-y-3">
                    <h6 className="figtree-semibold text-lg">{shopName}</h6>
                    <p className="text-sm">{branchName}</p>
                    <p className="text-sm">{location}</p>
                </div>
            </div>

            <div className="space-y-3 text-right">
                <h6 className="figtree-semibold text-lg">Php {totalPrice}</h6>
                <p className="text-sm">{date}</p>
                <p className="text-sm">{time}</p>
            </div>
        </div>
    );
};

export default AppointmentCard;
