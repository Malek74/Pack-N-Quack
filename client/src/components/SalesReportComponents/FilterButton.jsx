import { Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import SalesReportFilters from "./SalesReportFilters";
  

export function FilterButton({setReportFilters}) {
    const [filtersOn, setFiltersOn] = useState(false);

  return (
    <Dialog>
        <DialogTrigger><Button variant="outline" size="icon">
            <Filter />
       </Button></DialogTrigger>
        <DialogContent className="flex flex-col">
         <DialogHeader>
             <DialogTitle>Filter</DialogTitle>
                <DialogDescription>
                {/* <SlidersHorizontal /> */}
                 This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
        </DialogHeader>
        <SalesReportFilters setReportFilters={setReportFilters}/>
        </DialogContent>
    </Dialog>

  )
}
