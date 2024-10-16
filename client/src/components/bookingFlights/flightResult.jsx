/* eslint-disable react/prop-types */
import { Button } from "../ui/button";




const FlightResults = ({ flights, onSelect }) => {
    if (!flights || flights.length === 0) {
        return <p>No flights available.</p>;
    }

    return (
        <div className="m-5 justify-center">
            <h2 className="text-l font-bold mb-2">Available Flights</h2>
            <ul >
                {Array.isArray(flights) && flights.map((flight, index) => (
                    <li className="flex gap-5 my-5 items-center" key={index}>
                        <p>
                            {flight.origin} to {flight.destination} — ${flight.price}
                        </p>
                        <Button className="bg-skyblue hover:bg-sky-800 h-min" onClick={() => onSelect(flight)}>Select Flight</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlightResults;
