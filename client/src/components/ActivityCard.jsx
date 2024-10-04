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
import EditActivity from "./EditActivity";
import Maps from "./Maps";

export default function activityCard(props) {
    return (
        <div className="container rounded-lg w-[25rem] h-[22rem] shadow-md">
            <div className="flex place-content-end ">
            <img className=" w-[25rem] rounded-lg mb-4" src={props.img} alt={props.alt} />
            
            <Button className="w-14 absolute "><Trash2/></Button>
            <Button className="w-14 mx-10 absolute "><EditActivity name={props.name} time={props.time} 
            location={props.location} category={props.category} price ={props.price} 
            tags={props.tags}></EditActivity>
            </Button> </div>
            <div className="flex flex-col gap-2">
                <h1 className=" flex"> <span className="font-semibold text-xl mr-auto">{props.name} </span><span className="text-[#E7B008] drop-shadow">{props.category}</span></h1>
                <h4 className="text-base">{props.time}</h4>
                <h4 className="text-base">{props.location} <span className="ml-3"> <Maps></Maps> </span><br />
                </h4>
                <h4 className="flex"> <span className="text-base text-[#71BCD6] drop-shadow mr-auto">{props.price} </span><span className="text-gray-500 ml-auto">{props.tags}</span></h4>
            </div>
        </div >
    )
}