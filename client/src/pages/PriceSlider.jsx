"use client";

import React, { useState } from "react";
import PriceRangeSlider from "@/components/price-range-slider";
export default function PriceSlider({
  min,
  max,
  priceRange,
  handlePriceChange,
}) {
  return (
    <div className="max-w-md mx-auto">
      <PriceRangeSlider
        min={min}
        max={max}
        step={10}
        onChange={handlePriceChange}
        value={priceRange}
      />
    </div>
  );
}
