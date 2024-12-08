import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/shared/Loading';
import { Card } from '@/components/ui/card';
import TransportationImage from '/assets/images/duckInTaxi.png';
import HotelImage from '/assets/images/duckInHotel.jpg';
import FlightImage from '/assets/images/duckInPlane.jpg';
import TransportationCard from '@/components/transportationPage/TransportationCard';
import GuideButton from "@/components/guideComponents/popMessage";
export default function Booked() {
    const userID = "6725442e98359339d8b821f0";
    const [bookedFlights, setBookedFlights] = useState([])
    const [bookedHotels, setBookedHotels] = useState([])
    const [bookedTransportations, setBookedTransportations] = useState([])
    const [booked, setBooked] = useState([])

    useEffect(() => {
        const fetchBooked = async () => {
            try {
                const response = await axios.post(`/api/tourist/myBookings/${userID}`, {
                    eventType: "transportation"
                });

                setBookedFlights(response.data.flights);
                setBookedHotels(response.data.hotels);
                setBookedTransportations(response.data.transportations);
                setBooked(bookedFlights.concat(bookedHotels, bookedTransportations))
            } catch (error) {
                console.error(error);
            }
        };


        fetchBooked();
    }, []);
    console.log(bookedFlights);
    console.log(bookedHotels);
    console.log(bookedTransportations);
    if (Array.isArray(bookedFlights) && Array.isArray(bookedHotels) && Array.isArray(bookedTransportations) &&
        bookedFlights.length == 0 && bookedHotels.length == 0 && bookedTransportations.length == 0) {
        return <div className="flex justify-center mt-10"><Loading /></div>;
    }


    return (

        
        <div className='container mx-auto px-4 py-8 '>
            {Array.isArray(bookedFlights) && bookedFlights.length > 0 &&
                <div className='flex flex-col items-center justify-center place-content-center self-center '>
                    <h1 className='text-center text-3xl font-semibold my-10'>Your Booked Flights</h1>
                    <div className='grid grid-cols-2 justify-evenly gap-5'>
                        {Array.isArray(bookedFlights) && bookedFlights.map((flight) => (
                            <Card className="p-6 m-10 w-[20rem] h-auto flex flex-col" key={flight._id}>
                                <img className=" w-[20rem] rounded-lg mb-4 self-center" src={FlightImage} />
                                <div className="flex justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold">{flight.flightData.flight}</h2>
                                        <p className="text-gray-600">{new Date(flight.flightData.date).toDateString()}
                                            {" at "}
                                            {new Date(flight.flightData.date).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="h-min">
                                        <p className="text-skyblue font-medium">${flight.flightData.price}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
        
                    </div>
    
                </div>

                
            }

            <GuideButton guideMessage={"booking" }
      />
            {Array.isArray(bookedHotels) && bookedHotels.length > 0 &&
                <div className='flex flex-col items-center justify-center place-content-center self-center '>
                    <h1 className='text-center text-3xl font-semibold my-10'>Your Booked Hotels</h1>
                    <div className='grid grid-cols-2 justify-evenly gap-5'>
                        {Array.isArray(bookedHotels) && bookedHotels.map((hotel) => (
                            <Card className="p-6 m-10 w-[20rem] h-auto flex flex-col" key={hotel._id}>
                                <img className=" w-[20rem] rounded-lg mb-4 self-center" src={HotelImage} />
                                <div className="flex justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold mb-2">{hotel.hotelData.hotel}</h2>
                                        <p><span className="font-semibold">Number of Beds:</span> {hotel.hotelData.beds} <span ><br /><span className="font-semibold">Bed Type:</span> {hotel.hotelData.bedType}</span></p>
                                        <p className=""><span className='font-semibold'>Check In: </span>{new Date(hotel.hotelData.checkIn).toDateString()}
                                            {" at "}
                                            {new Date(hotel.hotelData.checkIn).toLocaleTimeString()}</p>
                                        <p className=""><span className='font-medium'>Check Out: </span>{new Date(hotel.hotelData.checkOut).toDateString()}
                                            {" at "}
                                            {new Date(hotel.hotelData.checkOut).toLocaleTimeString()}</p>
                                        <br />
                                        <p className="text-gray-600">{hotel.hotelData.description}</p>
                                    </div>
                                    <div className='h-min'>
                                        <p className="text-skyblue font-medium">${hotel.hotelData.price}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>}
            {Array.isArray(bookedTransportations) && bookedTransportations.length > 0 &&
                <div className='flex flex-col items-center justify-center place-content-center self-center '>

                    <h1 className='text-center text-3xl font-semibold my-10'>Your Booked Transportations</h1>
                    <div className='grid grid-cols-2 justify-evenly gap-5'>
                        {Array.isArray(bookedTransportations) && bookedTransportations.map((transportation) => (
                            <Card className="p-6 m-10 w-[20rem] h-auto flex flex-col " key={transportation._id}>
                                <img className=" w-[20rem] rounded-lg mb-4 self-center" src={TransportationImage} />
                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-lg font-bold">{transportation.transportationID.name}</h2>
                                        <p className="text-gray-600">
                                            {new Date(transportation.transportationID.date).toDateString()}
                                            {" at "}
                                            {new Date(transportation.transportationID.date).toLocaleTimeString()}</p>
                                        <p className="text-black">
                                            <span className="font-medium"> Number Of Tickets: </span>{transportation.price / transportation.transportationID.price}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-gold font-semibold text-right">{transportation.transportationID.type}</p>

                                        <p className="text-skyblue font-semibold">${transportation.transportationID.price}</p>

                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div></div >}

                        <GuideButton guideMessage={"Select what you want to book from the list of available items  " } />
        </div>
    )
}