import React from "react";
import ItineraryCard from "../itinerariesPage/ItineraryCard";

export default function BookItinerary({ itinerariesDB }) {
  const cancelBooking = (id) => {
    console.log(`Itinerary booking with id: ${id} has been cancelled.`);
    // Add logic here to handle itinerary cancellation
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Booked Itineraries</h1>
      <div className="grid grid-cols-3 gap-y-10">
        {itinerariesDB.map((itinerary, index) => (
          <ItineraryCard
            key={itinerary._id}
            id={itinerary._id}
            direction={index % 2 === 0 ? "flex-row" : "flex-row-reverse"}
            title={itinerary.name}
            description={itinerary.description}
            price={itinerary.price}
            language={itinerary.language}
            accessibility={itinerary.accessibility}
            pickUpLocation={itinerary.pickUpLocation}
            dropOffLocation={itinerary.dropOffLocation}
            days={itinerary.days}
            availableDates={itinerary.available_dates}
            tags={itinerary.tags}
            rating={itinerary.ratings.averageRating}
            deleteitineraryFunction={() => cancelBooking(itinerary._id)}
          />
        ))}
      </div>
    </div>
  );
}
