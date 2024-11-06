import SearchBar from "@/components/shared/SearchBar";
import Banner from "../components/shared/Banner";
import BannerImage from "/assets/images/romanBanner.jpg";
//import RamitoItinerariesCard from "@/components/ramitoItineraries/ramitoCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import RamitoItinerariesCard from "@/components/ramitoItineraries/ramitoCard";

export default function RamitoItineraries() {
  const [fetchedItineraries, setFetchedItineraries] = useState([]);
  // const [fetchedItinerariesParams, setFetchedItinerariesParams] = useState({});

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("/api/itinerary");
        console.log(response.data);
        setFetchedItineraries(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItineraries();
  }, []);
  return (
    <div className="flex flex-col w-screen p-14 pb-0">
      <div className="relative">
        <Banner background={BannerImage} name="Ramito Itineraries" />
        <SearchBar />
      </div>

      <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-10 px-14">
        {fetchedItineraries &&
          fetchedItineraries.map((itinerary) => (
            <RamitoItinerariesCard
              key={itinerary._id}
              image={itinerary.image}
              name={itinerary.name}
              description={itinerary.description}
              tags={itinerary.tags}
              price={itinerary.price}
              rating={itinerary.ratings.averageRating}
              numberOfReviews={itinerary.ratings.reviews.length}
            />
          ))}
      </div>
      <Button onClick={() => console.log(fetchedItineraries[0])}>
        Print Itineraries
      </Button>
    </div>
  );
}
