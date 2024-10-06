import HistoricalCard from "@/components/HistoricalCard"
import Historicalbackground from "../images/Italy.jpg"
import pyramids from "../images/Pyramids.jpeg"
import egyptianmuseum from "../images/egyptianmuseum.jpg"
import Banner from "@/components/Banner"
import CreateTag from "@/components/CreateTag"
import PlaceForm from "@/components/forms/PlaceForm"
import CreateDialog from "@/components/CreateDialog"
import { useState, useEffect } from "react"

export default function Historical() {

    const [places, setPlaces] = useState([]);
    const [placeDeleted, setPlaceDeleted] = useState();


    const deletePlace = async (id) => {
        try {
            const response = await axios.delete(`/api/place/delete/${id}`);
            console.log('Delete successful:', response.data);
            setPlaceDeleted(response.data);
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };


    useEffect(() => {
        const fetchActivites = async () => {
            try {
                const response = await axios.get("/api/activity");
                setPlaces(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchActivites()

    }, [placeDeleted]);



    return (

        <div className="flex flex-col w-screen p-14 ">
            <Banner
                background={Historicalbackground}
                alt="Historical Background"
                name="HISTORICAL PLACES & MUSEUMS"
            />
            <div className="flex place-content-end mx-8 mb-16">
                <span className="mr-5">  <CreateTag />
                </span>

                <CreateDialog title="a Place" type="act" form={<PlaceForm />} />


            </div>

            {/* <h1 className="text-5xl text-[#71BCD6] stroke-2 stroke-black font-bold mb-24 self-center"></h1> */}

            <grid className="grid grid-cols-2 justify-stretch w-screen self-center gap-y-10" >
                <HistoricalCard
                    img={pyramids}
                    alt="Pyramids"
                    name="Giza Pyramids and Great Sphinx"
                    description="The oldest of the Seven Wonders of the Ancient World"
                    hours="7:00 am - 6:00 pm every day"
                    location="Giza, Egypt"
                    Eprice="Adult: EGP 60, Student: EGP 30"
                    Fprice="Adult: €10 , Student: €5"
                    tags="#budget_friendly #family_friendly #historic_area"
                    notTourist={true}

                />
                <HistoricalCard
                    img={egyptianmuseum}
                    alt="Egyptian Museum"
                    name="Egyptian Museum"
                    description="One of the largest museums in the world, and the first national museum in the Middle East"
                    hours="9:00 am – 5:00 pm every day"
                    location="Downtown Cairo, Egypt"
                    Eprice="Adult: EGP 30, Student: EGP 10"
                    Fprice="Adult: €8.5 , Student: €4"
                    tags="#museum #ancientEgyptian #historic_area"
                    notTourist={true}

                />

            </grid>
        </div>

    )
}