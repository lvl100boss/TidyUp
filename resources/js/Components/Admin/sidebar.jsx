import React from 'react';
import { Link } from '@inertiajs/react';
import { Home, Users,Store, UsersRound, Calendar, Tag, Receipt, MessageCircleMore, MailOpen, TriangleAlert, IdCard} from 'lucide-react';

export default function Sidebar() {
    const navItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
        { label: 'Shops', href: '/admin/users', icon: Store },
        { label: 'Customers', href: '/admin/orders', icon: UsersRound },
        { label: 'Appointments', href: '/admin/reports', icon: Calendar },
        { label: 'Sales Report', href: '/admin/content', icon: Tag },
        { label: 'Invoice', href: '/admin/settings', icon: Receipt },
        { label: 'Analytics', href: '/admin/users', icon: Users },
        { label: 'Customer Service', href: '/admin/orders', icon: MessageCircleMore },
        { label: 'User Feedback', href: '/admin/reports', icon: MailOpen },
        { label: 'Restriction', href: '/admin/content', icon: TriangleAlert },
        { label: 'Platform Staff', href: '/admin/settings', icon: IdCard },
    ];

    return (
        <div className="min-h-screen w-52 bg-transparent">
            <div className="">
                <nav className="space-y-1 text-sm font-medium">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-md group transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Icon className="w-5 h-5 mr-3 text-gray-900 group-hover:text-gray-700 dark:text-gray-400 group-hover:dark:text-gray-300" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
