import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import ApplicationLogo from "@/components/ApplicationLogo";
export default function Footer() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();


        post(route('newsletter.subscribe'), {
            preserveScroll: true,
            preserveState: true,
            data: {
                email: data.email,
            },
            onSuccess: () => {
                reset();
                toast.success('You have been subscribed to the newsletter');
            },
            onError: () => {
                toast.error('Failed to subscribe to the newsletter');
            },
        });
    };

    return (
        <footer className={cn("w-[100%] bg-background/50 backdrop-blur-3xl text-foreground py-8")}>

            <div className={cn("container mx-auto px-6 md:px-3")}>
                {/* Main Content */}
                <div
                    className={cn(
                        "flex flex-col gap-8 sm:flex-row sm:justify-between"
                    )}
                >
                    {/* Brand Section */}
                    <div>
                        <div>
                            <div className="flex items-center gap-3">
                                <ApplicationLogo className="size-10 dark:invert" />
                                <h2 className={cn("text-xl font-semibold")}>
                                    TidyUp
                                </h2>
                            </div>
                            <p
                                className={cn(
                                    "text-sm text-muted-foreground mt-2"
                                )}
                            >
                                Find the nearest barbershops and hair salons,
                                browse services, and book with confidence.
                            </p>
                        </div>
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
                                    <Link
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Find Shops
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Book Appointments
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Browse Services
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        User Reviews
                                    </Link>
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
                                    <Link
                                        href={'/shop/setup'}
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        List Your Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={'/shop/appointments'}
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Manage Bookings
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={'/shop/dashboard'}
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Shop Dashboard
                                    </Link>
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
                                    <Link
                                        href={'/about-us'}
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className={cn(
                                            "text-sm text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className={cn("text-lg font-semibold")}>
                                Newsletter
                            </h3>
                            <form className={cn("mt-2 flex flex-col gap-2")} onSubmit={handleSubmit}>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Subscribing...' : 'Subscribe'}
                                </Button>
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
