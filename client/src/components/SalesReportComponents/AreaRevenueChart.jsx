  "use client"

  import * as React from "react"
  import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  const chartData = [
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
    ];
    
    

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  
  }  

  export function AreaRevenueChart() {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = chartData.filter((item) => {
      const date = new Date(item.date)
      const referenceDate = new Date("2024-06-30")
      let daysToSubtract = 90
      if (timeRange === "30d") {
        daysToSubtract = 30
      } else if (timeRange === "7d") {
        daysToSubtract = 7
      }
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    })

    return (

        <Card className = "w-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Revenue</CardTitle>
            <CardDescription>
              Showing your revenues/day
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillrevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillrevenue)"
                stroke="var(--color-revenue)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    
    )
  }
