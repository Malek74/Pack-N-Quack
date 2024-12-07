"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

const chartConfig = {
  bookings: {
    label: "bookings",
  },
  itineraries: {
    label: "Itineraries",
    color: "hsl(var(--chart-1))",
  },
  activities: {
    label: "Activities",
    color: "hsl(var(--chart-2))",
  }
} 

export function PieBookingsPercentageChart({totalBookings}) {
  const chartData = [
    { type: "itineraries", bookings: totalBookings.itinerariesBookings, fill: "var(--color-itineraries)" },
    { type: "activities", bookings: totalBookings.activitiesBookings, fill: "var(--color-activities)" },
  
  ]
  
  
  const totalbookings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.bookings, 0)
  }, [])

  return (
    <Card className="flex flex-col w-1/2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Bookings</CardTitle>
        <CardDescription>Bookings Stats</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="bookings"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalbookings.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-lg font-semibold"
                        >
                          Bookings
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total bookings for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
