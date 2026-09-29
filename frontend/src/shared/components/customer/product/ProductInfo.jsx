import { useEffect, useState } from "react";
import Input from "antd/es/input/Input";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { Button, Tooltip, message } from "antd";

import {
    MinusOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import {
    FiChevronLeft,
    FiChevronRight,
    FiGrid,
    FiHeart,
    FiMessageCircle,
    FiShare2,
    FiShuffle,
} from "react-icons/fi";

import SwiperSectionLayout from "../swiper/SwiperSectionLayout";

import { productService } from "../../../../services/productService";

import ProductCard from "./ProductCard";
import ProductBottomBar from "./ProductBottomBar";

import {
    Link,
    useParams,
    useNavigate,
} from "react-router-dom";
import { useCart } from "../../../../hooks";


const ProductInfo = () => {
    const [thumbsSwiper, setThumbsSwiper] =
        useState(null);

    const [activeIndex, setActiveIndex] =
        useState(0);

    const [bestSellingProducts, setBestSellingProducts] =
        useState([]);

    const [isLoader, setIsLoader] =
        useState(true);

    const [product, setProduct] =
        useState(null);

    const [chosenColor, setChosenColor] =
        useState("");

    const [chosenSize, setChosenSize] =
        useState(null);

    const [quantity, setQuantity] =
        useState(1);

    const [isAddingToCart, setIsAddingToCart] =
        useState(false);

    const { id } = useParams();

    const navigate = useNavigate();

    // -----------------------------------------
    // Cart Context
    // -----------------------------------------

    const { addToCart } = useCart();

    // -----------------------------------------
    // Get Best Selling Products
    // -----------------------------------------

    useEffect(() => {
        getBestSellingProducts();
    }, []);

    // -----------------------------------------
    // Get Product
    // -----------------------------------------

    useEffect(() => {
        if (id) {
            getProductById(id);
        }
    }, [id]);

    // -----------------------------------------
    // Get Products
    // -----------------------------------------

    const getBestSellingProducts = async () => {
        setIsLoader(true);

        try {
            const response =
                await productService.getAllProducts();

            console.log(
                "Best Selling Products:",
                response?.products
            );

            setBestSellingProducts(
                response?.products || []
            );
        } catch (error) {
            console.error(
                "Error fetching best selling products:",
                error
            );

            setBestSellingProducts([]);
        } finally {
            setIsLoader(false);
        }
    };

    // -----------------------------------------
    // Get Product Details
    // -----------------------------------------

    const getProductById = async (productId) => {
        try {
            const response =
                await productService.getProductById(
                    productId
                );

            console.log(
                "Product data:",
                response?.product
            );

            const productData =
                response?.product;

            setProduct(productData);

            // Select first color
            if (productData?.colors?.length) {
                setChosenColor(
                    productData.colors[0]
                );
            } else {
                setChosenColor("");
            }

            // Select first size
            if (productData?.sizes?.length) {
                setChosenSize(
                    productData.sizes[0]
                );
            } else {
                setChosenSize(null);
            }

            setQuantity(1);
            setActiveIndex(0);
        } catch (error) {
            console.error(
                "Error fetching product by id:",
                error
            );

            setProduct(null);
        }
    };

    // -----------------------------------------
    // Quantity Handler
    // -----------------------------------------

    const handleQuantityChange = (type) => {
        setQuantity((previousQuantity) => {
            if (type === "increase") {
                return previousQuantity + 1;
            }

            if (type === "decrease") {
                return previousQuantity > 1
                    ? previousQuantity - 1
                    : 1;
            }

            return previousQuantity;
        });
    };

    // -----------------------------------------
    // Create Cart Payload
    // -----------------------------------------

    const getCartPayload = () => {
        return {
            productId: product._id,

            quantity,

            size: chosenSize
                ? {
                      size: chosenSize.size,
                      priceModifier:
                          chosenSize.priceModifier || 0,
                  }
                : undefined,

            color: chosenColor || undefined,

            metalType:
                product?.metalType || undefined,

            gemstones:
                product?.gemstones || undefined,

            customization: {},
        };
    };

    // -----------------------------------------
    // Add To Cart
    // -----------------------------------------

    const handleAddToCart = async () => {
        if (!product?._id) {
            message.error("Product not found");
            return;
        }

        if (
            product?.sizes?.length &&
            !chosenSize
        ) {
            message.warning(
                "Please select a size"
            );
            return;
        }

        try {
            setIsAddingToCart(true);

            const payload =
                getCartPayload();

            console.log(
                "Add to cart payload:",
                payload
            );

            // IMPORTANT:
            // Use CartContext instead of
            // cartService directly.
            const response =
                await addToCart(payload);

            console.log(
                "Add to cart response:",
                response
            );

            message.success(
                `${product.title} added to cart`
            );
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            message.error(
                error?.response?.data?.message ||
                    "Unable to add product to cart"
            );
        } finally {
            setIsAddingToCart(false);
        }
    };

    // -----------------------------------------
    // Buy Now
    // -----------------------------------------

    const handleBuyNow = async () => {
        if (!product?._id) {
            message.error("Product not found");
            return;
        }

        if (
            product?.sizes?.length &&
            !chosenSize
        ) {
            message.warning(
                "Please select a size"
            );
            return;
        }

        try {
            setIsAddingToCart(true);

            const payload =
                getCartPayload();

            console.log(
                "Buy now payload:",
                payload
            );

            // IMPORTANT:
            // Use CartContext here as well.
            await addToCart(payload);

            navigate("/cart");
        } catch (error) {
            console.error(
                "Buy now error:",
                error
            );

            message.error(
                error?.response?.data?.message ||
                    "Unable to proceed"
            );
        } finally {
            setIsAddingToCart(false);
        }
    };

    const productImages =
        product?.images || [];

    return (
        <>
            {/* ---------------------------------
                Breadcrumb
            --------------------------------- */}

            <section className="px-4 py-8">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-2">

                            <Link
                                to="/home"
                                className="text-[#757575]"
                            >
                                Home
                            </Link>

                            <div className="w-4 h-4 flex items-center justify-center">
                                <span className="w-1 h-1 bg-[#757575] rounded-full" />
                            </div>

                            <p className="text-black text-sm font-normal">
                                {product?.title}
                            </p>

                        </div>

                        <div className="flex items-center gap-2.5">

                            <Tooltip
                                title="Previous Product"
                                placement="bottom"
                            >
                                <Button
                                    type="default"
                                    shape="circle"
                                    icon={
                                        <FiChevronLeft
                                            size={18}
                                        />
                                    }
                                    className="!min-w-4 !w-auto !text-black !inline-block !bg-transparent !shadow-none !border-none"
                                />
                            </Tooltip>

                            <Tooltip
                                title="View All Products"
                                placement="bottom"
                            >
                                <Button
                                    type="default"
                                    shape="circle"
                                    icon={
                                        <FiGrid
                                            size={20}
                                        />
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/products"
                                        )
                                    }
                                    className="!min-w-4 !w-auto !text-black !inline-block !bg-transparent !shadow-none !border-none"
                                />
                            </Tooltip>

                            <Tooltip
                                title="Next Product"
                                placement="bottom"
                            >
                                <Button
                                    type="default"
                                    shape="circle"
                                    icon={
                                        <FiChevronRight
                                            size={18}
                                        />
                                    }
                                    className="!min-w-4 !w-auto !text-black !inline-block !bg-transparent !shadow-none !border-none"
                                />
                            </Tooltip>

                        </div>

                    </div>
                </div>
            </section>

            {/* ---------------------------------
                Product Section
            --------------------------------- */}

            <section className="px-4">
                <div className="container mx-auto">

                    <div className="grid grid-cols-12 gap-6">

                        {/* Product Images */}

                        <div className="col-span-12 md:col-span-6">

                            <div className="grid grid-cols-12 gap-3">

                                {/* Thumbnails */}

                                <div className="col-span-2">

                                    <div className="flex flex-col gap-3">

                                        {productImages.map(
                                            (
                                                image,
                                                index
                                            ) => (
                                                <div
                                                    className="w-full h-[93px] overflow-hidden"
                                                    key={index}
                                                >
                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={
                                                            product?.title
                                                        }
                                                        onClick={() =>
                                                            thumbsSwiper?.slideTo(
                                                                index
                                                            )
                                                        }
                                                        className={`w-full h-full object-cover cursor-pointer border rounded-lg ${
                                                            activeIndex ===
                                                            index
                                                                ? "border-[#ff6f61]"
                                                                : "border-gray-300"
                                                        }`}
                                                    />
                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>

                                {/* Main Image */}

                                <div className="col-span-10">

                                    <div className="relative">

                                        <Swiper
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            navigation={{
                                                nextEl:
                                                    ".custom-swiper-button-next",
                                                prevEl:
                                                    ".custom-swiper-button-prev",
                                            }}
                                            onSwiper={
                                                setThumbsSwiper
                                            }
                                            onSlideChange={(
                                                swiper
                                            ) =>
                                                setActiveIndex(
                                                    swiper.activeIndex
                                                )
                                            }
                                            modules={[
                                                Navigation,
                                                Thumbs,
                                            ]}
                                        >

                                            {productImages.map(
                                                (
                                                    src,
                                                    index
                                                ) => (
                                                    <SwiperSlide
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        <div className="w-full h-[475px] rounded-xl overflow-hidden">

                                                            <img
                                                                src={
                                                                    src
                                                                }
                                                                alt={
                                                                    product?.title
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />

                                                        </div>
                                                    </SwiperSlide>
                                                )
                                            )}

                                        </Swiper>

                                        {/* Previous */}

                                        <Button
                                            type="default"
                                            shape="circle"
                                            disabled={
                                                activeIndex ===
                                                0
                                            }
                                            className={`custom-swiper-button-prev !absolute !top-1/2 !left-3 -translate-y-1/2 z-10 !w-11 !h-11 !border !p-0 ${
                                                activeIndex ===
                                                0
                                                    ? "!bg-gray-100 !border-[#E5E5E5] !text-gray-400"
                                                    : "!bg-white !border-[#EBEBEE] !text-black hover:!bg-black hover:!text-white"
                                            }`}
                                        >
                                            <FiChevronLeft
                                                size={20}
                                            />
                                        </Button>

                                        {/* Next */}

                                        <Button
                                            type="default"
                                            shape="circle"
                                            disabled={
                                                activeIndex ===
                                                productImages.length -
                                                    1
                                            }
                                            className={`custom-swiper-button-next !absolute !top-1/2 !right-3 -translate-y-1/2 z-10 !w-11 !h-11 !border !p-0 ${
                                                activeIndex ===
                                                productImages.length -
                                                    1
                                                    ? "!bg-gray-100 !border-[#E5E5E5] !text-gray-400"
                                                    : "!bg-white !border-[#EBEBEE] !text-black hover:!bg-black hover:!text-white"
                                            }`}
                                        >
                                            <FiChevronRight
                                                size={20}
                                            />
                                        </Button>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Product Information */}

                        <div className="col-span-12 md:col-span-6">

                            <div className="flex flex-col gap-y-6">

                                {/* Product Header */}

                                <div className="flex flex-col gap-3 border-b border-[#ebebeb] pb-8">

                                    <span className="text-[#545454] text-sm font-medium uppercase">
                                        {
                                            product
                                                ?.category
                                                ?.title
                                        }
                                    </span>

                                    <h2 className="text-3xl text-black font-medium">
                                        {
                                            product?.title
                                        }
                                    </h2>

                                    {/* Price */}

                                    <div className="flex items-center gap-3 flex-wrap">

                                        <p className="text-[#ff6f61] text-3xl font-medium">

                                            ₹
                                            {Number(
                                                product?.finalPrice ||
                                                    product?.basePrice ||
                                                    0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </p>

                                        {product?.discount
                                            ?.amount >
                                            0 && (
                                            <p className="text-[#0009] text-3xl font-medium">

                                                <del>
                                                    ₹
                                                    {Number(
                                                        product?.basePrice ||
                                                            0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </del>

                                            </p>
                                        )}

                                        {product?.discount
                                            ?.amount >
                                            0 && (
                                            <span className="bg-[#ff6f61] text-sm font-normal text-white px-2.5 py-[5px] rounded-full">

                                                {product
                                                    ?.discount
                                                    ?.type ===
                                                "percent"
                                                    ? `${product?.discount?.amount}% Off`
                                                    : `₹${product?.discount?.amount} Off`}

                                            </span>
                                        )}

                                    </div>

                                    {/* Stock */}

                                    <div className="flex items-center gap-3">

                                        <span className="text-[#1d770b] bg-[#2ca3151a] rounded-[5px] px-2.5 py-[5px] font-medium capitalize">
                                            {
                                                product?.stockStatus
                                            }
                                        </span>

                                        <p>
                                            30 sold in last
                                            24 hours
                                        </p>

                                    </div>

                                </div>

                                {/* Variants */}

                                <div className="border-b border-[#ebebeb] pb-8 flex flex-col gap-y-6">

                                    {/* Colors */}

                                    {product?.colors
                                        ?.length >
                                        0 && (
                                        <div className="flex flex-col gap-y-2">

                                            <p className="text-black font-normal text-base">

                                                Colors:

                                                <span className="font-medium ml-1">
                                                    {
                                                        chosenColor
                                                    }
                                                </span>

                                            </p>

                                            <div className="flex gap-3 flex-wrap">

                                                {product.colors.map(
                                                    (
                                                        color,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={
                                                                index
                                                            }
                                                            onClick={() =>
                                                                setChosenColor(
                                                                    color
                                                                )
                                                            }
                                                            className={`w-[38px] h-[38px] flex items-center justify-center cursor-pointer rounded-full border transition-all ${
                                                                chosenColor ===
                                                                color
                                                                    ? "border-[#101828]"
                                                                    : "border-transparent"
                                                            }`}
                                                        >

                                                            <div
                                                                className={`w-8 h-8 rounded-full border border-[#dcdcdc] ${
                                                                    color ===
                                                                    "Yellow Gold"
                                                                        ? "bg-[#e2d2ab]"
                                                                        : ""
                                                                } ${
                                                                    color ===
                                                                    "Rose Gold"
                                                                        ? "bg-[#dcc8ba]"
                                                                        : ""
                                                                } ${
                                                                    color ===
                                                                    "White Gold"
                                                                        ? "bg-[#d6d6d6]"
                                                                        : ""
                                                                }`}
                                                            />

                                                        </div>
                                                    )
                                                )}

                                            </div>

                                        </div>
                                    )}

                                    {/* Sizes */}

                                    {product?.sizes
                                        ?.length >
                                        0 && (
                                        <div className="flex flex-col gap-y-2">

                                            <p className="text-black font-normal text-base">

                                                Size:

                                                <span className="font-medium ml-1">
                                                    {
                                                        chosenSize?.size
                                                    }
                                                </span>

                                            </p>

                                            <div className="flex gap-3 flex-wrap">

                                                {product.sizes.map(
                                                    (
                                                        size,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={
                                                                size?._id ||
                                                                size?.id ||
                                                                index
                                                            }
                                                            onClick={() =>
                                                                setChosenSize(
                                                                    size
                                                                )
                                                            }
                                                            className={`w-12 h-12 rounded-full border text-xl font-medium cursor-pointer transition-all flex items-center justify-center uppercase ${
                                                                chosenSize?.size ===
                                                                size?.size
                                                                    ? "border-black"
                                                                    : "border-gray-300"
                                                            }`}
                                                        >
                                                            {
                                                                size?.size
                                                            }
                                                        </div>
                                                    )
                                                )}

                                            </div>

                                        </div>
                                    )}

                                </div>

                                {/* Cart Actions */}

                                <div className="border-b border-[#ebebeb] pb-8">

                                    <div className="flex items-center gap-3 mb-3">

                                        {/* Quantity */}

                                        <div className="flex items-center justify-between bg-[#f1f1f1] rounded-full">

                                            <Button
                                                type="default"
                                                icon={
                                                    <MinusOutlined className="text-[22px]" />
                                                }
                                                size="small"
                                                disabled={
                                                    quantity <=
                                                        1 ||
                                                    isAddingToCart
                                                }
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        "decrease"
                                                    )
                                                }
                                                className="!bg-transparent !w-[42px] !h-12 !border-none !shadow-none !text-black hover:!text-[#ff6f61]"
                                            />

                                            <Input
                                                className="w-[42px] h-12 !bg-transparent !border-none pointer-events-none !text-black font-medium text-[22px] text-center"
                                                value={
                                                    quantity
                                                }
                                            />

                                            <Button
                                                type="default"
                                                icon={
                                                    <PlusOutlined className="text-[22px]" />
                                                }
                                                size="small"
                                                disabled={
                                                    isAddingToCart
                                                }
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        "increase"
                                                    )
                                                }
                                                className="!bg-transparent !w-[42px] !h-12 !border-none !shadow-none !text-black hover:!text-[#ff6f61]"
                                            />

                                        </div>

                                        {/* Add To Cart */}

                                        <Button
                                            type="button"
                                            size="large"
                                            loading={
                                                isAddingToCart
                                            }
                                            disabled={
                                                !product ||
                                                (product?.sizes
                                                    ?.length >
                                                    0 &&
                                                    !chosenSize)
                                            }
                                            onClick={
                                                handleAddToCart
                                            }
                                            className="grow !font-medium !bg-black !text-white !border-black rounded-full hover:!bg-[#ff6f61]"
                                        >
                                            Add to cart
                                        </Button>

                                    </div>

                                    {/* Buy Now */}

                                    <Button
                                        type="button"
                                        size="large"
                                        loading={
                                            isAddingToCart
                                        }
                                        disabled={
                                            !product ||
                                            (product?.sizes
                                                ?.length >
                                                0 &&
                                                !chosenSize)
                                        }
                                        onClick={
                                            handleBuyNow
                                        }
                                        className="w-full !bg-[#ff6f61] !border-[#ff6f61] !font-medium !text-white rounded-full"
                                    >
                                        Buy it now
                                    </Button>

                                    {/* Extra Actions */}

                                    <div className="flex items-center flex-wrap gap-6 mt-4">

                                        <Button
                                            type="default"
                                            size="small"
                                            icon={
                                                <FiHeart
                                                    size={14}
                                                />
                                            }
                                            className="!border-none !px-0 !shadow-none !text-black hover:!text-[#ff6f61]"
                                        >
                                            Add to wishlist
                                        </Button>

                                        <Button
                                            type="default"
                                            size="small"
                                            icon={
                                                <FiShuffle
                                                    size={14}
                                                />
                                            }
                                            className="!border-none !px-0 !shadow-none !text-black hover:!text-[#ff6f61]"
                                        >
                                            Add to Compare
                                        </Button>

                                        <Button
                                            type="default"
                                            size="small"
                                            icon={
                                                <FiMessageCircle
                                                    size={14}
                                                />
                                            }
                                            className="!border-none !px-0 !shadow-none !text-black hover:!text-[#ff6f61]"
                                        >
                                            Ask a Question
                                        </Button>

                                        <Button
                                            type="default"
                                            size="small"
                                            icon={
                                                <FiShare2
                                                    size={14}
                                                />
                                            }
                                            className="!border-none !px-0 !shadow-none !text-black hover:!text-[#ff6f61]"
                                        >
                                            Share
                                        </Button>

                                    </div>

                                    {/* Product Meta */}

                                    <div className="mt-4 flex flex-col gap-y-3">

                                        <p className="text-black font-normal text-base">
                                            SKU:

                                            <span className="font-medium ml-1">
                                                {
                                                    product?.sku
                                                }
                                            </span>
                                        </p>

                                        <p className="text-black font-normal text-base">
                                            Category:

                                            <span className="font-medium ml-1 capitalize">
                                                {
                                                    product
                                                        ?.category
                                                        ?.title
                                                }
                                            </span>
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* ---------------------------------
                People Also Bought
            --------------------------------- */}

            <SwiperSectionLayout
                title="People Also Bought"
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }}
                bgColor="bg-[#ffffff]"
            >
                {isLoader
                    ? Array.from({
                          length: 4,
                      }).map((_, index) => (
                          <SwiperSlide
                              key={index}
                          >
                              <ProductCard
                                  loading
                              />
                          </SwiperSlide>
                      ))
                    : bestSellingProducts.map(
                          (item) => (
                              <SwiperSlide
                                  key={item._id}
                              >
                                  <ProductCard
                                      product={item}
                                  />
                              </SwiperSlide>
                          )
                      )}
            </SwiperSectionLayout>

            {/* ---------------------------------
                Recently Viewed
            --------------------------------- */}

            <SwiperSectionLayout
                title="Recently Viewed"
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }}
                bgColor="bg-[#ffffff]"
            >
                {isLoader
                    ? Array.from({
                          length: 4,
                      }).map((_, index) => (
                          <SwiperSlide
                              key={index}
                          >
                              <ProductCard
                                  loading
                              />
                          </SwiperSlide>
                      ))
                    : bestSellingProducts.map(
                          (item) => (
                              <SwiperSlide
                                  key={item._id}
                              >
                                  <ProductCard
                                      product={item}
                                  />
                              </SwiperSlide>
                          )
                      )}
            </SwiperSectionLayout>

            <ProductBottomBar />
        </>
    );
};

export default ProductInfo;