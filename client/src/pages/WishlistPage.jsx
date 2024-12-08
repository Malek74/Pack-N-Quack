import { useState, useEffect } from "react";
import ProductCard from "@/components/marketplacePage/ProductCard";
import Activitiesbackground from "/assets/images/Background.jpg";
import Banner from "../components/shared/BannerV2";
import BannerImage from "/assets/images/homeBanner.png";

import { Button } from "@/components/ui/button";
import SearchBar from "@/components/shared/SearchBar";
import axios from "axios";
import FilterButton from "@/components/shared/FilterButtons";
import PriceSlider from "../components/shared/PriceSlider";
import CreateDialog from "@/components/shared/CreateDialog";
import ProductForm from "@/components/forms/ProductForm";
import { useUser } from "@/context/UserContext";
import Loading from "@/components/shared/Loading";
export default function MarketplacePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const { prefCurrency } = useUser();
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(null); // Start as null until it's fetched
    const [priceRange, setPriceRange] = useState([0, 100000000]); // Applied price range
    const [sliderRange, setSliderRange] = useState([0, 100000000]); // Temporary slider range
    const [selectedFilters, setSelectedFilters] = useState({});
    const userType = "tourist";
    const touristId = "674641df1887b9c3e11436c4";
    const [loading, setLoading] = useState(true);
    const fetchWishlist = () => {
        try {
            setLoading(true);
            axios.get(`/api/tourist/wishlist`).then((response) => {
                setProducts(response.data);
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    26835438303
    14215076750
    // Fetch the maximum product price

    // Re-fetch products when filters or search terms change
    useEffect(() => {
        fetchWishlist(); // Fetch products after maxPrice is fetched

    });



    return (

        <div className="flex flex-col px-16 items-center mt-8">

            {loading && <Loading />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-8 py-8 justify-center">
                {products.length > 0 && (
                    products.map((product) => (
                        <ProductCard
                            key={product._id}
                            id={product._id}
                            img={product.picture}
                            alt={product.name}
                            available_quantity={product.available_quantity}
                            name={product.name}
                            seller={product.sellerUsername}
                            rating={product.ratings.averageRating}
                            reviewsCount={product.ratings.reviews.length}
                            price={product.price}
                            description={product.description}
                            onRefresh={fetchWishlist}
                            userType={userType}
                            wishlisted={true}
                        />
                    ))
                )}
            </div>
        </div>
    );
}