import { Button, buttonVariants } from "@/Components/ui/button";
import { Head, Link, usePage } from "@inertiajs/react"; // Add usePage import
import {
    Calendar,
    Store,
    BookOpen,
    Building2,
    LayoutDashboard,
    // TrendingUp,
    // Compass,
    // Scissors,
    // Droplet,
    // MessagesSquare,
    // MessageCircleQuestion,
    // MessageSquareWarning,
    // House,
} from "lucide-react";

const Sidebar = () => {
    const { url } = usePage(); // Get current URL from Inertia

    const mainLinks = [
        { href: "/shop/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/shop/appointments", label: "Appointments", icon: Calendar },
        { href: "/shop/profile", label: "Shop Profile", icon: Building2 },
        { href: "/shop/catalog", label: "Shop Catalog", icon: BookOpen },
        { href: "/shop/manage/staff", label: "Manage Staffs", icon: Store },
    ];

    // const categoryLinks = [
    //     { href: "/barbershops", label: "Barbershops", icon: Scissors },
    //     { href: "/hair-salons", label: "Hair Salons", icon: Droplet },
    // ];

    // const helpLinks = [
    //     { href: "/FAQs", label: "FAQ's", icon: MessageCircleQuestion },
    //     {
    //         href: "/send-feedback",
    //         label: "Send Feedback",
    //         icon: MessagesSquare,
    //     },
    //     {
    //         href: "/report-issue",
    //         label: "Report An Issue",
    //         icon: MessageSquareWarning,
    //     },
    // ];

    return (
        <div className="hidden lg:block">
            <div className="w-48 sticky top-5">
                {mainLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`w-full ${buttonVariants({
                            variant: url === link.href ? "secondary" : "ghost",
                        })} !justify-start`}
                    >
                        <link.icon />
                        <span>{link.label}</span>
                    </Link>
                ))}

                {/* <hr className="my-5 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
                <div>
                    <h3 className="figtree-medium mb-2">CATEGORIES</h3>
                </div>
                {categoryLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`w-full ${buttonVariants({
                            variant: url === link.href ? "secondary" : "ghost",
                        })} !justify-start`}
                    >
                        <link.icon />
                        <span>{link.label}</span>
                    </Link>
                ))}

                <hr className="my-5 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
                <div>
                    <h3 className="figtree-medium mb-2">HELP CENTER</h3>
                </div>
                {helpLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`w-full ${buttonVariants({
                            variant: url === link.href ? "secondary" : "ghost",
                        })} !justify-start`}
                    >
                        <link.icon />
                        <span>{link.label}</span>
                    </Link>
                ))} */}
            </div>
        </div>
    );
};

export default Sidebar;
