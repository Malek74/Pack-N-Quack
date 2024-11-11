import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/shared/Loading";
import BookedItineraryCard from "@/components/ItinerariesPage/BookedItineraryCard";
export default function ItineraryBookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedItineraries, setFetchedItineraries] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "/api/tourist/myBookings/6725442e98359339d8b821f0",
          {
            eventType: "itinerary",
          }
        );
        setFetchedItineraries(response.data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    fetchItineraries();
  }, []);

  return (
    (isLoading && (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Loading size="xl" />
      </div>
    )) ||
    (!isLoading && fetchedItineraries && (
      <div className="min-h-screen w-full grid grid-cols-2 gap-4 mt-6">
        {fetchedItineraries.map((itinerary) => (
          <BookedItineraryCard
            key={itinerary.itineraryID._id}
            id={itinerary.itineraryID._id}
            image={itinerary.itineraryID.image}
            name={itinerary.itineraryID.name}
            description={itinerary.itineraryID.description}
            tags={itinerary.itineraryID.tags}
            price={itinerary.itineraryID.price}
            rating={itinerary.itineraryID.ratings.averageRating}
            numberOfReviews={itinerary.itineraryID.ratings.reviews.length}
            coverImage={itinerary.itineraryID.coverImage || null}
            eventDate={itinerary.date}
            bookingDate={itinerary.createdAt}
            numOfTickets={itinerary.numOfTickets}
            bookingId={itinerary._id}
          />
        ))}
      </div>
    ))
  );
}
