import { useState } from "react";
import FlightSearchForm from "@/components/forms/flightSearchForm";
import FlightResults from "@/components/bookingFlights/flightResult";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Loading from "@/components/shared/Loading";

const FlightBookingApp = () => {
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    //const [selectedFlightPrice, setSelectedFlightPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const userID = "6725442e98359339d8b821f0";
    const searchFlights = async (originLocationCode, destinationLocationCode, departureDate) => {
        //    departureDate = "2025-08-01";
        //  console.log(originLocationCode, destinationLocationCode, departureDate);
        setLoading(true);
        try {
            const response = await axios.post('/api/bookFlight', {
                "originLocationCode": originLocationCode,
                "destinationLocationCode": destinationLocationCode,
                "departureDate": departureDate,
            });
            //  console.log(originLocationCode, destinationLocationCode, departureDate);
            console.log("Flight Search Results:", response.data);
            setFlights(response.data);
            console.log(flights);
            setSelectedFlight(null); // Reset selection if new search is performed
            return response.data;
        } catch (error) {
            console.error("Error searching flights:", error);
            return null;
        } finally {
            setLoading(false); // Set loading to false after operation completes
        }
    };

    const bookFlight = async (id, flightOffer, numTickets) => {
        try {
            const response = await axios.post(`/api/bookFlight/book/${id}`, {
                price: flightOffer.price.total,
                currency: flightOffer.price.currency,
                numTickets: numTickets,
                origin: flightOffer.itineraries[0].segments[0].departure.iataCode,
                destination: flightOffer.itineraries[0].segments[flightOffer.itineraries[0].segments.length - 1].arrival.iataCode,
                date: flightOffer.itineraries[0].segments[0].departure.at,
            });
            window.location.href = response.data.url;

            console.log("Booking successful:", response.data);
        } catch (error) {
            console.error("Error booking flight:", error);
        }
    };



    // Simulating flight search API response
    const handleSearch = (originLocationCode, destinationLocationCode, departureDate) => {

        const searchedFlights = searchFlights(originLocationCode, destinationLocationCode, departureDate);
        setFlights(searchedFlights);
        console.log(flights);
        setSelectedFlight(null); // Reset selection if new search is performed
    };

    const handleSelectFlight = (flight) => {
        setSelectedFlight(flight);
        console.log(selectedFlight);
        // const FullPrice = getPrice(flight);
        // setSelectedFlightPrice(FullPrice);
        // console.log("Price got");
        // console.log(selectedFlightPrice);
    };



    const handleBooking = (numTickets) => {
        if (selectedFlight) {

            bookFlight(userID, selectedFlight, numTickets); // Book the selected flight with traveler info
        } else {
            console.log("No flight selected.");
        }
    };

    return (
        <div className=" flex justify-center m-8 w-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Book a Flight</CardTitle>
                </CardHeader>
                <CardContent>
                    <FlightSearchForm onSearch={handleSearch} />
                    <div className="flex justify-center "> {loading && <Loading />}</div>
                    < FlightResults flights={flights} onSelect={handleSelectFlight} handleBooking={handleBooking} />
                </CardContent>
            </Card>
        </div>
    );
};

export default FlightBookingApp;