import UserLayout from "@/Layouts/UserLayout";
import ShopCard from "@/Components/User/ShopCard";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/Components/ui/button";
import { SlidersHorizontal } from "lucide-react";


export default function Popular({ shops }) {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = shops.map((shop) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = shop.shop_gallery[0].url;
                    img.onload = resolve;
                    img.onerror = resolve; // Resolve even on error to prevent blocking
                });
            });

            await Promise.all(imagePromises);

            // Add a minimum loading time of 1 second
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        };

        preloadImages();
    }, [shops]);
    return (
        <UserLayout>
            <Head title="Popular" />
            <div>
                <h1 className="text-nowrap text-2xl font-semibold">
                    Most Popular
                </h1>
            </div>
            <div className="flex justify-between items-center">
                <Button size="sm" variant="secondary">
                    <SlidersHorizontal />
                    Filter
                </Button>
                <Pagination className="justify-end my-2">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <div className="mb-5 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
                {shops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} isLoading={isLoading} />
                ))}
            </div>
            <Pagination className={`my-2`}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </UserLayout>
    );
}
