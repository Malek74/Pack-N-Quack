import { useState } from "react";
import FlightSearchForm from "@/components/forms/flightSearchForm";
import FlightResults from "@/components/bookingFlights/flightResult";
import FlightBookingForm from "@/components/forms/flightBookingForm";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CreateDialog from "@/components/shared/CreateDialog";

const FlightBookingApp = () => {
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const searchFlights = async (originLocationCode, destinationLocationCode, departureDate) => {
        //    departureDate = "2025-08-01";
        //  console.log(originLocationCode, destinationLocationCode, departureDate);
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
        }
    };

    const bookFlight = async (flightOffer, travelerInfo) => {
        try {
            const response = await axios.post('/api/book', {
                data: {
                    type: "flight-order",
                    flightOffers: [flightOffer],
                    travelers: [travelerInfo],
                },
            });
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
        setIsDialogOpen(true); // Open the dialog when a flight is selected
        console.log(selectedFlight);
    };


    const handleBooking = (travelerInfo) => {
        if (selectedFlight) {
            const flightBookingData = {
                ...travelerInfo,
                flightOffer: selectedFlight,
            };
            bookFlight(flightBookingData); // Book the selected flight with traveler info
            console.log("Booking confirmed!", flightBookingData);
        } else {
            console.log("No flight selected.");
        }
    };

    return (
        <div className=" flex justify-center m-8 w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Book a Flight</CardTitle>
                </CardHeader>
                <CardContent>
                    <FlightSearchForm onSearch={handleSearch} />

                    <FlightResults flights={flights} onSelect={handleSelectFlight} handleBooking={handleBooking} />

                    {/* {selectedFlight && isDialogOpen &&

                        <FlightBookingForm
                            flight={selectedFlight}
                            onBook={handleBooking}

                            onClose={() => setIsDialogOpen(false)}
                        />
                    } */}
                </CardContent>
            </Card>
        </div>
    );
};

export default FlightBookingApp;