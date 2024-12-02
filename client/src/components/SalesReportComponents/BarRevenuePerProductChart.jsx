"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { title: "Mark", revenue: 186, bookings: 80 },
  { title: "Itinerary2", revenue: 305, bookings: 200 },
  { title: "Itinerary3", revenue: 237, bookings: 120 },
  { title: "Activity1", revenue: 73, bookings: 190 },
  { title: "Activity2", revenue: 209, bookings: 130 },
  { title: "Activity3", revenue: 214, bookings: 140 },
  { title: "Activity4", revenue: 219, bookings: 140 },
  { title: "Activity5", revenue: 214, bookings: 140 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-2))",
  },
} 

export function BarRevenuePerProductChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Revenues and Bookings</CardTitle>
        <CardDescription>The revenue and booking for your events</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="title"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this title <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 titles
        </div>
      </CardFooter>
    </Card>
  )
}
