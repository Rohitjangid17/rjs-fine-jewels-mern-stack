import api from "./api";

export const wishlistService = {
    // Add product to wishlist
    addToWishlist: async (productId) => {
        const response = await api.post("/wishlist", {
            productId,
        });

        return response.data;
    },

    // Get complete wishlist
    getWishlist: async () => {
        const response = await api.get("/wishlist");

        return response.data;
    },

    // Check product in wishlist
    checkWishlist: async (productId) => {
        const response = await api.get(
            `/wishlist?product_id=${productId}`
        );

        return response.data;
    },

    // Remove product from wishlist
    removeFromWishlist: async (productId) => {
        const response = await api.delete(
            `/wishlist?product_id=${productId}`
        );

        return response.data;
    },
};