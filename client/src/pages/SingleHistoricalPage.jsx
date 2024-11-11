import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ImagesScroll from "@/components/shared/ImagesScroll";
import Maps from "@/components/shared/Maps";
import OpeningHours from "@/components/historicalPage/OpeningHours";
import { SampleDatePicker } from "@/components/shared/datepicker";
import { useUser } from "@/context/UserContext";
import { ShareButton } from "@/components/shared/ShareButton";
export default function SingleHistoricalPage() {
  const { name } = useParams();
  const [historicalPlace, setHistoricalPlace] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // State for date selection
  const { prefCurrency } = useUser();
  const fetchHistoricalPlace = async () => {
    try {
      const response = await axios.get(
        `/api/places/${name}?currency=${prefCurrency}`
      );
      setHistoricalPlace(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistoricalPlace();
  }, [name]);

  // Render a loading state or the historical place details
  if (!historicalPlace) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  // Destructure properties from the fetched historical place data
  const {
    description,
    pictures,
    location,
    googlemaps,
    openingHours,
    prices,
    tags,
  } = historicalPlace;

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedDate) {
      alert("Please select a date for booking.");
      return;
    }

    try {
      const response = await axios.post(`/api/bookings`, {
        placeName: name,
        date: selectedDate,
      });
      alert("Booking successful!");
    } catch (error) {
      console.error(error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 min-h-screen">
      <h1 className="font-semibold text-3xl text-gray-800 mb-4">{name}</h1>
      <h4 className="text-base text-gray-600 mb-2">{description}</h4>

      {/* Images Scroll Component */}
      <div className="mb-4">
        <ImagesScroll pictures={pictures} />
      </div>

      {/* Location and Map */}
      <h4 className="text-base text-gray-600 mb-2">{location}</h4>
      <Maps mapsSrc={googlemaps} />

      {/* Opening Hours */}
      <h4 className="text-base mb-2">
        <strong>Opening Hours:</strong>
        <OpeningHours openingHours={openingHours} />
      </h4>

      {/* Prices */}
      <div className="flex gap-4 mb-4">
        {Array.isArray(prices) &&
          prices.map((price) => (
            <span key={price.type} className="flex">
              <b className="mr-1">{price.type}:</b> EGP {price.price}
            </span>
          ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap mb-4">
        {Array.isArray(tags) &&
          tags.map((tag) => (
            <span
              key={tag._id}
              className="text-gray-500 ml-2 text-base border-b border-gray-300"
            >
              #{tag.name_tag}-{tag.option}
            </span>
          ))}
      </div>

      {/* Date Picker and Booking Button */}
      <ShareButton title={name} link={window.location.href} />
    </div>
  );
}
