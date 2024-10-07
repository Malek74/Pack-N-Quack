import { useState, useEffect } from "react"
import HistoricalCard from "@/components/HistoricalCard"
import Historicalbackground from "../images/Italy.jpg"
import pyramids from "../images/Pyramids.jpeg"
import egyptianmuseum from "../images/egyptianmuseum.jpg"
import Banner from "@/components/Banner"
import SearchBar from "@/components/SearchBar"
import EditTag from "@/components/SelectTag"
import axios from "axios"



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
                const response = await axios.post("/api/places/filterSort",
                    { name: searchTerm, tags: filteredTags }
                );
                setPlaces(response.data);
                console.log(response.data);
                console.log(filteredTags);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPlaces()

    }, [searchTerm, filteredTags]);
    return (

        <div className="flex flex-col w-screen p-14 ">
            {/* <Banner
                background={Historicalbackground}
                alt="Historical Background"
                name="HISTORICAL PLACES & MUSEUMS"
            /> */}
            <div className="relative mb-10">
                {/* Banner Section */}
                <Banner
                    background={Historicalbackground}
                    alt="Historical Background"
                    name="HISTORICAL PLACES & MUSEUMS"
                />

                {/* Search Bar Section - Positioned on top of the banner */}
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Look for a place.."} />
            </div>
            <div className="flex mb-10">
                <span className="ml-24"><EditTag initialTags={[]} onTagsChange={handleTagsChange}></EditTag></span>
            </div>

            <grid className="grid grid-cols-2 justify-stretch w-screen self-center gap-y-10" >
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
                    />))}

            </grid>
        </div>

    )
}