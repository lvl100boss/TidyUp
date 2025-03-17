const AppointmentCard = ({ appointment }) => {
    console.log(appointment);
    const shopImg = appointment.shop.shop_gallery[0].url;
    const shopName = appointment.shop.shop_name;
    const location = appointment.shop.detailed_address;
    const totalPrice = appointment.total_price;
    const date = new Date(appointment.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
    const time = new Date(`1970-01-01T${appointment.time}Z`).toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }
    );

    return (
        <div className="card border p-4 rounded-lg flex flex-col md:flex-row gap-4 md:gap-8 md:items-center md:justify-between hover:border-muted-foreground cursor-pointer">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-full md:w-[12rem]">
                    <img
                        className="w-full h-[12rem] md:h-[7rem] object-cover rounded-md"
                        src={shopImg}
                        alt={shopName}
                    />
                </div>
                <div className="space-y-2 md:space-y-3 w-full md:w-auto">
                    <h6 className="figtree-semibold text-lg">{shopName}</h6>
                    <p className="text-sm text-muted-foreground">{location}</p>
                </div>
            </div>

            <div className="flex md:flex-col justify-between md:text-right mt-4 md:mt-0 md:hidden">
                <h6 className="figtree-semibold text-lg">Php {totalPrice}</h6>
                <div className="text-right md:mt-3">
                    <p className="text-sm text-muted-foreground">{date}</p>
                    <p className="text-sm text-muted-foreground">{time}</p>
                </div>
            </div>
            <div className="space-y-2 md:space-y-3 w-full md:w-auto hidden md:block text-right">
                <h6 className="figtree-semibold text-lg">Php {totalPrice}</h6>
                <p className="text-sm text-muted-foreground">{date}</p>
                <p className="text-sm text-muted-foreground">{time}</p>
            </div>
        </div>
    );
};

export default AppointmentCard;
