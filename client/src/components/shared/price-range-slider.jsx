"use client";

import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export default function PriceRangeSlider({
  className,
  min = 0,
  max = 1000,
  step = 10,
  formatPrice = (price) => `${price?.toFixed(2) ?? "0.00"}`,
  onChange,
  ...props
}) {
  const [priceRange, setPriceRange] = useState([min, max]);

  useEffect(() => {
    setPriceRange([min, max]);
  }, [min, max]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Slider.Root
        className="relative flex w-full touch-none select-none items-center"
        value={priceRange}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
        onValueChange={handlePriceChange}
        {...props}
      >
        <Slider.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-secondary">
          <Slider.Range className="absolute h-full bg-primary" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-3 w-3 rounded-full border border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Minimum price"
        />
        <Slider.Thumb
          className="block h-3 w-3 rounded-full border border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Maximum price"
        />
      </Slider.Root>
      <div className="flex justify-between gap-4 items-center">
        <div>
          <p className="text-sm font-medium">{formatPrice(priceRange[0])}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{formatPrice(priceRange[1])}</p>
        </div>
      </div>
    </div>
  );
}
