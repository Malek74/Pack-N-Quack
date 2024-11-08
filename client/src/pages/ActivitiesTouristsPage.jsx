import { useState, useEffect } from "react";
import ActivityCard from "@/components/activityPage/ActivityCard";
import Activitiesbackground from "/assets/images/Background.jpg";
import Banner from "@/components/shared/BannerV2";
import FilterButton from "@/components/shared/FilterButtons";
import SearchBar from "@/components/shared/SearchBar";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import { Input } from "@/components/ui/input";

export default function Activities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState([]);
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

  useEffect(() => {
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

    fetchActivites();
    fetchData();
  }, [
    searchTerm,
    minPrice,
    maxPrice,
    selectedFilters,
    selectedTags,
    count,
    selectedRange,
  ]);

  return (
    <div className="flex flex-col  w-screen py-14 px-[5.6rem]">
      {/* <Banner
                background={Activitiesbackground}
                alt="Activities Background"
                name="ACTIVITIES"
            /> */}

      <div className="relative mb-10">
        {/* Banner Section */}
        <Banner
          background={Activitiesbackground}
          alt="Activities Background"
          name="ACTIVITIES"
        />

        {/* Search Bar Section - Positioned on top of the banner */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Look for an activity.."}
        />
      </div>

      {/* <div className="flex justify-center items-center mt-[-60px] w-full">

                <div className="w-[60%] bg-white rounded-lg p-4 shadow-lg flex justify-center items-center">
                    <Input
                        placeholder="Search product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 rounded-md w-full border-0"
                    />
                    <Button className="bg-yellow-500 text-white p-3 rounded-md ml-4">
                        Search
                    </Button>
                </div>
            </div> */}

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

      <h1 className="text-5xl text-skyblue stroke-2 stroke-black font-bold mb-24 self-center">
        Upcoming Actvities
      </h1>

      <div className="grid grid-cols-3 justify-stretch w-screen self-center gap-y-10">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.activityID}
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
            notTourist={false}
            booking={activity.isBookingOpen}
            discounts={activity.specialDiscounts}
            rating={activity.ratings.averageRating}
          />
        ))}
      </div>
    </div>
  );
}
