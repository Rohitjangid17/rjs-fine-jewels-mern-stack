import api from "./api";

export const cartService = {
    addToCart: async (product_data) => {
        const response = await api.post("/cart", product_data);
        return response.data;
    },
    getCartList: async () => {
        const response = await api.get("/cart");
        return response.data;
    },
    updateCartItem: async (cartId, quantity) => {
        const response = await api.put(`/cart?cart_id=${cartId}`, { quantity });
        return response.data;
    },
    removeCartItem: async (cartId) => {
        const response = await api.delete(`/cart?cart_id=${cartId}`);
        return response.data;
    }
};