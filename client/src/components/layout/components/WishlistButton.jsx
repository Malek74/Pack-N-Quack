/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Heart from "react-heart";

const WishlistButton = ({ id, wishlistAdd, wishlistRemove, wishlisted, touristId }) => {
    const [wished, setWished] = useState(wishlisted);
    useEffect(() => {


        const checkWishlist = async () => {
            try {
                const response = await axios.get(`/api/tourist/wishlist/`);
                const isWishlisted = response.data.some((product) => product._id === id);
                setWished(isWishlisted); // Update the state based on the check
                console.log(isWishlisted);
            } catch (error) {
                console.error("Error checking wishlist:", error);
            }
        };

        checkWishlist();
    }, [id, touristId, wishlisted]);
    const handleClick = () => {
        setWished(!wished);
        if (!wished)
            wishlistAdd(id); // Trigger your wishlist logic
        else
            wishlistRemove(id);
    };

    return (
        <div
            style={{
                width: "1.8rem",
                cursor: "pointer",
                marginTop: "0.25rem",
            }}
            onClick={handleClick}
        >
            <Heart
                isActive={wished}
                animationTrigger="hover" // Triggers animation on hover
                inactiveColor="rgba(0,0,0,1)" // Black when inactive
                activeColor="red" // Red when active
                animationDuration={0.1} // Animation duration
                animationScale={1.2} // Optional: scale effect on hover
                style={{ transition: "all 0.1s ease-in-out" }} // Smooth hover effect
            />
        </div>

    );
};

export default WishlistButton;
