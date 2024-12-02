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
import MultiselectDropdown from "@/components/shared/MultiselectDropdown";

SalesReportFilters.propTypes = {
  setReportFilters: PropTypes.func,
};

export default function SalesReportFilters({ setReportFilters }) {
  const [isLoading, setIsLoading] = useState(true);

  const [sortSelectorValue, setSortSelectorValue] = useState("");

  const [fetchedItineraryTags, setFetchedItineraryTags] = useState([]);
  const [fetchedLanguages, setFetchedLanguages] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  //const [selectedTag, setSelectedTag] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [order, setOrder] = useState();
  const [sortBy, setSortBy] = useState();

  useEffect(() => {
    setReportFilters({
      language: selectedLanguage,
      tags: selectedTags.map((tag) => tag.tag),
      minBudget: minBudget,
      maxBudget: maxBudget,
      minDate: startDate,
      maxDate: endDate,
      order: order,
      sortBy: sortBy,
    });
  }, [
    selectedLanguage,
    selectedTags,
    minBudget,
    maxBudget,
    startDate,
    endDate,
    order,
    sortBy,
    setReportFilters,
  ]);

  useEffect(() => {
    const fetchItineraryTags = async () => {
      try {
        const response = await axios.get("/api/itiernaryTags");
        setFetchedItineraryTags(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchItineraryLanguages = async () => {
      try {
        const response = await axios.get("/api/itinerary/languages");
        setFetchedLanguages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItineraryLanguages();
    fetchItineraryTags();
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
        <div className="flex flex-col">
          <Input
            type="number"
            id="min-budget"
            placeholder="Enter Minimum Budget"
            min="0"
            step="1"
            className="w-full"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Input
            type="number"
            id="max-budget"
            placeholder="Enter Maximum Budget"
            min="0"
            step="1"
            className="w-full"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
          />
        </div>

        <Select
          value={selectedLanguage}
          onValueChange={(value) =>
            setSelectedLanguage(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              <SelectItem value="all">Any</SelectItem>
              {fetchedLanguages.map((language, index) => (
                <SelectItem key={index} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <MultiselectDropdown
          options={fetchedItineraryTags}
          selectedOptions={selectedTags}
          setSelectedOptions={setSelectedTags}
        />

        <Select
          value={sortSelectorValue}
          onValueChange={(value) => {
            setSortSelectorValue(value);
            switch (value) {
              case "priceAsc":
                setSortBy("price");
                setOrder("asc");
                break;
              case "priceDesc":
                setSortBy("price");
                setOrder("desc");
                break;
              case "ratingAsc":
                setSortBy("ratings.averageRating");
                setOrder("asc");
                break;
              case "ratingDesc":
                setSortBy("ratings.averageRating");
                setOrder("desc");
                break;
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sorting Options</SelectLabel>
              <SelectItem value="priceAsc">Price Low to High</SelectItem>
              <SelectItem value="priceDesc">Price High to Low</SelectItem>
              <SelectItem value="ratingAsc">Rating Low to High</SelectItem>
              <SelectItem value="ratingDesc">Rating High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    )
  );
}
