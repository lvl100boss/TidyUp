import { Button, buttonVariants } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react";
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
    User,
    Palette,
    Lock,
} from "lucide-react";

const Sidebar = () => {
    const { url } = usePage(); // Get current URL from Inertia

    const settingsLinks = [
        { href: "/profile", label: "Profile", icon: User },
        { href: "/theme", label: "Theme", icon: Palette },
        { href: "/profile/password", label: "Password", icon: Lock },
    ];

    return (
        <div className="hidden lg:block">
            <div className="w-48 sticky top-20">

                {settingsLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`w-full ${buttonVariants({
                            variant: url === link.href ? "secondary" : "ghost",
                        })} !justify-start`}
                    >
                        <link.icon className="mr-2 h-4 w-4" />
                        <span>{link.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
