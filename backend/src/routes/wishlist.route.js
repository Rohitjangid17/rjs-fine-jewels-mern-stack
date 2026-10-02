import express from "express";

import { protect } from "../middlewares/auth.middleware.js";

import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", addToWishlist);

router.get("/", getWishlist);

router.delete("/", removeFromWishlist);

export default router;