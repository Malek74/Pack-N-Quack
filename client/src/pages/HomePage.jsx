import React, { useState, useEffect } from "react";
import ProductCard from "@/components/marketplacePage/ProductCard";
import Activitiesbackground from "/assets/images/Background.jpg";
import BannerImage from "/assets/images/homeBanner2.jpg";
import Banner from "../components/shared/BannerV2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/shared/SearchBar";
import axios from "axios";
import ActivityCard from "@/components/activityPage/ActivityCard";
import RamitoItinerariesCard from "@/components/layout/components/ramitoCard";
import ItineraryCard from "@/components/itinerariesPage/ItinerariesCard";
import { useUser } from "@/context/UserContext";
import { set } from "date-fns";
import Loading from "@/components/shared/Loading";

import { ShareButton } from "@/components/shared/ShareButton";
import Delivery from "@/components/CheckOutPage/Delivery";
import GuideButton from "@/components/guideComponents/popMessage";
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { userId, userType } = useUser();
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/tourist/myPreferences/`
        );
        console.log(response.data);
        setActivities(response.data.activites);
        setItineraries(response.data.itineraries);
        console.log(response.data.activites);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  const filteredActivities = activities
    ? activities.filter((activity) =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];
  console.log(filteredActivities);

  const filteredItineraries = itineraries
    ? itineraries.filter((itinerary) =>
      itinerary.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  return (
    <div className="flex flex-col px-16 my-8">
      <div className="relative mb-6">
        {/* Banner Section */}
        <Banner
          background={BannerImage}
        //    alt="Hustling market"
        //    name="Live your dream destinations."
        //    textAlign="left"
        //    description="Odio eu consectetur ornare congue non enim pellentesque eleifend ipsum."
        />

        {/* Search Bar Section - Positioned on top of the banner */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Look for something fun to do!"}
        />
      </div>

      <GuideButton
        guideMessage={"Navigate though home bar and check out our activities!"}
      />

      <div className="flex justify-center mt-10  ">
        {loading && <Loading />}
      </div>
      <div className="grid grid-cols-3  place-items-center gap-8 py-8 justify-evenly">
        {Array.isArray(filteredActivities) &&
          filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.activityID}
              activityID={activity._id}
              img={activity.coverImagePath}
              name={activity.name}
              category={activity.categoryID.name}
              time={activity.date}
              location={activity.location}
              googlemaps={activity.googleMapLink}
              priceType={activity.priceType}
              minPrice={activity.minPrice}
              maxPrice={activity.maxPrice}
              price={activity.price}
              tags={activity.tags}
              notTourist={false}
              booking={activity.isBookingOpen}
              discounts={activity.specialDiscounts}
              rating={activity.ratings.averageRating}
            />
          ))}
        {Array.isArray(filteredItineraries) &&
          filteredItineraries.map((itinerary) => (
            <ItineraryCard
              small={true}
              key={itinerary._id}
              id={itinerary._id}
              coverImage={itinerary.coverImage || null}
              name={itinerary.name}
              description={itinerary.description}
              tags={itinerary.tags}
              price={itinerary.price}
              rating={itinerary.ratings.averageRating}
              numberOfReviews={itinerary.ratings.reviews.length}
              touristClicked={true}
            />
          ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-8 py-8 justify-center">
        </div>
      </div>
    </div>
  );
}
