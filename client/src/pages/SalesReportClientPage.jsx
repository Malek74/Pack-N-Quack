import { AreaRevenueChart } from '@/components/SalesReportComponents/AreaRevenueChart'
import { BarRevenuePerProductChart } from '@/components/SalesReportComponents/BarRevenuePerProductChart'
import { PieBookingsPercentageChart } from '@/components/SalesReportComponents/PieBookingsPercentageChart'
import { PieRevenuePercentageChart } from '@/components/SalesReportComponents/PieRevenuePercentageChart'
import SalesReportFilters from '@/components/SalesReportComponents/SalesReportFilters'
import { FilterButton } from '@/components/SalesReportComponents/FilterButton'
import React, { useState } from 'react'
import { useUser } from "@/context/UserContext";

const SalesReportClientPage = () => {
    const { prefCurrency } = useUser(); //use to get currency to display sign for revenue and request data
    const [reportFilters, setReportFilters] = useState();
  return (
    //px-[5.5rem] 
    <div className="flex flex-col justify-center items-center gap-4 p-4">
        
        <div className="flex justify-between w-full">
            <h1 className='text-3xl font-semibold'>Sales Report</h1>
            <FilterButton />
        </div>
{/* 
        <SalesReportFilters setReportFilters={setReportFilters} /> */}

        <AreaRevenueChart />

        <div className="flex justify-between w-full gap-4">
            <PieRevenuePercentageChart />
            <PieBookingsPercentageChart />
        </div>

        <BarRevenuePerProductChart />
    </div>
  )
}

export default SalesReportClientPage