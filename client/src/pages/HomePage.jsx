import React, { useState, useEffect } from "react";
import ProductCard from "@/components/marketplacePage/ProductCard";
import Activitiesbackground from "/assets/images/Background.jpg";
import BannerImage from "/assets/images/homeBanner.png";
import Banner from "../components/shared/BannerV2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/shared/SearchBar";
import axios from "axios";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [preferedFirstCategory] = "";
  const [preferedSecondCategory] = "";
  const [preferedFirstTag] = "";
  const [preferedSecondTag] = "";
  const [activities, setActivities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [itineraries, setItineraries] = useState([]);

  const products = [
    {
      img: Activitiesbackground,
      name: "Sample Product 1",
      seller: "Amazon",
      rating: 2,
      reviewsCount: 25,
      price: "99.99",
      description: "This is a sample product",
    },
    {
      img: Activitiesbackground,
      name: "Another Product",
      seller: "BestBuy",
      rating: 4.5,
      reviewsCount: 15,
      price: "199.99",
      description: "Another product example",
    },
    {
      img: Activitiesbackground,
      name: "Another Product",
      seller: "BestBuy",
      rating: 4.5,
      reviewsCount: 15,
      price: "199.99",
      description: "Another product example",
    },
    {
      img: Activitiesbackground,
      name: "Another Product",
      seller: "BestBuy",
      rating: 4.5,
      reviewsCount: 15,
      price: "199.99",
      description: "Another product example",
    },
    {
      img: Activitiesbackground,
      name: "Another Product",
      seller: "BestBuy",
      rating: 4.5,
      reviewsCount: 15,
      price: "199.99",
      description: "Another product example",
    },
    {
      img: Activitiesbackground,
      name: "Another Product",
      seller: "BestBuy",
      rating: 4.5,
      reviewsCount: 15,
      price: "199.99",
      description: "Another product example",
    },
    {
      img: Activitiesbackground,
      name: "Another Product",
      seller: "BestBuy",
      rating: 4.5,
      reviewsCount: 15,
      price: "199.99",
      description: "Another product example",
    },
    {
      img: Activitiesbackground,
      name: "Another Product",
      seller: "BestBuy",
      rating: 4.5,
      reviewsCount: 15,
      price: "199.99",
      description: "Another product example",
    },
    {
      img: Activitiesbackground,
      name: "Another Product",
      seller: "BestBuy",
      rating: 4.5,
      reviewsCount: 15,
      price: "199.99",
      description: "Another product example",
    },
    {
      img: Activitiesbackground,
      name: "Another Product",
      seller: "BestBuy",
      rating: 4.5,
      reviewsCount: 15,
      price: "199.99",
      description: "Another product example",
    },
  ];


  useEffect(() => {
    const fetchActivites = async () => {
      try {
        const response = await axios.post("/api/activity/filterSort",
          {
            category: preferedFirstCategory, category2: preferedSecondCategory,
            tags: preferedFirstTag, tags2: preferedSecondTag
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
        buttons[1].options = fetchedCategories.data.map((category) => category.name);

      } catch (error) {
        console.error(error);
      }
    };

    fetchActivites();
    fetchData();

  }, [searchTerm, minPrice, maxPrice, selectedFilters, selectedTags, count, selectedRange]);



  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col px-16">
      <div className="relative mb-6">
        {/* Banner Section */}
        <Banner
          background={BannerImage}
          alt="Hustling market"
          name="Live your dream destinations."
          textAlign="left"
          description="Odio eu consectetur ornare congue non enim pellentesque eleifend ipsum."
        />

        {/* Search Bar Section - Positioned on top of the banner */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Look for something fun to do!"} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-8 py-8 justify-center">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard
              key={index}
              img={product.img}
              alt={product.name}
              name={product.name}
              seller={product.seller}
              rating={product.rating}
              reviewsCount={product.reviewsCount}
              price={product.price}
              description={product.description}
            />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}
