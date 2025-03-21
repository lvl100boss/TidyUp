import * as React from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import ShopCard from "@/components/User/ShopCard";
import { Badge } from "../ui/badge";
import { Link } from "@inertiajs/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// this is the comment
export default function ShopCarousel({ shops }) {
    // Inside your component, before rendering any shops
    const filteredShops = shops.filter(shop =>
        shop && shop.status === 'verified'
    );

    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="mb-10"
        >
            <div className="flex items-center justify-between mb-5 ">
                <h4 className="text-lg font-medium p-2 border-b border-foreground">
                    You May Also Like
                </h4>
                <div className="inline-flex items-center gap-2">
                    <CarouselPrevious className="static" />
                    <CarouselNext className="static" />
                </div>
            </div>
            <CarouselContent className="max-w-[94vw]">
                {filteredShops.map((shop, index) => (
                    <CarouselItem
                        key={index}
                        className="basis-[100%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                        {/* Update the link to the correct route format */}
                        <Link href={`/shop/${shop.id}`}>
                            <div className="">
                                <div className="aspect-video relative">
                                    <img
                                        src={`/${shop.shop_gallery[0].url}`}
                                        alt=""
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                    <span className="absolute top-2 right-2 bg-white rounded-full py-[0.2rem] px-3 md:py-1 md:px-4 scale-75 text-xs sm:text-sm "></span>
                                </div>
                                <div className="mb-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild className="cursor-pointer">
                                                <h5 className="mt-2 mb-1 text-sm ">
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
                                    <h5 className="text-xs text-muted-foreground font-light">
                                        {shop.detailed_address}
                                    </h5>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    {shop.shop_categories.map(
                                        (category, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className={"text-nowrap"}
                                            >
                                                {category.categories.name}
                                            </Badge>
                                        )
                                    )}
                                </div>
                            </div>
                        </Link>
                    </CarouselItem>
                ))
                }
            </CarouselContent >
        </Carousel >
    );
}
