import { Button, buttonVariants } from "@/Components/ui/button";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    const user = usePage().props.auth.user;
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        // Retrieve the theme preference from local storage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            setIsDarkTheme(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkTheme) {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setIsDarkTheme(!isDarkTheme);
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />
            <h1 className="text-2xl mb-2">Verify you Account!</h1>
            <div className="mb-4 text-sm text-muted-foreground">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === "verification-link-sent" && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <Button
                        className="figtree-semibold uppercase"
                        disabled={processing}
                    >
                        Resend Verification Email
                    </Button>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className={`text-muted-foreground text-sm  ${buttonVariants(
                            {
                                variant: "link",
                            }
                        )} !p-0`}
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
