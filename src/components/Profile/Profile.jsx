import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import axios from "axios";
import { Button } from "@headlessui/react";
import { TruckElectricIcon } from "lucide-react";
// import Orders from "./Orders";

const API_BASE = "https://api.escuelajs.co/api/v1";
const CHANGE_PASSWORD_URL = `${API_BASE}/auth/change-password`;

const Profile = () => {
  const [serverError, setServerError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setServerError("You must be logged in to change your password");
      return;
    }

    try {
      // Get user ID from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id || storedUser?._id;

      if (!userId) {
        setServerError("User ID not found");
        return;
      }

      // Update password - send only the new password to the API
      const { data: responseData } = await axios.put(
        `${API_BASE}/users/${userId}`,
        { password: formData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Password changed successfully:", responseData);
      setServerError(null);
      setShowChangePassword(false);

      // Optionally: show success message or reset form
    } catch (err) {
      setServerError(err.response?.data?.message || "Change password failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row px-[16px] lg:px-[100px] pt-[80px] pb-[90%] lg:pb-[168px]">
      <Tab.Group className="w-full">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Sidebar / Top nav */}
          <Tab.List className="w-full lg:w-44 lg:border-r lg:pr-6 mb-6 lg:mb-0">
            <ul className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 overflow-x-auto">
              <li>
                <Tab
                  className={({ selected }) =>
                    `block px-4 py-2 rounded ${
                      selected ? "bg-black text-white font-bold" : ""
                    }`
                  }
                >
                  Profile
                </Tab>
              </li>
              <li>
                <Tab
                  className={({ selected }) =>
                    `block px-4 py-2 rounded ${
                      selected ? "bg-black text-white font-bold" : ""
                    }`
                  }
                >
                  Orders
                </Tab>
              </li>
              <li>
                <Tab
                  className={({ selected }) =>
                    `block px-4 py-2 rounded ${
                      selected ? "bg-black text-white font-bold" : ""
                    }`
                  }
                >
                  Wishlist
                </Tab>
              </li>
              <li>
                <Tab
                  className={({ selected }) =>
                    `block px-4 py-2 rounded ${
                      selected ? "bg-black text-white font-bold" : ""
                    }`
                  }
                >
                  Settings
                </Tab>
              </li>
            </ul>
          </Tab.List>

          {/* Main content */}
          <Tab.Panels className="flex-1 lg:pl-8 w-full">
            <Tab.Panel>
              <div>
                <ProfileInfo />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div>{/* <Orders /> */}</div>
            </Tab.Panel>
            <Tab.Panel>
              <div>Your wishlist here</div>
            </Tab.Panel>
            <Tab.Panel>
              {/* <div>Change password / settings</div> */}
              {/* <div>
                <ChangePassword onSubmit={handleSubmit} serverError={serverError}/>
              </div> */}

              <div>
                {!showChangePassword ? (
                  <div className="flex flex-col gap-4">
                    {/* <ChangePassword
                      onSubmit={handleSubmit}
                      serverError={serverError}
                    /> */}
                    {/* Optional: Add a cancel/back button */}
                    {/* <button
                      onClick={() => setShowChangePassword(false)}
                      className="mt-4 text-gray-600 hover:text-black"
                    >
                      Cancel
                    </button> */}
                    <Button className="rounded bg-black px-4 py-2 text-sm text-white data-hover:bg-black/80 data-hover:data-active:bg-black/80 cursor-pointer w-full lg:w-60" onClick={() => setShowChangePassword(true)}>
                      Change Password{" "}
                    </Button>

                    <Button className="rounded bg-black px-4 py-2 text-sm text-white data-hover:bg-black/80 data-hover:data-active:bg-black/80 cursor-pointer w-full lg:w-60" >
                    Help Center{" "}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <ChangePassword
                      onSubmit={handleSubmit}
                      serverError={serverError}
                    />
                    {/* Optional: Add a cancel/back button */}
                    <button
                      onClick={() => setShowChangePassword(false)}
                      className="mt-4 text-gray-600 hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};

export default Profile;
