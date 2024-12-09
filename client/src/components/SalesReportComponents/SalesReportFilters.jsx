import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DateRangePickerV2 from "@/components/shared/DateRangePickerV2";
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
      startDate: startDate,
      endDate: endDate,
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
      <div className="flex w-full flex-col gap-4">
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
