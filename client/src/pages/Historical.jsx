import React, { useState } from "react"
import HistoricalCard from "@/components/HistoricalCard"
import Historicalbackground from "../images/Italy.jpg"
import pyramids from "../images/Pyramids.jpeg"
// import memo from "../images/memo.png"
// import amy from "../images/amy.jpeg"
import Banner from "@/components/Banner"
import Create from "@/components/Create"
import { Button } from "@/components/ui/button"

export default function Historical() {

    return (

        <div className="flex flex-col w-screen p-14 ">
            <Banner
                background={Historicalbackground}
                alt="Historical Background"
                name="HISTORICAL PLACES & MUSEUMS"
            />
            <div className="flex place-content-end mr-8">
                <Create task="Create a new Place" />
            </div>

            <h1 className="text-5xl text-[#71BCD6] stroke-2 stroke-black font-bold mb-24 self-center">Upcoming Actvities</h1>

            <grid className="grid grid-cols-2 justify-stretch w-screen self-center gap-y-10" >
                <HistoricalCard
                    img={pyramids}
                    alt="Pyramids"
                    name="Giza Pyramids and Great Sphinx"
                    category="Historical Monument"
                    hours="7am to 6pm"
                    location="Giza, Egypt"
                    price="EGP 60 for Egyptians €10 for foreigners" 
                    tags="#budget_friendly #family_friendly #historic_area"
                />
                <HistoricalCard
                    //img={memo}
                    alt="Memo play adv"
                    name="MEMO play"
                    category="Theatrical play"
                    time="Oct 03 | 09:00pm"
                    location="Grand Nile Tower"
                    price="EGP 500-2500"
                    tags="#Play #Theatre #Comedy"
                />
                <HistoricalCard
                    //img={amy}
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