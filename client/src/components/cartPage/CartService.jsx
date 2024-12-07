import axios from "axios";

// Add item to cart
export const addToCart = async (userId, productId, quantity) => {
    try {
        const response = await axios.post(`/api/tourist/cart/addItemToCart/${userId}`, {
            productID: productId,
            quantity: quantity,
        });
        return response.data; // Return the updated cart data
    } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error; // Let the caller handle the error
    }
};

// Remove item from cart
export const removeFromCart = async (userId, productId) => {
    try {
        console.log("userId:", userId, "productId:", productId);
        const response = await axios.delete(`/api/tourist/cart/removeItemFromCart/${userId}/${productId}`);
        return response.data; // Return the updated cart data
    } catch (error) {
        console.error("Error removing item from cart:", error);
        throw error;
    }
};

// Get cart details
export const getCart = async (userId) => {
    try {
        const response = await axios.get(`/api/tourist/cart/viewCart/${userId}`);
        return response.data; // Return the cart details
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

export const updateCartItem = async (userId, productId, quantity) => {
    try {
        const response = await axios.put(`/api/tourist/cart/updateQuantity/${userId}`, {
            productID: productId,
            quantity: quantity,
        }); return response.data; // Return the cart details
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};