//import RamitoItinerariesCard from "@/components/ramitoItineraries/ramitoCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropTypes from "prop-types";
import DateRangePickerV2 from "@/components/shared/DateRangePickerV2";
// import MultiselectDropdown from "@/components/shared/MultiselectDropdown";
import MultiselectEventsDropdown from "./MultiSelectEventsDropdown";

SalesReportFilters.propTypes = {
  setReportFilters: PropTypes.func,
};

export default function SalesReportFilters({setReportFilters }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  

  useEffect(() => {
    setReportFilters({
      events: selectedEvents.map((event) => event.title),
      minDate: startDate,
      maxDate: endDate,
    });
  }, [
    selectedEvents,
    startDate,
    endDate,
    setReportFilters,
  ]);


  //fetch all events available for the select menu
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/Events");
        setFetchedEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
    setIsLoading(false);
  }, []);

  return (
    !isLoading && (
      <div className=" flex flex-col w-full gap-4">
        <DateRangePickerV2
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        <MultiselectEventsDropdown
          options={fetchedEvents}
          selectedOptions={selectedEvents}
          setSelectedOptions={setSelectedEvents}
        />
      </div>
    )
  );
}
