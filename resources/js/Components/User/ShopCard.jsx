import { Link } from "@inertiajs/react";
import { AspectRatio } from "@/Components/ui/aspect-ratio";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";

const ShopCard = ({ shop, isLoading }) => {
    return (
        <Link
            href={`shop/${shop.id}/${shop.branches[0].id}`}
            className={isLoading ? "pointer-events-none" : ""}
        >
            <div className="card">
                <div className="card-body">
                    <div className="relative">
                        <AspectRatio ratio={16 / 9}>
                            {isLoading && (
                                <Skeleton className="h-full w-full rounded-lg absolute top-0 left-0 z-10" />
                            )}
                            <img
                                src={shop.branches[0]?.gallery[0]?.url}
                                alt={shop.shop_name}
                                className={`object-cover rounded-md h-full w-full ${
                                    isLoading ? "invisible" : ""
                                }`}
                            />
                        </AspectRatio>
                        <span className="absolute top-2 right-2 bg-white rounded-full py-1 px-4 scale-75 text-xs sm:text-sm ">
                            {!isLoading && shop.status}
                        </span>
                    </div>

                    {isLoading ? (
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    ) : (
                        <h5 className="mt-2 figtree-medium">
                            {shop.shop_name}
                        </h5>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {isLoading
                        ? Array(2)
                              .fill(0)
                              .map((_, index) => (
                                  <Skeleton
                                      key={index}
                                      className="h-4 w-12 rounded-full"
                                  />
                              ))
                        : shop.branches[0]?.branch_categories.map(
                              (category, index) => (
                                  <Badge
                                      key={index}
                                      variant="secondary"
                                      className={"text-nowrap"}
                                  >
                                      {category.name}
                                  </Badge>
                              )
                          )}
                </div>
            </div>
        </Link>
    );
};

export default ShopCard;
