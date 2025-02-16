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
// this is the comment
export default function ShopCarousel({ shops }) {
    console.log(shops);
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="mb-10"
        >
            <div className="flex items-center justify-between mb-5 ">
                <h4 className="text-lg figtree-medium p-2 border-b border-foreground">
                    You May Also Like
                </h4>
                <div className="inline-flex items-center gap-2">
                    <CarouselPrevious className="static" />
                    <CarouselNext className="static" />
                </div>
            </div>
            <CarouselContent className=" ">
                {shops.map((shop, index) => (
                    <CarouselItem
                        key={index}
                        className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 "
                    >
                        <Link href={`/${shop.id}/shop`}>
                            <div className="">
                                <div className="aspect-video relative">
                                    <img
                                        src={`/${shop.shop_photo}`}
                                        alt=""
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                    <span className="absolute top-2 right-2 bg-white rounded-full py-[0.2rem] px-3 md:py-1 md:px-4 scale-75 text-xs sm:text-sm "></span>
                                </div>
                                <div className="mb-2">
                                    <h5 className="mt-2 figtree-medium text-sm md:font-normal">
                                        {shop.shop_name}
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
                ))}
            </CarouselContent>
        </Carousel>
    );
}
