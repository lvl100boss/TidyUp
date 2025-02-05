import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/ui/carousel";
import { AspectRatio } from "@/Components/ui/aspect-ratio";

export default function ShopGallery({ branch }) {
    return (
        <div className="">
            <Carousel>
                <div className="relative">
                    <CarouselContent>
                        {branch.gallery.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="bg-muted  max-h-[30rem] rounded-md overflow-hidden">
                                    <img
                                        src={`${image.url}`}
                                        alt={`${branch.branch_name} Photo ${
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
