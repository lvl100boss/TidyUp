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
import * as Dialog from '@radix-ui/react-dialog';

export default function Popular({ shops }) {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availability, setAvailability] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleAvailabilityChange = () => {
        setAvailability((prev) => !prev);
    };

    const filteredShops = shops.filter((shop) => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(shop.category);
        const matchesAvailability = !availability || shop.isAvailable;
        return matchesCategory && matchesAvailability;
    });

    const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
    const currentShops = filteredShops.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <UserLayout>
            <Head title="Popular" />
            <div>
                <h1 className="text-nowrap text-2xl font-semibold">
                    Most Popular
                </h1>
            </div>
            <div className="flex justify-between items-center">
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <Button size="sm" variant="secondary">
                            <SlidersHorizontal />
                            Filter
                        </Button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        <Dialog.Content 
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-lg w-full max-w-md bg-background border border-secondary"
                        >
                            <Dialog.Title className="text-lg font-semibold mb-4">Filter Shops</Dialog.Title>
                            <Dialog.Description className="mb-4">
                                Select categories and availability to filter the shops.
                            </Dialog.Description>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h3 className="font-medium mb-2">Categories</h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes("barbershop")}
                                                onChange={() => handleCategoryChange("barbershop")}
                                            />
                                            <span>Barbershop</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes("hair salon")}
                                                onChange={() => handleCategoryChange("hair salon")}
                                            />
                                            <span>Hair Salon</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">Availability</h3>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={availability}
                                            onChange={handleAvailabilityChange}
                                        />
                                        <span>Available Now</span>
                                    </label>
                                </div>
                            </div>
                            <Dialog.Close asChild>
                                <Button size="sm" variant="secondary">
                                Apply Filters
                                </Button>
                            </Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
                <Pagination className="justify-end my-2">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink href="#" onClick={() => handlePageChange(index + 1)}>{index + 1}</PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <div className="mb-5 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {currentShops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} isLoading={isLoading} />
                ))}
            </div>
            <Pagination className={`my-2`}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink href="#" onClick={() => handlePageChange(index + 1)}>{index + 1}</PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </UserLayout>
    );
}
