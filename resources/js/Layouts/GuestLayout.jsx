import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center  pt-6 sm:justify-center sm:pt-0 ">
            <div>
                <Link href="/">
                    <ApplicationLogo className="size-36 dark:invert" />
                </Link>
            </div>
            <div>
                <h4 className="text-center text-4xl">Welcome back!</h4>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    We're glad to have you back here.
                </p>
            </div>
            <div className="mt-6 w-full overflow-hidden  px-6 py-4 sm:max-w-md sm:rounded-lg border ">
                {children}
            </div>
        </div>
    );
}
