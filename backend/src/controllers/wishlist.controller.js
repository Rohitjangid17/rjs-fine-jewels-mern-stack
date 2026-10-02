import mongoose from "mongoose";

import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

/**
 * POST /api/v1/wishlist
 * Add product to wishlist
 */
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        // 1. Validate productId
        if (!productId) {
            return res.status(400).json({
                status: false,
                message: "productId is required",
            });
        }

        // 2. Validate ObjectId
        if (
            !mongoose.Types.ObjectId.isValid(
                productId
            )
        ) {
            return res.status(400).json({
                status: false,
                message: "Invalid productId",
            });
        }

        // 3. Check product exists
        const product =
            await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found",
            });
        }

        // 4. Find user's wishlist
        let wishlist =
            await Wishlist.findOne({
                user: userId,
            });

        // 5. Create wishlist if not exists
        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId,
                products: [productId],
            });

            await wishlist.save();

            return res.status(201).json({
                status: true,
                message:
                    "Product added to wishlist",
                wishlist: wishlist.products,
            });
        }

        // 6. Check if product already exists
        const alreadyExists =
            wishlist.products.some(
                (id) =>
                    id.toString() ===
                    productId.toString()
            );

        if (alreadyExists) {
            return res.status(200).json({
                status: true,
                message:
                    "Product already exists in wishlist",
                wishlist: wishlist.products,
            });
        }

        // 7. Add product
        wishlist.products.push(productId);

        await wishlist.save();

        return res.status(200).json({
            status: true,
            message:
                "Product added to wishlist",
            wishlist: wishlist.products,
        });
    } catch (error) {
        console.error(
            "Add to wishlist error:",
            error
        );

        return res.status(500).json({
            status: false,
            message:
                "Error adding product to wishlist",
            error: error.message,
        });
    }
};

/**
 * GET /api/v1/wishlist
 * GET /api/v1/wishlist?product_id=xxx
 *
 * Get complete wishlist
 * OR
 * Check particular product
 */
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.query;

        // ==========================================
        // CHECK PARTICULAR PRODUCT
        // ==========================================
        if (product_id) {
            // Validate product_id
            if (
                !mongoose.Types.ObjectId.isValid(
                    product_id
                )
            ) {
                return res.status(400).json({
                    status: false,
                    message:
                        "Invalid product_id",
                });
            }

            const wishlist =
                await Wishlist.findOne({
                    user: userId,
                });

            // Wishlist doesn't exist
            if (!wishlist) {
                return res.json({
                    status: true,
                    isWishlist: false,
                });
            }

            const isWishlist =
                wishlist.products.some(
                    (id) =>
                        id.toString() ===
                        product_id.toString()
                );

            return res.json({
                status: true,
                isWishlist,
            });
        }

        // ==========================================
        // GET COMPLETE WISHLIST
        // ==========================================
        const wishlist =
            await Wishlist.findOne({
                user: userId,
            }).populate("products");

        if (!wishlist) {
            return res.json({
                status: true,
                message: "Wishlist is empty",
                wishlist: [],
            });
        }

        return res.json({
            status: true,
            message:
                "Wishlist fetched successfully",
            wishlist: wishlist.products || [],
        });
    } catch (error) {
        console.error(
            "Get wishlist error:",
            error
        );

        return res.status(500).json({
            status: false,
            message:
                "Error fetching wishlist",
            error: error.message,
        });
    }
};

/**
 * DELETE /api/v1/wishlist?product_id=xxx
 * Remove product from wishlist
 */
export const removeFromWishlist = async (
    req,
    res
) => {
    try {
        const { product_id } = req.query;
        const userId = req.user.id;

        // 1. Validate product_id
        if (!product_id) {
            return res.status(400).json({
                status: false,
                message:
                    "product_id is required",
            });
        }

        // 2. Validate ObjectId
        if (
            !mongoose.Types.ObjectId.isValid(
                product_id
            )
        ) {
            return res.status(400).json({
                status: false,
                message:
                    "Invalid product_id",
            });
        }

        // 3. Find user's wishlist
        const wishlist =
            await Wishlist.findOne({
                user: userId,
            });

        if (!wishlist) {
            return res.status(404).json({
                status: false,
                message: "Wishlist not found",
            });
        }

        // 4. Check product exists
        const productExists =
            wishlist.products.some(
                (id) =>
                    id.toString() ===
                    product_id.toString()
            );

        if (!productExists) {
            return res.status(404).json({
                status: false,
                message:
                    "Product not found in wishlist",
            });
        }

        // 5. Remove product
        wishlist.products =
            wishlist.products.filter(
                (id) =>
                    id.toString() !==
                    product_id.toString()
            );

        await wishlist.save();

        return res.json({
            status: true,
            message:
                "Product removed from wishlist",
            wishlist: wishlist.products,
        });
    } catch (error) {
        console.error(
            "Remove wishlist error:",
            error
        );

        return res.status(500).json({
            status: false,
            message:
                "Error removing product from wishlist",
            error: error.message,
        });
    }
};