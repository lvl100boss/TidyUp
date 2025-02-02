import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

export default function ReportAnIssue() {
    return (
        <UserLayout>
            <Head title="Report An Issue" />
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Report An Issue</CardTitle>
                            <CardDescription>
                                Report any issues you encounter
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        type="text"
                                        id="title"
                                        placeholder="Enter the title of the issue"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Enter a detailed description of the issue"
                                    />
                                </div>
                                <div>
                                    <Button type="submit">Submit</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
}
