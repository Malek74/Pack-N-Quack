import { AreaRevenueChart } from '@/components/SalesReportComponents/AreaRevenueChart'
import { BarRevenuePerProductChart } from '@/components/SalesReportComponents/BarRevenuePerProductChart'
import { PieBookingsPercentageChart } from '@/components/SalesReportComponents/PieBookingsPercentageChart'
import { PieRevenuePercentageChart } from '@/components/SalesReportComponents/PieRevenuePercentageChart'
import SalesReportFilters from '@/components/SalesReportComponents/SalesReportFilters'
import { FilterButton } from '@/components/SalesReportComponents/FilterButton'
import React, { useState, useEffect } from 'react'
import { useUser } from "@/context/UserContext";

const SalesReportClientPage = () => {
    const { prefCurrency } = useUser(); //use to get currency to display sign for revenue and request data
    const [reportFilters, setReportFilters] = useState();
    const [fetchedStats, setFetchedStats] = useState([]);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          console.log("filtersss->", reportFilters)
          setIsLoading(true);
          const response = await axios.get("/api/events", {
            params: { ...reportFilters, currency: prefCurrency },
          });
          setFetchedStats(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchStats();
    }, [reportFilters, prefCurrency]);
  

    const dummyStats = {
      revenuePerDay: [
        { date: "2024-04-01", revenue: 222 },
        { date: "2024-04-02", revenue: 97 },
        { date: "2024-04-03", revenue: 167 },
        { date: "2024-04-04", revenue: 242 },
        { date: "2024-04-05", revenue: 373 },
        { date: "2024-04-06", revenue: 301 },
        { date: "2024-04-07", revenue: 245 },
        { date: "2024-04-08", revenue: 409 },
        { date: "2024-04-09", revenue: 59 },
        { date: "2024-04-10", revenue: 261 },
        { date: "2024-04-11", revenue: 327 },
        { date: "2024-04-12", revenue: 292 },
        { date: "2024-04-13", revenue: 342 },
        { date: "2024-04-14", revenue: 137 },
        { date: "2024-04-15", revenue: 120 },
        { date: "2024-04-16", revenue: 138 },
        { date: "2024-04-17", revenue: 446 },
        { date: "2024-04-18", revenue: 364 },
        { date: "2024-04-19", revenue: 243 },
        { date: "2024-04-20", revenue: 89 },
        { date: "2024-04-21", revenue: 137 },
        { date: "2024-04-22", revenue: 224 },
        { date: "2024-04-23", revenue: 138 },
        { date: "2024-04-24", revenue: 387 },
        { date: "2024-04-25", revenue: 215 },
        { date: "2024-04-26", revenue: 75 },
        { date: "2024-04-27", revenue: 383 },
        { date: "2024-04-28", revenue: 122 },
        { date: "2024-04-29", revenue: 315 },
        { date: "2024-04-30", revenue: 454 },
        { date: "2024-05-01", revenue: 165 },
        { date: "2024-05-02", revenue: 293 },
        { date: "2024-05-03", revenue: 247 },
        { date: "2024-05-04", revenue: 385 },
        { date: "2024-05-05", revenue: 481 },
        { date: "2024-05-06", revenue: 498 },
        { date: "2024-05-07", revenue: 388 },
        { date: "2024-05-08", revenue: 149 },
        { date: "2024-05-09", revenue: 227 },
        { date: "2024-05-10", revenue: 293 },
        { date: "2024-05-11", revenue: 335 },
        { date: "2024-05-12", revenue: 197 },
        { date: "2024-05-13", revenue: 197 },
        { date: "2024-05-14", revenue: 448 },
        { date: "2024-05-15", revenue: 473 },
        { date: "2024-05-16", revenue: 338 },
        { date: "2024-05-17", revenue: 499 },
        { date: "2024-05-18", revenue: 315 },
        { date: "2024-05-19", revenue: 235 },
        { date: "2024-05-20", revenue: 177 },
        { date: "2024-05-21", revenue: 82 },
        { date: "2024-05-22", revenue: 81 },
        { date: "2024-05-23", revenue: 252 },
        { date: "2024-05-24", revenue: 294 },
        { date: "2024-05-25", revenue: 201 },
        { date: "2024-05-26", revenue: 213 },
        { date: "2024-05-27", revenue: 420 },
        { date: "2024-05-28", revenue: 233 },
        { date: "2024-05-29", revenue: 78 },
        { date: "2024-05-30", revenue: 340 },
        { date: "2024-05-31", revenue: 178 },
        { date: "2024-06-01", revenue: 178 },
        { date: "2024-06-02", revenue: 470 },
        { date: "2024-06-03", revenue: 103 },
        { date: "2024-06-04", revenue: 439 },
        { date: "2024-06-05", revenue: 88 },
        { date: "2024-06-06", revenue: 294 },
        { date: "2024-06-07", revenue: 323 },
        { date: "2024-06-08", revenue: 385 },
        { date: "2024-06-09", revenue: 438 },
        { date: "2024-06-10", revenue: 155 },
        { date: "2024-06-11", revenue: 92 },
        { date: "2024-06-12", revenue: 492 },
        { date: "2024-06-13", revenue: 81 },
        { date: "2024-06-14", revenue: 426 },
        { date: "2024-06-15", revenue: 307 },
        { date: "2024-06-16", revenue: 371 },
        { date: "2024-06-17", revenue: 475 },
        { date: "2024-06-18", revenue: 107 },
        { date: "2024-06-19", revenue: 341 },
        { date: "2024-06-20", revenue: 408 },
        { date: "2024-06-21", revenue: 169 },
        { date: "2024-06-22", revenue: 317 },
        { date: "2024-06-23", revenue: 480 },
        { date: "2024-06-24", revenue: 132 },
        { date: "2024-06-25", revenue: 141 },
        { date: "2024-06-26", revenue: 434 },
        { date: "2024-06-27", revenue: 448 },
        { date: "2024-06-28", revenue: 149 },
        { date: "2024-06-29", revenue: 103 },
        { date: "2024-06-30", revenue: 446 },
      ],
      totalRevenue: {
        itinerariesRevenue: 2705,
        activitiesRevenue: 200,
      },
      totalBookings: {
        itinerariesBookings: 275,
        activitiesBookings: 200,
      },
      revenueAndBookingPerEvent: [
        { title: "Italy", revenue: 186, bookings: 80 },
        { title: "A tour around Paris", revenue: 305, bookings: 200 },
        { title: "Mamma Mia", revenue: 237, bookings: 120 },
        { title: "Pyramids", revenue: 73, bookings: 190 },
        { title: "Atlantica", revenue: 209, bookings: 130 },
        { title: "A long hike", revenue: 214, bookings: 140 },
        { title: "Dancers Tour", revenue: 219, bookings: 140 },
        { title: "Hong Kong", revenue: 214, bookings: 140 },
      ],
    }    
    

  
  return (
    //px-[5.5rem] 
    <div className="flex flex-col justify-center items-center gap-4 p-4">
        
        <div className="flex justify-between w-full">
            <h1 className='text-3xl font-semibold'>Sales Report</h1>
            <FilterButton reportFilters = {reportFilters} setReportFilters = {setReportFilters}/>
        </div>
{/* 
        <SalesReportFilters setReportFilters={setReportFilters} /> */}

        <AreaRevenueChart revenuePerDay = {dummyStats.revenuePerDay}/>

        <div className="flex justify-between w-full gap-4">
            <PieRevenuePercentageChart totalRevenue = {dummyStats.totalRevenue} prefCurrency={prefCurrency} />
            <PieBookingsPercentageChart totalBookings = {dummyStats.totalBookings} />
        </div>

        <BarRevenuePerProductChart revenueAndBookingPerEvent = {dummyStats.revenueAndBookingPerEvent} />
    </div>
  )
}

export default SalesReportClientPage