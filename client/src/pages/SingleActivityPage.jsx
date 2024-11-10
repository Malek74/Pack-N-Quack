import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react"; // Importing Star for rating display

export default function SingleActivityPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null); // State to hold activity data

  const fetchActivity = async () => {
    try {
      const response = await axios.get(`/api/activity/activityDetails/${id}`); // Corrected the API endpoint
      console.log(response.data);
      setActivity(response.data); // Store the fetched activity in state
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivity(); // Fetch activity when component mounts
  }, [id]);

  // Render a loading state or the activity details
  if (!activity) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  // Destructure properties from the fetched activity data
  const {
    name,
    img,
    category,
    time,
    location,
    googlemaps,
    price,
    minPrice,
    maxPrice,
    priceType,
    rating,
    booking,
    discounts,
    tags,
  } = activity;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 min-h-screen">
      <img className="w-full rounded-lg shadow-lg mb-4" src={img} alt={name} />
      <h1 className="font-semibold text-3xl text-gray-800 mb-2">{name}</h1>
      <span className="text-gold text-xl">{category}</span>
      <h4 className="text-base text-gray-600 mb-2">
        {new Date(time).toDateString()} {new Date(time).toLocaleTimeString()}
      </h4>
      <h4 className="text-base text-gray-600 mb-2">{location}</h4>
      <h4 className="flex items-center mb-4">
        <span className="text-xl text-skyblue">
          EGP {priceType === "fixed" ? price : `${minPrice} - ${maxPrice}`}
        </span>
        <span className="flex items-center ml-4">
          <b className="mr-1">Rating:</b> {rating} <Star className="ml-1" color="#E7B008" />
        </span>
      </h4>
      <h4 className="text-base text-gray-600 mb-2">
        <b className="mr-2">Booking:</b>
        {booking ? "Open" : "Closed"}
      </h4>
      <div className="flex flex-col gap-2 mb-4">
        {Array.isArray(discounts) && discounts.map((discount, index) => (
          <p key={index} className="text-base text-red-700">
            {discount}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap mb-4">
        {Array.isArray(tags) && tags.map((tag) => (
          <span key={tag._id} className="text-gray-500 ml-2 text-base border-b border-gray-300">
            #{tag.name}
          </span>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <iframe
          className="w-full h-64 rounded-lg"
          src={googlemaps}
          title="Location Map"
          frameBorder="0"
          allowFullScreen
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
      </div>
    </div>
  );
}
