import { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadCartFromStorage, clearCart } from "./store/slices/cartSlice";
import { loadUserFromStorage, logout } from "./store/slices/authSlice";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Spinner from "./components/UI/Spiner";
import AuthRoute from "./components/Utils/AuthRoute.jsx";
// import OnSale from "./components/Sale/OnSale.jsx";

// Lazy load routes - only load when needed (reduces initial bundle size)
const ProductDetail = lazy(() => import("./components/Detail/ProductDetail"));
const AuthPage = lazy(() => import("./components/Auth/AuthPage"));
const Cart = lazy(() => import("./components/Cart/Cart"));
const Profile = lazy(() => import("./components/Profile/Profile"));
const Shop = lazy(() => import("./components/Shop/Shop"));

// ScrollToTop component - scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const checkExpiry = () => {
  //     const expiryTime = localStorage.getItem("expiryTime");
  //     if (expiryTime && Date.now() > Number(expiryTime)) {
  //       // expired → clear storage
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("user");
  //       localStorage.removeItem("expiryTime");
  //       localStorage.removeItem("cart"); // Clear cart on session expiry
  //       window.location.href = "/login"; // redirect to login
  //     }
  //   };

  //   // run once on load
  //   checkExpiry();

  //   // run every 5s to catch expiry while browsing
  //   const interval = setInterval(checkExpiry, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    // Load cart
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    dispatch(loadCartFromStorage(savedCart));

    // Load user
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      dispatch(
        loadUserFromStorage({
          user: JSON.parse(savedUser),
          token: savedToken,
        })
      );
    }
  }, [dispatch]);

  // Check for session expiry and update Redux
  useEffect(() => {
    const checkExpiry = () => {
      const expiryTime = localStorage.getItem("expiryTime");
      if (expiryTime && Date.now() > Number(expiryTime)) {
        // Update Redux
        dispatch(logout());
        dispatch(clearCart());

        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("expiryTime");
        localStorage.removeItem("cart");
        window.location.href = "/login";
      }
    };

    // run once on load
    checkExpiry();

    // run every 5s to catch expiry while browsing
    const interval = setInterval(checkExpiry, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div>
      <Router>
        <ScrollToTop />
        <Header />
        <div className="">
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id/:slug" element={<ProductDetail />} />
              <Route path="/shop/:sortBy?" element={<Shop />} />
              <Route path="/category/:categoryName/:sortBy?" element={<Shop />} />
              <Route path="/on-sale/:sortBy?" element={<Shop />} />
              <Route
                path="/login"
                element={
                  <AuthRoute type="guest">
                    <AuthPage />
                  </AuthRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <AuthRoute type="protected">
                    <Profile />
                  </AuthRoute>
                }
              />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
