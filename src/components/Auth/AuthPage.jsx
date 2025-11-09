import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import Login from "./Login";
import Register from "./Register";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "../../store/slices/authSlice";
import { clearCart } from "../../store/slices/cartSlice";

const API_URL = "https://api.escuelajs.co/api/v1/users";
const Register_URL = "https://api.escuelajs.co/api/v1/users";
const API_BASE = "https://api.escuelajs.co/api/v1";

const AuthPage = () => {
  const [serverError, setServerError] = useState(null);
  // const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const from = location.state?.from || "/";

  // const handleSubmit = async ({ email, password }) => {
  //   setServerError(null);
  //   try {
  //     const { data } = await axios.get(API_URL);

  //     const users = Array.isArray(data) ? data : data.data ?? [];

  //     // DEMO rule: password === username
  //     const user = users.find(
  //       (u) =>
  //         u.email.toLowerCase() === email.toLowerCase() &&
  //         u.password === password
  //     );

  //     if (!user) {
  //       setServerError("Invalid email or password");
  //       return;
  //     }

  //     // success → save and redirect
  //     localStorage.setItem("user", JSON.stringify(user));
  //     // window.location.href = "/"; // change route if needed
  //     console.log("✅ Yup! We are logged in:", user);
  //   } catch (err) {
  //     setServerError(err.response?.data?.message || "Login failed");
  //   }
  // };
  // ✅ LOGIN
  const handleSubmit = async ({ email, password }) => {
    setServerError(null);
    try {
      // 1) Login → get token
      // Use full API base so requests work in dev/prod (not rely on a proxy)
      const { data } = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { access_token } = data; // API returns { access_token, refresh_token }

      if (!access_token) {
        setServerError("Login failed: No token received");
        return;
      }

      // 2) Fetch user profile with token
      const profileRes = await axios.get(`${API_BASE}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      dispatch(login({
        user: profileRes.data,
        token: access_token,
      }));

      // 3) Store token + user
      const expiresIn = 60 * 60 * 1000; // 1 hour session
      const expiryTime = Date.now() + expiresIn;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(profileRes.data));
      localStorage.setItem("expiryTime", expiryTime.toString());

      // 🔑 Broadcast update so Header picks it up
      // window.dispatchEvent(new Event("storageUpdate"));

      // 4) Auto-logout after expiry
      setTimeout(() => {
        dispatch(logout());
        dispatch(clearCart());

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("expiryTime");
        localStorage.removeItem("cart"); // Clear cart on auto-logout
        window.location.href = "/login"; // redirect to login
      }, expiresIn);

      // setUser(profileRes.data);

      console.log("✅ Logged in user:", profileRes.data);
      // window.location.href = "/";
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed");
    }
  };

  // ✅ REGISTER
  const handleRegister = async ({ name, email, password, role, avatar }) => {
    setServerError(null);

    try {
      const payload = {
        name,
        email,
        password,
        role: "customer",
        avatar: avatar ?? null,
      };
      const { data: newUser } = await axios.post(`${API_BASE}/users`, payload);

      localStorage.setItem("user", JSON.stringify(newUser));
      console.log("✅ Registered user:", newUser);
      window.location.href = "/";
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="px-[16px] lg:px-[100px] pt-[80px] pb-[90%] lg:pb-[168px]">
      <h1 className="text-2xl font-bold mb-6">Authentication</h1>

      <div className="w-full max-w-md mx-auto">
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-300">
            <Tab className="flex-1 px-4 py-2 text-center font-medium ui-selected:border-b-2 ui-selected:border-black ui-selected:text-black">
              Login
            </Tab>
            <Tab className="flex-1 px-4 py-2 text-center font-medium ui-selected:border-b-2 ui-selected:border-black ui-selected:text-black">
              Register
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-6">
            {/* Login Form */}
            <Tab.Panel>
              <Login onSubmit={handleSubmit} serverError={serverError} />
            </Tab.Panel>

            {/* Register Form */}
            <Tab.Panel>
              <Register onSubmit={handleRegister} serverError={serverError} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default AuthPage;
