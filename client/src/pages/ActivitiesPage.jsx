import { useState, useEffect } from "react";
import ActivityCard from "@/components/activityPage/ActivityCard";
import Activitiesbackground from "/assets/images/Background.jpg";
import Banner from "@/components/shared/BannerV2";
import CreateDialog from "@/components/shared/CreateDialog";
import ActivityForm from "@/components/forms/ActivityForm";
import axios from "axios";
import { useParams } from "react-router-dom";
import SearchBar from "@/components/shared/SearchBar";
import FilterButton from "@/components/shared/FilterButtons";
import Multiselect from "multiselect-react-dropdown";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import { Input } from "@/components/ui/input";
import Loading from "@/components/shared/Loading";
import GuideButton from "@/components/guideComponents/popMessage";
import { useUser } from "@/context/UserContext";
export default function Activities() {
  const { userId, userType } = useUser();
  const [activities, setActivities] = useState([]);
  const [activityDeleted, setActivityDeleted] = useState();
  const [activityUpdated, setActivityUpdated] = useState();
  const [activityCreated, setActivityCreated] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

  // Handler to update selected filter values
  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value, // Update the selected value based on the type
    }));
  };
  const handleDateChange = (date) => {
    setSelectedRange(date);
  };

  let buttons = [
    {
      type: "Sort By",
      options: [
        { label: "Price Low To High", value: "price-asc" },
        { label: "Price High To Low", value: "price-desc" },
        { label: "Ratings Low To High", value: "ratings-asc" },
        { label: "Ratings High To Low", value: "ratings-desc" },
      ],
    },

    {
      type: "Category",
      options: categories,
    },
    {
      type: "Ratings",
      options: [
        { label: "1 star and more", value: 1 },
        { label: "2 stars and more", value: 2 },
        { label: "3 stars and more", value: 3 },
        { label: "4 stars and more", value: 4 },
        { label: "5 stars", value: 5 },
      ],
    },
  ];

  let count = 0;

  let tourist = true;
  {
    userType === "Tourist" ? (tourist = true) : (tourist = false);
  }

  const addActivity = async (values) => {
    try {
      values.advertiserID = userId;
      const response = await axios.post(`/api/activity`, values);
      console.log("Created successfully:", response.data);
      setActivityCreated(response.data);
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  const deleteActivity = async (id) => {
    try {
      const response = await axios.delete(`/api/activity/delete/${id}`);
      console.log("Delete successful:", response.data);
      setActivityDeleted(response.data);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const editActivity = async (id, values) => {
    try {
      const response = await axios.put(`/api/activity/update/${id}`, values);
      console.log("Updated successfully:", response.data);
      setActivityUpdated(response.data);
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  useEffect(() => {
    const fetchMyActivites = async () => {
      try {
        const response = await axios.get(`/api/activity/my/`);
        setActivities(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchActivites = async () => {
      try {
        const response = await axios.post("/api/activity/filterSort", {
          name: searchTerm,
          budgetMin: minPrice,
          budgetMax: maxPrice,
          category: selectedFilters.Category,
          tags: selectedTags,
          sortPrice:
            selectedFilters["Sort By"] == "price-asc"
              ? 1
              : selectedFilters["Sort By"] == "price-desc"
                ? -1
                : 0,
          sortRating:
            selectedFilters["Sort By"] == "ratings-asc"
              ? 1
              : selectedFilters["Sort By"] == "ratings-desc"
                ? -1
                : 0,
          rating: selectedFilters.Ratings,
          dateMin: selectedRange.from,
          dateMax: selectedRange.to,
        });
        console.log(response.data);
        setActivities(response.data);
        console.log(selectedRange);

        console.log(selectedFilters["Sort By"]);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchData = async () => {
      try {
        const fetchedTags = await axios.get("/api/activity/tag");
        const fetchedCategories = await axios.get("/api/activity/category");
        setTags(fetchedTags.data);
        setCategories(fetchedCategories.data);
        buttons[1].options = fetchedCategories.data.map(
          (category) => category.name
        );
      } catch (error) {
        console.error(error);
      }
    };

    {
      userType === "Advertiser" ? fetchMyActivites() : fetchActivites();
    }
    fetchData();
  }, [
    searchTerm,
    minPrice,
    maxPrice,
    selectedFilters,
    selectedTags,
    count,
    selectedRange,
    activityDeleted,
    activityUpdated,
    activityCreated,
  ]);



  return (

    <div className="flex flex-col justify-center w-screen px-14 my-8">

      <div className="relative mb-6">
        {tourist ?
          <Banner
            background={Activitiesbackground}
            alt="Activities Background"
            name="ACTIVITIES"
          /> :
          <Banner
            background={Activitiesbackground}
            alt="Activities Background"
            name="MY ACTIVITIES"
          />}

        {tourist && (
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Look for an activity.."}
          />
        )}
      </div>
      {!tourist && (
        <div className="flex place-content-end mr-8">
          <CreateDialog
            title="an Activity"
            type="act"
            form={
              <ActivityForm type="act" createActivityFunction={addActivity} />
            }
          />
        </div>
      )}
      {tourist && (
        <div className="flex mb-10">
          <span className="ml-18">
            {" "}
            <FilterButton
              categories={categories}
              buttons={buttons}
              onFilterChange={handleFilterChange}
            />
          </span>
          <span>
            <Multiselect
              className="w-max"
              isObject={false}
              onSelect={(selectedList) => {
                setSelectedTags(selectedList);
                count = count + 1;
              }}
              onRemove={(selectedList) => {
                setSelectedTags(selectedList);
                count--;
              }}
              options={tags.map((tag) => tag.name)}
            />
          </span>
          <span>
            <Input
              placeholder="Min Price"
              value={minPrice}
              type="number"
              onChange={(e) => setMinPrice(e.target.value)} // Capture min price
            />
          </span>
          <span>
            <Input
              placeholder="Max Price"
              value={maxPrice}
              type="number"
              onChange={(e) => setMaxPrice(e.target.value)} // Capture max price
            />
          </span>

          <span>
            {" "}
            <DatePickerWithRange onDateChange={handleDateChange} />
          </span>
          <span>
            <Button onClick={() => console.log(searchTerm)} className="">
              Submit Filters
            </Button>
          </span>
          {/* <span className="ml-auto mr-18"><SearchComponent></SearchComponent></span> */}
        </div>
      )}
      <h1 className="text-5xl text-skyblue stroke-2 stroke-black font-bold mb-24 self-center">
        Upcoming Actvities
      </h1>
      {Array.isArray(activities) && activities.length == 0 &&
        <div className="flex justify-center items-center">
          <Loading size="xl" />
        </div>
      }
      <div className="grid grid-cols-3 justify-evenly w-screen self-center gap-y-10 px-10">
        {activities.map((activity) => (
          <ActivityCard
            key={activity._id}
            img={activity.coverImagePath}
            name={activity.name}
            category={activity.categoryID.name}
            time={activity.date}
            location={activity.location}
            googlemaps={activity.googleMapLink}
            priceType={activity.priceType}
            minPrice={activity.minPrice}
            maxPrice={activity.maxPrice}
            price={activity.price}
            tags={activity.tags}
            notTourist={!tourist}
            booking={activity.isBookingOpen}
            discounts={activity.specialDiscounts}
            rating={activity.ratings.averageRating}
            numberOfReviews={activity.ratings.reviews.length}
            activityID={activity._id}
            deleteActivityFunction={deleteActivity}
            updateActivityFunction={editActivity}
          />
        ))}
      </div>


      <GuideButton guideMessage={"Choose an activity card to explore your next adventure!"} />


    </div>
  );
}
