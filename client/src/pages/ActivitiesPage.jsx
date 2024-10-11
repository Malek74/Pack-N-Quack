import { useState, useEffect } from "react";
import ActivityCard from "@/components/activityPage/ActivityCard";
import Activitiesbackground from "/assets/images/Background.jpg";
import Banner from "@/components/shared/Banner";
import CreateDialog from "@/components/shared/CreateDialog";
import ActivityForm from "@/components/forms/ActivityForm";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Activities() {
  const { idAdv } = useParams();
  console.log(idAdv);
  const [activities, setActivities] = useState([]);
  const [activityDeleted, setActivityDeleted] = useState();
  const [activityUpdated, setActivityUpdated] = useState();
  const [activityCreated, setActivityCreated] = useState();

  const addActivity = async (values) => {
    try {
      values.advertiserID = idAdv;
      const response = await axios.post(`/api/activity`, values);
      console.log("Created successfully:", response.data);
      setActivityCreated(response.data);
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  const deleteActivity = async (id) => {
    try {
      const response = await axios.delete(`/api/activity/delete/${id}`);
      console.log("Delete successful:", response.data);
      setActivityDeleted(response.data);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const editActivity = async (id, values) => {
    try {
      const response = await axios.put(`/api/activity/update/${id}`, values);
      console.log("Updated successfully:", response.data);
      setActivityUpdated(response.data);
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  useEffect(() => {
    const fetchActivites = async () => {
      try {
        const response = await axios.get(`/api/activity/my/${idAdv}`);
        setActivities(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivites();
  }, [activityDeleted, activityUpdated, activityCreated]);

  return (
    <div className="flex flex-col  w-screen p-14">
      <Banner
        background={Activitiesbackground}
        alt="Activities Background"
        name="ACTIVITIES"
      />
      <div className="flex place-content-end mr-8">
        <CreateDialog
          title="an Activity"
          type="act"
          form={
            <ActivityForm type="act" createActivityFunction={addActivity} />
          }
        />
      </div>

      <h1 className="text-5xl text-skyblue stroke-2 stroke-black font-bold mb-24 self-center">
        Upcoming Actvities
      </h1>

      <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-y-10">
        {activities.map((activity) => (
          <ActivityCard
            key={activity._id}
            img={activity.coverImagePath}
            name={activity.name}
            category={activity.categoryID.name}
            time={activity.date}
            location={activity.location}
            googlemaps={activity.googleMapLink}
            priceType={activity.priceType}
            minPrice={activity.minPrice}
            maxPrice={activity.maxPrice}
            price={activity.price}
            tags={activity.tags}
            notTourist={true}
            booking={activity.isBookingOpen}
            discounts={activity.specialDiscounts}
            rating={activity.ratings.averageRating}
            activityID={activity._id}
            deleteActivityFunction={deleteActivity}
            updateActivityFunction={editActivity}
          />
        ))}
      </div>
    </div>
  );
}
