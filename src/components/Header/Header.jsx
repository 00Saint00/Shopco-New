import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo/SHOP.CO.svg";
import cart from "../../assets/logo/cart.svg";
import { Menu, Button } from "@headlessui/react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  CircleUser,
  Clipboard,
  User,
  ClipboardCheck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const menuRef = useRef(null);
  const cartRef = useRef(null);

  // ✅ Load user & cart info
  // useEffect(() => {
  //   const loadUser = () => {
  //     const storedUser = localStorage.getItem("user");
  //     setUser(storedUser ? JSON.parse(storedUser) : null);
  //   };

  //   const loadCart = () => {
  //     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  //     setCartCount(savedCart.length);
  //   };

  //   loadUser();
  //   loadCart();

  //   // Listen for storage updates (user/cart changes)
  //   window.addEventListener("storageUpdate", () => {
  //     loadUser();
  //     loadCart();
  //   });

  //   return () =>
  //     window.removeEventListener("storageUpdate", () => {
  //       loadUser();
  //       loadCart();
  //     });
  // }, []);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = savedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    // Initial load
    loadUser();
    loadCart();

    // ✅ Listen for storage updates (triggered by add/remove functions)
    const handleStorageUpdate = () => {
      loadUser();
      loadCart();
    };

    window.addEventListener("storageUpdate", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate); // also works cross-tab

    return () => {
      window.removeEventListener("storageUpdate", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  useGSAP(() => {
    // GSAP target may be null if the overlay hasn't mounted yet.
    const run = () => {
      const el = menuRef.current;
      if (!el) return;

      if (navOpen) {
        gsap.fromTo(
          el,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
        const items = el.querySelectorAll("li");
        if (items && items.length) {
          gsap.fromTo(
            items,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.1 }
          );
        }
      } else {
        gsap.to(el, {
          y: -20,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    };

    // If the ref isn't yet set (render timing), postpone the run one tick.
    if (!menuRef.current) {
      const id = setTimeout(() => {
        run();
      }, 0);
      return () => clearTimeout(id);
    }

    run();
    return () => {
      // cleanup any tweens on the element
      if (menuRef.current) gsap.killTweensOf(menuRef.current);
    };
  }, [navOpen]);

  // ✅ Logout clears user & cart instantly
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("storageUpdate"));
  };

  return (
    <header className="flex justify-between items-center lg:px-[100px] px-[16px] bg-white shadow-sm relative z-50">
      <div className="flex justify-between items-center w-full lg:py-[24px] py-[12px]">
        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center">
          <button onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? (
              <X className="h-[24px] w-[24px]" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[24px] w-[24px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={logo}
            alt="Logo"
            className="h-[22px] w-[160px]"
            loading="eager"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-[24px] ml-[40px]">
          <Menu as="li" className="relative list-none">
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center gap-2 cursor-pointer">
                  <span>Shop</span>
                  {open ? (
                    <ChevronUp className="h-[16px] w-[16px]" />
                  ) : (
                    <ChevronDown className="h-[16px] w-[16px]" />
                  )}
                </Menu.Button>

                <Menu.Items className="absolute bg-white shadow-md py-2 min-w-[200px] mt-2 rounded-md z-40">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/category/men"
                        className={`block px-4 py-2 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        Men
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/category/women"
                        className={`block px-4 py-2 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        Women
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </>
            )}
          </Menu>

          <Link to="/on-sale">On Sale</Link>
          <Link to="shop/latest-product">New Arrival</Link>
          <Link to="/brands">Brands</Link>
        </nav>

        {/* Search (Desktop Only) */}
        <div className="hidden lg:flex items-center border-0 rounded-[62px] px-[16px] py-[12px] bg-[#f0f0f0] w-[577px] h-[48px]">
          <Search className="h-[24px] w-[24px] text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            className="px-4 py-2 flex-1 focus:outline-none bg-transparent"
          />
        </div>

        {/* User / Cart Section */}
        <div className="flex items-center gap-[14px]">
          <div className="relative" ref={cartRef}>
            <Link to="/cart">
              <img
                src={cart}
                alt="Cart"
                className="h-[24px] w-[24px]"
                loading="lazy"
              />
            </Link>

            {/* 🔵 Blue badge */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center shadow-md">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>

          {user ? (
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <Menu.Button className="flex items-center gap-2 focus:outline-none">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-[32px] w-[32px] rounded-full"
                      loading="lazy"
                    />
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-400 ease-out ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </Menu.Button>

                  <Menu.Items
                    className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 transition-all duration-300 ease-out ${
                      open
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2"
                    }`}
                  >
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } flex items-center w-full px-4 py-2 text-sm text-gray-800`}
                        >
                          <User className="h-4 w-4 mr-2" />
                          My Profile
                        </Link>
                      )}
                    </Menu.Item>

                    {user.role === "admin" && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`${
                              active ? "bg-gray-100" : ""
                            } flex items-center w-full px-4 py-2 text-sm text-gray-800`}
                          >
                            <ClipboardCheck className="h-4 w-4 mr-2" />
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                    )}

                    <Menu.Item>
                      {({ active }) => (
                        <Button
                          onClick={handleLogout}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                        >
                          <Clipboard className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </>
              )}
            </Menu>
          ) : (
            <Link to="/login">
              <CircleUser />
            </Link>
          )}
        </div>
      </div>

      {/* ===========================
          MOBILE NAV OVERLAY
      =========================== */}
      {navOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 w-full bg-white shadow-md sm:hidden animate-fadeIn p-6 z-40"
        >
          <ul className="flex flex-col gap-4 text-lg font-medium">
            <li>
              <Menu as="div" className="relative w-full">
                {({ open }) => (
                  <>
                    <Menu.Button className="flex justify-between items-center w-full">
                      <span>Shop</span>
                      {open ? (
                        <ChevronUp className="h-[18px] w-[18px]" />
                      ) : (
                        <ChevronDown className="h-[18px] w-[18px]" />
                      )}
                    </Menu.Button>

                    <Menu.Items className="static mt-2 rounded-md bg-gray-50 p-2">
                      <Menu.Item>
                        <Link
                          to="/category/men"
                          className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                          Men
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          to="/category/women"
                          className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                          Women
                        </Link>
                      </Menu.Item>
                    </Menu.Items>
                  </>
                )}
              </Menu>
            </li>

            <li>
              <Link to="/on-sale" onClick={() => setNavOpen(false)}>
                On Sale
              </Link>
            </li>
            <li>
              <Link to="/new-arrival" onClick={() => setNavOpen(false)}>
                New Arrival
              </Link>
            </li>
            <li>
              <Link to="/brands" onClick={() => setNavOpen(false)}>
                Brands
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
