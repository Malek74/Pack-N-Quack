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
import { useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
const Cart = () => {
    const { fetchCart, cartState } = useCart();
    const { cartItems } = cartState;
    const userId = useUser().userId;
    const prefCurrency = useUser().prefCurrency;
    const cart = useLocation().pathname === "/cart" ? true : false;
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
            <h1 className="text-3xl font-bold text-center my-8">Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="flex justify-center"> <Loading /> </div>
            ) : (
                <>
                    <div className="mx-16">
                        <div className="grid grid-rows-1 gap-8 mb-12 justify-start">
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
                    <div className="flex justify-between">
                        <span className="text-2xl mx-16 my-8 font-bold"> Your Total:</span>
                        <span className="text-2xl mx-16 my-8 mr-20 "> {prefCurrency}{" "}{cartItems.reduce((total, item) => total + item.productID.price * item.quantity, 0)}</span></div>
                    <div className="flex justify-end  ">
                        {cart && <Button className="mr-20 mb-12 w-40 h-12 text-xl hover:bg-goldhover bg-gold" onClick={() => { window.location.href = "/checkout" }}>Checkout</Button>}
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
