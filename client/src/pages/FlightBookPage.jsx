import { useState } from "react";
import FlightSearchForm from "@/components/forms/flightSearchForm";
import FlightResults from "@/components/bookingFlights/flightResult";
import BookingForm from "@/components/forms/flightBookingForm";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const FlightBookingApp = () => {
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);

    const searchFlights = async (origin, destination, departureDate) => {
        const options = {
            method: 'GET',
            url: 'https://ryanair2.p.rapidapi.com/api/v1/searchFlights',
            params: {
                origin: origin,           // Example: 'JFK'
                destination: destination, // Example: 'LAX'
                outboundDate: departureDate,      // Format: '2024-11-01'
                adults: '1',
                currency: 'USD',          // Currency of choice
                countryCode: 'US',        // Country of choice
                market: 'US'              // Market of choice
            },
            headers: {
                'X-RapidAPI-Key': '8fcaa46a62msh18c3a4dc00d6374p10370ajsn83ef183bc2c5', // Replace with your RapidAPI key
                'X-RapidAPI-Host': 'ryanair2.p.rapidapi.com'
            }
        };

        try {
            console.log(origin, destination, departureDate);
            const response = await axios.request(options);
            console.log("Flight Search Results:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error searching for flights:", error);
        }
    };


    const bookFlight = async (flightOffer) => {
        try {
            const response = await axios.post(
                `https://test.api.amadeus.com/v1/booking/flight-orders`,
                {
                    data: {
                        type: "flight-order",
                        flightOffers: [flightOffer],
                        travelers: [
                            {
                                id: "1",
                                dateOfBirth: "1990-01-01",
                                name: {
                                    firstName: "John",
                                    lastName: "Doe"
                                },
                                contact: {
                                    emailAddress: "john.doe@example.com",
                                    phones: [
                                        {
                                            deviceType: "MOBILE",
                                            number: "+123456789"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer YOUR_ACCESS_TOKEN`
                    }
                }
            );
            console.log("Booking successful:", response.data);
        } catch (error) {
            console.error("Error booking flight:", error);
        }
    };



    // Simulating flight search API response
    const handleSearch = (origin, destination, departureDate) => {
        // const mockFlights = [
        //     { origin, destination, departureDate, price: 200 },
        //     { origin, destination, departureDate, price: 250 },
        //     { origin, destination, departureDate, price: 180 },
        // ];
        const searchedFlights = searchFlights(origin, destination, departureDate);
        setFlights(searchedFlights);
        setSelectedFlight(null); // Reset selection if new search is performed
    };

    const handleSelectFlight = (flight) => {
        setSelectedFlight(flight);
    };


    const handleBooking = () => {
        if (selectedFlight) {
            bookFlight(selectedFlight); // Book the selected flight
            console.log("Booking confirmed!", selectedFlight);

        } else {
            console.log("No flight selected.");
        }
    };
    return (
        <div className=" flex justify-center m-8">
            <Card>
                <CardHeader>
                    <CardTitle>Book a Flight</CardTitle>
                </CardHeader>
                <CardContent>
                    <FlightSearchForm onSearch={handleSearch} />

                    <FlightResults flights={flights} onSelect={handleSelectFlight} />

                    {selectedFlight && <BookingForm flight={selectedFlight} onBook={handleBooking} />}
                </CardContent>
            </Card>
        </div>
    );
};

export default FlightBookingApp;