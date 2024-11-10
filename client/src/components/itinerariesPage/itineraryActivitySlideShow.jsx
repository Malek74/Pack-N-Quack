"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import Maps from "../shared/Maps";
// Sample card data

ItineraryActivitySlideShow.propTypes = {
  cardData: PropTypes.array.isRequired,
};
export default function ItineraryActivitySlideShow({ cardData }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goUp = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : cardData.length - 1
    );
  };

  const goDown = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < cardData.length - 1 ? prevIndex + 1 : 0
    );
  };

  const currentCard = cardData[currentIndex];

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden rounded-lg">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/2">
            <img
              src={currentCard.image}
              alt={currentCard.name}
              className="w-full h-48 sm:h-full object-cover"
            />
          </div>
          <div className="w-full sm:w-1/2 p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">{currentCard.name}</h2>
              <p className="text-gray-600">{currentCard.description}</p>
              <h2 className="text-2xl font-bold">Location</h2>
              <div className="flex justify-between">
                <p className="text-gray-600">{currentCard.location}</p>
                <Maps mapsSrc={currentCard.googleMapLink} />
              </div>
              <h2 className="text-2xl font-bold">Duration</h2>
              <p className="text-gray-600">
                {`From ${currentCard.duration.startTime} to ${currentCard.duration.endTime}`}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goUp}
                aria-label="Previous card"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goDown}
                aria-label="Next card"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
