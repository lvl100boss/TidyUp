import UserLayout from "@/Layouts/UserLayout";
import ShopCard from "@/Components/User/ShopCard";
import { Head, usePage, Link } from "@inertiajs/react";
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
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Popular({ shops }) {
    const { pagination } = usePage().props;
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Debug log to see if shops data is received
        console.log("Shops data received:", shops?.length || 0);
        
        const preloadImages = async () => {
            if (!shops || shops.length === 0) {
                setIsLoading(false);
                return;
            }
            
            const imagePromises = shops.map((shop) => {
                return new Promise((resolve) => {
                    // Safe access in case shop_gallery is missing
                    if (!shop.shop_gallery || !shop.shop_gallery[0]) {
                        console.warn(`Shop ${shop.id} has no gallery images`);
                        return resolve();
                    }
                    
                    const img = new Image();
                    img.src = shop.shop_gallery[0].url;
                    img.onload = resolve;
                    img.onerror = () => {
                        console.warn(`Failed to load image for shop ${shop.id}`);
                        resolve(); // Resolve even on error to prevent blocking
                    };
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
    
    // Generate page numbers to display
    const generatePaginationItems = () => {
        if (!pagination) return null;
        
        const items = [];
        const { currentPage, lastPage } = pagination;
        
        // Add previous page button
        items.push(
            <PaginationItem key="prev">
                <Link
                    href={currentPage > 1 ? `/popular?page=${currentPage - 1}` : '#'}
                    preserveScroll
                    preserveState
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                >
                    <PaginationPrevious />
                </Link>
            </PaginationItem>
        );
        
        // First page
        items.push(
            <PaginationItem key={1}>
                <Link
                    href="/popular?page=1"
                    preserveScroll
                    preserveState
                >
                    <PaginationLink isActive={currentPage === 1}>1</PaginationLink>
                </Link>
            </PaginationItem>
        );
        
        // Ellipsis if needed
        if (currentPage > 3) {
            items.push(
                <PaginationItem key="ellipsis1">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }
        
        // Pages around current page
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(lastPage - 1, currentPage + 1); i++) {
            items.push(
                <PaginationItem key={i}>
                    <Link
                        href={`/popular?page=${i}`}
                        preserveScroll
                        preserveState
                    >
                        <PaginationLink isActive={currentPage === i}>{i}</PaginationLink>
                    </Link>
                </PaginationItem>
            );
        }
        
        // Ellipsis if needed
        if (currentPage < lastPage - 2) {
            items.push(
                <PaginationItem key="ellipsis2">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }
        
        // Last page (if not already included)
        if (lastPage > 1) {
            items.push(
                <PaginationItem key={lastPage}>
                    <Link
                        href={`/popular?page=${lastPage}`}
                        preserveScroll
                        preserveState
                    >
                        <PaginationLink isActive={currentPage === lastPage}>{lastPage}</PaginationLink>
                    </Link>
                </PaginationItem>
            );
        }
        
        // Add next page button
        items.push(
            <PaginationItem key="next">
                <Link
                    href={currentPage < lastPage ? `/popular?page=${currentPage + 1}` : '#'}
                    preserveScroll
                    preserveState
                    className={currentPage >= lastPage ? 'pointer-events-none opacity-50' : ''}
                >
                    <PaginationNext />
                </Link>
            </PaginationItem>
        );
        
        return items;
    };
    
    return (
        <UserLayout>
            <Head title="Popular" />
            <div>
                <h1 className="text-nowrap text-2xl">
                    Most Popular
                </h1>
            </div>
            <div className="flex justify-between items-center">
                <Button size="sm" variant="secondary">
                    <SlidersHorizontal />
                    Filter
                </Button>
                
                {pagination && (
                    <Pagination className="justify-end my-2">
                        <PaginationContent>
                            {generatePaginationItems()}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>

            {!shops || shops.length === 0 ? (
                <div>
                    <ApplicationLogo className="size-48 mx-auto mb-1 opacity-40 dark:invert" />
                    <p className="text-center font-bold text-2xl opacity-40">
                        No popular shops available
                    </p>
                </div>
            ) : (
                <div className="mb-5 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
                    {shops.map((shop) => (
                        <ShopCard key={shop.id} shop={shop} isLoading={isLoading} />
                    ))}
                </div>
            )}
            
            {pagination && (
                <Pagination className="my-2">
                    <PaginationContent>
                        {generatePaginationItems()}
                    </PaginationContent>
                </Pagination>
            )}
        </UserLayout>
    );
}