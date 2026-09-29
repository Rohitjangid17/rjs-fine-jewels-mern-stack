import {
    createContext,
    useCallback,
    useState,
} from "react";

import { cartService } from "../services/cartService";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // -----------------------------------------
    // Calculate Cart Count
    // -----------------------------------------

    const calculateCartCount = useCallback(
        (items = []) => {
            return items.reduce(
                (total, item) =>
                    total +
                    Number(item.quantity || 0),
                0
            );
        },
        []
    );

    // -----------------------------------------
    // Get Cart
    // -----------------------------------------

    const getCart = useCallback(async () => {
        try {
            setLoading(true);

            const response =
                await cartService.getCartList();

            console.log(
                "🛒 Get Cart Response:",
                response
            );

            const cartData =
                response?.cart || response;

            const items =
                cartData?.items || [];

            setCart(cartData);

            setCartCount(
                calculateCartCount(items)
            );

            return cartData;
        } catch (error) {
            console.error(
                "Get cart error:",
                error
            );

            setCart(null);
            setCartCount(0);

            throw error;
        } finally {
            setLoading(false);
        }
    }, [calculateCartCount]);

    // -----------------------------------------
    // Refresh Cart
    // -----------------------------------------

    const refreshCart = useCallback(async () => {
        await getCart();
    }, [getCart]);

    // -----------------------------------------
    // Add To Cart
    // -----------------------------------------

    const addToCart = async (productData) => {
        try {
            setLoading(true);

            const response =
                await cartService.addToCart(
                    productData
                );

            console.log(
                "🛒 Add To Cart Response:",
                response
            );

            await getCart();

            return response;
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------
    // Update Cart Item
    // -----------------------------------------

    const updateCartItem = async (
        cartItemId,
        quantity
    ) => {
        try {
            setLoading(true);

            const response =
                await cartService.updateCartItem(
                    cartItemId,
                    quantity
                );

            console.log(
                "🛒 Update Cart Response:",
                response
            );

            await getCart();

            return response;
        } catch (error) {
            console.error(
                "Update cart item error:",
                error
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------
    // Remove Cart Item
    // -----------------------------------------

    const removeCartItem = async (
        cartItemId
    ) => {
        try {
            setLoading(true);

            const response =
                await cartService.removeCartItem(
                    cartItemId
                );

            console.log(
                "🛒 Remove Cart Response:",
                response
            );

            await getCart();

            return response;
        } catch (error) {
            console.error(
                "Remove cart item error:",
                error
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------
    // Clear Cart
    // -----------------------------------------

    const clearCart = () => {
        setCart(null);
        setCartCount(0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,

                cartCount,

                loading,

                getCart,
                refreshCart,

                addToCart,
                updateCartItem,
                removeCartItem,

                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};