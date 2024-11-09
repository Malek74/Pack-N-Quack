import { useState, useEffect } from "react";
import TransportationCard from "@/components/transportationPage/TransportationCard";
import Transportationsbackground from "/assets/images/Transportation.jpg";
import Transportationsbackground2 from "/assets/images/Tram.jpg";
import Banner from "@/components/shared/Banner";
import CreateDialog from "@/components/shared/CreateDialog";
import axios from "axios";
import { useParams } from "react-router-dom";
import TransportationForm from "@/components/forms/TransportationForm";
export default function Transportation() {
    const { idAdv } = useParams();
    const [transportations, setTransportations] = useState([]);
    const [transportationDeleted, setTransportationDeleted] = useState();
    const [transportationUpdated, setTransportationUpdated] = useState();
    const [transportationCreated, setTransportationCreated] = useState();
    let tourist = true;
    { idAdv ? tourist = false : tourist = true }
    const mockTransportation = [{
        _id: "1",
        coverImagePath: Transportationsbackground2,
        advertiserName: "GO Bus",
        type: "Bus",
        date: "2024-12-01 10:00 AM",
        from: "Alexandria",
        to: "Cairo",
        price: 100,
        isBookingOpen: true,
        specialDiscounts: ["20% for earlybirds"]
    }, {
        _id: "2",
        coverImagePath: Transportationsbackground2,
        advertiserName: "London Cab",
        type: "Taxi",
        date: "2024-11-29 12:00 PM",
        from: "Cairo",
        to: "Gouna",
        price: 300,
        specialDiscounts: ["20% for students", "30% for seniors"],
    }, {
        _id: "3",
        coverImagePath: Transportationsbackground2,
        advertiserName: "Uber",
        type: "Taxi",
        date: "2024-12-31 08:00 AM",
        from: "Cairo",
        to: "Aswan",
        price: 200,
        isBookingOpen: true
    }]
    const addTransportation = async (values) => {
        try {
            const { advertiserName, date, type, from, to, price, isBookingOpen, specialDiscounts } = values;
            const response = await axios.post(`/api/transportation/${idAdv}`, {
                price: price,
                type: type,
                name: advertiserName + " from " + from + " to " + to,
                available: isBookingOpen,
                origin: from,
                destination: to,
                date: date,
            });
            console.log("Created successfully:", response.data);
            setTransportationCreated(response.data);
        } catch (error) {
            console.error("Error creating transportation:", error);
        }
    };

    const deleteTransportation = async (id) => {
        try {
            const response = await axios.delete(`/api/transportation/delete/${id}`);
            console.log("Delete successful:", response.data);
            setTransportationDeleted(response.data);
        } catch (error) {
            console.error("Error deleting transportation:", error);
        }
    };

    const editTransportation = async (id, values) => {
        try {
            const response = await axios.put(`/api/transportation/update/${id}`, values);
            console.log("Updated successfully:", response.data);
            setTransportationUpdated(response.data);
        } catch (error) {
            console.error("Error updating transportation:", error);
        }
    };

    useEffect(() => {
        const fetchTransportation = async () => {
            try {

                const response = await axios.get('/api/transportation', {
                    params: {
                        currency: 'USD',
                        ...(idAdv && { advertiserID: idAdv }), // Only adds advertiserID if idAdv is truthy (not null or undefined)                    },
                    }
                });

                setTransportations(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTransportation();
    }, [transportationDeleted, transportationUpdated, transportationCreated]);

    return (
        <div className="flex flex-col  w-screen p-14">
            <Banner
                background={Transportationsbackground}
                alt="Transportations Background"
                name="TRANSPORTATION"
            />{!tourist &&
                <div className="flex place-content-end mr-8">
                    <CreateDialog
                        title="an Transportation"
                        type="act"
                        form={
                            <TransportationForm type="act" createTransportationFunction={addTransportation} />
                        }
                    />
                </div>}

            <h1 className="text-5xl text-skyblue stroke-2 stroke-black font-bold mb-24 self-center">
                Upcoming Transportations
            </h1>

            <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-y-10">
                {transportations.map((transportation) => (
                    <TransportationCard
                        key={transportation._id}
                        img={Transportationsbackground2}
                        advertiserName={transportation.advertiserID.companyName}
                        type={transportation.type}
                        time={transportation.date}
                        from={transportation.origin}
                        to={transportation.destination}
                        price={transportation.price}
                        notTourist={!tourist}
                        booking={transportation.available}
                        discounts={transportation.specialDiscounts}
                        transportationID={transportation._id}
                        deleteTransportationFunction={deleteTransportation}
                        updateTransportationFunction={editTransportation}
                    />
                ))}
            </div>
        </div>
    );
}
