/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { EditProductDialog } from "../editButtonsWillBeReusedLater/EditProduct";
import { Rating } from "../shared/Rating";
import DeleteButton from "../shared/DeleteButton";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import WishlistButton from "../layout/components/WishlistButton";
import { useCart } from "@/context/CartContext";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { Input } from "../ui/input";
import { Pencil } from "lucide-react";
import QuantityInput from "@/components/shared/QuantityInput";
export default function CartCard(props) {

    const { prefCurrency } = useUser();
    const { toast } = useToast();
    const isSeller = props.userType === "seller" ? true : false;
    const touristId = "674641df1887b9c3e11436c4";
    const [isWishlisted, setWishlisted] = useState(false);
    const { addItemToCart } = useCart();
    const [quantity, setQuantity] = useState(props.quantity);
    const { removeItemFromCart, updateCart } = useCart();
    const userId = "674641df1887b9c3e11436c4";


    const deleteClicked = (id) => {
        removeItemFromCart(userId, id);

    };

    const handleUpdate = (id, quantity) => {
        updateCart(userId, id, quantity);
    }

    return (<div className="rounded-xl w-[40rem] h-[10rem]  shadow-md flex relative overflow-hidden">

        {/* Product Image Section */}
        <div className="w-1/3 h-full bg-gray-200">
            {/* Placeholder for image */}
            <img src={props.imageUrl} alt={props.name} className="object-cover w-full h-full" />
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col justify-between w-2/3 p-5">
            {/* Top Section: Product Name, Seller, and Buttons */}
            <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold line-clamp-2">{props.name}</h1>
                    <h2 className="text-gray-500">{props.seller}</h2>
                </div>
                <div className="flex gap-2">
                    <DeleteButton
                        onConfirm={() => deleteClicked(props.id) + props.onRefresh()}
                    />
                </div>
            </div>

            {/* Middle Section: Rating and Description */}
            <div className="flex flex-col gap-2">
                <Rating
                    rating={props.rating}
                    size="medium"
                    numberOfReviews={props.reviewsCount}
                />
                <p className="text-sm text-gray-600 line-clamp-2">{props.description}</p>
            </div>

            {/* Bottom Section: Price and Quantity */}
            <div className="flex justify-between items-center">
                <span className="text-xl text-[#71BCD6] drop-shadow">
                    {prefCurrency}
                    {props.price}
                </span>
                <div className="flex items-center gap-2">
                    <QuantityInput setQuantity={setQuantity} quantity={quantity} />
                    <Button
                        className="w-12 h-12 p-0 text-black hover:bg-gold hover:text-white bg-transparent flex items-center justify-center"
                        onClick={() => handleUpdate(props.id, quantity)}
                    >
                        <Pencil className="m-0 p-0" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
    );
}
