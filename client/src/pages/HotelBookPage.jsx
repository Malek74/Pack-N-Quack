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
import { set } from "date-fns";

const HotelBookingApp = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedHotelDetails, setSelectedHotelDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const userID = "6725442e98359339d8b821f0";

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

    const showHotelDetails = async (hotelID, checkInDate, checkOutDate, adults) => {
        console.log(hotelID, checkInDate, checkOutDate, adults);
        setLoading2(true);
        try {
            const response = await axios.post('/api/hotels/rooms', {
                hotelID: hotelID,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                adults: adults
            });
            console.log("Hotel Details:", response.data);
            setSelectedHotelDetails(response.data);
            setCheckInDate(checkInDate);
            setCheckOutDate(checkOutDate);
            console.log(selectedHotelDetails);
            return response.data;
        } catch (error) {
            console.error("Error showing hotel details:", error);
        } finally {
            setLoading2(false);
        }
    }

    const bookHotel = async (room, numOfDays) => {
        console.log(room);
        console.log(checkInDate);
        console.log(checkOutDate);
        try {
            const response = await axios.post(`/api/hotels/bookRoom/${userID}`,
                {
                    price: room.price,
                    numOfDays: numOfDays,
                    currency: "USD",
                    hotel: room,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    name: room.hotel

                });
            window.location.href = response.data.url;
            console.log("Booking successful:", response.data);
        } catch (error) {
            console.error("Error booking hotel:", error);
        }
    };



    // Simulating hotel search API response
    const handleSearch = (cityName) => {
        const searchedhotels = searchHotels(cityName);
        setHotels(searchedhotels);
        setSelectedHotel(null); // Reset selection if new search is performed
        setSelectedHotelDetails(null);
    };

    const handleSelecthotel = (hotel) => {
        setSelectedHotel(hotel);
        setSelectedHotelDetails(null);
    };

    const handleShowDetails = async ({ checkInDate, checkOutDate, adults }) => {
        try {
            const details = await showHotelDetails(selectedHotel.hotelId, checkInDate, checkOutDate, adults);
            setSelectedHotelDetails(details);
            setCheckInDate(checkInDate);
            setCheckOutDate(checkOutDate);
            console.log(details);
            console.log(selectedHotelDetails);
        }
        catch (error) {
            console.error("Error showing hotel details:", error);
        }
    };


    const handleBooking = ({ room, checkInDate, checkOutDate }) => {
        const timeDifference = checkOutDate - checkInDate; // Time difference in milliseconds
        const dayInMilliseconds = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
        const numOfDays = timeDifference / dayInMilliseconds; // Convert to days
        bookHotel(room, numOfDays);
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

                    <HotelResults hotels={hotels} onBook={handleBooking} onSelect={handleSelecthotel} selectedHotelDetails={selectedHotelDetails} handleShowDetails={handleShowDetails} loading={loading2} />

                    {/* {selectedHotel && <HotelBookingForm hotel={selectedHotel} onBook={handleBooking} />} */}
                </CardContent>
            </Card>
        </div>
    );
};

export default HotelBookingApp;