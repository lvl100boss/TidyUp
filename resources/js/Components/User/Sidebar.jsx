import { Button, buttonVariants } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react"; // Add usePage import
import {
    Calendar,
    TrendingUp,
    Compass,
    Scissors,
    Droplet,
    MessagesSquare,
    MessageCircleQuestion,
    MessageSquareWarning,
    House,
} from "lucide-react";

const Sidebar = () => {
    const { url } = usePage(); // Get current URL from Inertia

    const mainLinks = [
        { href: "/", label: "Home", icon: House },
        { href: "/appointments", label: "Appointments", icon: Calendar },
        { href: "/discover", label: "Discover", icon: Compass },
        { href: "/popular", label: "Popular", icon: TrendingUp },
    ];

    const categoryLinks = [
        { href: "/barbershops", label: "Barbershops", icon: Scissors },
        { href: "/hair-salons", label: "Hair Salons", icon: Droplet },
    ];

    const helpLinks = [
        { href: "/FAQs", label: "FAQ's", icon: MessageCircleQuestion },
        {
            href: "/send-feedback",
            label: "Send Feedback",
            icon: MessagesSquare,
        },
        {
            href: "/report-issue",
            label: "Report An Issue",
            icon: MessageSquareWarning,
        },
    ];

    return (
        <div className="hidden lg:block ">
            <div className="w-48 sticky top-20 ">
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

                <hr className="my-5 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
                <div>
                    <h3 className="font-medium mb-2">CATEGORIES</h3>
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
                    <h3 className="font-medium mb-2">HELP CENTER</h3>
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
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
