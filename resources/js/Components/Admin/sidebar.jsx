import React from "react";
import { Link } from "@inertiajs/react";
import {
    Home,
    Users,
    Store,
    UsersRound,
    Calendar,
    Tag,
    Receipt,
    MessageCircleMore,
    MailOpen,
    TriangleAlert,
    IdCard,
    CreditCard,
} from "lucide-react";

export default function Sidebar() {
    const navItems = [
        { label: "Dashboard", href: "/admin/dashboard", icon: Home },
        { label: "Shops", href: "/admin/shops", icon: Store },
        { label: "Users", href: "/admin/users", icon: UsersRound },
        // { label: "Appointments", href: "/admin/appointments", icon: Calendar },
        { label: "Sales Report", href: "/admin/content", icon: Tag },
        // { label: "Invoice", href: "/admin/settings", icon: Receipt },
        { label: "Analytics", href: "/admin/analytics", icon: Users },
        { label: "User Feedback", href: "/admin/feedback", icon: MailOpen },
        {
            label: "Restriction",
            href: "/admin/restriction",
            icon: TriangleAlert,
        },
        {
            label: "Platform Staff",
            href: "/admin/platform-staff",
            icon: IdCard,
        },
    ];

    return (
        <div className="min-h-screen w-52 bg-transparent">
            <div className="">
                <nav className="space-y-1 text-sm font-medium">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = window.location.pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center px-4 py-2 rounded-md group transition-colors ${isActive
                                    ? "bg-secondary"
                                    : "hover:bg-secondary"
                                    }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
