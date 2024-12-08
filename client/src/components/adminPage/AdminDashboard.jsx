// "use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import DeleteButton from "../shared/DeleteButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function AccountDashboard() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = () => {
    axios
      .get("api/admins/users")
      .then((response) => {
        setAccounts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const handlegetNumberOfUsers = () => {
    axios
      .get("api/admins/sum")
      .then((response) => {
        setNumberOfUsers(response.data.totalUsers);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [chartData, setChartData] = useState([
    { month: "Jan", users: 275, fill: "#FFD700" }, // Gold
    { month: "Feb", users: 200, fill: "#FFA500" }, // Orange
    { month: "Mar", users: 187, fill: "#DAA520" }, // Goldenrod
    { month: "Apr", users: 173, fill: "#FF8C00" }, // Dark Orange
    { month: "May", users: 190, fill: "#D2691E" }, // Chocolate
    { month: "Jun", users: 210, fill: "#CD853F" }, // Peru
    { month: "Jul", users: 240, fill: "#DEB887" }, // Burlywood
    { month: "Aug", users: 255, fill: "#F4A460" }, // Sandy Brown
    { month: "Sep", users: 230, fill: "#D2691E" }, // Chocolate
    { month: "Oct", users: 220, fill: "#8B4513" }, // Saddle Brown
    { month: "Nov", users: 245, fill: "#A0522D" }, // Sienna
    { month: "Dec", users: 260, fill: "#B8860B" }, // Dark Goldenrod
  ]);
  const updateChartData = (apiResponse) => {
    console.log(apiResponse);
    // Create a map from the API response for easier lookup by month
    const apiDataMap = new Map(
      apiResponse.map((item) => [item.month, item.users])
    );
    console.log(apiDataMap);
    // Update the chartData users property using the API response
    setChartData(
      chartData.map((item) => ({
        ...item,
        users: apiDataMap.get(item.month) || 0, // Default to 0 if the month is not in the API response
      }))
    );
  };
  const chartConfig = {
    users: {
      label: "users",
    },
    jan: { label: "January", color: "hsl(var(--chart-1))" },
    feb: { label: "February", color: "hsl(var(--chart-2))" },
    mar: { label: "March", color: "hsl(var(--chart-3))" },
    apr: { label: "April", color: "hsl(var(--chart-4))" },
    may: { label: "May", color: "hsl(var(--chart-5))" },
    jun: { label: "June", color: "hsl(var(--chart-6))" },
    jul: { label: "July", color: "hsl(var(--chart-7))" },
    aug: { label: "August", color: "hsl(var(--chart-8))" },
    sep: { label: "September", color: "hsl(var(--chart-9))" },
    oct: { label: "October", color: "hsl(var(--chart-10))" },
    nov: { label: "November", color: "hsl(var(--chart-11))" },
    dec: { label: "December", color: "hsl(var(--chart-12))" },
  };
  const handlegetNumberOfMonthlyUsers = () => {
    axios
      .get("api/admins/newsum")
      .then((response) => {
        updateChartData(response.data.monthlyData);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteClicked = (account) => {
    console.log("Hi " + account.userType);
    axios
      .delete(`api/admins/${account._id}`, {
        data: {
          userType: account.userType,
        },
      })
      .then(() => {
        toast({
          title: "Account deleted successfully!",
        });
        fetchAccounts(); // Refresh the tags list after deletion
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Failed to delete account",
          variant: "destructive", // Error variant
        });
      });
  };

  useEffect(() => {
    fetchAccounts(); // Initial fetch when component mounts
    handlegetNumberOfUsers();
    handlegetNumberOfMonthlyUsers();
  }, []);

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Monthly New Users</CardTitle>
            <CardDescription>January - December 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis
                  dataKey="month"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={40}
                />
                <XAxis dataKey="users" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="users" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Quackers are increasing this year{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total new users for all 12 months of 2024
            </div>
          </CardFooter>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered accounts</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold">{numberOfUsers}</div>
              <div className="text-muted-foreground mt-2">Total Users</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>Manage all accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of accounts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account._id}>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.userType}</TableCell>
                  <TableCell>
                    <DeleteButton onConfirm={() => deleteClicked(account)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{accounts.length}</strong> accounts
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
