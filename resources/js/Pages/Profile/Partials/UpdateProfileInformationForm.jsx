import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { User } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            email: user.email,
            contact_number: user.contact_number,
            profile_photo_path: null,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            _method: "PATCH",
        });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("first_name", data.first_name);
        formData.append("middle_name", data.middle_name);
        formData.append("last_name", data.last_name);
        formData.append("email", data.email);
        formData.append("contact_number", data.contact_number);

        if (data.profile_photo_path) {
            formData.append("profile_photo_path", data.profile_photo_path);
        }

        post(route("profile.update"), {
            preserveScroll: true,
            preserveState: true,
            data: formData,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium ">Profile Information</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="mt-6 space-y-6"
                encType="multipart/form-data"
            >
                <div>
                    <Label htmlFor="profile_photo_path">Profile Picture</Label>
                    <Input
                        id="profile_photo_path"
                        type="file"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setData(
                                    "profile_photo_path",
                                    e.target.files[0]
                                );
                            }
                        }}
                        className="pt-2 mb-5"
                    />
                    <InputError
                        className="mt-2"
                        message={errors.profile_photo_path}
                    />
                    {user.profile_photo_path && !data.profile_photo_path && (
                        <div className="flex items-center gap-5 mb-3">
                            <img
                                src={`/storage/${user.profile_photo_path}`}
                                alt="Current Profile Picture"
                                className="mt-2 size-32 mb-3 rounded-full object-cover"
                            />
                            <img
                                src={`/storage/${user.profile_photo_path}`}
                                alt="Current Profile Picture"
                                className="mt-2 size-20 mb-3 rounded-full object-cover"
                            />
                            <img
                                src={`/storage/${user.profile_photo_path}`}
                                alt="Current Profile Picture"
                                className="mt-2 size-14 mb-3 rounded-full object-cover"
                            />
                        </div>
                    )}
                    {data.profile_photo_path && (
                        <div className="flex items-center gap-5 mb-3">
                            <img
                                src={URL.createObjectURL(
                                    data.profile_photo_path
                                )}
                                alt="New Profile Picture"
                                className="mt-2 size-32 mb-3 rounded-full object-cover"
                            />
                            <img
                                src={URL.createObjectURL(
                                    data.profile_photo_path
                                )}
                                alt="New Profile Picture"
                                className="mt-2 size-20 mb-3 rounded-full object-cover"
                            />
                            <img
                                src={URL.createObjectURL(
                                    data.profile_photo_path
                                )}
                                alt="New Profile Picture"
                                className="mt-2 size-14 mb-3 rounded-full object-cover"
                            />
                        </div>
                    )}
                    {!user.profile_photo_path && !data.profile_photo_path && (
                        <div className="flex items-center gap-5 mb-3">
                            <div className="mt-2 size-32  rounded-full bg-muted-foreground/10 border grid place-items-center">
                                <User
                                    size={70}
                                    className="stroke-muted-foreground stroke-1"
                                />
                            </div>
                            <div className="mt-2 size-20 rounded-full bg-muted-foreground/10 border grid place-items-center">
                                <User
                                    size={50}
                                    className="stroke-muted-foreground stroke-1"
                                />
                            </div>
                            <div className="mt-2 size-14 rounded-full bg-muted-foreground/10 border grid place-items-center">
                                <User
                                    size={30}
                                    className="stroke-muted-foreground stroke-1"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <Label htmlFor="first_name">First Name</Label>

                    <Input
                        id="first_name"
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", e.target.value)}
                        isFocused
                        autoComplete="first_name"
                    />

                    <InputError className="mt-2" message={errors.first_name} />
                </div>
                <div>
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <Input
                        id="middle_name"
                        type="text"
                        value={data.middle_name}
                        onChange={(e) => setData("middle_name", e.target.value)}
                        autoComplete="middle_name"
                    />
                    <InputError className="mt-2" message={errors.middle_name} />
                </div>
                <div>
                    <Label htmlFor="last_name">Last Name</Label>

                    <Input
                        id="last_name"
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData("last_name", e.target.value)}
                        isFocused
                        autoComplete="last_name"
                    />

                    <InputError className="mt-2" message={errors.last_name} />
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <Label htmlFor="contact_number">Contact Number</Label>

                    <Input
                        id="contact_number"
                        value={data.contact_number}
                        onChange={(e) =>
                            setData("contact_number", e.target.value)
                        }
                        autoComplete="contact_number"
                    />

                    <InputError
                        className="mt-2"
                        message={errors.contact_number}
                    />
                </div>

                <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>

                    <Input
                        id="date_of_birth"
                        type="date"
                        value={data.date_of_birth}
                        onChange={(e) =>
                            setData("date_of_birth", e.target.value)
                        }
                        autoComplete="bday"
                    />

                    <InputError
                        className="mt-2"
                        message={errors.date_of_birth}
                    />
                </div>

                <div>
                    <Label>Gender</Label>
                    <Select
                        value={data.gender}
                        onValueChange={(value) => setData("gender", value)}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>

                    <InputError className="mt-2" message={errors.gender} />
                </div>



                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button
                        className="uppercase figtree-semibold"
                        disabled={processing}
                    >
                        Save
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm ">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
