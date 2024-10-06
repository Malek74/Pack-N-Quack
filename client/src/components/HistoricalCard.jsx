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
import PlaceEditForm from "./forms/PlaceEditForm";

export default function HistoricalCard(props) {
    return (
        <div className="container rounded-lg w-[30rem] h-auto shadow-md">
            <div className="flex place-content-end ">
                <img className=" w-[25rem] h-[15rem] rounded-lg mb-4" src={props.img} alt={props.alt} />

                {(props.notTourist) && (
                    <>
                        <Button className="w-14 absolute bg-transparent "><Trash2 /></Button>
                        <Button className="w-14 mx-10 absolute bg-transparent">
                            <PlaceEditForm name={props.name} description={props.description}
                                location={props.location} hours={props.hours} Eprice={props.Eprice} Fprice={props.Fprice}
                                tags={props.tags}></PlaceEditForm>
                        </Button>
                    </>)}


            </div>
            <div className="flex flex-col gap-2">
                <h1 className=" flex"> <span className="font-semibold text-xl mr-auto text-skyblue stroke-black ">{props.name} </span></h1>
                <h4 className="text-base">{props.description}</h4>
                <h4 className="text-base"><b>Opening Hours: </b>{props.hours}</h4>
                <h4 className="text-base"><b>Location: </b>{props.location} <br />
                </h4>
                <h4 className="flex"> <span className="text-base w-max "><b>Price for Egyptians: </b>{props.Eprice} </span></h4>
                <h4 className="flex"> <span className="text-base w-max "><b>Price for Foreigners: </b>{props.Fprice} </span></h4>
                <h4 className="flex mb-3  text-gray-500 self-end text-right">{props.tags}</h4>
            </div>
        </div >
    )
}