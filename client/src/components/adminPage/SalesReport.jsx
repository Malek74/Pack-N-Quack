import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/context/UserContext";

import { AdminRevenuePieChart } from "../SalesReportComponents/AdminRevenuePieChart";
import { AdminFilterButton } from "@/components/SalesReportComponents/AdminFilterButton"
export default function Stats() {
  const [Stats, setStats] = useState([]);
  const [reportFilters, setReportFilters] = useState();
  const navigate = useNavigate();
  const { prefCurrency } = useUser(); //use to get currency to display sign for revenue and request data
  // const fetchStats = () => {
  //   console.log(
  //     "fetching w/ query ",
  //     `api/admins/Stats?sortBy=${selectedFilters["Sort By Date"]}&statusFilter=${selectedFilters["Status"]}`
  //   );
  //   axios
  //     .get(
  //       `api/admins/Stats?sortBy=${selectedFilters["Sort By Date"]}&statusFilter=${selectedFilters["Status"]}`
  //     )
  //     .then((response) => {
  //       setStats(response.data);
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    // Format the date
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format the time
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate}, ${formattedTime}`;
  }

  // useEffect(() => {
  //   fetchStats();
  // }, [reportFilters]);

  

  const dummyStats = [
    {
      title: "Italy Tour",
      type: "Itinerary",
      date: "10-10-2024",
      revenue: 500,
    },
    {
      title: "Paris Adventure",
      type: "Itinerary",
      date: "11-10-2024",
      revenue: 350,
    },
    {
      title: "Skydiving Experience",
      type: "Activity",
      date: "12-10-2024",
      revenue: 800,
    },
    {
      title: "Gift Shop – Italy Souvenirs",
      type: "Gift Shop",
      date: "13-10-2024",
      revenue: 150,
    },
    {
      title: "Egyptian Pyramid Tour",
      type: "Itinerary",
      date: "14-10-2024",
      revenue: 600,
    },
    {
      title: "Cooking Class in Rome",
      type: "Activity",
      date: "15-10-2024",
      revenue: 300,
    },
    {
      title: "London Sightseeing",
      type: "Itinerary",
      date: "16-10-2024",
      revenue: 450,
    },
    {
      title: "Gift Shop – Paris Mementos",
      type: "Gift Shop",
      date: "17-10-2024",
      revenue: 200,
    },
    {
      title: "Hiking in the Swiss Alps",
      type: "Activity",
      date: "18-10-2024",
      revenue: 700,
    },
    {
      title: "Safari in Kenya",
      type: "Itinerary",
      date: "19-10-2024",
      revenue: 1000,
    },
    {
      title: "Tokyo Tour",
      type: "Itinerary",
      date: "20-10-2024",
      revenue: 550,
    },
    {
      title: "Gift Shop – Tokyo Gadgets",
      type: "Gift Shop",
      date: "21-10-2024",
      revenue: 120,
    },
    {
      title: "Zipline Adventure",
      type: "Activity",
      date: "22-10-2024",
      revenue: 400,
    },
    {
      title: "New York City Tour",
      type: "Itinerary",
      date: "23-10-2024",
      revenue: 750,
    },
    {
      title: "Gift Shop – NYC Memorabilia",
      type: "Gift Shop",
      date: "24-10-2024",
      revenue: 180,
    },
    {
      title: "Scuba Diving in Bali",
      type: "Activity",
      date: "25-10-2024",
      revenue: 900,
    },
  ];

  const totalRevenue = {
    itinerariesRevenue: 275,
    activitiesRevenue: 210,
    giftshopRevenue:100,
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
         
          <div className="flex flex-row justify-between">
           <div className="flex flex-col">
            <CardTitle>Sales Report</CardTitle>
            <CardDescription className="mt-1">Revenue Stats.</CardDescription>
          </div>
          <AdminFilterButton setReportFilters={setReportFilters} />
          </div>
          
        </CardHeader>
        <CardContent >
          {" "}
          <div className="flex w-full justify-center mb-6">
          <AdminRevenuePieChart totalRevenue={totalRevenue} prefCurrency={prefCurrency}/>
          </div>
          {" "}
          <Table>
            <TableCaption>A list of products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyStats?.map((stat) => (
                <TableRow>
                  <TableCell>
                    {stat.title}
                  </TableCell>
                  <TableCell>
                    {stat.type}
                  </TableCell>
                  <TableCell>
                    {stat.date}
                  </TableCell>
                  <TableCell>
                    {stat.revenue} {prefCurrency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{dummyStats && dummyStats.length}</strong>{" "}
            products
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
