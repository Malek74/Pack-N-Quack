/* eslint-disable react/prop-types */
import OpeningHours from "./OpeningHours";
import { Button } from "../ui/button"
import { Trash2 } from 'lucide-react';
import PlaceEditForm from "../forms/PlaceEditForm";
import ImagesScroll from "../shared/ImagesScroll";
import Maps from "../shared/Maps";
export default function HistoricalCard(props) {
    return (
        <div className="container rounded-lg w-[30rem] h-auto pb-3 shadow-md">
            <div className="flex place-content-end ">
                <img className=" w-[25rem] h-[15rem] rounded-lg mb-4" src={props.img} alt={props.alt} />

                {(props.notTourist) && (
                    <>
                        <Button onClick={() => props.deletePlaceFunction(props.placeID)} className="w-14 absolute bg-transparent "><Trash2 /></Button>
                        <Button className="w-14 mx-10 absolute bg-transparent">
                            <PlaceEditForm name={props.name} description={props.description} pictures={props.pictures}
                                location={props.location} openingHours={props.openingHours} prices={props.prices} googleMapLink={props.googlemaps}
                                tags={props.tags} key={props.key} placeID={props.placeID}
                                updatePlaceFunction={props.updatePlaceFunction}
                            ></PlaceEditForm>
                        </Button>
                    </>)}


            </div>
            <div className="flex flex-col gap-2">
                <h1 className=" flex"> <span className="font-semibold text-xl mr-auto text-skyblue stroke-black ">{props.name} </span></h1>
                <h4 className="text-base">{props.description}</h4>
                <div className="flex gap-8">
                    <h4 className="text-base"> <OpeningHours openingHours={props.openingHours}></OpeningHours> </h4>
                    <h4 className="text-base"> <ImagesScroll pictures={props.pictures}></ImagesScroll> </h4>
                </div>
                <h4 className="text-base">{props.location} <span className="ml-2"> <Maps mapsSrc={props.googlemaps}></Maps> </span><br />
                </h4>

                <div className="flex gap-4">{Array.isArray(props.prices) && props.prices.map((price) => (<span key={price.type} className="flex "><b className="mr-1">{price.type}: </b> EGP{price.price}</span>
                ))}</div>
                <div className="flex flex-col text-right self-end ">
                    {Array.isArray(props.tags) && props.tags.map((tag) => (<p key={tag._id} className="flex  text-gray-500 self-end text-right"> {`#${tag.name_tag}-${tag.option}  `} </p>
                    ))}</div>


            </div>
        </div >
    )
}