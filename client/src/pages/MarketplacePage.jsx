import { useState, useEffect } from "react";
import ProductCard from "@/components/marketplacePage/ProductCard";
import Banner from "../components/shared/BannerV2";
import BannerImage from "/assets/images/homeBanner.png";

import { Button } from "@/components/ui/button";
import SearchBar from "@/components/shared/SearchBar";
import axios from "axios";
import PriceSlider from "../components/shared/PriceSlider";
import { useUser } from "@/context/UserContext";
import Loading from "@/components/shared/Loading";
import { FilterDialog } from "@/components/shared/FilterDialog";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { Filter } from "lucide-react";
export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const { prefCurrency, userType } = useUser();
  const [maxPrice, setMaxPrice] = useState(null); // Start as null until it's fetched
  const [priceRange, setPriceRange] = useState([0, 100000000]); // Applied price range
  const [sliderRange, setSliderRange] = useState([0, 100000000]); // Temporary slider range
  const [selectedFilters, setSelectedFilters] = useState({});
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

  const handleApplyFilters = (appliedFilters) => {
    if (appliedFilters.price) {
      setPriceRange(appliedFilters.price); // Update the price range
    }
    setSelectedFilters(appliedFilters); // Update other filters
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setPriceRange([0, maxPrice]); // Reset price range to full range
    setSliderRange([0, maxPrice]); // Reset slider range
  };

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
      component: ({ priceRange, handlePriceChange }) => (
        <PriceSlider
          min={0}
          max={maxPrice || 100000000}
          priceRange={priceRange}
          handlePriceChange={handlePriceChange}
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
        <FilterDialog
          triggerIcon={<Filter />}
          title="Filter Products"
          description="Apply filters to find the best products for you."
        >
          <FilterPanel
            filters={filterConfig}
            onApply={handleApplyFilters}
            fetchMaxPrice={fetchMaxPrice}
          />
        </FilterDialog>
        <Button onClick={handleClearFilters} variant="outline">
          Clear Filters
        </Button>
      </div>

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
