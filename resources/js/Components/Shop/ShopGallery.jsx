import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Image } from "lucide-react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ShopGallery({ shop }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Debug log to check the shop data
  console.log('Shop Gallery Data:', shop?.shop_gallery);

  if (!shop?.shop_gallery || shop.shop_gallery.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Image className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-muted-foreground">No gallery images available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? shop.shop_gallery.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(shop.shop_gallery[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex === shop.shop_gallery.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(shop.shop_gallery[newIndex]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex justify-between items-center">
            Gallery
            <span className="text-sm text-muted-foreground font-normal">
              {shop.shop_gallery.length} photos
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px]">
            <div className="grid grid-cols-3 gap-3">
              {shop.shop_gallery.map((gallery, index) => (
                <div
                  key={gallery.id}
                  className="relative group aspect-square overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => {
                    console.log('Clicked image:', gallery);
                    setSelectedImage(gallery);
                    setCurrentIndex(index);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedImage(gallery);
                      setCurrentIndex(index);
                    }
                  }}
                >
                  <img
                    src={`/${gallery.url}`}
                    alt={`Gallery ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90">
          <div className="relative h-[80vh] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white/20 z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            {shop.shop_gallery.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <img
              src={`/${selectedImage?.url}`}
              alt="Gallery preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
