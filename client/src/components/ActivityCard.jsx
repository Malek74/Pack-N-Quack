
import { Button } from "./ui/button"
import { Trash2 } from 'lucide-react';
import Maps from "./Maps";
import ActivityEditForm from "./forms/ActivityEditForm";
import { Star } from "lucide-react";

export default function activityCard(props) {
    const date = new Date(props.time)


    return (
        <div className="container rounded-lg w-[25rem] h-auto p-2 shadow-md">
            <div className="flex place-content-end ">
                <img className=" w-[25rem] rounded-lg mb-4" src={props.img} />

                {props.notTourist && (
                    <>
                        <Button onClick={() => props.deleteActivityFunction(props.activityID)} className="w-14 absolute bg-transparent " ><Trash2 /></Button>
                        <Button className="w-14 mx-10 absolute bg-transparent ">
                            <ActivityEditForm type="act" name={props.name} time={date}
                                location={props.location} mapsSrc={props.googlemaps} category={props.category} minPrice={props.minPrice}
                                maxPrice={props.maxPrice} price={props.price} priceType={props.priceType}
                                tags={props.tags} booking={props.booking} discounts={props.discounts} activityID={props.activityID}
                                updateActivityFunction={props.updateActivityFunction} />
                        </Button>
                    </>)}
            </div>
            <div className="flex flex-col gap-2">
                <h1 className=" flex"> <span className="font-semibold text-xl mr-auto">{props.name} </span><span className="text-gold drop-shadow">{props.category}</span></h1>
                <h4 className="text-base">{date.toDateString() + " " + date.toLocaleTimeString()}</h4>
                <h4 className="text-base">{props.location} <span className="ml-2"> <Maps mapsSrc={props.googlemaps}></Maps> </span><br />
                </h4>

                <h4 className="flex"> <span className="text-base text-skyblue drop-shadow mr-auto">EGP {props.priceType == "fixed" ? props.price : `${props.minPrice} - ${props.maxPrice}`} </span>
                    <span className="flex"><b className="mr-1">Rating:</b> {props.rating}  <Star className="ml-1" color=" #E7B008" /></span>
                </h4>
                <h4 className="text-base"> <b className="mr-2">Booking:</b>{props.booking ? "Open" : "Closed"}</h4>
                <div className="flex flex-row justify-between gap-4">
                    <div className="flex flex-col gap-y-0">   {Array.isArray(props.discounts) && props.discounts.map((discount) => (<p className="text-base text-red-700 ">{discount}</p>
                    ))}</div>
                    <div className="text-right">
                        {Array.isArray(props.tags) && props.tags.map((tag) => (<span key={tag._id} className="text-gray-500 ml-2">#{tag.name}</span>
                        ))}</div>
                </div>
            </div>
        </div >
    )
}