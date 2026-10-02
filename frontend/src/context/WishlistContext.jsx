import {
    createContext,
    useCallback,
    useState,
} from "react";
import { wishlistService } from "../services/wishlistService";

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Get wishlist
    const getWishlist = useCallback(async () => {
        try {
            setLoading(true);

            const response = await wishlistService.getWishlist();

            const products = response?.wishlist || [];

            setWishlist(products);
            setWishlistCount(products.length);

            return products;
        } catch (error) {
            setWishlist([]);
            setWishlistCount(0);

            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Add product to wishlist
    const addToWishlist = async (productId) => {
        try {
            setLoading(true);

            const response =
                await wishlistService.addToWishlist(productId);

            await getWishlist();

            return response;
        } finally {
            setLoading(false);
        }
    };

    // Remove product from wishlist
    const removeFromWishlist = async (productId) => {
        try {
            setLoading(true);

            const response =
                await wishlistService.removeFromWishlist(productId);

            await getWishlist();

            return response;
        } finally {
            setLoading(false);
        }
    };

    // Check product in wishlist
    const isInWishlist = (productId) => {
        return wishlist.some(
            (product) =>
                product?._id?.toString() === productId?.toString()
        );
    };

    // Add / Remove wishlist
    const toggleWishlist = async (productId) => {
        if (isInWishlist(productId)) {
            return removeFromWishlist(productId);
        }

        return addToWishlist(productId);
    };

    // Clear wishlist locally
    const clearWishlist = () => {
        setWishlist([]);
        setWishlistCount(0);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                wishlistCount,
                loading,

                getWishlist,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};