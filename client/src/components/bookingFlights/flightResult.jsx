/* eslint-disable react/prop-types */
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import FlightBookingForm from "../forms/flightBookingForm";
import { useState, useEffect } from "react";
import axios from "axios";


const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    const hours = match[1] ? match[1].replace("H", "h ") : "";
    const minutes = match[2] ? match[2].replace("M", "m") : "";
    return `${hours}${minutes}`.trim();
};
const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
};



export default function FlightResults({ flights, onSelect, handleBooking }) {

    const [walletBallance, setWalletBallance] = useState(0);

    const fetchWallet = async () => {
        try {
            const response = await axios.get(`/api/tourist/walletBalance`);
            setWalletBallance(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchWallet();

    }, []);

    if (!flights || flights.length === 0) {
        return <p>No Flights Available.</p>;
    }

    return (
        <div className="m-5 justify-center">

            <Table>
                <TableCaption>A list of the available flights.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Index</TableHead>
                        <TableHead className="text-center">Total Price</TableHead>
                        <TableHead className="text-center">Flights</TableHead>
                        <TableHead className="text-center">Total Duration</TableHead>
                        <TableHead className="text-center">Select</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(flights) && flights.map((flight, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{flight.id}</TableCell>
                            <TableCell>{flight.price.currency} {flight.price.total}</TableCell>
                            {Array.isArray(flight.itineraries) && flight.itineraries.map((itinerary, itineraryIndex) => (
                                <>

                                    <TableCell>
                                        <div>
                                            {Array.isArray(itinerary.segments) && itinerary.segments.map((segment, segmentIndex) => (
                                                <div key={segmentIndex}>

                                                    <h4 className="font-bold">Flight {segmentIndex + 1}</h4>
                                                    <p> <span className="font-semibold">From</span> {segment.departure.iataCode} Airport   <span className="font-medium">On </span> {formatDateTime(segment.departure.at)} <span className="font-medium">Terminal </span>{segment.departure.terminal} </p>
                                                    <p> <span className="font-semibold">To</span> {segment.arrival.iataCode} Airport   <span className="font-medium">On </span> {formatDateTime(segment.arrival.at)} <span className="font-medium">Terminal </span>{segment.arrival.terminal} </p>
                                                    <p><span className="font-semibold">Flight Number: </span> {segment.carrierCode} {segment.number}</p>
                                                    <p><span className="font-semibold">Duration:</span> {formatDuration(segment.duration)}</p>
                                                    <br />
                                                </div>

                                            ))
                                            }
                                        </div>
                                    </TableCell >
                                    <TableCell key={itineraryIndex}>
                                        <p> {formatDuration(itinerary.duration)}</p>
                                    </TableCell>
                                </>
                            ))
                            }
                            <TableCell className="text-right">

                                <FlightBookingForm flight={flight} onBook={handleBooking} onSelect={onSelect} walletBallance={walletBallance} />

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div >
    );
}
