import Banner from "../components/shared/Banner";
import BannerImage from "/assets/images/romanBanner.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
import ItinerariesCard from "@/components/ItinerariesPage/ItinerariesCard";
import Loading from "@/components/shared/Loading";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export default function ItinerariesTourGuidePage() {
  const [isLoading, setIsLoading] = useState(true);

  const [fetchedItineraries, setFetchedItineraries] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const { prefCurrency } = useUser();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setIsLoading(true);
        console.log(id);
        const response = await axios.get(`/api/itinerary/myItineraries/${id}`, {
          params: { currency: prefCurrency },
        });
        setFetchedItineraries(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItineraries();
  }, [id, prefCurrency]);

  return (
    <div className="flex flex-col w-screen p-14 pb-0">
      <div className="relative">
        <Banner background={BannerImage} name="My Itineraries" />
      </div>
      <div className="flex mb-36 justify-center items-center">
        <Button onClick={() => navigate("/createItinerary")}>
          Create Itineraries
        </Button>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center">
          <Loading size="xl" />
        </div>
      )}
      {!isLoading && (
        <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-10 px-14 mb-36">
          {fetchedItineraries &&
            fetchedItineraries.map((itinerary) => (
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
                isFlagged={itinerary.flagged}
                isActive={itinerary.isActive}
                tourGuideClicked
              />
            ))}
        </div>
      )}
    </div>
  );
}
