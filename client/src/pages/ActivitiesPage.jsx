import React, { useState } from "react"
import ActivityCard from "@/components/ActivityCard"
import Activitiesbackground from "../images/Background.jpg"
import lege from "../images/lege-cy.jpg"
import memo from "../images/memo.png"
import amy from "../images/amy.jpeg"
import Banner from "@/components/Banner"
import CreateActivity from "@/components/CreateActivity"
import { Button } from "@/components/ui/button"
import CreateDialog from "@/components/CreateDialog"
import ActivityForm from "@/components/forms/ActivityForm"

export default function Activities() {

    const [activities, setActivities] = useState([
        {
            img: {lege},
            alt:"Lege-cy concert adv",
            name:"Lege-Cy Live at Boom Room",
            category:"Concert",
            time:"Oct 02 | 09:00pm",
            location:"Boom Room, Open Air Mall, Madinaty",
            price:"EGP 400",
            tags:"#Rap #Singer #Entertainment"
        },
        {
            img:{memo},
            alt:"Memo play adv",
            name:"MEMO play",
            category:"Theatrical play",
            time:"Oct 03 | 09:00pm",
            location:"Grand Nile Tower",
            price:"EGP 500-2500",
            tags:"#Play #Theatre #Comedy",
        },
        {
            img: {amy},
            alt:"Amy Whinehouse adv",
            name: "The Amy Whinehouse Band Live",
            category: "Concert",
            time: "Oct 05 | 11:00pm",
            location: "The Theater Somabay Marina",
            price: "EGP 1300",
            tags: "#Concert #Band #Music",
        },
        {
          title: "Scenic New Zealand",
          description:
            "Experience the stunning landscapes of New Zealand with this outdoor adventure itinerary. Start in Auckland and make your way to Rotorua, known for its geothermal activity and Maori culture. Then, explore the rolling hills of Hobbiton and continue to Queenstown, the adventure capital, where activities like bungee jumping, skiing, and mountain biking await. Finally, visit the majestic Milford Sound, a fjord surrounded by towering cliffs and cascading waterfalls.",
          price: "2000",
          point1: "Outdoor Adventures",
          point2: "Cultural Experiences",
          point3: "Fjord Exploration",
          language: "Arabic"
          // direction: "flex-row-reverse"
        },
        {
          title: "Treasures of Egypt",
          description:
            "Delve into the wonders of ancient Egypt with this historically rich itinerary. Begin your journey in Cairo, where the Great Pyramids of Giza and the Sphinx stand as testaments to Egypt's grandeur. Sail along the Nile River to Luxor, home to the Valley of the Kings and Karnak Temple. Explore the temples of Abu Simbel, and cap off your trip with a visit to the vibrant markets of Aswan. This itinerary is perfect for history buffs and those seeking a connection to one of the world's oldest civilizations.",
          price: "1700",
          point1: "Ancient Monuments",
          point2: "Nile River Cruise",
          point3: "Cultural Immersion",
          language: "Arabic"
          
        }
      ]);
    
      const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        point1: '',
        point2: '',
        point3: '',
        language:'',
      });

    return (

        <div className="flex flex-col  w-screen p-14">
            <Banner
                background={Activitiesbackground}
                alt="Activities Background"
                name="ACTIVITIES"
            />
            <div className="flex place-content-end mr-8">
                <CreateDialog title="an Activity" type="act" form={<ActivityForm type="act" />} />
            </div>



            <h1 className="text-5xl text-skyblue stroke-2 stroke-black font-bold mb-24 self-center">Upcoming Actvities</h1>

            <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-y-10" >
                <ActivityCard
                    img={lege}
                    alt="Lege-cy concert adv"
                    name="Lege-Cy Live at Boom Room"
                    category="Concert"
                    time="Oct 02 | 09:00pm"
                    location="Boom Room, Madinaty"
                    googlemaps="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.487353992242!2d31.625272675013036!3d30.108865015516624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581d0076c628fd%3A0x79a9352dd30a2613!2sBoom%20Room!5e0!3m2!1sen!2seg!4v1728066364256!5m2!1sen!2seg"
                    price="EGP 400"
                    tags="#Rap #Singer #Entertainment"
                    notTourist={true}
                    booking="Closed"
                    discount="20% for earlybirds"


                />
                <ActivityCard
                    img={memo}
                    alt="Memo play adv"
                    name="MEMO play"
                    category="Theatrical play"
                    time="Oct 03 | 09:00pm"
                    location="Grand Nile Tower"
                    googlemaps=" https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.0866606273935!2d31.22242097966857!3d30.034371554423682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584090695d6421%3A0x201285387107863a!2sGrand%20Nile%20Tower!5e0!3m2!1sen!2seg!4v1728068257077!5m2!1sen!2seg"
                    price="EGP 500-2500"
                    tags="#Play #Theatre #Comedy"
                    notTourist={true}
                    booking="Open"
                    discount="Buy 3 get 1 free"

                />
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