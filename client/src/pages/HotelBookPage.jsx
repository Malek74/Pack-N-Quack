import { useState } from "react";
import HotelSearchForm from "@/components/forms/hotelSearchForm";
import HotelResults from "@/components/bookingHotels/hotelResult";
import HotelBookingForm from "@/components/forms/hotelBookingForm";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const HotelBookingApp = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);

    const searchHotels = async (cityName) => {
        console.log(cityName);
        try {
            const response = await axios.post('/api/hotels', {
                "cityName": cityName
            });
            console.log(cityName);
            console.log("Hotel Search Results:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error searching hotels:", error);
            return null;
        }
    };

    const bookHotel = async (hotelOffer) => {
        try {
            const response = await axios.post('/api/bookhotel',
                {
                    data: {
                        type: "hotel-order",
                        hotelOffers: [hotelOffer],
                        travelers: [
                            {
                                id: "1",
                                dateOfBirth: "1982-01-16",
                                name: {
                                    firstName: "JORGE",
                                    lastName: "GONZALES",
                                },
                                gender: "MALE",
                                contact: {
                                    emailAddress: "jorge.gonzales833@telefonica.es",
                                    phones: [
                                        {
                                            deviceType: "MOBILE",
                                            countryCallingCode: "34",
                                            number: "480080076",
                                        },
                                    ],
                                },
                                documents: [
                                    {
                                        documentType: "PASSPORT",
                                        birthPlace: "Madrid",
                                        issuanceLocation: "Madrid",
                                        issuanceDate: "2015-04-14",
                                        number: "00000000",
                                        expiryDate: "2025-04-14",
                                        issuanceCountry: "ES",
                                        validityCountry: "ES",
                                        nationality: "ES",
                                        holder: true,
                                    },
                                ],
                            },
                        ],
                    },
                });
            console.log("Booking successful:", response.data);
        } catch (error) {
            console.error("Error booking hotel:", error);
        }
    };



    // Simulating hotel search API response
    const handleSearch = (originLocationCode, destinationLocationCode, departureDate, adults) => {
        // const mockhotels = [
        //     { origin, destination, departureDate, price: 200 },
        //     { origin, destination, departureDate, price: 250 },
        //     { origin, destination, departureDate, price: 180 },
        // ];
        const searchedhotels = searchHotels(originLocationCode, destinationLocationCode, departureDate, adults);
        setHotels(searchedhotels);
        setSelectedHotel(null); // Reset selection if new search is performed
    };

    const handleSelecthotel = (hotel) => {
        setSelectedHotel(hotel);
    };


    const handleBooking = () => {
        if (selectedHotel) {
            bookHotel(selectedHotel); // Book the selected hotel
            console.log("Booking confirmed!", selectedHotel);

        } else {
            console.log("No Hotel selected.");
        }
    };
    return (
        <div className=" flex justify-center m-8">
            <Card>
                <CardHeader>
                    <CardTitle>Book a hotel</CardTitle>
                </CardHeader>
                <CardContent>
                    <HotelSearchForm onSearch={handleSearch} />

                    <HotelResults hotels={hotels} onSelect={handleSelecthotel} />

                    {selectedHotel && <HotelBookingForm hotel={selectedHotel} onBook={handleBooking} />}
                </CardContent>
            </Card>
        </div>
    );
};

export default HotelBookingApp;