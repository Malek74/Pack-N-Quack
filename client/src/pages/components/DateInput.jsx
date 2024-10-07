import React, { useState } from "react";

const DateInput = ({ dates, setDates }) => {
  const [currentDate, setCurrentDate] = useState("");

  const handleDateInputChange = (event) => {
    setCurrentDate(event.target.value);
  };

  const handleAddDate = () => {
    if (currentDate && !dates.includes(currentDate)) {
      // Ensure no duplicate dates
      setDates([...dates, currentDate]);
      setCurrentDate(""); // Clear input after adding the date
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setDates(dates.filter((date) => date !== dateToRemove));
  };

  return (
    <div className="mb-4">
      <input
        type="date"
        value={currentDate}
        onChange={handleDateInputChange}
        className="mb-2 p-2 border rounded w-full"
      />
      <button
        type="button"
        onClick={handleAddDate}
        className="bg-blue-500 text-white p-2 rounded mb-2 w-full"
      >
        Add Date
      </button>
      <div className="flex flex-wrap">
        {dates.map((date, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-2 mb-2 flex items-center"
          >
            {date}
            <button
              type="button"
              onClick={() => handleRemoveDate(date)}
              className="ml-2 text-red-500"
            >
              &times; {/* Remove icon */}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default DateInput;
