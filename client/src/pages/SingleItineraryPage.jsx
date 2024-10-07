import React, { useState } from "react";
import ItineraryCard from "./components/ItineraryCardDetails";
import TempActivityCard from "./components/TempActivityCard";
import Banner from "@/components/Banner";
import lege from "../images/lege-cy.jpg";
import memo from "../images/memo.png";
import amy from "../images/amy.jpeg";
import duckie from "../assets/duckiePool.jpg";
import { Button } from "@/components/ui/button";

const SingleItineraryPage = (props) => {
  // State to hold days and their activities
  const [days, setDays] = useState([
    {
      day: 1,
      activities: [
        {
          img: lege,
          alt: "Lege-cy concert adv",
          name: "Lege-Cy Live at Boom Room",
          description: "Concert",
          startTime: "2024-12-10T09:00:00.000Z",
          endTime: "2024-12-10T12:00:00.000Z",
          location: "Boom Room, Open Air Mall, Madinaty",
        },
        {
          img: memo,
          alt: "Memo play adv",
          name: "MEMO Play",
          description: "Theatrical play",
          startTime: "2024-12-10T09:00:00.000Z",
          endTime: "2024-12-10T12:00:00.000Z",
          location: "Grand Nile Tower",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          img: amy,
          alt: "Amy Whinehouse adv",
          name: "The Amy Whinehouse Band Live",
          description: "Concert",
          startTime: "2024-12-11T09:00:00.000Z",
          endTime: "2024-12-11T12:00:00.000Z",
          location: "The Theater Somabay Marina",
        },
      ],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    img: "",
    alt: "",
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    language: "",
    accessibility: "",
    pickUpLocation: "",
    dropOffLocation: "",
    day: null, // To keep track of which day to add the activity
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(null); // To track which day's activity is being updated

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Add a new activity
  const addActivity = () => {
    const updatedDays = [...days];
    updatedDays[formData.day - 1].activities.push(formData); // Add activity to the specific day
    setDays(updatedDays);
    resetForm();
  };

  // Update an existing activity
  const updateActivity = () => {
    const updatedDays = [...days];
    updatedDays[currentDayIndex].activities[currentIndex] = formData; // Update activity in the specific day
    setDays(updatedDays);
    resetForm();
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      img: "",
      alt: "",
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      day: null,
    });
    setShowModal(false);
    setIsUpdating(false);
    setCurrentIndex(null);
    setCurrentDayIndex(null);
  };

  // Delete an activity
  const removeActivity = (dayIndex, activityIndex) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities.splice(activityIndex, 1); // Remove activity from the specific day
    setDays(updatedDays);
  };

  // Open update modal with activity details pre-filled
  const openUpdateModal = (dayIndex, activityIndex) => {
    setFormData(days[dayIndex].activities[activityIndex]);
    setCurrentIndex(activityIndex);
    setCurrentDayIndex(dayIndex);
    setIsUpdating(true);
    setShowModal(true);
  };
  const dates = [
    "2024-10-01T09:00:00.000Z",
    "2024-10-02T09:00:00.000Z",
    "2024-10-03T09:00:00.000Z",
    "2024-10-04T09:00:00.000Z",
    "2024-10-05T09:00:00.000Z",
    "2024-10-06T09:00:00.000Z",
    "2024-10-07T09:00:00.000Z",
    "2024-10-08T09:00:00.000Z",
    "2024-10-09T09:00:00.000Z",
    "2024-10-10T09:00:00.000Z",
  ];

  return (
    <div className="flex flex-col gap-y-10 py-8 px-[5.6rem]">
      <ItineraryCard
        title="Grand Tour of Italy"
        description="Discover the timeless beauty of Italy with this extensive itinerary! Start in Rome, where ancient ruins like the Colosseum and Roman Forum await. Marvel at Vatican City, home to St. Peter's Basilica and the Sistine Chapel. Travel to Florence for Renaissance art and architecture, and then to Venice, where gondola rides through scenic canals offer a glimpse of its unique charm. Conclude your trip in the Amalfi Coast, renowned for its stunning cliffs and azure waters."
        price={1500}
        point1="Ancient Ruins"
        point2="Art & Architecture"
        point3="Coastal Views"
        language="English"
        accessibility="wheel chair"
        pickUpLocation="Al tagamoa, Gamal Abdel Nasser, New Cairo 1, Cairo Governorate"
        dropOffLocation="Al tagamoa, Gamal Abdel Nasser, New Cairo 1, Cairo Governorate"
        availableDates={dates}
      />

      {/* Button to add a new activity */}
      <Button
        onClick={() => setShowModal(true)}
        className="bg-gray-300 p-2 mt-8 hover:bg-gray-400"
      >
        Add New Activity
      </Button>

      {/* Modal for creating or updating activities */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="font-bold mb-2">
              {isUpdating ? "Update Activity" : "Add New Activity"}
            </h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Activity Name"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="time" // Change here
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              placeholder="Start Time"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="time" // Change here
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              placeholder="End Time"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="number"
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              placeholder="Day Number (1, 2, ...)"
              className="mb-2 p-2 border rounded w-full"
              min="1"
            />
            <Button
              onClick={isUpdating ? updateActivity : addActivity}
              className="bg-green-500 text-white p-2 rounded"
            >
              {isUpdating ? "Update Activity" : "Add Activity"}
            </Button>
            <Button
              onClick={resetForm}
              className="ml-2 bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Display mapped activities grouped by day */}
      {days.map((dayObj, dayIndex) => (
        <div key={dayIndex}>
          <h1 className="text-6xl mb-8 mt-2 flex justify-center font-semibold text-[#E7B008] drop-shadow ">
            Day {dayObj.day}
          </h1>
          <div className="flex overflow-x-auto p-4 space-x-8">
            {dayObj.activities.map((activity, activityIndex) => (
              <div key={activityIndex} className="min-w-[25rem]">
                <TempActivityCard
                  img={duckie}
                  name={activity.name}
                  description={activity.description}
                  startTime={activity.startTime}
                  endTime={activity.endTime}
                  location={activity.location}
                  onDelete={() => removeActivity(dayIndex, activityIndex)}
                  onUpdate={() => openUpdateModal(dayIndex, activityIndex)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SingleItineraryPage;
