import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import Maps from "../shared/Maps";
import TransportationEditForm from "../forms/TransportationEditForm";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function transportationCard(props) {
    const navigate = useNavigate();

    const date = new Date(props.time);
    const openTransportationPage = () => {
        console.log(props.id)
        navigate(`/transportation/${props.id}`);
    };
    return (

        <div
            onClick={openTransportationPage}
            className="container rounded-lg w-[25rem] h-auto p-2 shadow-md"
        >
            <div className="flex place-content-end ">
                <img className=" w-[25rem] rounded-lg mb-4" src={props.img} />

                {props.notTourist && (
                    <>
                        <Button
                            onClick={() => props.deleteTransportationFunction(props.transportationID)}
                            className="w-14 absolute bg-transparent "
                        >
                            <Trash2 />
                        </Button>
                        <Button className="w-14 mx-10 absolute bg-transparent ">
                            <TransportationEditForm
                                advertiserName={props.advertiserName}
                                date={date}
                                type={props.type}
                                from={props.from}
                                to={props.to}
                                price={props.price}
                                notTourist={true}
                                booking={props.isBookingOpen}
                                discounts={props.specialDiscounts}
                                transportationID={props._id}
                                updateTransportationFunction={props.updateTransportationFunction}
                            />
                        </Button>
                    </>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <h1 className=" flex">
                    {" "}
                    <span className="font-semibold text-xl mr-auto">{props.type} </span>
                    <span className="text-gold text-xl font-semibold stroke-black stroke-2 mr-2">{props.advertiserName}</span>
                </h1>
                <h4 className="text-base">
                    {date.toDateString() + " " + date.toLocaleTimeString()}
                </h4>
                <h4 className="text-base">
                    <b>FROM:</b> {props.from}{" "}
                    <br />
                    <b>TO:</b> {props.to}
                    <br />
                </h4>

                <h4 className="flex">
                    {" "}
                    <span className="text-base text-skyblue drop-shadow mr-auto">
                        EGP{" "}
                        {props.price}
                    </span>
                </h4>
                <h4 className="text-base">
                    {" "}
                    <b className="mr-2">Booking:</b>
                    {props.booking ? "Open" : "Closed"}
                </h4>
                <div className="flex flex-row justify-between gap-4">
                    <div className="flex flex-col gap-y-0">
                        {" "}
                        {Array.isArray(props.discounts) &&
                            props.discounts.map((discount) => (
                                <p key={discount} className="text-base text-red-700 ">
                                    {discount}
                                </p>
                            ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
