import HistoricalCard from "@/components/historicalPage/HistoricalCard";
import Historicalbackground from "/assets/images/Italy.jpg";
import Banner from "@/components/shared/Banner";
import CreateTag from "@/components/editButtonsWillBeReusedLater/CreateTag";
import PlaceForm from "@/components/forms/PlaceForm";
import CreateDialog from "@/components/shared/CreateDialog";
import { useState, useEffect } from "react";
import axios from "axios";
export default function Historical() {
  const [places, setPlaces] = useState([]);
  const [placeDeleted, setPlaceDeleted] = useState();
  const [placeUpdated, setPlaceUpdated] = useState();
  const [placeCreated, setPlaceCreated] = useState();

  const addPlace = async (values) => {
    try {
      const response = await axios.post(`/api/places`, values);
      console.log("Created successfully:", response.data);
      setPlaceCreated(response.data);
    } catch (error) {
      console.error("Error creating place:", error);
    }
  };

  const deletePlace = async (id) => {
    try {
      const response = await axios.delete(`/api/places/${id}`);
      console.log("Delete successful:", response.data);
      setPlaceDeleted(response.data);
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  const editPlace = async (id, values) => {
    try {
      const response = await axios.put(`/api/places/${id}`, values);
      console.log("Updated successfully:", response.data);
      setPlaceUpdated(response.data);
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`/api/places/my/`);
        setPlaces(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaces();
  }, [placeDeleted, placeUpdated, placeCreated]);

  return (
    <div className="flex flex-col w-screen p-14 ">
      <Banner
        background={Historicalbackground}
        alt="Historical Background"
        name="HISTORICAL PLACES & MUSEUMS"
      />
      <div className="flex place-content-end mx-8 mb-16">
        <span className="mr-5">
          {" "}
          <CreateTag />
        </span>

        <CreateDialog
          title="a Place"
          type="act"
          form={<PlaceForm createPlaceFunction={addPlace} />}
        />
      </div>

      {/* <h1 className="text-5xl text-[#71BCD6] stroke-2 stroke-black font-bold mb-24 self-center"></h1> */}

      <grid className="grid grid-cols-2 justify-stretch w-screen self-center gap-y-10">
        {places.map((place) => (
          <HistoricalCard
            key={place._id}
            img={place.coverImagePath}
            pictures={place.pictures}
            name={place.name}
            description={place.description}
            openingHours={place.opening_hour}
            location={place.location}
            prices={place.tickets}
            tags={place.tags}
            notTourist={true}
            deletePlaceFunction={deletePlace}
            updatePlaceFunction={editPlace}
            placeID={place._id}
            googlemaps={place.googleMapLink}
          />
        ))}
      </grid>
    </div>
  );
}
