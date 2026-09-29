import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FiSearch,
    FiUser,
    FiHeart,
    FiShoppingBag,
    FiMenu,
    FiX,
} from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineStorefront } from "react-icons/md";
import {
    Drawer,
    Button,
    Form,
    notification,
} from "antd";

import {
    COMPANY_ADDRESS,
    COMPANY_LOGO,
    SOMETHING_WENT_WRONG,
    SUPPORT_EMAIL,
    SUPPORT_PHONE,
} from "../../constants";

import CustomerAuthModel from "./modals/CustomerAuthModel";
import { authService } from "../../../services/authService";
import { useCart } from "../../../hooks";

const navLinks = [
    {
        label: "Home",
        path: "/home",
    },
    {
        label: "Shop",
        path: "/shop",
    },
    {
        label: "Products",
        path: "/products",
    },
    {
        label: "About",
        path: "/about",
    },
    {
        label: "Contact",
        path: "/contact",
    },
];

const mobileMenuItems = [
    {
        label: "Home",
        path: "/home",
        icon: <AiOutlineHome size={20} />,
    },
    {
        label: "Account",
        path: "/account",
        icon: <FiUser size={20} />,
        openModal: true,
    },
    {
        label: "Shop",
        path: "/shop",
        icon: <MdOutlineStorefront size={20} />,
    },
    {
        label: "Wishlist",
        path: "/wishlist",
        icon: <FiHeart size={20} />,
        badge: 3,
        authOnly: true,
    },
    {
        label: "Cart",
        path: "/cart",
        icon: <FiShoppingBag size={20} />,
        authOnly: true,
    },
];

