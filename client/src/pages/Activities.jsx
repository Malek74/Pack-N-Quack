import React from "react"
import ActivityCard from "@/components/ActivityCard"
import background from "../images/Background.jpg"
import lege from "../images/lege-cy.jpg"
import memo from "../images/memo.png"
import amy from "../images/amy.jpeg"
export default function Activities() {
    return (

        <div className="flex flex-col items-center">
            <div className="flex justify-center items-center m-10 mb-36">
                <img className="rounded-3xl w-auto h-[440px] " src={background} alt="Activities Background" />
                <h1 className=" text-white text-8xl font-bold absolute">ACTIVITIES</h1>
            </div>

            <h1 className="text-5xl text-primary font-bold mb-24">Upcoming Actvities</h1>

            <grid className="grid grid-cols-3">
                <ActivityCard
                    img={lege}
                    alt="Lege-cy concert adv"
                    name="Lege-Cy Live at Boom Room"
                    category="Concert"
                    time="Oct 02 | 09:00pm"
                    location="Boom Room, Open Air Mall, Madinaty"
                    price="EGP 400"
                    tags="#Rap #Singer #Entertainment"
                />
                <ActivityCard
                    img={memo}
                    alt="Memo play adv"
                    name="MEMO play"
                    category="Theatrical play"
                    time="Oct 03 | 09:00pm"
                    location="Grand Nile Tower"
                    price="EGP 500-2500"
                    tags="#Play #Theatre #Comedy"
                />
                <ActivityCard
                    img={amy}
                    alt="Amy Whinehouse adv"
                    name="The Amy Whinehouse Band Live"
                    category="Concert"
                    time="Oct 05 | 11:00pm"
                    location="The Theater Somabay Marina"
                    price="EGP 1300"
                    tags="#Concert #Band #Music"
                />
            </grid>
        </div>

    )
}