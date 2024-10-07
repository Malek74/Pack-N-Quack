import React, { useEffect, useState } from "react";
import ItineraryCard from "./components/ItineraryCard";
import Banner from "./components/BannerV2";
import BannerImage from "../assets/romanBanner.jpg";
import { Button } from "@/components/ui/button";
import AddActivity from "./components/AddActivity";
import SearchBar from "@/components/SearchBar";
import FilterButton from "@/components/FilterButtons";
import Multiselect from "multiselect-react-dropdown";
import DateInput from "./components/DateInput";
import axios from "axios";

const ItinerariesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itinerariesDB, setItinerariesDB] = useState([]);
  const [dates, setDates] = useState([]); //stores dates array of input
  const [itineraryDeleted, setItineraryDeleted] = useState([]);
  const [itineraryCreated, setItineraryCreated] = useState([]);
  const [itineraryUpdate, setItineraryUpdate] = useState([]);
  const [itineraryUpdatingID, setItineraryUpdatingID] = useState("");
  const [updateActivityList, setUpdateActivityList] = useState([]);

  const onUpdateActivity = (dayNumber) => {};

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("/api/itinerary/");
        console.log(response.data);
        setItinerariesDB(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItineraries();
  }, [itineraryDeleted, itineraryCreated, itineraryUpdate]);

  const [tags, setTags] = useState([]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("/api/itiernaryTags");
        console.log(response.data);
        setTags(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`/api/itinerary/${id}`)
      .then((response) => {
        setItineraryDeleted(response.data); // Update the deletion state
        console.log("Deleted itinerary:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting itinerary:", error);
      });
  };

  const buttons = [
    {
      type: "Sort By", // This will create a "Sort By" dropdown
      options: [
        { label: "Price Low To High", value: "price-low-to-high" },
        { label: "Price High To Low", value: "price-high-to-low" },
      ],
    },
    {
      type: "Price", // This will create a "Filter By" dropdown
      options: [
        { label: "EGP 0-100", value: "EGP 0-100" },
        { label: "EGP 100-200", value: "EGP 100-200" },
        { label: "EGP 200-300", value: "EGP 200-300" },
        { label: "EGP 300-400", value: "EGP 300-400" },
        { label: "EGP 400-500", value: "EGP 400-500" },
        { label: "More than EGP 500", value: "More than EGP 500" },
      ],
    },
    {
      type: "Date",
      options: [
        { label: "In the next week", value: "In the next week" },
        { label: "In the next 2 weeks", value: "In the next 2 weeks" },
        { label: "In the next 1 month", value: "In the next 1 month" },
        { label: "In the next 6 months", value: "In the next 6 months" },
        { label: "In the next 1 year", value: "In the next 1 year" },
      ],
    },
    {
      type: "Language",
      options: [
        { label: "English", value: "English" },
        { label: "Arabic", value: "Arabic" },
        { label: "Russian", value: "Russian" },
      ],
    },
    {
      type: "Preferences",
      options: [
        ...tags.map((tag) => ({
          label: tag.tag,
          value: tag.tag,
        })),
      ],
    },
    {
      type: "Ratings",
      options: [
        { label: "1 star and more", value: "1 star and more" },
        { label: "2 stars and more", value: "2 stars and more" },
        { label: "3 stars and more", value: "3 stars and more" },
        { label: "4 stars and more", value: "4 stars and more" },
        { label: "5 stars", value: "5 stars" },
      ],
    },
  ];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    language: "",
    accessibility: "",
    pickUpLocation: "",
    dropOffLocation: "",
    tags: [],
    days: [],
    dates: [],
    tourGuideID: "66fb241366ea8f57d59ec6db",
  });

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Flag to check if updating or adding
  const [currentIndex, setCurrentIndex] = useState(null); // To keep track of which itinerary is being updated

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addItinerary = () => {
    // setItineraries([formData]);

    formData.dates = dates;
    formData.days = activitiesByDay;
    formData.tags = selectedTags;
    formData.tourGuideID = "66fb241366ea8f57d59ec6db";
    console.log(formData);

    axios
      .post("/api/itinerary/", formData) // Pass formData directly as the second argument
      .then((response) => {
        console.log("Itinerary added:", response.data); // Handle successful response
        setItineraryCreated(response.data);
      })
      .catch((error) => {
        console.error("There was an error adding the itinerary:", error); // Handle errors
      });

    resetForm();
  };

  const updateItinerary = () => {
    formData.dates = dates;
    formData.days = activitiesByDay;
    formData.tags = selectedTags;
    formData.tourGuideID = "66fb241366ea8f57d59ec6db";

    console.log(formData);

    axios
      .put(`/api/itinerary/${itineraryUpdatingID}`, formData) // Pass formData directly as the second argument
      .then((response) => {
        console.log(response.data);
        setItineraryUpdate(response.data);
      })
      .catch((error) => {
        console.error("There was an error adding the itinerary:", error); // Handle errors
      });
    resetForm();
  };

  const handleSelectTags = (selectedList) => {
    const tagsString = selectedList.map((tag) => `#${tag}`).join(" ");
    setFormData((prevData) => ({
      ...prevData,
      tags: tagsString,
    }));
  };

  // Function to handle when an option is removed
  const handleRemoveTags = (selectedList) => {
    const tagsString = selectedList.map((tag) => `#${tag}`).join(" ");
    setFormData((prevData) => ({
      ...prevData,
      tags: tagsString,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      language: "",
      accessibility: "",
      pickUpLocation: "",
      dropOffLocation: "",
      days: [],
      tags: "",
      dates: [],
      direction: "flex-row",
    });
    setDates([]);
    setActivitiesByDay([]);
    setSelectedTags([]);
    setShowModal(false);
    setIsUpdating(false);
    setCurrentIndex(null);
  };

  // const removeItinerary = (index) => {
  //   const updatedItineraries = itineraries.filter((_, i) => i !== index);
  //   setItineraries(updatedItineraries);
  // };

  // Function to handle the update button click
  const openUpdateModal = (index, id) => {
    setItineraryUpdatingID(id);
    setFormData({ ...itinerariesDB[index], title: itinerariesDB[index].name }); // Pre-fill the form with the itinerary data
    setCurrentIndex(index); // Set the current index of the itinerary being updated
    setIsUpdating(true); // Set the flag to updating
    setShowModal(true); // Show the modal
  };

  const [activitiesByDay, setActivitiesByDay] = useState([]);

  const handleAddActivity = (dayNumber, newActivity) => {
    // Find if the day already exists
    const dayIndex = activitiesByDay.findIndex(
      (daySearchIndex) => daySearchIndex.day === parseInt(dayNumber)
    );

    if (dayIndex !== -1) {
      // If the day exists, append the new activity
      const updatedActivities = activitiesByDay;
      updatedActivities[dayIndex].activities.push(newActivity);
      setActivitiesByDay(updatedActivities);
    } else {
      // If the day doesn't exist, create a new day object
      const newDay = {
        day: parseInt(dayNumber),
        activities: [newActivity],
      };
      setActivitiesByDay([...activitiesByDay, newDay]);
    }
    console.log(activitiesByDay);
  };

  const [selectedTags, setSelectedTags] = useState([]);
  const handleSelect = (selectedList) => {
    setSelectedTags(selectedList);
    // Log or perform other actions with the selected tags
  };

  const handleRemove = (selectedList) => {
    setSelectedTags(selectedList);
    // Log or perform other actions with the updated tags
  };

  return (
    <div className="flex flex-col gap-y-10 py-8 px-[5.6rem]">
      <div className="relative mb-6">
        <Banner background={BannerImage} name="Itineraries" />
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Look for something fun to do!"}
        />
      </div>

      <div className="flex">
        <span className="ml-18">
          {" "}
          <FilterButton buttons={buttons} />
        </span>
        {/* <span className="ml-auto mr-18"><SearchComponent></SearchComponent></span> */}
      </div>

      <div className="w-full flex justify-center">
        <Button
          onClick={() => setShowModal(true)}
          className="my-4 bg-gray-300 text-white p-2 rounded w-full hover:bg-gray-400"
        >
          Add Itinerary
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="font-bold mb-2">
              {isUpdating ? "Update Itinerary" : "Add New Itinerary"}
            </h3>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="mb-2 p-2 border rounded w-full"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              placeholder="Language"
              className="mb-2 p-2 border rounded w-full"
            />

            <Multiselect
              className="w-full mb-2"
              isObject={false} // Set to true if using objects instead of strings
              options={tags.map((tag) => tag.tag)} // Populate options with tag names
              onSelect={handleSelect} // Callback when tags are selected
              onRemove={handleRemove} // Callback when tags are removed
              selectedValues={selectedTags} // Set the currently selected tags
              displayValue="tag" // Set display value (if using objects)
            />
            <input
              type="text"
              name="accessibility"
              value={formData.accessibility}
              onChange={handleInputChange}
              placeholder="Accessibility"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              name="pickUpLocation"
              value={formData.pickUpLocation}
              onChange={handleInputChange}
              placeholder="Pick up location"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              name="dropOffLocation"
              value={formData.dropOffLocation}
              onChange={handleInputChange}
              placeholder="Drop off location "
              className="mb-2 p-2 border rounded w-full"
            />

            <DateInput dates={dates} setDates={setDates} />

            <div className="flex flex-row justify-between">
              <Button onClick={isUpdating ? updateItinerary : addItinerary}>
                {isUpdating ? "Update Itinerary" : "Add Itinerary"}
              </Button>

              <AddActivity
                className
                showModal={showActivityModal}
                setShowModal={setShowActivityModal}
                onSubmit={handleAddActivity}
              />

              <Button
                onClick={resetForm}
                className="ml-2 bg-gray-500 hover:bg-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {itinerariesDB.map((itinerary, index) => (
        <ItineraryCard
          id={itinerary._id}
          key={itinerary._id}
          direction={index % 2 === 0 ? "flex-row" : "flex-row-reverse"}
          title={itinerary.name}
          description={itinerary.description}
          price={itinerary.price}
          language={itinerary.language}
          accessibility={itinerary.accessibility}
          pickUpLocation={itinerary.pickUpLocation}
          dropOffLocation={itinerary.dropOffLocation}
          days={itinerary.days}
          availableDates={itinerary.available_dates}
          tags={itinerary.tags}
          rating={itinerary.ratings.averageRating}
          onDelete={() => {
            handleDelete(itinerary._id);
          }} // Pass the delete function
          onUpdate={() => {
            openUpdateModal(index, itinerary._id);
          }} // Pass the update function
        />
      ))}
      {/* {itineraries.map((itinerary, index) => (
        <ItineraryCard 
          key={index}
          direction={index % 2 === 0 ? "flex-row" : "flex-row-reverse"}
          title={itinerary.title}
          description={itinerary.description}
          price={itinerary.price}
          language={itinerary.language}
          accessibility={itinerary.accessibility}
          pickUpLocation={itinerary.pickUpLocation}
          dropOffLocation={itinerary.dropOffLocation}
          tags={itinerary.tags}
          onDelete={() => removeItinerary(index)} // Pass the delete function
          onUpdate={() => openUpdateModal(index)} // Pass the update function
        />
      ))} */}
    </div>
  );
};

export default ItinerariesPage;
