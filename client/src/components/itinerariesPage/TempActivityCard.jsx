import { Button } from "../ui/button";
import { Trash2 } from 'lucide-react';
import EditActivity from "./editItineraryActivity";
import Maps from "@/components/shared/Maps";
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const amPm = hours >= 12 ? 'PM' : 'AM';
    return `${formattedHours}:${minutes} ${amPm}`;
}

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
