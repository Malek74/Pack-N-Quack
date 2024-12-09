import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DateRangePickerV2 from "@/components/shared/DateRangePickerV2";
import MultiselectEventsDropdown from "./MultiSelectEventsDropdown";
import { useUser } from "@/context/UserContext";

SalesReportFilters.propTypes = {
  setReportFilters: PropTypes.func,
};

export default function SalesReportFilters({ setReportFilters }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { isAdvertiser, isTourGuide, isSeller } = useUser();
  useEffect(() => {
    if (isAdvertiser || isTourGuide) {
      setReportFilters({
        activities: selectedEvents.map((event) => event._id), // Combines all _id values into one array
        startDate: startDate,
        endDate: endDate,
      });
    }
    
    if (isSeller) {
      setReportFilters({
        selectedProducts: selectedEvents.map((event) => event._id), // Combines all _id values into one array
        startDate: startDate,
        endDate: endDate,
      });
    }
  }, [selectedEvents, startDate, endDate, isAdvertiser, isTourGuide, isSeller]);

  //fetch all events available for the select menu
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (isAdvertiser) {
          const response = await axios.get("/api/advertisers/activities");
          setFetchedEvents(response.data);
          console.log(response.data);
        } else if (isTourGuide) {
          const response = await axios.get("/api/tourGuide/my");
          setFetchedEvents(response.data);
          console.log(response.data);
        } else if (isSeller) {
          const response = await axios.get("/api/sellers/my/products");
          setFetchedEvents(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
    setIsLoading(false);
  }, [isAdvertiser, isTourGuide, isSeller]);

  return (
    !isLoading && (
      <div className="flex w-full flex-col gap-4">
        <DateRangePickerV2
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          report
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
