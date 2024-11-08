import { useState } from "react";
import HotelSearchForm from "@/components/forms/hotelSearchForm";
import HotelResults from "@/components/bookingHotels/hotelResult";
import axios from "axios";
import Loading from "@/components/shared/Loading";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const HotelBookingApp = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedHotelDetails, setSelectedHotelDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const searchHotels = async (cityName) => {
        console.log(cityName);
        setLoading(true);
        try {
            const response = await axios.post('/api/hotels', {
                "cityName": cityName
            });
            console.log(cityName);
            console.log("Hotel Search Results:", response.data);
            setHotels(response.data);
            return response.data;
        } catch (error) {
            console.error("Error searching hotels:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const showHotelDetails = (hotel) => {
        try {
            const response = axios.post('/api/hotels/rooms', {
                hotelId: hotel.hotelId
            });
            console.log("Hotel Details:", response.data);
            setSelectedHotelDetails(response.data);
        } catch (error) {
            console.error("Error showing hotel details:", error);
        }
    }

    const bookHotel = async (hotelOffer) => {
        try {
            const response = await axios.post('/api/bookhotel',
                {
                    hotelId: hotelOffer.hotelId
                });
            console.log("Booking successful:", response.data);
        } catch (error) {
            console.error("Error booking hotel:", error);
        }
    };



    // Simulating hotel search API response
    const handleSearch = (cityName) => {
        // const mockhotels = [
        //     { origin, destination, departureDate, price: 200 },
        //     { origin, destination, departureDate, price: 250 },
        //     { origin, destination, departureDate, price: 180 },
        // ];
        const searchedhotels = searchHotels(cityName);
        setHotels(searchedhotels);
        setSelectedHotel(null); // Reset selection if new search is performed
    };

    const handleSelecthotel = (hotel) => {
        setSelectedHotel(hotel);
        //    showHotelDetails(hotel);
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
                    <div className="flex justify-center"> {loading && <Loading />}</div>

                    <HotelResults hotels={hotels} onBook={handleBooking} onSelect={handleSelecthotel} selectedHotelDetails={selectedHotelDetails} />

                    {/* {selectedHotel && <HotelBookingForm hotel={selectedHotel} onBook={handleBooking} />} */}
                </CardContent>
            </Card>
        </div>
    );
};

export default HotelBookingApp;