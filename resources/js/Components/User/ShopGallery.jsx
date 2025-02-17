import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/ui/carousel";
import { AspectRatio } from "@/Components/ui/aspect-ratio";

export default function ShopGallery({ shop }) {
    return (
        <div className="-mx-5 sm:mx-0">
            <Carousel>
                <div className="relative">
                    <CarouselContent>
                        {shop?.shop_gallery.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="bg-muted  aspect-video  sm:rounded-md overflow-hidden">
                                    <img
                                        src={`/${image.url}`}
                                        alt={`${shop.shop_name} Photo ${
                                            index + 1
                                        }`}
                                        className="w-full h-full object-cover object-center"
                                        loading="lazy"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-3 sm:left-5" />
                    <CarouselNext className="absolute right-3 sm:right-5" />
                </div>
            </Carousel>
        </div>
    );
}
