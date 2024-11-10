import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/shared/Loading';
import { Card } from '@/components/ui/card';
export default function Booked() {
    const userID = "672f8e2c142c1410c5243616";
    const [bookedFlights, setBookedFlights] = useState([])
    const [bookedHotels, setBookedHotels] = useState([])
    const [bookedTransportations, setBookedTransportations] = useState([])

    useEffect(() => {
        const fetchBooked = async () => {
            try {
                const response = await axios.post(`/api/tourist/myBookings/${userID}`, {
                    eventType: "transportation"
                });
                console.log(response.data);
                console.log(response.data.flights);
                console.log(response.data.hotels);
                console.log(response.data.transportations);
                setBookedFlights(response.data.flights);
                setBookedHotels(response.data.hotels);
                setBookedTransportations(response.data.transportations);
            } catch (error) {
                console.error(error);
            }
        };


        fetchBooked();
    }, []);
    console.log(bookedFlights);
    console.log(bookedHotels);
    console.log(bookedTransportations);
    if (bookedFlights.length == 0 && bookedHotels.length == 0 && bookedTransportations.length == 0) {
        return <div className="flex justify-center mt-10"><Loading /></div>;
    }


    return (
        <>
            <h1>Your Booked Flights</h1>
            <div className='grid grid-cols-3 gap-4'>
                {Array.isArray(bookedFlights) && bookedFlights.map((flight) => (
                    <Card key={flight._id}>
                        <div className="flex justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">{flight.name}</h2>
                                <p className="text-gray-600">{flight.date}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">${flight.price}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}