import { Link } from "@inertiajs/react";
import PropTypes from "prop-types";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { MapPin, Star } from "lucide-react";

// Skeleton component for loading state
const ShopCardSkeleton = () => (
    <div className="card rounded-lg bg-background">
        <div className="card-body">
            <div className="relative">
                <AspectRatio ratio={13 / 16}>
                    <Skeleton className="h-full w-full rounded-lg absolute top-0 left-0 z-10" />
                </AspectRatio>
            </div>
            <Skeleton className="h-5 w-3/4 mt-3" />
            <Skeleton className="h-4 w-3/4 mt-2" />
            <div className="flex items-center gap-2 mt-2 flex-wrap">
                {Array(2)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} className="h-4 w-16" />
                    ))}
            </div>
        </div>
    </div>
);

// Content component for actual shop data
const ShopCardContent = ({ shop }) => {
    const shopImage = shop?.shop_gallery?.[0]?.url || "/placeholder-shop.jpg";

    return (
        <div className="card rounded-md bg-background overflow-hidden transition-all duration-300 hover:shadow-md group">
            <div className="card-body p-0">
                <div className="relative">
                    <Badge className="absolute top-2 right-2 z-20 bg-white shadow-lg"></Badge>
                    <AspectRatio ratio={12 / 16}>
                        <img
                            src={shopImage}
                            alt={`${shop.shop_name} shop front`}
                            className="object-cover h-full w-full transition-opacity duration-200 opacity-100"
                            onError={(e) => {
                                e.target.src = "/placeholder-shop.jpg";
                            }}
                            onLoad={(e) => {
                                e.target.style.opacity = 1;
                            }}
                            loading="lazy"
                        />
                    </AspectRatio>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                    {/* Shop information positioned inside the photo */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h3 className="font-medium text-base line-clamp-1 ">
                                        {shop.shop_name}
                                    </h3>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="w-80 p-3 bg-background text-foreground">
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
                                            <p className="font-semibold text-lg">{shop.shop_name}</p>
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {shop.bio || "No shop description available."}
                                            </p>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-white/80" />
                            <p className="text-xs text-white/80 font-light truncate">
                                {shop.detailed_address || "Address not available"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {shop.shop_categories?.map((category, index) => (
                                <Badge key={index} variant="outline" className="text-nowrap text-xs bg-white/20 text-white border-none">
                                    {category.categories.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main ShopCard component
const ShopCard = ({ shop, isLoading }) => {
    return (
        <Link
            href={isLoading ? "#" : `/shop/${shop.id}`}
            className={`block overflow-hidden ${isLoading ? "pointer-events-none" : ""}`}
            aria-label={isLoading ? "Loading shop information" : `Visit ${shop.shop_name} shop page`}
        >
            {isLoading ? <ShopCardSkeleton /> : <ShopCardContent shop={shop} />}
        </Link>
    );
};

export default ShopCard;
