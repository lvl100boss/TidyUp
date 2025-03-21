import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";

const PlatformDeleteStaffModal = ({ staff, trigger }) => {
    const { data, setData, delete: destroy, processing, errors } = useForm({
        staffId: staff.id,
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update the path to match the new route
        destroy(route('admin.platform-staff.destroy', staff.id), {
            errorBag: "deleteStaff",
            preserveScroll: true,
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger className="w-full" asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the staff's account
                        and remove their data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label htmlFor="password" className="block text-sm figtree-medium">
                            Confirm your password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className="mt-1"
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit" disabled={processing}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default PlatformDeleteStaffModal;
