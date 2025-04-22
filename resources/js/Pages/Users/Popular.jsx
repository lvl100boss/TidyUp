import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PaginationControls from "@/Components/Shop/Shop_popular/PaginationControls";
import ShopsList from "@/Components/Shop/Shop_popular/ShopsList";
import FilterButton from "@/Components/Shop/Shop_popular/FilterButton";
import FilterDialog from "@/Components/Shop/Shop_popular/FilterDialog";
import PageHeader from "@/Components/Shop/Shop_popular/PageHeader";

export default function Popular({ shops, categories, provinces, cities, barangays, services }) {
    const { pagination } = usePage().props;
    const [isLoading, setIsLoading] = useState(true);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    
    // Initialize activeFilters with empty values
    const [activeFilters, setActiveFilters] = useState({
        category_id: "",
        province: "",
        city: "",
        barangay: "",
        services: []
    });
    
    // Reset filters when component mounts to ensure synchronization with URL state
    useEffect(() => {
        // Clear any existing filters by redirecting to the base route without parameters
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.split('?')[0];
        
        if (currentUrl !== baseUrl) {
            // Only redirect if there are query parameters
            window.location.href = baseUrl;
        }
    }, []);
    
    // Check if any filters are active
    const hasActiveFilters = () => {
        return (
            activeFilters.category_id !== "" ||
            activeFilters.province !== "" ||
            activeFilters.city !== "" ||
            activeFilters.barangay !== "" ||
            activeFilters.services.length > 0
        );
    };
    
    useEffect(() => {
        // Data validation
        if (!shops || !Array.isArray(shops)) {
            setIsLoading(false);
            return;
        }
        
        const preloadImages = async () => {
            if (shops.length === 0) {
                setIsLoading(false);
                return;
            }
            
            const imagePromises = shops.map((shop) => {
                return new Promise((resolve) => {
                    if (!shop.shop_gallery || !shop.shop_gallery[0]) {
                        console.warn(`Shop ${shop.id} has no gallery images`);
                        return resolve();
                    }
                    
                    const img = new Image();
                    img.src = shop.shop_gallery[0].url;
                    img.onload = resolve;
                    img.onerror = () => {
                        console.warn(`Failed to load image for shop ${shop.id}`);
                        resolve();
                    };
                });
            });

            try {
                await Promise.all(imagePromises);
            } catch (error) {
                console.error("Error preloading images:", error);
            } finally {
                // Add a minimum loading time for UI smoothness
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        };

        preloadImages();
    }, [shops]);
    
    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        setFilterDialogOpen(false);
        
        // Prepare query parameters for filtering
        const params = {};
        
        if (filters.category_id) params.category_id = filters.category_id;
        if (filters.province) params.province = filters.province;
        if (filters.city) params.city = filters.city;
        if (filters.barangay) params.barangay = filters.barangay;
        
        // Handle array filters
        if (filters.services && filters.services.length > 0) {
            params.services = filters.services.join(',');
        }
        
        // Server-side filtering
        router.get(route('Popular'), params, {
            preserveState: true,
            replace: true,
        });
    };
    
    // Function to clear all filters
    const handleClearFilters = () => {
        setActiveFilters({
            category_id: "",
            province: "",
            city: "",
            barangay: "",
            services: []
        });
        
        // Navigate to base route without parameters
        router.get(route('Popular'), {}, {
            preserveState: false,
            replace: true,
        });
    };
    
    return (
        <UserLayout>
            <Head title="Popular" />
            <PageHeader title="Most Popular" />
            
            <div className="flex justify-between items-center">
                <FilterButton 
                    onClick={() => setFilterDialogOpen(true)} 
                    hasActiveFilters={hasActiveFilters()}
                />
                
                <FilterDialog 
                    open={filterDialogOpen}
                    onOpenChange={setFilterDialogOpen}
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                    categories={categories || []}
                    provinces={provinces || []}
                    cities={cities || []}
                    barangays={barangays || []}
                    services={services || []}
                />
                
                {pagination && (
                    <PaginationControls 
                        pagination={pagination} 
                        className="justify-end my-2"
                    />
                )}
            </div>

            <ShopsList shops={shops} isLoading={isLoading} />
            
            {pagination && (
                <PaginationControls pagination={pagination} />
            )}
        </UserLayout>
    );
}