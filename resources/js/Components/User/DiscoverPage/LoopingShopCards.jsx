import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Link } from "@inertiajs/react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/Components/ui/badge";

export function LoopingShopCards({ shops }) {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className=""
        >
            <CarouselContent className="">
                {shops.map((shop, index) => (
                    <CarouselItem key={index} className="group">
                        <Link href={`/${shop.id}/shop`}>
                            <Card className="relative overflow-hidden rounded-lg">
                                <div>
                                    <img
                                        src={shop.shop_gallery[0].url}
                                        alt=""
                                        className="w-full h-[32rem] object-cover"
                                    />
                                </div>
                                <div class="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black to-transparent p-5 pt-7 z-20 text-white">
                                    <div>
                                        <h2 className="text-sm font-light group-hover:underline">{shop.detailed_address}</h2>
                                        <h2 className="text-3xl font-medium group-hover:underline">{shop.shop_name}</h2>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 p-3 space-x-2">
                                    {shop.shop_categories.map((category, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className={"text-nowrap shadow-md"}
                                        >
                                            {category.categories.name}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
