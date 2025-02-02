import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { Input, PInput } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import ApplicationLogo from "@/Components/ApplicationLogo";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center  pt-6 sm:justify-center sm:pt-0  px-5">
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div>
                <Link href="/">
                    <ApplicationLogo className="size-28 md:size-32 dark:invert" />
                </Link>
            </div>

            <div className="mt-4 space-y-4">
                <h4 className="text-center text-4xl figtree-medium">Sign in</h4>
                <p className="text-sm text-muted-foreground">
                    Enter your Email and Password to login
                </p>
            </div>

            <form
                onSubmit={submit}
                className="w-full max-w-screen-sm md:max-w-96 md:px-6 md:py-4 rounded-lg"
            >
                <div>
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={data.email}
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>

                    <PInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={data.password}
                        autoComplete="current-password"
                        className=""
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) =>
                                setData("remember", checked)
                            }
                        />

                        <span className="">Remember me</span>
                    </Label>
                    {canResetPassword && (
                        <Link
                            className="underline text-sm"
                            href={route("password.request")}
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <div className="mt-4 w-full">
                    <Button className=" w-full" disabled={processing}>
                        Sign In
                    </Button>
                </div>
                <div className="mt-8 flex items-center justify-center text-sm gap-1">
                    <span className="">Don't have an Account? </span>
                    <Link
                        href={route("register")}
                        className="figtree-medium hover:figtree-semibold underline"
                    >
                        Sign Up
                    </Link>
                </div>
            </form>
        </div>
    );
}
