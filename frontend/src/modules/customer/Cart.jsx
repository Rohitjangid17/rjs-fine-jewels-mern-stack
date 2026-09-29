import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Table,
    Button,
    Card,
    Divider,
    Empty,
    message,
    Space,
    Spin,
} from "antd";
import {
    DeleteOutlined,
    MinusOutlined,
    PlusOutlined,
    WhatsAppOutlined,
} from "@ant-design/icons";

import CommonBanner from "../../shared/components/customer/banner/CommonBanner";
import { cartService } from "../../services/cartService";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    const [summary, setSummary] = useState({
        subtotal: 0,
        totalDiscount: 0,
        grandTotal: 0,
    });

    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        getCartList();
    }, []);

    /**
     * Get cart
     */
    const getCartList = async () => {
        try {
            setLoading(true);

            const cart = await cartService.getCartList();

            setCartItems(cart?.items || []);

            setSummary(
                cart?.summary || {
                    subtotal: 0,
                    totalDiscount: 0,
                    grandTotal: 0,
                }
            );
        } catch (error) {
            console.error("Get cart error:", error);

            message.error(
                error?.response?.data?.message ||
                    "Unable to fetch cart"
            );

            setCartItems([]);

            setSummary({
                subtotal: 0,
                totalDiscount: 0,
                grandTotal: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update quantity
     */
    const handleQuantityChange = async (
        cartId,
        type,
        currentQuantity
    ) => {
        const newQuantity =
            type === "increase"
                ? currentQuantity + 1
                : currentQuantity > 1
                ? currentQuantity - 1
                : 1;

        if (newQuantity === currentQuantity) {
            return;
        }

        try {
            setUpdatingId(cartId);

            const cart =
                await cartService.updateCartItem(
                    cartId,
                    newQuantity
                );

            setCartItems(cart?.items || []);

            setSummary(
                cart?.summary || {
                    subtotal: 0,
                    totalDiscount: 0,
                    grandTotal: 0,
                }
            );
        } catch (error) {
            console.error(
                "Update cart error:",
                error
            );

            message.error(
                error?.response?.data?.message ||
                    "Unable to update quantity"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    /**
     * Remove item
     */
    const handleRemove = async (cartId) => {
        try {
            setRemovingId(cartId);

            const cart =
                await cartService.removeCartItem(
                    cartId
                );

            setCartItems(cart?.items || []);

            setSummary(
                cart?.summary || {
                    subtotal: 0,
                    totalDiscount: 0,
                    grandTotal: 0,
                }
            );

            message.success(
                "Item removed from cart"
            );
        } catch (error) {
            console.error(
                "Remove cart item error:",
                error
            );

            message.error(
                error?.response?.data?.message ||
                    "Unable to remove item"
            );
        } finally {
            setRemovingId(null);
        }
    };

    /**
     * Get product image
     */
    const getProductImage = (record) => {
        return (
            record?.snapshot?.images?.[0] ||
            record?.productId?.images?.[0] ||
            "/assets/images/category/product-5.jpg"
        );
    };

    /**
     * Get product name
     */
    const getProductName = (record) => {
        return (
            record?.snapshot?.title ||
            record?.productId?.title ||
            "Jewellery Product"
        );
    };

    /**
     * WhatsApp enquiry
     */
    const handleWhatsAppOrder = () => {
        if (!cartItems.length) {
            message.warning(
                "Your cart is empty"
            );
            return;
        }

        // Replace with actual RJS Fine Jewels WhatsApp number
        const phoneNumber = "916376015899";

        const productsMessage = cartItems
            .map((item, index) => {
                const productName =
                    getProductName(item);

                const variantDetails = [
                    item?.size?.size
                        ? `Size: ${item.size.size}`
                        : null,

                    item?.color
                        ? `Color: ${item.color}`
                        : null,

                    item?.metalType
                        ? `Metal: ${item.metalType}`
                        : null,
                ]
                    .filter(Boolean)
                    .join(" | ");

                const finalPrice =
                    Number(
                        item?.price?.finalPrice || 0
                    );

                return `${index + 1}. ${productName}
SKU: ${
                    item?.snapshot?.sku ||
                    item?.productId?.sku ||
                    "N/A"
                }
Quantity: ${item?.quantity || 1}
Price: ₹${finalPrice.toLocaleString(
                    "en-IN"
                )}${
                    variantDetails
                        ? `\n${variantDetails}`
                        : ""
                }`;
            })
            .join("\n\n");

        const messageText = `Hello RJS Fine Jewels,

I would like to enquire about the following products:

${productsMessage}

Subtotal: ₹${Number(
            summary?.subtotal || 0
        ).toLocaleString("en-IN")}
Discount: ₹${Number(
            summary?.totalDiscount || 0
        ).toLocaleString("en-IN")}
Total: ₹${Number(
            summary?.grandTotal || 0
        ).toLocaleString("en-IN")}

Please share the availability and further details.`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            messageText
        )}`;

        window.open(
            whatsappUrl,
            "_blank"
        );
    };

    const columns = [
        {
            title: "Product",
            dataIndex: "snapshot",
            key: "product",

            render: (_, record) => (
                <div className="flex items-center gap-3 min-w-[220px]">
                    <img
                        src={getProductImage(record)}
                        alt={getProductName(record)}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />

                    <div>
                        <p className="font-medium text-[#0d0d0d]">
                            {getProductName(record)}
                        </p>

                        {record?.snapshot?.sku && (
                            <p className="text-xs text-gray-500 mt-1">
                                SKU:{" "}
                                {
                                    record.snapshot
                                        .sku
                                }
                            </p>
                        )}

                        {record?.size?.size && (
                            <p className="text-xs text-gray-500">
                                Size:{" "}
                                {record.size.size}
                            </p>
                        )}

                        {record?.color && (
                            <p className="text-xs text-gray-500">
                                Color:{" "}
                                {record.color}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },

        {
            title: "Price",
            key: "price",

            render: (_, record) => {
                const finalPrice =
                    Number(
                        record?.price?.finalPrice ||
                            0
                    );

                const discount =
                    Number(
                        record?.price?.discount ||
                            0
                    );

                return (
                    <div>
                        <span className="font-medium">
                            ₹
                            {finalPrice.toLocaleString(
                                "en-IN"
                            )}
                        </span>

                        {discount > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                                Save ₹
                                {discount.toLocaleString(
                                    "en-IN"
                                )}
                            </p>
                        )}
                    </div>
                );
            },
        },

        {
            title: "Quantity",
            key: "quantity",

            render: (_, record) => (
                <Space>
                    <Button
                        type="default"
                        icon={
                            <MinusOutlined />
                        }
                        size="small"
                        disabled={
                            record.quantity <= 1 ||
                            updatingId ===
                                record._id
                        }
                        loading={
                            updatingId ===
                                record._id &&
                            record.quantity > 1
                        }
                        onClick={() =>
                            handleQuantityChange(
                                record._id,
                                "decrease",
                                record.quantity
                            )
                        }
                        className="hover:!bg-transparent focus:!bg-transparent !rounded-sm !shadow-none !text-black !border-gray-200"
                    />

                    <span className="px-2 min-w-[24px] text-center">
                        {record.quantity}
                    </span>

                    <Button
                        type="default"
                        icon={
                            <PlusOutlined />
                        }
                        size="small"
                        disabled={
                            updatingId ===
                            record._id
                        }
                        loading={
                            updatingId ===
                            record._id &&
                            record.quantity >= 1
                        }
                        onClick={() =>
                            handleQuantityChange(
                                record._id,
                                "increase",
                                record.quantity
                            )
                        }
                        className="hover:!bg-transparent focus:!bg-transparent !rounded-sm !shadow-none !text-black !border-gray-200"
                    />
                </Space>
            ),
        },

        {
            title: "Total",
            key: "total",

            render: (_, record) => {
                const finalPrice =
                    Number(
                        record?.price?.finalPrice ||
                            0
                    );

                const quantity =
                    Number(
                        record?.quantity || 0
                    );

                return (
                    <span className="font-semibold">
                        ₹
                        {(
                            finalPrice *
                            quantity
                        ).toLocaleString(
                            "en-IN"
                        )}
                    </span>
                );
            },
        },

        {
            title: "Action",
            key: "action",

            render: (_, record) => (
                <Button
                    type="default"
                    size="small"
                    danger
                    icon={
                        <DeleteOutlined />
                    }
                    loading={
                        removingId ===
                        record._id
                    }
                    disabled={
                        removingId ===
                        record._id
                    }
                    onClick={() =>
                        handleRemove(
                            record._id
                        )
                    }
                    className="!border-none !bg-transparent !shadow-none"
                />
            ),
        },
    ];

    return (
        <>
            <CommonBanner title="Shopping Cart" />

            <section className="py-12 sm:py-16 px-4">
                <div className="container mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <Spin size="large" />
                        </div>
                    ) : cartItems.length ===
                      0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh]">
                            <Empty
                                description={
                                    <>
                                        <p className="text-lg font-semibold text-[#0d0d0d]">
                                            Your
                                            cart
                                            is
                                            empty
                                        </p>

                                        <Link
                                            to="/products"
                                            className="text-[#ff6f61] hover:underline"
                                        >
                                            Continue
                                            Shopping
                                        </Link>
                                    </>
                                }
                            />
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Cart Table */}
                            <div className="lg:col-span-2 bg-white p-4 rounded-lg border shadow-sm overflow-x-auto">
                                <Table
                                    columns={columns}
                                    dataSource={
                                        cartItems
                                    }
                                    rowKey="_id"
                                    pagination={
                                        false
                                    }
                                    loading={
                                        loading
                                    }
                                    className="cart-table"
                                    scroll={{
                                        x: 700,
                                    }}
                                />
                            </div>

                            {/* Summary */}
                            <Card
                                title="Cart Summary"
                                className="shadow-sm h-fit"
                            >
                                <div className="space-y-3">

                                    {/* Subtotal */}
                                    <div className="flex justify-between text-[#545454]">
                                        <span>
                                            Subtotal
                                        </span>

                                        <span>
                                            ₹
                                            {Number(
                                                summary?.subtotal ||
                                                    0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>

                                    {/* Discount */}
                                    {Number(
                                        summary?.totalDiscount ||
                                            0
                                    ) > 0 && (
                                        <div className="flex justify-between text-[#545454]">
                                            <span>
                                                Discount
                                            </span>

                                            <span className="text-green-600">
                                                -₹
                                                {Number(
                                                    summary?.totalDiscount ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {/* Shipping */}
                                    <div className="flex justify-between text-[#545454]">
                                        <span>
                                            Shipping
                                        </span>

                                        <span className="text-green-600">
                                            Free
                                        </span>
                                    </div>

                                    <Divider />

                                    {/* Grand Total */}
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>
                                            Total
                                        </span>

                                        <span className="text-[#ff6f61]">
                                            ₹
                                            {Number(
                                                summary?.grandTotal ||
                                                    0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>

                                    {/* WhatsApp */}
                                    <Button
                                        type="primary"
                                        icon={
                                            <WhatsAppOutlined />
                                        }
                                        onClick={
                                            handleWhatsAppOrder
                                        }
                                        size="large"
                                        className="!bg-black !text-white !border-black !text-center !rounded-sm !w-full !mt-3"
                                    >
                                        Enquire on WhatsApp
                                    </Button>

                                    {/* Continue Shopping */}
                                    <Link to="/products">
                                        <Button
                                            type="link"
                                            block
                                            className="!mt-1 !text-[#0d0d0d]"
                                        >
                                            Continue
                                            Shopping
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Cart;