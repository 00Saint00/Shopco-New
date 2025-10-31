import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { PencilIcon, Check, X } from "lucide-react";

const API_BASE = "https://api.escuelajs.co/api/v1";
const ProfileInfo = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  // const [nameInput, setNameInput] = useState("");
  const [serverError, setServerError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const parsed = JSON.parse(storedUser);
  //     setUser(parsed);
  //     // setNameInput(parsed.name);
  //     setFormData({
  //       name: parsed.name,
  //       email: parsed.email,
  //       avatar: parsed.avatar,
  //     });
  //   } else {
  //     navigate("/login", { state: { from: location } });
  //   }
  // }, [navigate, location]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name,
      email: parsedUser.email,
      avatar: parsedUser.avatar,
    });

    // Optional: fetch fresh data from API to stay up-to-date
    axios
      .get(`${API_BASE}/users/${parsedUser.id || parsedUser._id}`)
      .then(({ data }) => {
        if (!data || typeof data !== "object") return;
        // Only update local state/storage when we received a valid user object
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          avatar: data.avatar || "",
        });
        try {
          localStorage.setItem("user", JSON.stringify(data));
          window.dispatchEvent(new Event("storageUpdate"));
        } catch (e) {
          console.warn("Could not persist user to localStorage", e);
        }
      })
      .catch((err) => console.warn("Could not fetch fresh user data:", err));
  }, [navigate, location]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.put(
        `${API_BASE}/users/${user.id || user._id}`,
        // { ...user, name: nameInput },
        { ...user, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setIsEditing(false);
      setServerError(null);
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed");
    }
  };

  const handleCancel = () => {
    // setNameInput(user.name);
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
    setIsEditing(false);
    setServerError(null);
  };

  if (!user) return null;

  return (
    <div className="profile-info space-y-2">
      <div className="flex items-center space-x-2 pb-3">
        {isEditing === "avatar" ? (
          <div className="flex items-center space-x-2">
            <input
              name="avatar"
              className="border rounded px-2 py-1"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              placeholder="Enter avatar URL"
            />
            <button
              className="text-green-600 hover:text-green-800"
              onClick={handleSave}
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={handleCancel}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-[40px] w-[40px] rounded-full"
            />
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing("avatar")}
            >
              <PencilIcon className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 pb-3">
        {isEditing === "name" ? (
          <>
            <input
              name="name"
              className="border rounded px-2 py-2 text-[20px]"
              value={formData.name}
              // onChange={(e) => setNameInput(e.target.value)}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <button
              className="text-green-600 hover:text-green-800"
              onClick={handleSave}
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={handleCancel}
            >
              <X className="h-2 lg:h-5 w-2 lg:w-5" />
            </button>
          </>
        ) : (
          <>
            <span className="text-[25px] font-semibold">{user.name}</span>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing("name")}
            >
              <PencilIcon className="h-3 w-3" />
            </button>
          </>
        )}
      </div>
      <div className="flex items-center space-x-2 pb-3">
        {isEditing === "email" ? (
          <>
            <input
              name="email"
              className="border rounded px-2 py-2 text-[20px]"
              value={formData.email}
              // onChange={(e) => setNameInput(e.target.value)}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <button
              className="text-green-600 hover:text-green-800"
              onClick={handleSave}
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={handleCancel}
            >
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <span className="text-[25px] font-semibold">{user.email}</span>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing("email")}
            >
              <PencilIcon className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      {serverError && <p className="text-red-500">{serverError}</p>}
    </div>
  );
};

export default ProfileInfo;
