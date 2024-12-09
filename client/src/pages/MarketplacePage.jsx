import { useState, useEffect } from "react";
import ProductCard from "@/components/marketplacePage/ProductCard";
import Banner from "../components/shared/BannerV2";
import BannerImage from "/assets/images/homeBanner.png";

import { Button } from "@/components/ui/button";
import SearchBar from "@/components/shared/SearchBar";
import axios from "axios";
import PriceSlider from "../components/shared/PriceSlider";
import CreateDialog from "@/components/shared/CreateDialog";
import ProductForm from "@/components/forms/ProductForm";
import { useUser } from "@/context/UserContext";
import Loading from "@/components/shared/Loading";
import { FilterButton } from "@/components/SalesReportComponents/FilterButton";
import { FilterDialog } from "@/components/shared/FilterDialog";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { Filter } from "lucide-react";
export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const { prefCurrency } = useUser();
  const [maxPrice, setMaxPrice] = useState(null); // Start as null until it's fetched
  const [priceRange, setPriceRange] = useState([0, 100000000]); // Applied price range
  const [sliderRange, setSliderRange] = useState([0, 100000000]); // Temporary slider range
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filters, setFilters] = useState({});

  const userType = "tourist";
  // Fetch products based on filters and search term
  const fetchProducts = () => {
    axios
      .get(
        `api/products?maxPrice=${priceRange[1]}&minPrice=${priceRange[0]}&sortBy=ratings.averageRating&order=${selectedFilters["Sort By Rating"]}&name=${searchTerm}&currency=${prefCurrency}&isArchived=false`
      )
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
        console.log(priceRange);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 26835438303
  // 14215076750
  // Fetch the maximum product price
  const fetchMaxPrice = () => {
    axios

      .get(`api/products/maxProductPrice?currency=${prefCurrency}`)
      .then((response) => {
        setMaxPrice(response.data + 200);
        setSliderRange([0, response.data]); // Set the range once maxPrice is fetched
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Re-fetch products when filters or search terms change
  useEffect(() => {
    if (maxPrice !== null) {
      fetchProducts(); // Fetch products after maxPrice is fetched
    }
  }, [searchTerm, maxPrice, priceRange, selectedFilters, prefCurrency]);

  // Fetch maxPrice when component mounts
  useEffect(() => {
    fetchMaxPrice();
  }, [prefCurrency]);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value, // Update the selected value based on the type
    }));
    console.log(type, value);
  };

  // Handle price change from the slider
  const handlePriceChange = (newRange) => {
    setSliderRange(newRange); // Temporarily update the slider range
  };

  // Apply the slider range to the actual price range on clicking "Apply"
  const applyPriceRange = () => {
    setPriceRange(sliderRange); // Apply the selected price range
  };

  let buttons = [
    {
      type: "Sort By Rating",
      options: [
        { label: "Ratings Low To High", value: "asc" },
        { label: "Ratings High To Low", value: "desc" },
      ],
    },
  ];
  const filterConfig = [
    {
      type: "dropdown",
      key: "rating",
      label: "Sort By Rating",
      options: [
        { label: "Ratings Low to High", value: "asc" },
        { label: "Ratings High to Low", value: "desc" },
      ],
    },
    {
      type: "range",
      key: "price",
      label: "Price Range",
      component: (
        <PriceSlider
          min={0}
          max={1000}
          priceRange={sliderRange}
          handlePriceChange={(newRange) => setSliderRange(newRange)}
        />
      ),
    },
  ];


  
  return (
    <div className="flex flex-col px-16">
      <div className="relative">
        {/* Banner Section */}
        <Banner
          background={BannerImage}
          alt="Hustling market"
          name="Marketplace"
        />
        <div>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={"Look for a product.."}
          />
        </div>
      </div>

      <div className="mt-8 flex">
        {/* <FilterButton buttons={buttons} onFilterChange={handleFilterChange} /> */}
        {/* <FilterButton */}
        <FilterDialog
        triggerIcon={<Filter />}
        title="Filter Products"
        description="Apply filters to find the best products for you."
      >
        <FilterPanel filters={filterConfig} setFilters={setFilters} />
      </FilterDialog>

        {/* {maxPrice !== null && (
          <div className="flex items-center justify-center">
            <PriceSlider
              min={0}
              max={maxPrice}
              priceRange={sliderRange} // Use the temporary slider range
              handlePriceChange={handlePriceChange} // Update slider range on change
            />
            <Button
              size="sm"
              onClick={applyPriceRange} // Apply the price range on click
              className="ml-2 rounded-md px-4 py-2"
            >
              Apply
            </Button>
          </div>
        )} */}

        
      </div>
      {userType === "seller" && (
        <CreateDialog
          title="Product"
          form={
            <ProductForm
              onRefresh={fetchProducts}
              adderId="6703ba52daf9eae5ef55344c"
            />
          }
        />
      )}

      <div className="grid grid-cols-1 place-items-center justify-center gap-8 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              img={product.picture}
              alt={product.name}
              available_quantity={product.available_quantity}
              name={product.name}
              seller={product.seller}
              rating={product.ratings.averageRating}
              reviewsCount={product.ratings.reviews.length}
              price={product.price}
              description={product.description}
              onRefresh={fetchProducts}
              userType={userType}
            />
          ))
        ) : (
          <div>
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}
