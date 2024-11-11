import SearchBar from "@/components/shared/SearchBar";
import Banner from "@/components/shared/BannerV2";
import BannerImage from "/assets/images/romanBanner.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
import ItinerariesCard from "@/components/ItinerariesPage/ItinerariesCard";
import Loading from "@/components/shared/Loading";
import ItineraryFilters from "@/components/ItinerariesPage/ItineraryFilters";
import { useUser } from "@/context/UserContext";
export default function ItinerariesTouristsPage() {
  const [isLoading, setIsLoading] = useState(true);

  const [fetchedItineraries, setFetchedItineraries] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedItinerariesParams, setFetchedItinerariesParams] = useState({});
  const { prefCurrency } = useUser();

  useEffect(() => {
    setFetchedItinerariesParams({
      name: searchTerm,
    });
  }, [searchTerm]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/itinerary", {
          params: { ...fetchedItinerariesParams, currency: prefCurrency },
        });
        setFetchedItineraries(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItineraries();
  }, [fetchedItinerariesParams, prefCurrency]);

  return (
    <div className="flex flex-col w-screen p-14">
      <div className="relative mb-10">
        <Banner background={BannerImage} name="Itineraries" />
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Look for an itinerary..."}
        />
      </div>

      <ItineraryFilters
        setFetchedItinerariesParams={setFetchedItinerariesParams}
      />

      {isLoading && (
        <div className="flex justify-center items-center">
          <Loading size="xl" />
        </div>
      )}
      {!isLoading && (
        <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-10 px-14 mb-36">
          {fetchedItineraries?.map((itinerary) => (
            <ItinerariesCard
              key={itinerary._id}
              id={itinerary._id}
              image={itinerary.image}
              name={itinerary.name}
              description={itinerary.description}
              tags={itinerary.tags}
              price={itinerary.price}
              rating={itinerary.ratings.averageRating}
              numberOfReviews={itinerary.ratings.reviews.length}
              coverImage={itinerary.coverImage || null}
              touristClicked
            />
          ))}
        </div>
      )}

      {/* <Button onClick={() => navigate("/createItinerary")}>
        Create Itineraries
      </Button> */}
    </div>
  );
}
