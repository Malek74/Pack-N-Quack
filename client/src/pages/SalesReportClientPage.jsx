import { AreaRevenueChart } from "@/components/SalesReportComponents/AreaRevenueChart";
import { BarRevenuePerProductChart } from "@/components/SalesReportComponents/BarRevenuePerProductChart";
import { PieBookingsPercentageChart } from "@/components/SalesReportComponents/PieBookingsPercentageChart";
import { PieRevenuePercentageChart } from "@/components/SalesReportComponents/PieRevenuePercentageChart";
import SalesReportFilters from "@/components/SalesReportComponents/SalesReportFilters";
import { FilterButton } from "@/components/SalesReportComponents/FilterButton";
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";

const SalesReportClientPage = () => {
  const { prefCurrency } = useUser(); //use to get currency to display sign for revenue and request data
  const [reportFilters, setReportFilters] = useState();
  const [fetchedStats, setFetchedStats] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const isTourGuide = true;
  const isAdvertiser = false;
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("filtersss->", reportFilters);
        console.log("FETCHING");
        setIsLoading(true);
        let response;
        if (isTourGuide) {
          response = await axios.get(
            "/api/tourGuide/testing/6744aa1a8b14b29dbaaf1de6",
            {
              params: { ...reportFilters, currency: prefCurrency },
            }
          );
        } else if (isAdvertiser) {
          response = await axios.get(
            "/api/advertiser/testing/6744aa1a8b14b29dbaaf1de6",
            {
              params: { ...reportFilters, currency: prefCurrency },
            }
          );
        }
        setFetchedStats(response.data);
        console.log("STATS AS FOLLOWS");
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [reportFilters, prefCurrency]);

  const dummyStats = {
    revenuePerDay: [
      { date: "2024-06-17", revenue: 475 },
      { date: "2024-06-18", revenue: 107 },
      { date: "2024-06-19", revenue: 341 },
      { date: "2024-06-20", revenue: 408 },
      { date: "2024-06-21", revenue: 169 },
      { date: "2024-06-22", revenue: 317 },
      { date: "2024-06-23", revenue: 480 },
      { date: "2024-06-24", revenue: 132 },
    ],
    totalRevenue: {
      itinerariesRevenue: 275,
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
  };

  return (
    //px-[5.5rem]
    <div className="flex flex-col justify-center items-center gap-4 p-4">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-semibold">Sales Report</h1>
        <FilterButton
          reportFilters={reportFilters}
          setReportFilters={setReportFilters}
        />
      </div>

      {/* <SalesReportFilters setReportFilters={setReportFilters} /> */}

      {/* <AreaRevenueChart revenuePerDay={fetchedStats.revenuePerDay} /> */}

      <div className="flex justify-between w-full gap-4">
        <PieRevenuePercentageChart totalRevenue={dummyStats.totalRevenue} />
        <PieBookingsPercentageChart totalBookings={dummyStats.totalBookings} />
      </div>

      <BarRevenuePerProductChart
        revenueAndBookingPerEvent={dummyStats.revenueAndBookingPerEvent}
      />
    </div>
  );
};

export default SalesReportClientPage;
