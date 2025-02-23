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

export default function Home({ shops }) {
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
    console.log(shops);
    const sm = useMediaQuery({ minWidth: 640 });
    const md = useMediaQuery({ minWidth: 768 });
    const lg = useMediaQuery({ minWidth: 1024 });
    const xl = useMediaQuery({ minWidth: 1280 });
    const xxl = useMediaQuery({ minWidth: 1536 });

    let ratio;
    if (xxl) {
        ratio = 16 / 4.5;
        console.log("xxl");
    } else if (xl) {
        ratio = 16 / 6.3;
        console.log("xl");
    } else if (lg) {
        ratio = 16 / 7.3;
        console.log("lg");
    } else if (md) {
        ratio = 16 / 9;
        console.log("md");
    } else if (sm) {
        ratio = 16 / 8;
        console.log("sm");
    } else {
        ratio = 16 / 11;
        console.log("default");
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
            <div className="relative flex items-center justify-center text-white dark:text-black overflow-hidden sm:rounded-lg mb-5 -mx-5 sm:mx-0 ">
                <AspectRatio ratio={ratio}>
                    <div>
                        <video
                            className="invert w-full h-full object-cover "
                            src="/assets/videos/bg-gradient.mp4"
                            autoPlay
                            muted
                            loop
                        ></video>
                    </div>
                </AspectRatio>
                <div className="flex items-center justify-center min-h-[90%]  px-6 absolute">
                    <div className="text-center max-w-2xl">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-2xl md:text-6xl font-extrabold text-foreground dark:text-background"
                        >
                            Transformation in a <br />
                            <span className="text-green-200 dark:text-green-300">
                                Click of a Button
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-sm md:text-xl mt-4 text-foreground dark:text-background"
                        >
                            A comprehensive booking platform for beauty-related
                            services, offering users ease and comfort.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="mt-6"
                        >
                            <Link
                                href="/discover"
                                className={`${buttonVariants({
                                    variant: "outline",
                                })} text-foreground px-6 py-3 text-lg`}
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className="flex items-end justify-between mb-5">
                <h4 className="text-lg figtree-medium p-2 border-b border-foreground">
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
                {shops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} isLoading={isLoading} />
                ))}
            </div>
            <div className="flex items-center justify-between mb-5">
                <h4 className="text-lg figtree-medium p-2 border-b border-foreground">
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
