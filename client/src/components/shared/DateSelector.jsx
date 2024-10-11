import React, { useState } from "react";

const DateSelector = ({ dates }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Function to format the ISO date to a more readable format
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="py-8">
      {/* Header showing the selected date */}
      <h1 className="text-2xl font-bold mb-4">
        {selectedDate
          ? `Selected Date: ${formatDate(selectedDate)}`
          : "Available Dates"}
      </h1>

      {/* Dropdown for selecting a date */}
      <select
        value={selectedDate}
        onChange={handleDateChange}
        className="border p-2 rounded"
      >
        <option value="" disabled>
          Select a date
        </option>
        {(Array.isArray(dates) ? dates : []).map((date, index) => (
          <option key={index} value={date}>
            {formatDate(date)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;
