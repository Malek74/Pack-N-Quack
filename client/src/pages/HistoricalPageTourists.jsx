import React, { useState } from "react"
import HistoricalCard from "@/components/HistoricalCard"
import Historicalbackground from "../images/Italy.jpg"
import pyramids from "../images/Pyramids.jpeg"
import egyptianmuseum from "../images/egyptianmuseum.jpg"
import tourEiffel from "../images/TourEiffel.jpeg"
import Banner from "@/components/Banner"
import CreatePlace from "@/components/CreatePlace"
import { Button } from "@/components/ui/button"
import FilterButton from "@/components/FilterButtons"
import SearchComponent from "@/components/SearchComponent"
import SearchBar from "@/components/SearchBar"


const buttons = [
    {
        type: 'Tags', // This will create a "Sort By" dropdown
        options: [
            { label: "Museums", value: "Museums" },
            { label: "Palaces", value: "Palaces" },
            { label: "Budget-friendly", value: "Budget-friendly" },
            { label: "Family-friendly", value: "Family-friendly" },
        ],
    }]




export default function Historical() {
    const [searchTerm, setSearchTerm] = useState("");

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
                <span className="ml-24">  <FilterButton buttons={buttons} /></span>
                {/* <span className="ml-auto mr-24"><SearchComponent></SearchComponent></span> */}
            </div>
            {/* <h1 className="text-5xl text-[#71BCD6] stroke-2 stroke-black font-bold mb-24 self-center"></h1> */}

            <grid className="grid grid-cols-2 justify-stretch w-screen self-center gap-y-10" >
                <HistoricalCard
                    img={pyramids}
                    alt="Pyramids"
                    name="Giza Pyramids and Great Sphinx"
                    description="The oldest of the Seven Wonders of the Ancient World"
                    hours="7:00 am - 6:00 pm every day"
                    location="Giza, Egypt"
                    Eprice="Adult: EGP 60, Student: EGP 30"
                    Fprice="Adult: €10 , Student: €5"
                    tags="#budget_friendly #family_friendly #historic_area"
                    notTourist={false}

                />
                <HistoricalCard
                    img={egyptianmuseum}
                    alt="Egyptian Museum"
                    name="Egyptian Museum"
                    description="One of the largest museums in the world, and the first national museum in the Middle East"
                    hours="9:00 am – 5:00 pm every day"
                    location="Downtown Cairo, Egypt"
                    Eprice="Adult: EGP 30, Student: EGP 10"
                    Fprice="Adult: €8.5 , Student: €4"
                    tags="#museum #ancientEgyptian #historic_area"
                    notTourist={false}

                />
                {/* 
                <HistoricalCard
                    img={tourEiffel}
                    alt="Eiffel Tower"
                    name="Eiffel Tower"
                    description="a wrought-iron lattice tower on the Champ de Mars in Paris, France"
                    hours="9:15 am - 10:45 every day"
                    location="Paris, France"
                    Eprice="Adult: EGP 30, Student: EGP 10"
                    Fprice="Adult: €8.5 , Student: €4"
                    tags="#museum #ancientEgyptian #historic_area"
                    notTourist={false}

                /> */}

            </grid>
        </div>

    )
}