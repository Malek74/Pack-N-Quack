import { useState, useEffect } from "react";
import HistoricalCard from "@/components/historicalPage/HistoricalCard";
import Historicalbackground from "/assets/images/Italy.jpg";
import Banner from "@/components/shared/BannerV2";
import SearchBar from "@/components/shared/SearchBar";
import EditTag from "@/components/historicalPage/SelectTag";
import axios from "axios";

import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import { Input } from "@/components/ui/input";
import Loading from "@/components/shared/Loading";

import GuideButton from "@/components/guideComponents/popMessage";

export default function Historical() {
  const [filteredTags, setFilteredTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [places, setPlaces] = useState([]);
  const handleTagsChange = (updatedTags) => {
    setFilteredTags(updatedTags);
    console.log("Updated Tags:", updatedTags);
  };
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.post("/api/places/filterSort", {
          name: searchTerm,
          tags: filteredTags,
        });
        setPlaces(response.data);
        console.log(response.data);
        console.log(filteredTags);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaces();
  }, [searchTerm, filteredTags]);
  return (

    <div className="flex flex-col justify-center w-screen px-14 my-8">
      <div className="relative mb-6">

        {/* Banner Section */}
        <Banner
          background={Historicalbackground}
          alt="Historical Background"
          name="HISTORICAL PLACES & MUSEUMS"
        />

        {/* Search Bar Section - Positioned on top of the banner */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Look for a place.."}
        />
      </div>
      <div className="flex mb-10">
        <span className="ml-24">
          <EditTag initialTags={[]} onTagsChange={handleTagsChange}></EditTag>
        </span>
      </div>

      <div className="grid grid-cols-3 justify-evenly w-screen self-center gap-y-10 px-10">
        {places.map((place) => (
          <HistoricalCard
            key={place._id}
            img={place.coverImagePath}
            pictures={place.pictures}
            name={place.name}
            description={place.description}
            openingHours={place.opening_hour}
            location={place.location}
            prices={place.tickets}
            tags={place.tags}
            notTourist={false}
            placeID={place._id}
            googlemaps={place.googleMapLink}
          />
        ))}

      </div>
      <GuideButton guideMessage={"Select a historical place and embark on your adventure!"} />

    </div>
  );
}
