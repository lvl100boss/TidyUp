import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head } from "@inertiajs/react";
import { LayoutDashboard, Bell, Banknote, PhilippinePeso } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

export default function Dashboard({ shop }) {
    console.log(shop);
    const shopOwner =
        shop.shop_account.user.first_name +
        " " +
        shop.shop_account.user.last_name;
    const shopOwnerEmail = shop.shop_account.user.email;
    const user = shop.shop_account.user;
    return (
        <ShopsLayout>
            <Head title="Shop Dashboard" />
            <div className="border p-5 px-5 rounded-lg flex items-center justify-between mb-5">
                <div>
                    <h6>Shop Name</h6>
                    <h1 className="text-3xl figtree-bold">{shop.shop_name}</h1>
                </div>
                <div className="hidden sm:inline-flex items-center gap-5 ">
                    <div className="text-right">
                        <p>{shopOwner}</p>
                        <p className="text-sm">{shopOwnerEmail}</p>
                    </div>
                    <Avatar className="size-12">
                        {user.profile_photo_path ? (
                            <AvatarImage
                                src={`/storage/${user.profile_photo_path}`}
                            />
                        ) : user.first_name ? (
                            <AvatarFallback>
                                {user.first_name[0] + user.last_name[0]}
                            </AvatarFallback>
                        ) : (
                            <AvatarFallback className="uppercase">
                                {user.username[0] + user.username[1]}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </div>
            </div>
            <div className="mb-5">
                <h1 className="figtree-bold text-4xl">Overview</h1>
            </div>
            <div className="flex flex-wrap gap-5">
                <div className="flex flex-wrap gap-5 flex-1 min-w-96">
                    <div className="border rounded-lg min-w-60 flex-1 p-5">
                        <div className="inline-flex items-center gap-2 mb-5 border-b w-full pb-3">
                            <Banknote />
                            <h6 className="figtree-semibold">Total Income</h6>
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <PhilippinePeso size={15} />
                            <span className="text-xl ">0.00</span>
                        </div>
                    </div>
                    <div className="border rounded-lg min-w-60 flex-1 p-5">
                        <div className="inline-flex items-center gap-2 mb-5 border-b w-full pb-3">
                            <Banknote />
                            <h6 className="figtree-semibold">Total Income</h6>
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <PhilippinePeso size={15} />
                            <span className="text-xl ">0.00</span>
                        </div>
                    </div>
                    <div className="border rounded-lg min-w-60 flex-1 p-5">
                        <div className="inline-flex items-center gap-2 mb-5 border-b w-full pb-3">
                            <Banknote />
                            <h6 className="figtree-semibold">Total Income</h6>
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <PhilippinePeso size={15} />
                            <span className="text-xl ">0.00</span>
                        </div>
                    </div>
                    <div className="border rounded-lg min-w-60 flex-1 p-5">
                        <div className="inline-flex items-center gap-2 mb-5 border-b w-full pb-3">
                            <Banknote />
                            <h6 className="figtree-semibold">Total Income</h6>
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <PhilippinePeso size={15} />
                            <span className="text-xl ">0.00</span>
                        </div>
                    </div>
                </div>
                <div className="border rounded-lg flex-1 min-w-96 p-5">
                    asdasd
                </div>
                <div className="border rounded-lg flex-1 min-w-96 p-5">
                    asdasda
                </div>
            </div>
        </ShopsLayout>
    );
}
