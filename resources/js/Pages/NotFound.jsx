import React from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Home, Search, Store } from "lucide-react";

export default function NotFound() {
    return (
        <UserLayout>
            <Head title="Shop Not Found" />
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-red-50 p-10 rounded-lg border border-red-100 max-w-md mx-auto">
                    <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
                    <h2 className="text-2xl font-semibold mb-6">Shop Not Available</h2>
                    <p className="text-muted-foreground mb-8">
                        This shop is either not found, hasn't been verified yet, or has been rejected.
                        Only verified shops are visible to customers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/discover">
                                <Search className="mr-2 h-4 w-4" />
                                Discover Shops
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
