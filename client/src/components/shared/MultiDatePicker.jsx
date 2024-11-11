import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import PropTypes from "prop-types";
import { useState } from "react";

MultiDatePicker.propTypes = {
  dates: PropTypes.array,
  setDates: PropTypes.func,
};
export default function MultiDatePicker({ dates, setDates }) {
  const [endMonth, setEndMonth] = useState(new Date());
  const removeDate = (dateToRemove) => {
    setDates(dates.filter((date) => date.getTime() !== dateToRemove.getTime()));
  };

  return (
    <div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dates.length && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Pick dates</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 text-center font-semibold">
              {format(endMonth, "MMMM yyyy")}
            </div>
            <Calendar
              mode="multiple"
              selected={dates}
              onSelect={setDates}
              month={endMonth}
              onMonthChange={setEndMonth}
              initialFocus
              className="rounded-md border border-t-0"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Selected Dates</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {dates.length > 0 ? (
            dates.map((date, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm bg-gold text-white hover:bg-gold"
              >
                {format(date, "PPP")}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 rounded-full p-0"
                  onClick={() => removeDate(date)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove date</span>
                </Button>
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              No dates selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
