/* eslint-disable react/prop-types */
import React, { createContext, useReducer, useContext } from "react";
import { addToCart, removeFromCart, getCart, updateCartItem } from "../components/cartPage/CartService";
const CartContext = createContext();

const initialState = {
    cartItems: [],
    loading: false,
    error: null,
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case "FETCH_CART":
            return { ...state, loading: true, error: null };
        case "FETCH_CART_SUCCESS":
            return { ...state, cartItems: action.payload, loading: false };
        case "FETCH_CART_ERROR":
            return { ...state, error: action.payload, loading: false };
        case "ADD_TO_CART_SUCCESS":
            return { ...state, cartItems: action.payload };
        case "REMOVE_FROM_CART_SUCCESS":
            return { ...state, cartItems: action.payload };
        case "UPDATE_CART_SUCCESS":
            return { ...state, cartItems: action.payload };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const fetchCart = async (userId) => {
        dispatch({ type: "FETCH_CART" });
        try {
            const cart = await getCart(userId);
            dispatch({ type: "FETCH_CART_SUCCESS", payload: cart });
        } catch (error) {
            dispatch({ type: "FETCH_CART_ERROR", payload: error.message });
        }
    };

    const addItemToCart = async (userId, productId, quantity) => {
        try {
            console.log("userId:", userId, "productId:", productId, "quantity:", quantity);
            const updatedCart = await addToCart(userId, productId, quantity);
            dispatch({ type: "ADD_TO_CART_SUCCESS", payload: updatedCart });
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const removeItemFromCart = async (userId, productId) => {
        try {
            const updatedCart = await removeFromCart(userId, productId);
            dispatch({ type: "REMOVE_FROM_CART_SUCCESS", payload: updatedCart });
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };
    const updateCart = async (userId, productId, quantity) => {
        try {
            const updatedCart = await updateCartItem(userId, productId, quantity);
            dispatch({ type: "UPDATE_CART_SUCCESS", payload: updatedCart });
        } catch (error) {
            console.error("Error updating item from cart:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartState: state,
                fetchCart,
                addItemToCart,
                removeItemFromCart,
                updateCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
