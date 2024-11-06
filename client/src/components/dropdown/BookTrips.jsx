import React from "react";
import ActivityCard from "@/components/activityPage/ActivityCard";
import ItineraryCard from "@/components/itineraryPage/ItineraryCard"; 

export default function TripsPage({ activities, itinerariesDB }) {
  const cancelBooking = (id, type) => {
    if (type === "activity") {
      // Logic to cancel activity booking by id
      console.log(`Activity booking with id: ${id} has been cancelled.`);
    } else if (type === "itinerary") {
      // Logic to cancel itinerary booking by id
      console.log(`Itinerary booking with id: ${id} has been cancelled.`);
    }
    // Call your API or logic to cancel the booking
  };

  // Function to determine whether it's an activity or itinerary and render accordingly
  const renderCard = (item, index, type) => {
    if (type === "activity") {
      return (
        <ActivityCard
          key={item._id}
          img={item.coverImagePath}
          name={item.name}
          category={item.categoryID.name}
          time={item.date}
          location={item.location}
          googlemaps={item.googleMapLink}
          priceType={item.priceType}
          minPrice={item.minPrice}
          maxPrice={item.maxPrice}
          price={item.price}
          tags={item.tags}
          notTourist={true}
          booking={item.isBookingOpen}
          discounts={item.specialDiscounts}
          rating={item.ratings.averageRating}
          activityID={item._id}
          deleteActivityFunction={() => cancelBooking(item._id, "activity")} // Pass cancel function
        />
      );
    } else if (type === "itinerary") {
      return (
        <ItineraryCard
          key={item._id}
          id={item._id}
          direction={index % 2 === 0 ? "flex-row" : "flex-row-reverse"}
          title={item.name}
          description={item.description}
          price={item.price}
          language={item.language}
          accessibility={item.accessibility}
          pickUpLocation={item.pickUpLocation}
          dropOffLocation={item.dropOffLocation}
          days={item.days}
          availableDates={item.available_dates}
          tags={item.tags}
          rating={item.ratings.averageRating}
          deleteitineraryFunction={() => cancelBooking(item._id, "itinerary")} // Pass cancel function
        />
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>

      {/* Render activities */}
      <div className="grid grid-cols-3 gap-y-10">
        {activities.map((activity, index) => renderCard(activity, index, "activity"))}
      </div>

      {/* Render itineraries */}
      <div className="grid grid-cols-3 gap-y-10 mt-10">
        {itinerariesDB.map((itinerary, index) => renderCard(itinerary, index, "itinerary"))}
      </div>
    </div>
  );
}
