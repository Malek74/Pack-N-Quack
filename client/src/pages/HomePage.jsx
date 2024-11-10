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
import { set } from "date-fns";

import { ShareButton } from "@/components/shared/ShareButton";
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const userID = "672f8e2c142c1410c5243616";
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  // const products = [
  //   {
  //     img: Activitiesbackground,
  //     name: "Sample Product 1",
  //     seller: "Amazon",
  //     rating: 2,
  //     reviewsCount: 25,
  //     price: "99.99",
  //     description: "This is a sample product",
  //   },
  //   {
  //     img: Activitiesbackground,
  //     name: "Another Product",
  //     seller: "BestBuy",
  //     rating: 4.5,
  //     reviewsCount: 15,
  //     price: "199.99",
  //     description: "Another product example",
  //   },
  //   {
  //     img: Activitiesbackground,
  //     name: "Another Product",
  //     seller: "BestBuy",
  //     rating: 4.5,
  //     reviewsCount: 15,
  //     price: "199.99",
  //     description: "Another product example",
  //   },
  //   {
  //     img: Activitiesbackground,
  //     name: "Another Product",
  //     seller: "BestBuy",
  //     rating: 4.5,
  //     reviewsCount: 15,
  //     price: "199.99",
  //     description: "Another product example",
  //   },
  //   {
  //     img: Activitiesbackground,
  //     name: "Another Product",
  //     seller: "BestBuy",
  //     rating: 4.5,
  //     reviewsCount: 15,
  //     price: "199.99",
  //     description: "Another product example",
  //   },
  //   {
  //     img: Activitiesbackground,
  //     name: "Another Product",
  //     seller: "BestBuy",
  //     rating: 4.5,
  //     reviewsCount: 15,
  //     price: "199.99",
  //     description: "Another product example",
  //   },
  //   {
  //     img: Activitiesbackground,
  //     name: "Another Product",
  //     seller: "BestBuy",
  //     rating: 4.5,
  //     reviewsCount: 15,
  //     price: "199.99",
  //     description: "Another product example",
  //   },
  //   {
  //     img: Activitiesbackground,
  //     name: "Another Product",
  //     seller: "BestBuy",
  //     rating: 4.5,
  //     reviewsCount: 15,
  //     price: "199.99",
  //     description: "Another product example",
  //   },
  //   {
  //     img: Activitiesbackground,
  //     name: "Another Product",
  //     seller: "BestBuy",
  //     rating: 4.5,
  //     reviewsCount: 15,
  //     price: "199.99",
  //     description: "Another product example",
  //   },
  //   {
  //     img: Activitiesbackground,
  //     name: "Another Product",
  //     seller: "BestBuy",
  //     rating: 4.5,
  //     reviewsCount: 15,
  //     price: "199.99",
  //     description: "Another product example",
  //   },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/tourist/myPreferences/${userID}`
        );
        console.log(response.data);
        setActivities(response.data.activities);
        setItineraries(response.data.itineraries);
        set;
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [searchTerm]);

  const filteredActivities = activities
    ? activities.filter((activity) =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredItineraries = itineraries
    ? itineraries.filter((itinerary) =>
        itinerary.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col px-16">
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

      <div className="grid grid-cols-3  place-items-center gap-8 py-8 justify-center">
        {Array.isArray(filteredActivities) &&
          filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.activityID}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-8 py-8 justify-center">
          <ShareButton />
        </div>
      </div>
    </div>
  );
}
