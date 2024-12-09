import { useState } from "react";
import { format, isBefore, startOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PropTypes from "prop-types";
DateRangePickerV2.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
  report: PropTypes.bool,
};
export default function DateRangePickerV2({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  report,
}) {
  const [startMonth, setStartMonth] = useState(new Date());
  const [endMonth, setEndMonth] = useState(new Date());

  const handleStartDateSelect = (date) => {
    setStartDate(date);
    if (date) {
      setStartMonth(startOfMonth(date));
      // If the new start date is after the current end date, reset the end date
      if (endDate && isBefore(endDate, date)) {
        setEndDate(undefined);
      }
    }
  };

  const handleEndDateSelect = (date) => {
    setEndDate(date);
    if (date) {
      setEndMonth(startOfMonth(date));
    }
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? (
              format(startDate, "PPP")
            ) : (
              <span>Pick start date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2 text-center font-semibold">
            {format(startMonth, "MMMM yyyy")}
          </div>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleStartDateSelect}
            month={startMonth}
            onMonthChange={setStartMonth}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2 text-center font-semibold">
            {format(endMonth, "MMMM yyyy")}
          </div>
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleEndDateSelect}
            month={endMonth}
            onMonthChange={setEndMonth}
            disabled={
              report
                ? false
                : (date) =>
                    date < new Date() || (startDate ? date < startDate : false)
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
