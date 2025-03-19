import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/Components/ui/button";
import {
    ArrowUpRight,
    Building2,
    Handshake,
    Store,
    CalendarFold,
    Calendar,
    Clock,
    Star,
} from "lucide-react";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { useMediaQuery } from "react-responsive";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import ShopCard from "@/Components/User/ShopCard";
import { useEffect, useState } from "react";
import HeroSection from "@/Components/User/Home/HeroSection";

export default function Home({ randomShops, canLogin, canRegister }) {
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Add debugging to see what we're receiving
        console.log('Random shops data:', randomShops);
        
        const preloadImages = async () => {
            // Only try to preload images if we have shop data with gallery images
            if (!randomShops || !randomShops.length) {
                setIsLoading(false);
                return;
            }
            
            const imagePromises = randomShops
                .filter(shop => shop && shop.shop_gallery && shop.shop_gallery.length > 0)
                .map((shop) => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.src = shop.shop_gallery[0].url;
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                });

            await Promise.all(imagePromises);
            setTimeout(() => setIsLoading(false), 1000);
        };

        preloadImages();
    }, [randomShops]);

    const sm = useMediaQuery({ minWidth: 640 });
    const md = useMediaQuery({ minWidth: 768 });
    const lg = useMediaQuery({ minWidth: 1024 });
    const xl = useMediaQuery({ minWidth: 1280 });
    const xxl = useMediaQuery({ minWidth: 1536 });

    let ratio;
    if (xxl) {
        ratio = 16 / 4.5;
    } else if (xl) {
        ratio = 16 / 6.3;
    } else if (lg) {
        ratio = 16 / 7.3;
    } else if (md) {
        ratio = 16 / 9;
    } else if (sm) {
        ratio = 16 / 8;
    } else {
        ratio = 16 / 11;
    }

    // Define the card data
    const cardData = [
        {
            icon: Building2,
            title: "Service Selection",
            description:
                "A huge selection of services categorized to make it easier for users to find what suits their needs.",
        },
        {
            icon: Handshake,
            title: "Appointment Management Made Easy",
            description:
                "A built-in feature to manage your appointments on the go.",
        },
        {
            icon: Store,
            title: "Shop Personalization",
            description:
                "From shop services to galleries, how you customize and set up your shop is all up to you!",
        },
        {
            icon: CalendarFold,
            title: "Tracking Made Easy",
            description: "Automated notifications for upcoming appointments.",
        },
    ];

    return (
        <UserLayout>
            <Head title="Home" />

            <HeroSection />
            {/* {sampleShops[0].shop_gallery[0].url} */}
            <div className="flex items-end justify-between mb-5">
                <h4 className="text-lg font-medium p-2 border-b border-foreground">
                    Customer's Choice
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
                {randomShops && randomShops.length > 0 ? (
                    randomShops.map((shop) => (
                        <ShopCard key={shop.id} shop={shop} isLoading={isLoading} />
                    ))
                ) : (
                    <div className="md:basis-full">
                        <div className="flex items-center justify-center h-40 border rounded-md bg-muted/10">
                            <p className="text-muted-foreground">No shops available</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between mb-5">
                <h4 className="text-lg font-medium p-2 border-b border-foreground">
                    How It Works
                </h4>
            </div>
            <div className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {cardData.map((card, index) => (
                        <Card key={index} className="hover:shadow-md transition-all ease-in-out">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold inline-flex gap-2 items-center">
                                    <card.icon size={20} />
                                    <span>{card.title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    {card.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}
