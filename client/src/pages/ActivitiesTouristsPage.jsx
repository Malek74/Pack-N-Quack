import { useState, useEffect } from "react"
import ActivityCard from "@/components/ActivityCard"
import Activitiesbackground from "../images/Background.jpg"
import amy from "../images/amy.jpeg"
import Banner from "@/components/Banner"
import FilterButton from "@/components/FilterButtons"
import SearchBar from "@/components/SearchBar"
import axios from "axios"


const buttons = [
    {
        type: 'Sort By', // This will create a "Sort By" dropdown
        options: [
            { label: "Price Low To High", value: "price-low-to-high" },
            { label: "Price High To Low", value: "price-high-to-low" },
            { label: "Ratings Low To High", value: "ratings-low-to-high" },
            { label: "Ratings High To Low", value: "ratings-high-to-low" },
        ],
    },
    {
        type: 'Price', // This will create a "Filter By" dropdown
        options: [
            { label: "EGP 0-100", value: "EGP 0-100" },
            { label: "EGP 100-200", value: "EGP 100-200" },
            { label: "EGP 200-300", value: "EGP 200-300" },
            { label: "EGP 300-400", value: "EGP 300-400" },
            { label: "EGP 400-500", value: "EGP 400-500" },
            { label: "More than EGP 500", value: "More than EGP 500" },
        ],
    },
    {
        type: 'Date',
        options: [
            { label: "In the next week", value: "In the next week" },
            { label: "In the next 2 weeks", value: "In the next 2 weeks" },
            { label: "In the next 1 month", value: "In the next 1 month" },
            { label: "In the next 6 months", value: "In the next 6 months" },
            { label: "In the next 1 year", value: "In the next 1 year" },
        ],
    },
    {
        type: 'Category',
        options: [
            { label: "Concert", value: "In the next week" },
            { label: "Theatre", value: "In the next 2 weeks" },
            { label: "Entertainment", value: "In the next 1 month" },
        ],
    },
    {
        type: 'Ratings',
        options: [
            { label: "1 star and more", value: "1 star and more" },
            { label: "2 stars and more", value: "2 stars and more" },
            { label: "3 stars and more", value: "3 stars and more" },
            { label: "4 stars and more", value: "4 stars and more" },
            { label: "5 stars", value: "5 stars" },
        ],
    },
];

export default function Activities() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activities, setActivities] = useState([]);


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

    }, []);


    return (

        <div className="flex flex-col  w-screen p-14">
            {/* <Banner
                background={Activitiesbackground}
                alt="Activities Background"
                name="ACTIVITIES"
            /> */}

            <div className="relative mb-10">
                {/* Banner Section */}
                <Banner
                    background={Activitiesbackground}
                    alt="Activities Background"
                    name="ACTIVITIES"
                />

                {/* Search Bar Section - Positioned on top of the banner */}
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Look for an activity.."} />
            </div>



            {/* <div className="flex justify-center items-center mt-[-60px] w-full">

                <div className="w-[60%] bg-white rounded-lg p-4 shadow-lg flex justify-center items-center">
                    <Input
                        placeholder="Search product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 rounded-md w-full border-0"
                    />
                    <Button className="bg-yellow-500 text-white p-3 rounded-md ml-4">
                        Search
                    </Button>
                </div>
            </div> */}


            <div className="flex mb-10">
                <span className="ml-18">  <FilterButton buttons={buttons} /></span>
                {/* <span className="ml-auto mr-18"><SearchComponent></SearchComponent></span> */}
            </div>

            <h1 className="text-5xl text-skyblue stroke-2 stroke-black font-bold mb-24 self-center">Upcoming Actvities</h1>

            <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-y-10" >

                {activities.map((activity) => (<ActivityCard
                    key={activity.activityID}
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
                    notTourist={false}
                    booking={activity.isBookingOpen}
                    discounts={activity.specialDiscounts}
                    rating={activity.ratings.averageRating}

                />))}

                <ActivityCard
                    img={amy}
                    alt="Amy Whinehouse adv"
                    name="The Amy Whinehouse Band Live"
                    category="Concert"
                    time="Oct 05 | 11:00pm"
                    location="The Theater Somabay Marina"
                    googlemaps="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2553.608620259062!2d33.98254983670627!3d26.84981674800142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x144d6fc7bf7f4123%3A0x1dce7abda4de4a3e!2sSoma%20Bay%20Marina!5e0!3m2!1sen!2seg!4v1728068796045!5m2!1sen!2seg"
                    price="EGP 1300"
                    tags="#Concert #Band #Music"
                    notTourist={false}
                    booking="Open"
                    discount="50% off for Armed Forces Day"

                />
            </div>
        </div>

    )
}