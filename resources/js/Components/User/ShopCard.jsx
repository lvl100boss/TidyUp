import { Link } from "@inertiajs/react";
import PropTypes from "prop-types";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { MapPin, Star } from "lucide-react";

/**
 * ShopCard Component
 * Displays a card containing shop information with loading states
 *
 * @param {Object} shop - Shop data object containing id, name, gallery, and categories
 * @param {boolean} isLoading - Flag to show loading state
 */
const ShopCard = ({ shop, isLoading }) => {
    // Safely access the first image or use a fallback
    const shopImage = shop?.shop_gallery?.[0]?.url || "/placeholder-shop.jpg";

    return (
        <Link
            href={`/shop/${shop.id}`}
            className={`
                block  overflow-hidden
                ${isLoading ? "pointer-events-none" : ""}
            `}
            aria-label={isLoading ? "Loading shop information" : `Visit ${shop.shop_name} shop page`}
        >
            <div className="card rounded-lg bg-background">
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
                                src={shopImage}
                                alt={`${shop.shop_name} shop front`}
                                className={`object-cover rounded-md h-full w-full transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"
                                    }`}
                                onError={(e) => {
                                    e.target.src = "/placeholder-shop.jpg";
                                }}
                            />
                        </AspectRatio>

                        {/* Rating Badge */}
                        {!isLoading && shop.rating && (
                            <Badge className="absolute top-3 right-3 bg-white/90 text-black flex items-center gap-1 shadow-sm">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {shop.rating}
                            </Badge>
                        )}
                    </div>

                    {/* Shop Name Section */}
                    {isLoading ? (
                        <Skeleton className="h-5 w-3/4 mt-3" />
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h3 className="mt-3 font-medium text-base line-clamp-1 hover:text-primary transition-colors">
                                        {shop.shop_name}
                                    </h3>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="w-80 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 flex-shrink-0">
                                            <img
                                                src={shop.shop_photo || shopImage}
                                                alt={`${shop.shop_name} logo`}
                                                className="size-full object-cover rounded-full border"
                                                onError={(e) => {
                                                    e.target.src = "/placeholder-shop-logo.jpg";
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg">
                                                {shop.shop_name}
                                            </p>
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {shop.bio || "No shop description available."}
                                            </p>
                                            {shop.rating && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm">{shop.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {isLoading ? (
                        <Skeleton className="h-4 w-3/4 mt-2" />
                    ) : (
                        <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground font-light truncate">
                                {shop.detailed_address || "Address not available"}
                            </p>
                        </div>
                    )}
                    {/* Categories Section */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {isLoading
                            ? Array(2)
                                .fill(0)
                                .map((_, index) => (
                                    <Skeleton key={index} className="h-4 w-16" />
                                ))
                            : shop.shop_categories?.map((category, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-nowrap text-xs"
                                >
                                    {category.categories.name}
                                </Badge>
                            ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};


export default ShopCard;
