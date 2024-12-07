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
import QuantityInput from "@/components/shared/QuantityInput";
export default function ProductCard(props) {

  const { prefCurrency } = useUser();
  const { toast } = useToast();
  const isSeller = props.userType === "seller" ? true : false;
  const touristId = "674641df1887b9c3e11436c4";
  const [isWishlisted, setWishlisted] = useState(false);
  const { addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItemToCart(touristId, props.id, quantity);
  };
  const wishlistAdd = (id) => {
    try {
      console.log(id);
      axios
        .post(`api/tourist/wishlist/${touristId}`, { productID: id })
        .then(() => {
          setWishlisted(true);
          toast({
            title: "Product added to wishlist!",
          });
        })
        .catch((error) => {
          console.error(error);
          toast({
            text: "Failed to add product to wishlist",
            variant: "destructive", // Error variant
          });
        });
    } catch (error) {
      console.error(error);
    }
  }

  const wishlistRemove = (id) => {
    try {
      console.log(id);
      axios
        .delete(`api/tourist/wishlist/${touristId}/${id}`)
        .then(() => {
          setWishlisted(false);
          toast({
            title: "Product removed from wishlist!",
          });
        })
        .catch((error) => {
          console.error(error);
          toast({
            text: "Failed to remove product from wishlist",
            variant: "destructive", // Error variant
          });
        });
    } catch (error) {
      console.error(error);
    }
  }

  const deleteClicked = (id) => {
    axios
      .delete(`api/products/delete/${id}`)
      .then(() => {
        toast({
          title: "Product deleted succesfully!",
        });
        props.onRefresh(); // Refresh the products list after deletion
      })
      .catch((error) => {
        console.error(error);
        toast({
          text: "Failed to delete product",
          variant: "destructive", // Error variant
        });
      });
  };

  // useEffect(() => {
  //   checkWishlist(props.id);
  // }, [props.id, isWishlisted]);


  return (
    <div className="rounded-xl w-[20rem] h-[25rem] shadow-md relative overflow-hidden">
      {/* Image Section */}
      <img
        className="w-full h-[11rem] object-cover rounded-t-lg"
        src={props.img}
        alt={props.alt}
      />
      {!isSeller && (
        <div className="absolute top-4 right-4 flex gap-2">
          <WishlistButton id={props.id} wishlistAdd={wishlistAdd} wishlistRemove={wishlistRemove} wishlisted={isWishlisted} touristId={touristId} />
        </div>
      )}
      {/* Button Section */}
      {isSeller && (
        <div className="absolute top-4 right-4 flex gap-2">
          <DeleteButton
            onConfirm={() => deleteClicked(props.id) + props.onRefresh()}
          />
          <EditProductDialog
            className="w-14 absolute bg-transparent"
            product={{
              _id: props.id,
              name: props.name,
              price: props.price,
              description: props.description,
              available_quantity: props.available_quantity,
            }}
            onRefresh={props.onRefresh}
          />
        </div>
      )}

      {/* Product Info Section */}
      <div className="flex flex-col gap-2 p-5">
        <div>
          {/* Product Name Section with fixed height */}
          <h1 className="flex">
            <span className="font-semibold text-xl mr-auto mb-0 h-14 overflow-hidden line-clamp-2">
              {props.name}
            </span>
          </h1>
          <h2 className="text-gray-500">{props.seller}</h2>
        </div>
        <Rating
          rating={props.rating}
          size="medium"
          numberOfReviews={props.reviewsCount}
        />
        <h4 className="text-base line-clamp-2">{props.description}</h4>
        <h4 className="flex">
          <span className="text-xl text-[#71BCD6] drop-shadow mr-auto">
            {prefCurrency}
            {props.price}
          </span>
          <span className="flex items-end">
            {/* <Input className="text-center w-12 " type="number" defaultValue={1}></Input> */}
            <QuantityInput setQuantity={setQuantity} quantity={quantity} />
            <Button className=" w-14 p-0  text-black hover:bg-gold hover:text-white bg-transparent self-end place-self-end" onClick={handleAddToCart}><ShoppingCart className="m-0 p-0 " /></Button>

          </span>
        </h4>

      </div>
    </div>
  );
}
