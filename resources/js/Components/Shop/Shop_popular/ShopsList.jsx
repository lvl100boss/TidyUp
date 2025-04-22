import ShopCard from "@/Components/User/ShopCard";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function ShopsList({ shops, isLoading }) {
    if (!shops || shops.length === 0) {
        return (
            <div>
                <ApplicationLogo className="size-48 mx-auto mb-1 opacity-40 dark:invert" />
                <p className="text-center font-bold text-2xl opacity-40">
                    No popular shops available
                </p>
            </div>
        );
    }
    
    return (
        <div className="mb-5 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
            {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} isLoading={isLoading} />
            ))}
        </div>
    );
}