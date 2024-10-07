import { Button } from "../../components/ui/button";
import { Trash2 } from 'lucide-react';
import EditActivity from "./editItineraryActivity";
import Maps from "../../components/Maps";

// Function to format the ISO date to a more readable time format
const formatTime = (isoString) => {
    const date = new Date(isoString);
    
    // Get the hours and minutes
    let hours = date.getUTCHours(); // Use getUTCHours() to avoid timezone conversion
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM

    // Convert to 12-hour format
    hours = hours % 12; // Convert 0-23 hour format to 0-11
    hours = hours ? hours : 12; // If hours is 0, set it to 12 for 12 AM

    // Format hours and minutes to be two digits
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    
    return formattedTime; // Return the formatted time
};

export default function TempActivityCard(props) {
    return (
        <div className="container rounded-lg w-[25rem] h-[22rem] shadow-md relative">
            <div className="flex place-content-end">
                <img className="w-[25rem] rounded-lg mb-4" src={props.img} alt={props.alt} />

                {/* Delete Button */}
                <Button 
                    className="w-14 absolute top-2 right-10" 
                    onClick={props.onDelete}  // Trigger delete function passed via props
                    size="icon"
                >
                    <Trash2 />
                </Button>

                {/* Edit Button */}
                <Button className="w-14 mx-10 absolute top-2 right-16" variant="ghost" size="icon">
                    <EditActivity 
                        name={props.name} 
                        startTime={props.startTime}
                        endTime={props.endTime}
                        location={props.location} 
                        description={props.description} 
                        onSave={props.onUpdate} // Trigger update function passed via props
                    />
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="flex font-semibold text-xl mr-auto"> 
                    {props.name}
                </h1>
                <p className="text-[#E7B008] drop-shadow text-sm">{props.description}</p>
                
                {/* Display formatted time */}
                <h4 className="text-base">{`${formatTime(props.startTime)} Till ${formatTime(props.endTime)}`}</h4>
                
                <h4 className="text-base ">{props.location} 
                    <span className="ml-3"> <Maps /> </span>
                </h4>
            </div>
        </div>
    );
}
