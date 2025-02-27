import { Link } from "@inertiajs/react";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"


/**
 * ShopCard Component
 * Displays a card containing shop information with loading states
 *
 * @param {Object} shop - Shop data object containing id, name, gallery, and categories
 * @param {boolean} isLoading - Flag to show loading state
 */
const ShopCard = ({ shop, isLoading }) => {
    return (
        // Wrap card in Link component, disable if loading
        <Link
            href={`/${shop.id}/shop`}
            className={isLoading ? "pointer-events-none" : ""}
        >
            <div className="card">
                <div className="card-body">
                    {/* Image Section */}
                    <div className="relative">
                        <AspectRatio ratio={16 / 9}>
                            {/* Show skeleton loader while loading */}
                            {isLoading && (
                                <Skeleton className="h-full w-full rounded-lg absolute top-0 left-0 z-10" />
                            )}
                            {/* Shop Image */}
                            <img
                                src={shop.shop_gallery[0].url}
                                alt={shop.shop_name}
                                className={` object-cover rounded-md h-full w-full ${isLoading ? "invisible" : ""
                                    }`}
                            />
                        </AspectRatio>
                        {/* Empty badge container */}
                        <Badge
                            className={`absolute top-3 right-3 bg-white`}
                        ></Badge>
                    </div>

                    {/* Shop Name Section */}
                    {isLoading ? (
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild className="cursor-pointer">
                                    <h5 className="mt-2 cursor-default">
                                        {shop.shop_name}
                                    </h5>
                                </TooltipTrigger>
                                <TooltipContent className="w-80 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-16">
                                            <img
                                                src={shop.shop_photo}
                                                alt={shop.shop_name}
                                                className="size-full object-cover rounded-full"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg">
                                                {shop.shop_name}
                                            </p>
                                            <p className="line-clamp-2 ">
                                                {shop.bio}
                                            </p>
                                            {/* put a shop review here later on like the ratings */}
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {isLoading ? (
                        <Skeleton className="h-3 w-3/4 mt-2" />
                    ) : (
                        <h5 className="text-xs text-muted-foreground font-light">
                            {shop.detailed_address}
                        </h5>
                    )}
                </div>

                {/* Categories Section */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {isLoading
                        ? // Show skeleton loaders for categories
                        Array(2)
                            .fill(0)
                            .map((_, index) => (
                                <Skeleton key={index} className="h-4 w-12" />
                            ))
                        : // Display shop categories
                        shop.shop_categories.map((category, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className={"text-nowrap"}
                            >
                                {category.categories.name}
                            </Badge>
                        ))}
                </div>
            </div>
        </Link>
    );
};

export default ShopCard;
