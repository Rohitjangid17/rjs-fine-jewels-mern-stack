import { useEffect } from "react";
import { message } from "antd";

import CommonBanner from "../../shared/components/customer/banner/CommonBanner";
import ProductCard from "../../shared/components/customer/product/ProductCard";
import { useWishlist } from "../../hooks";

const Wishlist = () => {
    const {
        wishlist,
        loading,
        getWishlist,
    } = useWishlist();

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                await getWishlist();
            } catch (error) {
                message.error(
                    error?.response?.data?.message ||
                    "Unable to load wishlist"
                );
            }
        };

        loadWishlist();
    }, [getWishlist]);

    return (
        <>
            <CommonBanner title="Wishlist" />

            <section className="py-16 px-4">
                <div className="container mx-auto">

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => (
                                <ProductCard
                                    key={index}
                                    loading
                                />
                            ))
                            : wishlist.length > 0
                                ? wishlist.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        isWishlist={true}
                                    />
                                ))
                                : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                                            <span className="text-3xl">♡</span>
                                        </div>

                                        <h2 className="text-2xl font-semibold text-gray-900">
                                            Your wishlist is empty
                                        </h2>

                                        <p className="text-gray-500 mt-2 max-w-md">
                                            Save your favorite jewellery here
                                            and come back to them anytime.
                                        </p>
                                    </div>
                                )}

                    </div>

                </div>
            </section>
        </>
    );
};

export default Wishlist;