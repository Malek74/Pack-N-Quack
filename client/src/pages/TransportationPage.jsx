import { useState, useEffect } from "react";
import TransportationCard from "@/components/transportationPage/TransportationCard";
import Transportationsbackground from "/assets/images/Transportation.jpg";
import Transportationsbackground2 from "/assets/images/Tram.jpg";
import Banner from "@/components/shared/Banner";
import CreateDialog from "@/components/shared/CreateDialog";
import axios from "axios";
import GuideButton from "@/components/guideComponents/popMessage";
import TransportationForm from "@/components/forms/TransportationForm";
import { useUser } from "@/context/UserContext";
import Loading from "@/components/shared/Loading";
export default function Transportation() {
    const [transportations, setTransportations] = useState([]);
    const [transportationDeleted, setTransportationDeleted] = useState();
    const [transportationUpdated, setTransportationUpdated] = useState();
    const [transportationCreated, setTransportationCreated] = useState();
    const { userId, userType, prefCurrency } = useUser();
    const [loading, setLoading] = useState(true);
    const addTransportation = async (values) => {
        try {
            const { advertiserName, date, type, from, to, price, isBookingOpen, specialDiscounts } = values;
            const response = await axios.post(`/api/transportation/`, {
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
                setLoading(true);
                const response = await axios.get('/api/transportation');

                setTransportations(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransportation();
    }, [transportationDeleted, transportationUpdated, transportationCreated]);

    return (

        <div className="flex flex-col px-16 my-8">
            <Banner
                background={Transportationsbackground}
                alt="Transportations Background"
                name="TRANSPORTATION"
            />
            {!userType === "Tourist" &&
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
            <div className="flex justify-center">
                {loading && <Loading size="lg" />}
            </div>
            <div className="grid grid-cols-3  place-items-center gap-8 py-8 justify-evenly">
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
                        notTourist={!userType === "Tourist"}
                        booking={transportation.available}
                        discounts={transportation.specialDiscounts}
                        transportationID={transportation._id}
                        deleteTransportationFunction={deleteTransportation}
                        updateTransportationFunction={editTransportation}
                    />
                ))}
            </div>

            <GuideButton guideMessage={"Select your transportation, review the details, and proceed to booking."} />


        </div>
    );
}
