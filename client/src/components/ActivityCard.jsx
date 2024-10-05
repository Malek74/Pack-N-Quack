// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTrigger,
//     DialogFooter,
//     DialogClose
// } from "@/components/ui/dialog"
// import Button from "./ui/button"
import { Button } from "./ui/button"
import { Trash2 } from 'lucide-react';
import Maps from "./Maps";
import CreateDialog from "./CreateDialog";
import ActivityEditForm from "./forms/ActivityEditForm";

export default function activityCard(props) {
    return (
        <div className="container rounded-lg w-[25rem] h-auto p-2 shadow-md">
            <div className="flex place-content-end ">
                <img className=" w-[25rem] rounded-lg mb-4" src={props.img} alt={props.alt} />

                {props.notTourist && (
                    <>
                        <Button className="w-14 absolute bg-transparent "><Trash2 /></Button>
                        <Button className="w-14 mx-10 absolute bg-transparent ">
                            <ActivityEditForm type="act" name={props.name} time={props.time}
                                location={props.location} mapsSrc={props.mapsSrc} category={props.category} price={props.price}
                                tags={props.tags} booking={props.booking} />
                        </Button>
                    </>)}
            </div>
            <div className="flex flex-col gap-2">
                <h1 className=" flex"> <span className="font-semibold text-xl mr-auto">{props.name} </span><span className="text-gold drop-shadow">{props.category}</span></h1>
                <h4 className="text-base">{props.time}</h4>
                <h4 className="text-base">{props.location} <span className="ml-2"> <Maps mapsSrc={props.googlemaps}></Maps> </span><br />
                </h4>
                <h4 className="flex"> <span className="text-base text-skyblue drop-shadow mr-auto">{props.price} </span><span className="text-gray-500 ml-auto">{props.tags}</span></h4>
                <h4 className="text-base"> <b className="mr-2">Booking:</b>{props.booking}</h4>
                <h4 className="text-base text-red-700"> {props.discount}</h4>

            </div>
        </div >
    )
}