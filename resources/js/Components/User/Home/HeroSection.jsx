import { motion } from "framer-motion";
import { buttonVariants } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { Calendar, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Removed two-column animation variants

    return (
        // Kept padding adjustments
        <div className="relative w-full py-20 sm:py-28 flex items-center justify-center">
            {/* Adjusted max-width, added text-center */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Removed grid layout */}
                <motion.div
                    // Main content animation
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    // Added text-center, adjusted spacing
                    className="space-y-8"
                >
                    {/* Kept heading size, but added class to span for emphasis */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                        Your Next Look
                        {/* Removed text-primary from span as gradient is applied to parent */}
                        <span className="block mt-2 lg:text-7xl">Is Just a Click Away</span>
                    </h1>

                    {/* Kept paragraph centered */}
                    <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto">
                        Discover and book appointments with top barbershops and salons in your area. Quick, easy, and stylish.
                    </p>

                    {/* Centered buttons */}
                    <div className="flex flex-wrap gap-4 justify-center pt-4">
                        <Link
                            href="/discover"
                            className={buttonVariants({
                                variant: "default",
                                size: "lg",
                                // Added hover effect
                                className: "px-8 transition-transform duration-200 ease-in-out hover:scale-105"
                            })}
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/popular"
                            className={buttonVariants({
                                variant: "outline",
                                size: "lg",
                                className: "px-8"
                            })}
                        >
                            Popular Services
                        </Link>
                    </div>
                </motion.div>

                {/* Features Section - Centered Row below */}
                {/* Using simple icon + text like original, but with animation */}
                <div className="flex flex-wrap justify-center sm:grid sm:grid-cols-3 gap-x-10 gap-y-8 pt-16 max-w-4xl mx-auto">
                    {[
                        { icon: Calendar, text: "Easy Booking" },
                        { icon: Clock, text: "Flexible Hours" },
                        { icon: Star, text: "Quality Services" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            // Use mounted state for client-side animation
                            animate={mounted ? { opacity: 1, y: 0 } : {}}
                            // Delay based on index, starting after main content animation
                            transition={{ delay: mounted ? 0.8 + (i * 0.1) : 0, duration: 0.5 }}
                            // Reverted to simpler flex layout for each item
                            className="flex items-center justify-center space-x-3"
                        >
                            {/* Increased icon size and padding */}
                            <div className="p-3 rounded-full bg-primary/10">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            {/* Increased text size */}
                            <span className="text-base font-medium text-foreground/90">{item.text}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}