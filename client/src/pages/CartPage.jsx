// Cart.js
import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Button } from "../components/ui/button";
import ProductCard from "../components/marketplacePage/ProductCard";
import CartCard from "../components/cartPage/CartCard";
import Loading from "@/components/shared/Loading";
import Banner from "@/components/shared/Banner";
import BannerImage from "/assets/images/Background.jpg";
const Cart = () => {
    const { fetchCart, cartState } = useCart();
    const { cartItems } = cartState;
    const userId = "674641df1887b9c3e11436c4";

    // const handleRemove = (productId) => {
    //     removeItemFromCart(userId, productId);
    // };
    const fetchProducts = (userId) => {
        fetchCart(userId);
    }
    // const handleClearCart = () => {
    //     cartDispatch({ type: "CLEAR_CART" });
    // };

    useEffect(() => {
        fetchProducts(userId);
    }, []);

    return (
        <div>
            {/*
             <div className="flex flex-col px-16 mt-12">
                <div className="relative">
                    <Banner
                        background={BannerImage}
                        alt="Hustling market"
                        name="Your Cart"
                    />

                </div>
            </div> 
            */}
            {cartItems.length === 0 ? (
                <Loading />
            ) : (
                <>
                    <div className="mx-16">
                        <div className="grid grid-rows-1 gap-8 mb-12 justify-start">
                            <h1 className="text-3xl font-bold text-center my-8">Your Cart</h1>
                            {cartItems.map((item) => (

                                <CartCard
                                    key={item.productID._id}
                                    id={item.productID._id}
                                    quantity={item.quantity}
                                    name={item.productID.name}
                                    description={item.productID.description}
                                    price={item.productID.price}
                                    picture={item.productID.picture[0]}

                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end ">
                        <Button className="mr-16 mb-12 w-40 h-12 text-xl hover:bg-goldhover bg-gold" onClick={() => { window.location.href = "/checkout" }}>Checkout</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
