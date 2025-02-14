import { Link } from "@inertiajs/react";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";

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
                                src={shop.shop_photo}
                                alt={shop.shop_name}
                                className={`object-cover rounded-md h-full w-full ${
                                    isLoading ? "invisible" : ""
                                }`}
                            />
                        </AspectRatio>
                        {/* Empty badge container */}
                        <Badge className={`absolute top-3 right-3`}></Badge>
                    </div>

                    {/* Shop Name Section */}
                    {isLoading ? (
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    ) : (
                        <h5 className="mt-2 figtree-medium">
                            {shop.shop_name}
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
                                  <Skeleton
                                      key={index}
                                      className="h-4 w-12 rounded-full"
                                  />
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
