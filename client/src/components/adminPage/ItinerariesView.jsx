import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../shared/Loading";
import ItinerariesCard from "../ItinerariesPage/ItinerariesCard";
export default function ItinerariesView() {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedItineraries, setFetchedItineraries] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/itinerary/admin");
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
      <div className="min-h-screen w-full grid grid-cols-3 gap-4 mt-6">
        {fetchedItineraries.map((itinerary) => (
          <ItinerariesCard
            key={itinerary._id}
            id={itinerary._id}
            isFlagged={itinerary.flagged}
            {...itinerary}
            small
            adminClicked
          />
        ))}
      </div>
    ))
  );
}
