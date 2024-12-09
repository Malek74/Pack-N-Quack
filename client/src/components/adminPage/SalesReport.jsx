import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import Loading from "@/components/shared/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { AdminRevenuePieChart } from "../SalesReportComponents/AdminRevenuePieChart";
import { AdminFilterButton } from "@/components/SalesReportComponents/AdminFilterButton";
export default function Stats() {
  const [stats, setStats] = useState([]);
  const [reportFilters, setReportFilters] = useState();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { prefCurrency } = useUser();

  const fetchStats = () => {
    setLoading(true);
    axios
      .get(`/api/admins/adminRevenue`, {
        params: { ...reportFilters, currency: prefCurrency },
      })

      .then((response) => {
        setStats(response.data);
        console.log("STATS AS FOLLOWS");
        console.log(response.data);

        // Process the response data for transactions
        const calculatedTransactions = response.data.map((item) => ({
          title: item.productName || item.title || "Unknown Product",
          description: item.quantity
            ? `${item.quantity} items sold`
            : `${item.revenue} revenue generated`,
          date: item.orderDate || item.date || new Date().toISOString(),
          incoming: true, // Assuming all transactions are incoming
          amount: item.revenue || 0, // Use revenue or fallback to 0
        }));

        setTransactions(calculatedTransactions);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

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
                {formatDate(transaction.date)}
              </p>
            </div>
            <span
              className={`${
                transaction.incoming ? "text-green-500" : "text-red-500"
              } font-semibold`}
            >
              {transaction.incoming ? "+" : "-"}
              {prefCurrency} {transaction.amount.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const formatDate = (isoDateString) => {
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
  };

  useEffect(() => {
    fetchStats();
  }, [reportFilters]);

  return (
    <Card
      x-chunk="dashboard-06-chunk-0"
      className="flex flex-col items-center justify-center gap-4 p-4"
    >
      <CardHeader className="flex w-full flex-row justify-between">
        <div>
          <CardTitle>Sales Report</CardTitle>
          <CardDescription>View all your sales data here!</CardDescription>
        </div>
        <AdminFilterButton setReportFilters={setReportFilters} />
      </CardHeader>
      <CardContent className="flex w-full flex-col items-center justify-center gap-4 p-4">
        {loading ? (
          <Loading className="place-items-center place-self-center" />
        ) : transactions?.length > 0 ? (
          <div className="flex w-full">
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="w-full">
                <ScrollArea className="h-[500px]">
                  {renderTransactions(transactions)}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <p>No transactions found</p>
        )}
      </CardContent>
    </Card>
  );
}
