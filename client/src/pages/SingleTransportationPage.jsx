import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react"; // Importing Star for rating display
import Loading from "../components/shared/Loading";
import TransportationBackground from "/assets/images/Tram.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export default function SingleTransportationPage() {
  const { id } = useParams();
  const { prefCurrency } = useUser();
  const [transportation, setTransportation] = useState(null); // State to hold transportation data
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [walletBallance, setWalletBallance] = useState(0);

  const fetchWallet = async () => {
    try {
      const response = await axios.get(`/api/tourist/walletBalance`);
      setWalletBallance(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchTransportation = async () => {
    try {
      const response = await axios.get(`/api/transportation/${id}`

      ); // Corrected the API endpoint
      console.log(response.data);
      setTransportation(response.data); // Store the fetched transportation in state
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchTransportation();
    fetchWallet(); // Fetch transportation when component mounts
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
  const bookTransportation = async (id) => {
    try {
      const response = await axios.post(`/api/transportation/book`,
        {
          eventID: id,
          numOfTickets: numberOfTickets,
          promoCode: promoCode,
          payByWallet: paymentMethod === "wallet" ? true : false,
          date: date
        }
      );
      window.location.href = response.data.url;

      // Corrected the API endpoint
      console.log("Booking successful:", response.data);
    } catch (error) {
      console.error("Error booking transportation:", error);
    }
  };
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

      <>

        <div className="flex justify-between items-center ">
          <Label className="text-lg font-semibold mr-5">Wallet Balance:</Label>
          <p className="text-3xl font-bold text-green-600">{prefCurrency}{" "}{walletBallance}</p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <Label className="text-lg font-semibold mb-3 block">Choose Payment Method:</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200 transition-all hover:border-blue-500">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet" className="flex-grow cursor-pointer">
                <span className="font-medium">Pay by Wallet</span>
                <p className="text-sm text-gray-500">Use your available balance</p>
              </Label>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200 transition-all hover:border-blue-500">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-grow cursor-pointer">
                <span className="font-medium">Pay by Card</span>
                <p className="text-sm text-gray-500">Use your credit or debit card</p>
              </Label>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </RadioGroup>
        </div>


        <div className="mb-6 mt-6">
          <Label htmlFor="promoCode" className="text-lg font-semibold mb-2">
            Got a Promo Code?
          </Label>
          <div className="flex">
            <Input
              id="promoCode"
              placeholder="Enter your promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-grow mr-2"
            />
          </div>
        </div></>

      {available && <Button className="bg-skyblue hover:bg-sky-800 text-xl m-5" onClick={() => bookTransportation(id)}>Book Now</Button>}

    </div >
  );
}
