import { Button, buttonVariants } from "@/Components/ui/button";
import { Head, Link, usePage } from "@inertiajs/react"; // Add usePage import
import {
    Calendar,
    Store,
    Building2,
    LayoutDashboard,
    CreditCard,
    ChartColumnBig,
    Scissors,
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
        { href: "/shop/catalog", label: "Services", icon: Scissors },
        { href: "/shop/manage/staff", label: "Manage Staffs", icon: Store },
        { href: "/shop/analytics", label: "Analytics", icon: ChartColumnBig },
        { href: "/shop/subscriptions", label: "Subscriptions", icon: CreditCard },
    ];
    return (
        <div className="hidden lg:block">
            <div className="w-48 sticky top-20">
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

            </div>
        </div>
    );
};

export default Sidebar;
