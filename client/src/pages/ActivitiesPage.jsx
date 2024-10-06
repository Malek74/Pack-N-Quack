import { useState, useEffect } from "react"
import ActivityCard from "@/components/ActivityCard"
import Activitiesbackground from "../images/Background.jpg"
import Banner from "@/components/Banner"
import CreateDialog from "@/components/CreateDialog"
import ActivityForm from "@/components/forms/ActivityForm"
import axios from "axios"


export default function Activities() {

    const [activities, setActivities] = useState([]);
    const [activityDeleted, setActivityDeleted] = useState();
    const [activityUpdated, setActivityUpdated] = useState();
    const [activityCreated, setActivityCreated] = useState();


    const addActivity = async (values) => {
        try {
            const response = await axios.post(`/api/activity`, values);
            console.log('Created successfully:', response.data);
            setActivityCreated(response.data);
        } catch (error) {
            console.error('Error creating activity:', error);
        }
    };

    const deleteActivity = async (id) => {
        try {
            const response = await axios.delete(`/api/activity/delete/${id}`);
            console.log('Delete successful:', response.data);
            setActivityDeleted(response.data);
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };

    const editActivity = async (id, values) => {
        try {
            const response = await axios.put(`/api/activity/update/${id}`, values);
            console.log('Updated successfully:', response.data);
            setActivityUpdated(response.data);
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    useEffect(() => {
        const fetchActivites = async () => {
            try {
                const response = await axios.get("/api/activity");
                setActivities(response.data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchActivites()

    }, [activityDeleted, activityUpdated, activityCreated]);



    return (

        <div className="flex flex-col  w-screen p-14">
            <Banner
                background={Activitiesbackground}
                alt="Activities Background"
                name="ACTIVITIES"
            />
            <div className="flex place-content-end mr-8">
                <CreateDialog title="an Activity" type="act" form={<ActivityForm type="act" createActivityFunction={addActivity} />} />
            </div>



            <h1 className="text-5xl text-skyblue stroke-2 stroke-black font-bold mb-24 self-center">Upcoming Actvities</h1>

            <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-y-10" >


                {activities.map((activity) => (<ActivityCard
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
                />))}



                {/* <ActivityCard
                    img={amy}
                    alt="Amy Whinehouse adv"
                    name="The Amy Whinehouse Band Live"
                    category="Concert"
                    time="Oct 05 | 11:00pm"
                    location="The Theater Somabay Marina"
                    googlemaps="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2553.608620259062!2d33.98254983670627!3d26.84981674800142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x144d6fc7bf7f4123%3A0x1dce7abda4de4a3e!2sSoma%20Bay%20Marina!5e0!3m2!1sen!2seg!4v1728068796045!5m2!1sen!2seg"
                    price="EGP 1300"
                    tags="#Concert #Band #Music"
                    notTourist={true}
                    booking="Open"
                    discount="50% off for Armed Forces Day"


                /> */}
            </div>
        </div>

    )
}