const CustomerHeader = () => {
    const [messageApi, contextHolder] = notification.useNotification();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userDrawerOpen, setUserDrawerOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("customer_token"));
    const location = useLocation();
    const [form] = Form.useForm();

    // Cart Context
    const { cartCount, getCart } = useCart();

    // Close mobile menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Get cart after customer login
    useEffect(() => {
        if (isAuthenticated) {
            getCart();
        }
    }, [isAuthenticated, getCart]);

    // ------------------------------------------
    // CUSTOMER LOGIN
    // ------------------------------------------

    const customerLogin = async (payload) => {
        try {
            setIsLoader(true);

            console.log(
                "login payload",
                payload
            );

            const response =
                await authService.customerLogin(
                    payload
                );

            console.log(
                "login response",
                response
            );

            if (response.success) {
                localStorage.setItem(
                    "customer_token",
                    response?.user?.token
                );

                localStorage.setItem(
                    "customer_user",
                    JSON.stringify({
                        name: response.user.name,
                        email: response.user.email,
                        role: response.user.role,
                    })
                );

                setIsAuthenticated(true);

                messageApi.success({
                    message: "Success",
                    description:
                        "Customer login successfully!",
                    placement: "topRight",
                });

                setUserDrawerOpen(false);
                setIsLogin(true);
                form.resetFields();
            }
        } catch (error) {
            messageApi.error({
                message: "Server Error",
                description:
                    error?.response?.data?.message ??
                    SOMETHING_WENT_WRONG,
                placement: "topRight",
            });
        } finally {
            setIsLoader(false);
        }
    };

    // ------------------------------------------
    // CUSTOMER REGISTER
    // ------------------------------------------

    const customerRegister = async (payload) => {
        try {
            setIsLoader(true);

            console.log(
                "customer register",
                payload
            );

            const response =
                await authService.customerRegister(
                    payload
                );

            console.log(
                "register response",
                response
            );

            if (response.success) {
                localStorage.setItem(
                    "customer_token",
                    response?.user?.token
                );

                localStorage.setItem(
                    "customer_user",
                    JSON.stringify({
                        name: response.user.name,
                        email: response.user.email,
                        role: response.user.role,
                    })
                );

                setIsAuthenticated(true);

                messageApi.success({
                    message: "Success",
                    description:
                        "Customer registered successfully!",
                    placement: "topRight",
                });

                setUserDrawerOpen(false);
                setIsLogin(true);
                form.resetFields();
            }
        } catch (error) {
            messageApi.error({
                message: "Server Error",
                description:
                    error?.response?.data?.message ??
                    SOMETHING_WENT_WRONG,
                placement: "topRight",
            });
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <>
            {contextHolder}

            {/* ================= HEADER ================= */}

            <header className="sticky top-0 z-50 bg-white px-4 shadow-sm">
                <div className="container mx-auto">

                    {/* ================= NAVBAR ================= */}

                    <nav className="flex items-center justify-between py-6 bg-white">

                        {/* LEFT SIDE */}

                        <div className="grow">

                            {/* DESKTOP NAV */}

                            <ul className="hidden md:flex gap-8">
                                {navLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.path}
                                            className={`text-sm font-medium hover:text-[#ff6f61] transition ${location.pathname ===
                                                link.path
                                                ? "text-[#ff6f61]"
                                                : ""
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* MOBILE MENU ICON */}

                            <div className="md:hidden">
                                <FiMenu
                                    size={24}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setMenuOpen(true)
                                    }
                                />
                            </div>
                        </div>

                        {/* ================= LOGO ================= */}

                        <div className="grow flex justify-center md:inline">
                            <Link to="/home">
                                <img
                                    src={COMPANY_LOGO}
                                    className="object-cover w-[100px] h-[50px]"
                                    alt="logo"
                                />
                            </Link>
                        </div>

                        {/* ================= RIGHT SIDE ================= */}

                        <div className="grow">
                            <div className="flex gap-4 items-center justify-end">

                                {/* SEARCH */}

                                <FiSearch
                                    size={20}
                                    className="cursor-pointer transition text-black hover:text-[#ff6f61]"
                                    onClick={() =>
                                        setSearchOpen(true)
                                    }
                                />

                                {/* USER */}

                                <FiUser
                                    size={20}
                                    className="cursor-pointer hidden md:block text-black hover:text-[#ff6f61] transition"
                                    onClick={() =>
                                        setUserDrawerOpen(
                                            true
                                        )
                                    }
                                />

                                {/* ================= WISHLIST ================= */}

                                {isAuthenticated && (
                                    <div className="relative hidden md:block">

                                        <Link to="/wishlist">

                                            <FiHeart
                                                size={20}
                                                className={`cursor-pointer transition ${location.pathname ===
                                                    "/wishlist"
                                                    ? "text-[#ff6f61]"
                                                    : "text-black hover:text-[#ff6f61]"
                                                    }`}
                                            />

                                            {/* Wishlist Count */}

                                            <span className="absolute -top-2 -right-2 bg-[#ff6f61] text-white text-xs rounded-full px-1">
                                                3
                                            </span>

                                        </Link>

                                    </div>
                                )}

                                {/* ================= CART ================= */}

                                {isAuthenticated && (
                                    <div className="relative">

                                        <Link to="/cart">

                                            <FiShoppingBag
                                                size={20}
                                                className={`cursor-pointer transition ${location.pathname ===
                                                    "/cart"
                                                    ? "text-[#ff6f61]"
                                                    : "text-black hover:text-[#ff6f61]"
                                                    }`}
                                            />

                                            {/* Dynamic Cart Count */}

                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-[#ff6f61] text-white text-xs rounded-full px-1">
                                                    {cartCount}
                                                </span>
                                            )}

                                        </Link>

                                    </div>
                                )}

                            </div>
                        </div>

                    </nav>

                    {/* ================= MOBILE DRAWER ================= */}

                    <Drawer
                        placement="left"
                        onClose={() =>
                            setMenuOpen(false)
                        }
                        open={menuOpen}
                        width={320}
                        closable={false}
                    >

                        {/* CLOSE BUTTON */}

                        <div className="flex items-center justify-between">

                            <Button
                                type="default"
                                icon={<FiX size={24} />}
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="justify-start !border-none text-black hover:!text-[#ff6f61] !shadow-none"
                            />

                        </div>

                        {/* MOBILE NAV */}

                        <div>

                            <ul>

                                {navLinks.map((link) => (
                                    <li
                                        key={link.label}
                                        className="border-b last:border-b-0 border-[#ebebeb] py-3"
                                    >
                                        <Link
                                            to={link.path}
                                            className={`text-sm font-medium hover:text-[#ff6f61] transition ${location.pathname ===
                                                link.path
                                                ? "text-[#ff6f61]"
                                                : ""
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}

                            </ul>

                            {/* MOBILE ACTION BUTTONS */}

                            <div className="flex items-center gap-4 mt-4">

                                {/* WISHLIST */}

                                <Link
                                    to="/wishlist"
                                    onClick={() =>
                                        setMenuOpen(false)
                                    }
                                    className="flex items-center justify-center gap-2 bg-[#ebebeb] rounded text-black font-semibold px-4 py-[10px] text-base hover:bg-black hover:text-white transition duration-300 ease-in-out"
                                >
                                    <FiHeart size={16} />

                                    Wishlist
                                </Link>

                                {/* LOGIN */}

                                {!isAuthenticated && (
                                    <Button
                                        type="default"
                                        size="large"
                                        icon={
                                            <FiUser
                                                size={16}
                                            />
                                        }
                                        onClick={() => {
                                            setMenuOpen(
                                                false
                                            );

                                            setIsLogin(
                                                true
                                            );

                                            setUserDrawerOpen(
                                                true
                                            );
                                        }}
                                        className="bg-[#ebebeb] !rounded !border-none !shadow-none hover:!bg-black text-black font-semibold hover:!text-white"
                                    >
                                        Login
                                    </Button>
                                )}

                            </div>

                            {/* HELP SECTION */}

                            <div className="flex flex-col gap-y-3 mt-4">

                                <Link
                                    to="/contact"
                                    className="text-sm font-medium !text-black"
                                >
                                    Need Help?
                                </Link>

                                <ul className="flex flex-col gap-y-3">

                                    <li className="text-[#545454] text-sm">
                                        Address:{" "}
                                        {COMPANY_ADDRESS}
                                    </li>

                                    <li className="text-[#545454] text-sm">
                                        Email:{" "}
                                        {SUPPORT_EMAIL}
                                    </li>

                                    <li className="text-[#545454] text-sm">
                                        Phone:{" "}
                                        {SUPPORT_PHONE}
                                    </li>

                                </ul>

                            </div>

                        </div>

                    </Drawer>

                    {/* ================= MOBILE BOTTOM NAV ================= */}

                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow z-40">

                        <ul className="flex justify-around text-xs px-[15px] py-[11px]">

                            {mobileMenuItems
                                .filter(
                                    (item) =>
                                        !item.authOnly ||
                                        isAuthenticated
                                )
                                .map((item) => (

                                    <li
                                        key={item.label}
                                        className="relative"
                                    >

                                        {/* ACCOUNT BUTTON */}

                                        {item.openModal ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsLogin(
                                                        true
                                                    );

                                                    setUserDrawerOpen(
                                                        true
                                                    );
                                                }}
                                                className="flex flex-col items-center gap-y-[5px] text-black bg-transparent border-none"
                                            >
                                                {item.icon}

                                                <span className="text-[13px] font-medium text-black">
                                                    {item.label}
                                                </span>
                                            </button>
                                        ) : (

                                            /* NORMAL LINK */

                                            <Link
                                                to={item.path}
                                                className="flex flex-col items-center gap-y-[5px] text-black"
                                            >

                                                {item.icon}

                                                <span className="text-[13px] font-medium text-black">
                                                    {item.label}
                                                </span>

                                                {/* WISHLIST BADGE */}

                                                {item.label ===
                                                    "Wishlist" &&
                                                    item.badge && (
                                                        <span className="absolute top-0 right-2 text-[10px] bg-[#ff6f61] text-white rounded-full px-1">
                                                            {
                                                                item.badge
                                                            }
                                                        </span>
                                                    )}

                                                {/* CART BADGE */}

                                                {item.label ===
                                                    "Cart" &&
                                                    cartCount >
                                                    0 && (
                                                        <span className="absolute top-0 right-2 text-[10px] bg-[#ff6f61] text-white rounded-full px-1">
                                                            {
                                                                cartCount
                                                            }
                                                        </span>
                                                    )}

                                            </Link>
                                        )}

                                    </li>
                                ))}

                        </ul>

                    </div>

                    {/* ================= AUTH MODAL ================= */}

                    <CustomerAuthModel
                        open={userDrawerOpen}
                        onClose={() =>
                            setUserDrawerOpen(false)
                        }
                        isLogin={isLogin}
                        setIsLogin={setIsLogin}
                        handleLogin={customerLogin}
                        handleRegister={
                            customerRegister
                        }
                        isLoader={isLoader}
                        form={form}
                    />

                    {/* ================= SEARCH DRAWER ================= */}

                    <Drawer
                        placement="top"
                        onClose={() =>
                            setSearchOpen(false)
                        }
                        open={searchOpen}
                        className="!h-screen"
                        closable={false}
                    >

                        {/* CLOSE SEARCH */}

                        <div className="flex items-center justify-end">

                            <Button
                                type="default"
                                icon={<FiX size={24} />}
                                onClick={() =>
                                    setSearchOpen(false)
                                }
                                className="!border-none text-black hover:!text-[#ff6f61]"
                            />

                        </div>

                        {/* SEARCH CONTENT */}

                        <div className="py-6">

                            <h2 className="text-[32px] text-center mb-[42px] font-medium">
                                What are you looking for?
                            </h2>

                        </div>

                    </Drawer>

                </div>
            </header>
        </>
    );
};

export default CustomerHeader;