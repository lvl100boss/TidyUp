import UserLayout from "@/Layouts/UserLayout";
import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { LoopingShopCards } from "@/Components/User/DiscoverPage/LoopingShopCards";
import ShopCarousel from "@/Components/User/ShopCarousel";
import ShopCarousel2 from "@/Components/User/ShopCarousel2";

import { ArrowUpRight } from "lucide-react";
import ShopCard from "@/Components/User/ShopCard";


export default function Discover({ shops, barberShops, salons }) {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = shops.map((shop) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = shop.shop_gallery[0].url;
                    img.onload = resolve;
                    img.onerror = resolve; // Resolve even on error to prevent blocking
                });
            });

            await Promise.all(imagePromises);

            // Add a minimum loading time of 1 second
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        };

        preloadImages();
    }, [shops]);
    return (
        <UserLayout>
            <Head title="Discover" />
            <div className="space-y-4 min-h-screen">
                {/* Header */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Discover Services</h1>
                    <p className="text-muted-foreground text-xs">
                        Find and book the best services in your area
                    </p>
                </div>
                <div>
                    <LoopingShopCards shops={shops} />
                </div>
                <div>
                    <ShopCarousel shops={shops} />
                </div>
                <div>
                    <div className="flex items-end justify-between mb-5">
                        <h4 className="text-lg font-medium p-2 border-b border-foreground">
                            Most Popular
                        </h4>
                        <Link
                            href="/popular"
                            className="p-2 border-b border-foreground inline-flex items-center gap-1"
                        >
                            <ArrowUpRight className="stroke-1 size-5" />
                            <span>See More</span>
                        </Link>
                    </div>
                    <div className="mb-5 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                        {shops.map((shop) => (
                            <ShopCard key={shop.id} shop={shop} isLoading={isLoading} />
                        ))}
                    </div>
                </div>
                <div>
                    <div className="w-full py-20 mt-20 rounded-md bg-muted/50">
                        <h1 className="text-center text-xl sm:text-3xl font-light tracking-widest underline underline-offset-8 animate-bounce">
                            EXPLORE BY CATEGORIES
                        </h1>
                    </div>
                </div>
                <div>
                    <ShopCarousel2
                        title="Barbershops"
                        link="/barbershops"
                        shops={barberShops}
                    />
                </div>
                <div>
                    <ShopCarousel2
                        title="Hair Salons"
                        link="/hair-salons"
                        shops={salons}
                    />
                </div>
            </div >
        </UserLayout >
    );
}
