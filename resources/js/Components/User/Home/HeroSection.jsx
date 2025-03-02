import { motion } from "framer-motion";
import { buttonVariants } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { Calendar, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection() {
    // Add state for the animated background
    const [mounted, setMounted] = useState(false);

    // Ensure the animation runs only after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        // Hero Section with animated radial gradient
        <div className={`relative p-8 rounded-lg mb-8 shadow-sm overflow-hidden ${mounted ? 'animate-radial-gradient' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}
            style={{
                backgroundSize: '300% 300%',
                backgroundImage: 'radial-gradient(circle at center,  #ede9fe 0%, #e0f2fe 20%,  #fafafa 60%, #ede9fe 75%, #e0f2fe 100%)', // blue-50, indigo-50, neutral-50, purple-50
                backgroundPosition: 'center',
            }}>

            <style jsx global>{`
                @keyframes radial-gradient {
                    0% {
                        background-position: 0% 0%;
                    }
                    25% {
                        background-position: 75% 25%;
                    }
                    50% {
                        background-position: 100% 100%;
                    }
                    75% {
                        background-position: 25% 75%;
                    }
                    100% {
                        background-position: 0% 0%;
                    }
                }
                .animate-radial-gradient {
                    animation: radial-gradient 12s ease infinite;
                }
            `}</style>

            <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
                <div className="md:w-1/2 mb-6 md:mb-0">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
                    >
                        Transformation in a <br />
                        <span>Click of a Button</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg text-gray-600 mb-6"
                    >
                        A comprehensive booking platform for beauty-related
                        services, offering users ease and comfort.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-wrap gap-3"
                    >
                        <Link
                            href="/discover"
                            className={buttonVariants({
                                variant: "default",
                            })}
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/popular"
                            className={buttonVariants({
                                variant: "outline",
                            })}
                        >
                            Popular Services
                        </Link>
                    </motion.div>

                    <div className="mt-8 flex items-center gap-x-8 gap-y-2 flex-wrap">
                        {[
                            { icon: Calendar, text: "Easy Booking" },
                            { icon: Clock, text: "Flexible Hours" },
                            { icon: Star, text: "Quality Services" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <div className="bg-white p-2 rounded-full">
                                    <item.icon className="h-4 w-4 stroke-black" />
                                </div>
                                <span className="text-sm text-black font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/2 md:pl-8">
                    <img
                        src="https://illustrations.popsy.co/amber/studying.svg"
                        alt="Beauty Services Illustration"
                        className="w-full max-w-md mx-auto"
                    />
                </div>
            </div>
        </div>
    );
}