import { AreaRevenueChart } from "@/components/SalesReportComponents/AreaRevenueChart";
import { BarRevenuePerProductChart } from "@/components/SalesReportComponents/BarRevenuePerProductChart";
import { PieBookingsPercentageChart } from "@/components/SalesReportComponents/PieBookingsPercentageChart";
import { PieRevenuePercentageChart } from "@/components/SalesReportComponents/PieRevenuePercentageChart";
import { FilterButton } from "@/components/SalesReportComponents/FilterButton";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import axios from "axios";
import Loading from "@/components/shared/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SalesReportClientPage = () => {
  const { prefCurrency } = useUser();
  const [reportFilters, setReportFilters] = useState();
  const [fetchedStats, setFetchedStats] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const { isTourGuide, isAdvertiser, isSeller } = useUser();
  const [transactions, setTransactions] = useState([]);

  const fetchStats = async () => {
    try {
      console.log("filtersss->", reportFilters);
      console.log("FETCHING");
      setIsLoading(true);
      let response;
      if (isTourGuide) {
        response = await axios.get("/api/tourGuide/revenue/reports", {
          params: { ...reportFilters, currency: prefCurrency },
        });
      } else if (isAdvertiser) {
        console.log("INSIDE");
        response = await axios.get("/api/advertisers/testing", {
          params: { ...reportFilters, currency: prefCurrency },
        });
      } else if (isSeller) {
        response = await axios.get("/api/sellers/revenue/reports", {
          params: { ...reportFilters, currency: prefCurrency },
        });
      }
      setFetchedStats(response.data);
      const calculatedTransactions =
        response.data.revenueAndBookingsPerEvent.map((event) => ({
          title: event.activityName,
          description: `${event.numOfTickets} tickets sold`,
          date: new Date(event.date).toISOString(), // Convert event.date to ISO string
          incoming: true,
          amount: event.price, // Use the price directly from the event
        }));

      setTransactions(calculatedTransactions);
      console.log("STATS AS FOLLOWS");
      console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  // Render transactions
  const renderTransactions = (transactions) => {
    return transactions.map((transaction, index) => (
      <Card key={index} className="mb-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{transaction.title}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(transaction.date).toLocaleString()}
              </p>
            </div>
            <span
              className={`${
                transaction.incoming ? "text-green-500" : "text-red-500"
              } font-semibold`}
            >
              {transaction.incoming ? "+" : "-"}
              {prefCurrency} {transaction.amount}
            </span>
          </div>
        </CardContent>
      </Card>
    ));
  };
  useEffect(() => {
    fetchStats();
  }, [reportFilters, prefCurrency, isTourGuide, isAdvertiser, isSeller]);

  if (fetchedStats) {
    return (
      <Card
        x-chunk="dashboard-06-chunk-0 "
        className="flex flex-col items-center justify-center gap-4 p-4"
      >
        <CardHeader className="flex w-full flex-row justify-between">
          <div>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>View all your sales data here!</CardDescription>
          </div>
          <FilterButton
            reportFilters={reportFilters}
            setReportFilters={setReportFilters}
          />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
          {loading ? (
            <Loading className="place-items-center place-self-center" />
          ) : (
            <>
              {fetchedStats.revenuePerDay?.length > 0 ? (
                <AreaRevenueChart revenuePerDay={fetchedStats.revenuePerDay} />
              ) : (
                <h2>No sales yet!</h2>
              )}
              <div className="flex w-full justify-between gap-4">
                {isAdvertiser && (
                  <>
                    {fetchedStats.totalRevenue?.activitiesRevenue > 0 && (
                      <PieRevenuePercentageChart
                        totalRevenue={
                          fetchedStats.totalRevenue?.activitiesRevenue
                        }
                      />
                    )}
                    {fetchedStats.totalBookings?.activitiesBookings > 0 && (
                      <PieBookingsPercentageChart
                        totalBookings={
                          fetchedStats.totalBookings?.activitiesBookings
                        }
                        type="activities"
                      />
                    )}
                  </>
                )}
                {isTourGuide && (
                  <>
                    {fetchedStats.totalRevenue?.itinerariesRevenue > 0 && (
                      <PieRevenuePercentageChart
                        totalRevenue={
                          fetchedStats.totalRevenue?.itinerariesRevenue
                        }
                      />
                    )}
                    {fetchedStats.totalBookings?.itinerariesBookings > 0 && (
                      <PieBookingsPercentageChart
                        totalBookings={
                          fetchedStats.totalBookings?.itinerariesBookings
                        }
                        type="itineraries"
                      />
                    )}
                  </>
                )}
              </div>
              {/* {fetchedStats?.revenueAndBookingsPerEvent?.length > 0 && (
              <BarRevenuePerProductChart
                revenueAndBookingPerEvent={
                  fetchedStats?.revenueAndBookingsPerEvent
                }
              />
            )} */}
              {transactions?.length > 0 && (
                <div className="flex w-full">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="">
                      <TabsTrigger value="all">All Transactions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="w-full">
                      <ScrollArea className="h-[500px]">
                        {renderTransactions(transactions)}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }
};

export default SalesReportClientPage;
