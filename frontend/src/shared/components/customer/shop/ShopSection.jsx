import { Button, Pagination, Select, Drawer, } from "antd";
import ProductCard from "../product/ProductCard";
import SidebarFilters from "./filters/SidebarFilters";
import React, { useEffect, useState, } from "react";
import { FiList, FiPackage, } from "react-icons/fi";
import { productService } from "../../../../services/productService";

const { Option } = Select;

const ShopSection = () => {

    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);

    const [isLoader, setIsLoader] =
        useState(true);


    // =====================================================
    // FILTER / SORT
    // =====================================================

    const [selectedSortBy, setSelectedSortBy] =
        useState("default");

    const [categoryId, setCategoryId] =
        useState(null);


    // =====================================================
    // DRAWER
    // =====================================================

    const [isDrawerOpen, setIsDrawerOpen] =
        useState(false);


    // =====================================================
    // PAGINATION
    // =====================================================

    const [current, setCurrent] =
        useState(1);

    const pageSize = 9;


    // =====================================================
    // GET PRODUCTS
    // =====================================================

    useEffect(() => {

        setCurrent(1);

        if (categoryId) {

            getProductsByCategory(categoryId);

        } else if (
            selectedSortBy === "default"
        ) {

            getAllProducts();

        } else {

            getSortedProducts(
                selectedSortBy
            );
        }

    }, [
        selectedSortBy,
        categoryId,
    ]);


    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================

    const getAllProducts = async () => {

        setIsLoader(true);

        try {

            const response =
                await productService.getAllProducts();

            setProducts(
                response?.products || []
            );

            console.log(
                "Product Data:",
                response?.products
            );

        } catch (error) {

            setProducts([]);

            console.error(
                "API Error:",
                error?.message
            );

        } finally {

            setIsLoader(false);

        }
    };


    // =====================================================
    // GET SORTED PRODUCTS
    // =====================================================

    const getSortedProducts = async (
        sort_by
    ) => {

        setIsLoader(true);

        try {

            const response =
                await productService.getSortedProducts(
                    sort_by
                );

            setProducts(
                response?.products || []
            );

            console.log(
                "Sorted Products:",
                response?.products
            );

        } catch (error) {

            setProducts([]);

            console.error(
                "API Error:",
                error?.message
            );

        } finally {

            setIsLoader(false);

        }
    };


    // =====================================================
    // GET PRODUCTS BY CATEGORY
    // =====================================================

    const getProductsByCategory = async (
        category_id
    ) => {

        setIsLoader(true);

        try {

            const response =
                await productService.getProductsByCategory(
                    category_id
                );

            setProducts(
                response?.products || []
            );

            console.log(
                "Category Products:",
                response?.products
            );

        } catch (error) {

            setProducts([]);

            console.error(
                "API Error:",
                error?.message
            );

        } finally {

            setIsLoader(false);

        }
    };


    // =====================================================
    // PAGINATION DATA
    // =====================================================

    const total = products.length;

    const startIndex =
        (current - 1) * pageSize;

    const endIndex =
        startIndex + pageSize;

    const paginatedProducts =
        products.slice(
            startIndex,
            endIndex
        );


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (page) => {

        setCurrent(page);

        // Scroll to product section
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // =====================================================
    // PAGINATION ITEM RENDER
    // =====================================================

    const itemRender = (
        page,
        type,
        originalElement
    ) => {

        if (type === "page") {

            return React.cloneElement(
                originalElement,
                {
                    className: `${originalElement.props.className ||
                        ""
                        } circle-page`,
                }
            );
        }

        if (
            type === "prev" ||
            type === "next"
        ) {

            return React.cloneElement(
                originalElement,
                {
                    className: `${originalElement.props.className ||
                        ""
                        } circle-nav`,
                }
            );
        }

        return originalElement;
    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <section className="py-8 sm:py-12 px-4">

            <div className="container mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">


                    {/* =================================================
                        DESKTOP FILTER
                    ================================================= */}

                    <div className="col-span-3 hidden lg:block">

                        <SidebarFilters
                            onCategorySelect={(id) => {
                                setCategoryId(id);
                                setCurrent(1);
                            }}
                        />

                    </div>


                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    <div className="col-span-12 lg:col-span-9">


                        {/* =================================================
                            FILTER / SORT
                        ================================================= */}

                        <div className="flex items-center gap-1.5 mb-6 md:mb-10">


                            {/* MOBILE FILTER */}

                            <Button
                                type="default"
                                size="large"
                                onClick={() =>
                                    setIsDrawerOpen(true)
                                }
                                className="lg:hidden flex items-center gap-2 transition-all duration-300 ease-in-out !text-black rounded-full !border !border-[#EBEBEE] hover:!border-black"
                            >

                                <FiList size={18} />

                                Filter

                            </Button>


                            {/* SORT */}

                            <div className="max-w-[220px] min-w-[244px]">

                                <Select
                                    value={
                                        selectedSortBy
                                    }
                                    onChange={(value) => {

                                        setSelectedSortBy(
                                            value
                                        );

                                        setCurrent(1);

                                    }}
                                    size="large"
                                    className="w-full !shadow-none [&_.ant-select-selector]:!shadow-none rounded-full [&_.ant-select-selector]:!rounded-full [&_.ant-select-selector]:!border-[#EBEBEE] hover:[&_.ant-select-selector]:!border-black focus:[&_.ant-select-selector]:!border-black focus:[&_.ant-select-selector]:!shadow-none transition-all duration-300 ease-in-out"
                                >

                                    <Option value="default">
                                        Sort By (Default)
                                    </Option>

                                    <Option value="title_asc">
                                        Title Ascending
                                    </Option>

                                    <Option value="title_desc">
                                        Title Descending
                                    </Option>

                                    <Option value="price_asc">
                                        Price Ascending
                                    </Option>

                                    <Option value="price_desc">
                                        Price Descending
                                    </Option>

                                </Select>

                            </div>

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {isLoader ? (

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                                {Array.from({
                                    length: pageSize,
                                }).map(
                                    (_, index) => (

                                        <ProductCard
                                            key={index}
                                            loading
                                        />

                                    )
                                )}

                            </div>


                        ) : paginatedProducts.length > 0 ? (


                            /* =================================================
                                PAGINATED PRODUCTS
                            ================================================= */

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                                {paginatedProducts.map(
                                    (product) => (

                                        <ProductCard
                                            key={
                                                product?._id
                                            }
                                            product={
                                                product
                                            }
                                        />

                                    )
                                )}

                            </div>


                        ) : (


                            /* =================================================
                                NO PRODUCTS
                            ================================================= */

                            <div className="flex flex-col items-center justify-center py-20 text-center">

                                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#f5f5f5] mb-4">

                                    <FiPackage
                                        size={40}
                                        className="text-[#ff6f61]"
                                    />

                                </div>

                                <h2 className="text-2xl font-semibold text-black mb-2">

                                    No Products Found

                                </h2>

                                <p className="text-[#0009] max-w-sm">

                                    We couldn’t find any products
                                    matching your filter or search.
                                    Try clearing filters or explore
                                    another category.

                                </p>

                            </div>

                        )}


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        {!isLoader &&
                            products.length > 0 && (

                                <div className="flex items-center justify-center gap-2 mt-10">

                                    <Pagination
                                        className="customer-pagination"
                                        total={total}
                                        pageSize={pageSize}
                                        current={current}
                                        showSizeChanger={false}
                                        onChange={
                                            handlePageChange
                                        }
                                        itemRender={
                                            itemRender
                                        }
                                    />

                                </div>

                            )}

                    </div>

                </div>

            </div>


            {/* =================================================
                MOBILE FILTER DRAWER
            ================================================= */}

            <Drawer
                title="Filter"
                placement="left"
                open={isDrawerOpen}
                onClose={() =>
                    setIsDrawerOpen(false)
                }
                width={300}
                bodyStyle={{
                    padding: "16px",
                }}
            >

                <SidebarFilters
                    onCategorySelect={(id) => {

                        setCategoryId(id);

                        setCurrent(1);

                        setIsDrawerOpen(false);

                    }}
                />

            </Drawer>

        </section>
    );
};


export default ShopSection;