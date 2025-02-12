import { Button } from "@/components/ui/button";
import InputError from "@/components/InputError";
import Modal from "@/components/Modal";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        // Validate password before submission
        if (!data.password.trim()) {
            setData("password", "");
            return;
        }

        // Encode the password properly before sending
        const formData = new FormData();
        formData.append("password", data.password);

        destroy(route("profile.destroy"), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: (errors) => {
                console.error("Deletion failed:", errors);
                passwordInput.current?.focus();
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        // Sanitize the input value if needed
        const sanitizedValue = value.trim();
        setData("password", sanitizedValue);
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium">Delete Account</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <Button
                variant="destructive"
                className="uppercase font-semibold dark:bg-red-700"
                onClick={confirmUserDeletion}
            >
                Delete Account
            </Button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div className="mt-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="button"
                            className="uppercase font-semibold"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="destructive"
                            className="ms-3 uppercase font-semibold dark:bg-red-700"
                            disabled={processing || !data.password.trim()}
                        >
                            Delete Account
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
