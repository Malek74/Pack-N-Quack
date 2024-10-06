import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Activitiesbackground from "../images/Background.jpg";
import Banner from "./components/BannerV2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/forms/ProductForm";
import CreateDialog from "@/components/CreateDialog";
import SearchBar from "@/components/SearchBar";
export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col px-16">
      <div className="relative">
        {/* Banner Section */}
        <Banner
          background={Activitiesbackground}
          alt="Hustling market"
          name="Marketplace"
        />

        {/* Search Bar Section - Positioned on top of the banner */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Look for a product.."}
        />
      </div>

      <div className="flex justify-center items-center mt-[-60px] w-full">
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
