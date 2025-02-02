import { cn } from "@/lib/utils"; // ShadCN utility for class merging
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Input } from "@/components/ui/input"; // ShadCN Input component

export default function Footer() {
    return (
        <footer className={cn("w-full bg-background text-foreground py-8")}>
            <div className={cn("container mx-auto")}>
                {/* Main Content */}
                <div
                    className={cn(
                        "flex flex-col gap-8 sm:flex-row sm:justify-between"
                    )}
                >
                    {/* Brand Section */}
                    <div>
                        <h2 className={cn("text-xl font-semibold")}>TidyUp</h2>
                        <p className={cn("text-sm text-muted-foreground mt-2")}>
                            Find the nearest barbershops and hair salons, browse
                            services, and book with confidence.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div
                        className={cn("grid grid-cols-2 gap-8 sm:grid-cols-4")}
                    >
                        {/* For Users */}
                        <div>
                            <h3 className={cn("text-lg font-semibold")}>
                                For Users
                            </h3>
                            <ul className={cn("space-y-2 mt-2")}>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Find Shops
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Book Appointments
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Browse Services
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        User Reviews
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* For Shops */}
                        <div>
                            <h3 className={cn("text-lg font-semibold")}>
                                For Shops
                            </h3>
                            <ul className={cn("space-y-2 mt-2")}>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        List Your Shop
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Manage Bookings
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Advertise
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Shop Dashboard
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className={cn("text-lg font-semibold")}>
                                Company
                            </h3>
                            <ul className={cn("space-y-2 mt-2")}>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className={cn("text-lg font-semibold")}>
                                Newsletter
                            </h3>
                            <form className={cn("mt-2 flex flex-col gap-2")}>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                />
                                <Button type="submit">Subscribe</Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div
                    className={cn(
                        "mt-8 pt-8 border-t text-sm text-muted-foreground text-center"
                    )}
                >
                    <p>
                        &copy; {new Date().getFullYear()} TidyUp. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
