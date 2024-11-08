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
import HotelBookingForm from "../forms/hotelBookingForm";

const HotelResults = ({ hotels, onSelect, handleBooking, selectedHotelDetails }) => {
    if (!hotels || hotels.length === 0) {
        return <p>No hotels available.</p>;
    }

    return (
        <div className="m-5 justify-center">
            <Table>
                <TableCaption>A list of the available hotels.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Index</TableHead>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Address</TableHead>
                        <TableHead className="text-center">Select</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(hotels) && hotels.map((hotel, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{hotel.name}</TableCell>
                            <TableCell>{hotel.address.countryCode}</TableCell>
                            <TableCell className="text-right">
                                {/* <Button className="bg-skyblue hover:bg-sky-800 h-min"
                                    onClick={() => onSelect(flight)}
                                >Select Flight</Button> */}
                                <HotelBookingForm hotel={hotel} onBook={handleBooking} onSelect={onSelect} selectedHotelDetails={selectedHotelDetails} />


                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


        </div>
    );
};

export default HotelResults;
