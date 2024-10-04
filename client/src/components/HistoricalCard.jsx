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
import EditPlace from "./EditPlace";

export default function HistoricalCard(props) {
    return (
        <div className="container rounded-lg w-[30rem] h-[30rem] shadow-md">
            <div className="flex place-content-end ">
            <img className=" w-[25rem] rounded-lg mb-4" src={props.img} alt={props.alt} />
            
            <Button className="w-14 absolute "><Trash2/></Button>
            <Button className="w-14 mx-10 absolute "><EditPlace name={props.name} description={props.description} 
            location={props.location} hours={props.hours} price ={props.price} 
            tags={props.tags}></EditPlace>
            </Button> </div>
            <div className="flex flex-col gap-2">
                <h1 className=" flex"> <span className="font-semibold text-xl mr-auto text-[#71BCD6] stroke-black ">{props.name} </span></h1>
                <h4 className="text-base">{props.description}</h4>
                <h4 className="text-base"><b>Opening Hours: </b>{props.hours}</h4>
                <h4 className="text-base"><b>Location: </b>{props.location} <br />
                    {/* <Dialog>
                        <DialogTrigger>Open in Maps</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogDescription>
                                    MAPS POPUP SHOULD BE HERE!
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> */}
                </h4>
                <h4 className="flex"> <span className="text-base w-max "><b>Price: </b>{props.price} </span><span className="text-gray-500 self-end text-right">{props.tags}</span></h4>
            </div>
        </div >
    )
}