import {
    FiHeart,
    FiEye,
    FiShoppingBag,
    FiTrash,
    FiShuffle,
    FiDollarSign,
} from "react-icons/fi";

import { Tooltip, message } from "antd";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useWishlist } from "../../../../hooks";

const ProductCard = ({
    product = {},
    loading = false,
    isWishlist = false,
    onAddToCart = () => { },
}) => {
    const {
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
    } = useWishlist();

    const title = product?.title || "Untitled Product";

    const images = product?.images || [];

    const defaultImage =
        images[0] || "/assets/images/default-image.png";

    const hoverImage =
        images[4] ||
        images[1] ||
        defaultImage;

    // =========================
    // PRICE
    // =========================

    const basePrice =
        Number(product?.basePrice) || 0;

    const discount =
        product?.discount || {};

    const discountAmount =
        Number(discount?.amount) || 0;

    const discountType =
        discount?.type || "none";

    let finalPrice = basePrice;

    if (discountType === "flat") {
        finalPrice = Math.max(
            basePrice - discountAmount,
            0
        );
    } else if (discountType === "percent") {
        finalPrice = Math.max(
            basePrice -
            (basePrice * discountAmount) / 100,
            0
        );
    }

    // =========================
    // ADD TO CART
    // =========================

    const handleAddToCart = () => {
        onAddToCart(product);
    };

    // =========================
    // WISHLIST
    // =========================

    const handleWishlist = async () => {
        try {
            await toggleWishlist(product?._id);

            message.success(
                isInWishlist(product?._id)
                    ? "Product removed from wishlist"
                    : "Product added to wishlist"
            );
        } catch (error) {
            message.error(
                error?.response?.data?.message ||
                "Unable to update wishlist"
            );
        }
    };

    const handleRemoveFromWishlist = async () => {
        try {
            await removeFromWishlist(product?._id);

            message.success(
                "Product removed from wishlist"
            );
        } catch (error) {
            message.error(
                error?.response?.data?.message ||
                "Unable to remove product from wishlist"
            );
        }
    };

    // =========================
    // ACTIONS
    // =========================

    const actions = isWishlist
        ? [
            {
                icon: <FiTrash size={18} />,
                label: "Remove from Wishlist",
                onClick: handleRemoveFromWishlist,
            },
        ]
        : [
            {
                icon: <FiShoppingBag size={18} />,
                label: "Add to Cart",
                onClick: handleAddToCart,
            },
            {
                icon: (
                    <FiHeart
                        size={18}
                        fill={
                            isInWishlist(product?._id)
                                ? "currentColor"
                                : "none"
                        }
                    />
                ),
                label: isInWishlist(product?._id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist",
                onClick: handleWishlist,
            },
            {
                icon: <FiEye size={18} />,
                label: "Quick View",
                onClick: () => {
                    // Quick view logic
                },
            },
            {
                icon: <FiShuffle size={18} />,
                label: "Add to Compare",
                onClick: () => {
                    // Compare logic
                },
            },
        ];

    return (
        <div className="relative group">
            {/* =========================
                IMAGE AREA
            ========================= */}

            <div className="relative overflow-hidden aspect-[4/4] w-full">
                {loading ? (
                    <Skeleton height={250} />
                ) : (
                    <>
                        {/* Default Image */}

                        <Link
                            to={`/ product - details / ${product?._id} `}
                        >
                            <img
                                src={defaultImage}
                                alt={title}
                                loading="lazy"
                                width="684"
                                height="848"
                                className="w-full h-full object-cover transition-opacity ease-in-out duration-500 group-hover:opacity-0"
                            />
                        </Link>

                        {/* Hover Image */}

                        <Link
                            to={`/ product - details / ${product?._id} `}
                        >
                            <img
                                src={hoverImage}
                                alt={title}
                                loading="lazy"
                                width="684"
                                height="848"
                                className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity ease-in-out duration-500 group-hover:opacity-100"
                            />
                        </Link>

                        {/* =========================
                            ACTION BUTTONS
                        ========================= */}

                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {actions.map((action, idx) => (
                                <Tooltip
                                    key={idx}
                                    title={
                                        <span
                                            style={{
                                                fontSize: "11px",
                                            }}
                                        >
                                            {action.label}
                                        </span>
                                    }
                                    placement="left"
                                >
                                    <button
                                        type="button"
                                        className="p-2 bg-white shadow-md rounded-full hover:bg-black hover:text-white transition duration-300"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            action.onClick?.();
                                        }}
                                    >
                                        {action.icon}
                                    </button>
                                </Tooltip>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* =========================
                PRODUCT INFORMATION
            ========================= */}

            <div className="flex flex-col gap-[10px] py-4">
                {loading ? (
                    <>
                        <Skeleton
                            height={20}
                            width="80%"
                        />

                        <Skeleton
                            height={20}
                            width="60%"
                        />
                    </>
                ) : (
                    <>
                        {/* Product Title */}

                        <Link
                            to={`/ product - details / ${product?._id} `}
                            className="capitalize text-base leading-[24px] font-normal text-black hover:text-[#ff6f61] transition-colors duration-300"
                        >
                            {title}
                        </Link>

                        {/* Price */}

                        <div className="flex items-center gap-1">
                            {/* Final Price */}

                            <p className="flex items-center text-[#ff6f61] text-base leading-[24px] font-medium">
                                <FiDollarSign />

                                <span>
                                    {Math.max(
                                        finalPrice,
                                        0
                                    )}
                                </span>
                            </p>

                            {/* Original Price */}

                            {discountType !== "none" && (
                                <p className="flex items-center text-[#1f1f1f] text-base leading-[24px] font-medium line-through">
                                    <FiDollarSign />

                                    <span>
                                        {basePrice}
                                    </span>
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductCard;