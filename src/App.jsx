import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import ProductDetail from "./components/Detail/ProductDetail";
import AuthRoute from "./components/Utils/AuthRoute.jsx";
import AuthPage from "./components/Auth/AuthPage.jsx";
import Cart from "./components/Cart/Cart.jsx";
import Profile from "./components/Profile/Profile.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Router>
        <Header />
        <div className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id/:slug" element={<ProductDetail />} />
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
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
