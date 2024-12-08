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
import { AdminFilterButton } from "@/components/SalesReportComponents/AdminFilterButton";
export default function Stats() {
  const [stats, setStats] = useState([]);
  const [reportFilters, setReportFilters] = useState();
  const navigate = useNavigate();
  const fetchStats = () => {
    axios
      .get(`/api/tourGuide/testing/6744aa1a8b14b29dbaaf1de6`)
      .then((response) => {
        setStats(response.data);
        console.log("STATS AS FOLLOWS");
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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

  useEffect(() => {
    fetchStats();
  }, []);

  const dummyStats = [
    {
      title: "Italy Tour",
      type: "Itinerary",
      date: "10-10-2024",
      revenue: 500,
    },
  ];

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <CardTitle>Salessss Report</CardTitle>
              <CardDescription className="mt-1">Revenue Stats.</CardDescription>
            </div>
            <AdminFilterButton setReportFilters={setReportFilters} />
          </div>
        </CardHeader>
        <CardContent>
          {" "}
          <div className="flex w-full justify-center mb-6">
            <AdminRevenuePieChart totalRevenue={totalRevenue} />
          </div>{" "}
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
              {stats?.map((stat) => (
                <TableRow>
                  <TableCell>{stat.title}</TableCell>
                  <TableCell>{stat.type}</TableCell>
                  <TableCell>{stat.date}</TableCell>
                  <TableCell>{stat.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{dummyStats && dummyStats.length}</strong> products
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
