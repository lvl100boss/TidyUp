import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ManageBranch({ shop }) {
    const [branchIndex, setBranchIndex] = useState(0);

    if (!shop?.branches?.length) {
        return (
            <ShopsLayout>
                <Head title="Manage Branch" />
                <div className="p-4">
                    <h1 className="text-2xl font-semibold">Manage Branch</h1>
                    <p>No branches available.</p>
                </div>
            </ShopsLayout>
        );
    }

    return (
        <ShopsLayout>
            <Head title="Manage Branch" />
            <div className="p-4 space-y-4">
                <h1 className="text-4xl figtree-semibold">Manage Branch</h1>
                <div className="flex gap-5">
                    <div className="border rounded-md p-5 min-w-[30rem]">
                        <h1 className="mb-5 text-2xl figtree-semibold">
                            Current Branch
                        </h1>
                        <div className="mb-5">
                            <Select
                                value={branchIndex.toString()}
                                onValueChange={(value) =>
                                    setBranchIndex(parseInt(value))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {shop.branches[branchIndex].branch_name}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {shop.branches.map((branch, index) => (
                                        <SelectItem
                                            key={branch.id}
                                            value={index.toString()}
                                        >
                                            {branch.branch_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="">
                            <Button className="w-full figtree-semibold">
                                Create New Branch
                            </Button>
                        </div>
                    </div>

                    <div className=" p-4 rounded-lg border flex-1">
                        <h2 className="text-lg font-medium mb-2">
                            Selected Branch
                        </h2>
                        <p>Name: {shop.branches[branchIndex].branch_name}</p>
                        <p>ID: {shop.branches[branchIndex].id}</p>
                    </div>
                </div>
            </div>
        </ShopsLayout>
    );
}
