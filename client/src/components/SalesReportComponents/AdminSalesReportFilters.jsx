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
import AdminMultiselectProductsDropdown from "./AdminMultiselectProductsDropdown";

AdminSalesReportFilters.propTypes = {
  setReportFilters: PropTypes.func,
};

export default function AdminSalesReportFilters({setReportFilters }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  

  useEffect(() => {
    setReportFilters({
      products: selectedProducts.map((product) => product.title),
      minDate: startDate,
      maxDate: endDate,
    });
  }, [
    selectedProducts,
    startDate,
    endDate,
    setReportFilters,
  ]);


  //fetch all products available for the select menu
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setFetchedProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
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

        <AdminMultiselectProductsDropdown
          options={fetchedProducts}
          selectedOptions={selectedProducts}
          setSelectedOptions={setSelectedProducts}
        />
      </div>
    )
  );
}
