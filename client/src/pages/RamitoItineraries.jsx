import SearchBar from "@/components/shared/SearchBar";
import Banner from "../components/shared/Banner";
import BannerImage from "/assets/images/romanBanner.jpg";
//import RamitoItinerariesCard from "@/components/ramitoItineraries/ramitoCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import RamitoItinerariesCard from "@/components/ramitoItineraries/ramitoCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/components/shared/Loading";

export default function RamitoItineraries() {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedItineraries, setFetchedItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("");
  const [fetchedItineraryTags, setFetchedItineraryTags] = useState([]);
  const [fetchedItinerariesParams, setFetchedItinerariesParams] = useState({
    name: "",
    language: "",
  });

  useEffect(() => {
    setFetchedItinerariesParams({ name: searchTerm, language: language });
  }, [language, searchTerm]);

  useEffect(() => {
    const fetchItineraryTags = async () => {
      try {
        const response = await axios.get("/api/itineraryTags");
        setFetchedItineraryTags(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItineraryTags();
  }, []);

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

      <div className="flex w-screen self-center justify-center gap-10 p-10 pt-0">
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={language}
          onValueChange={(value) => setLanguage(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

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
    </div>
  );
}
