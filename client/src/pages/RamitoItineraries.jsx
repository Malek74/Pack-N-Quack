import SearchBar from "@/components/shared/SearchBar";
import Banner from "../components/shared/Banner";
import BannerImage from "/assets/images/romanBanner.jpg";
//import RamitoItinerariesCard from "@/components/ramitoItineraries/ramitoCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import RamitoItinerariesCard from "@/components/ramitoItineraries/ramitoCard";
import Loading from "@/components/shared/Loading";
import ItineraryFilters from "@/components/itinerariesPage/ItineraryFilters";
import { useNavigate } from "react-router-dom";
//import MultiselectDropdown from "@/components/shared/MultiselectDropdown";

export default function RamitoItineraries() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [fetchedItineraries, setFetchedItineraries] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    //const [selectedTags, setSelectedTags] = useState([]);

    const [fetchedItinerariesParams, setFetchedItinerariesParams] = useState({});

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
                    params: fetchedItinerariesParams,
                });
                setFetchedItineraries(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchItineraries();
    }, [fetchedItinerariesParams]);

    return (
        <div className="flex flex-col w-screen p-14 pb-0">
            <div className="relative">
                <Banner background={BannerImage} name="Ramito Itineraries" />
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
                <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-10 px-14">
                    {fetchedItineraries &&
                        fetchedItineraries.map((itinerary) => (
                            <RamitoItinerariesCard
                                key={itinerary._id}
                                id={itinerary._id}
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
            )}
            <Button onClick={() => console.log(fetchedItineraries[0])}>
                Print Itineraries
            </Button>

            <Button onClick={() => navigate("/createItinerary")}>
                Create Itineraries
            </Button>
        </div>
    );
}