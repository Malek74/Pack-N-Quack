/* eslint-disable react/prop-types */
import { Button } from "../ui/button";




const HotelResults = ({ hotels, onSelect }) => {
    if (!hotels || hotels.length === 0) {
        return <p>No hotels available.</p>;
    }

    return (
        <div className="m-5 justify-center">
            <h2 className="text-l font-bold mb-2">Available Hotels</h2>
            <ul >
                {Array.isArray(hotels) && hotels.map((hotel, index) => (
                    <li className="flex gap-5 my-5 items-center" key={index}>
                        <p>
                            {hotel.name} in {hotel.address}
                        </p>
                        <Button className="bg-skyblue hover:bg-sky-800 h-min" onClick={() => onSelect(hotel)}>Select Hotel</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HotelResults;
