    /* eslint-disable */
import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "../ui/card";
import { Image } from "@/types/images";

type Props = {
  carouselData: Image[];
};

const CarouselDashboard = (props: Props) => {
  const filteredImages = props.carouselData.filter((image) => image.isActive).sort((a, b) => a.order - b.order);
  return (
    <Card className="shadow-lg border-green-100 overflow-hidden">
      <CardContent className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {filteredImages.length === 0 && (
              <CarouselItem>
                <div className="flex items-center justify-center h-64 md:h-80 lg:h-96">
                  <p className="text-lg text-muted-foreground">
                    No Images Found
                  </p>
                </div>
              </CarouselItem>
            )}

            {filteredImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-64 md:h-80 lg:h-96">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/80 hover:bg-white border-green-200 text-green-700" />
          <CarouselNext className="right-4 bg-white/80 hover:bg-white border-green-200 text-green-700" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default CarouselDashboard;
