import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react"; // Importing Star for rating display
import Loading from "../components/shared/Loading";
import TransportationBackground from "/assets/images/Tram.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function SingleTransportationPage() {
  const { id } = useParams();
  const [transportation, setTransportation] = useState(null); // State to hold transportation data
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const userID = "6725442e98359339d8b821f0";
  const fetchTransportation = async () => {
    try {
      const response = await axios.get(`/api/transportation/${id}`,
        { params: { currency: 'USD' } }

      ); // Corrected the API endpoint
      console.log(response.data);
      setTransportation(response.data); // Store the fetched transportation in state
    } catch (error) {
      console.error(error);
    }
  };

  const bookTransportation = async (id) => {
    try {
      const response = await axios.post(`/api/transportation/book/${userID}`,
        {
          eventID: id,
          numOfTickets: numberOfTickets
        },
        {
          params: { currency: 'USD' }  // Query parameters go here
        }
      );
      window.location.href = response.data.url;

      // Corrected the API endpoint
      console.log("Booking successful:", response.data);
    } catch (error) {
      console.error("Error booking transportation:", error);
    }
  };
  useEffect(() => {
    fetchTransportation(); // Fetch transportation when component mounts
  }, [id]);

  // Render a loading state or the transportation details
  if (!transportation) {
    return <div className="flex justify-center mt-10"><Loading /></div>;
  }

  // Destructure properties from the fetched transportation data
  const {
    name,
    type,
    date,
    origin,
    destination,
    price,
    available,
    advertiserID,
    img = TransportationBackground,
    // discounts,

  } = transportation;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 min-h-screen gap-3">
      <img className="w-[30rem] rounded-lg shadow-lg mb-4" src={img} alt={name} />
      <h1 className="font-semibold text-3xl text-gray-800 mb-2">{name}</h1>
      <span className="text-gold text-xl">{type}</span>
      <h4 className="text-base text-gray-600 mb-2">
        {new Date(date).toDateString()} {new Date(date).toLocaleTimeString()}
      </h4>
      <h4 className="text-base">
        <b>FROM:</b> {origin}{" "}
        <br />
        <b>TO:</b> {destination}
        <br />
      </h4>
      <h4 className="flex items-center mb-4">
        <span className="text-xl text-skyblue">
          EGP {price}
        </span>

      </h4>
      <h4 className="text-base text-gray-600 mb-2">
        <b className="mr-2">Booking:</b>
        {available ? "Open" : "Closed"}
      </h4>
      {/* <div className="flex flex-col gap-2 mb-4">
        {Array.isArray(discounts) && discounts.map((discount, index) => (
          <p key={index} className="text-base text-red-700">
            {discount}
          </p>
        ))}
      </div> */}

      {available &&
        <div className="flex flex-col gap-2 mb-4 items-center">
          <h2 className="text-l font-semibold text-gray-800">Number Of Tickets</h2>
          <Input

            type="number"
            onChange={(e) => setNumberOfTickets(e.target.value)}
            defaultValue="1"
            className="w-1/3 text-center"
          />
        </div>
      }

      <h4 className="flex items-center mb-4">
        <span className="text-xl text-skyblue">
          Total Price: EGP {price * numberOfTickets}
        </span>

      </h4>
      {available && <Button className="bg-skyblue hover:bg-sky-800 text-xl m-5" onClick={() => bookTransportation(id)}>Book Now</Button>}

    </div >
  );
}
