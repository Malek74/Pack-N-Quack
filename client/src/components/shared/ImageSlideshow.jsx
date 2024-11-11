import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import PropTypes from "prop-types";

ImageSlideshow.propTypes = {
  images: PropTypes.array.isRequired,
};

export default function ImageSlideshow({ images }) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  React.useEffect(() => {
    let interval;

    if (!isPaused) {
      interval = setInterval(() => {
        api?.scrollNext();
      }, 7000); // Change slide every 5 seconds (slower)
    }

    return () => clearInterval(interval);
  }, [isPaused, api]);

  const handleImageClick = (src) => {
    setSelectedImage(src);
    setIsPaused(true);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
    setIsPaused(false);
  };

  return (
    <div className="w-full mx-auto px-36">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex items-center justify-center p-0">
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className="object-cover w-full h-[35vh] cursor-pointer"
                    onClick={() => handleImageClick(src)}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-center items-center mt-4">
        <span className="text-sm text-muted-foreground">
          Image {current} of {count}
        </span>
      </div>
      <Dialog open={!!selectedImage} onOpenChange={handleCloseDialog}>
        <DialogContent className="">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged image"
              className="w-full h-full"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
