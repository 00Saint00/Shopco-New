import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../UI/Tabs.jsx";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import axios from "axios";
import { Button } from "@headlessui/react";
import { TruckElectricIcon } from "lucide-react";
import { account } from "../../lib/appwrite";
// import Orders from "./Orders";

const Profile = () => {
  const [serverError, setServerError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // const handleSubmit = async (formData) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     setServerError("You must be logged in to change your password");
  //     return;
  //   }

  //   try {
  //     // Get user ID from localStorage
  //     const storedUser = JSON.parse(localStorage.getItem("user"));
  //     const userId = storedUser?.id || storedUser?._id;

  //     if (!userId) {
  //       setServerError("User ID not found");
  //       return;
  //     }

  //     // Update password - send only the new password to the API
  //     const { data: responseData } = await axios.put(
  //       `${API_BASE}/users/${userId}`,
  //       { password: formData.newPassword },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     console.log("Password changed successfully:", responseData);
  //     setServerError(null);
  //     setShowChangePassword(false);

  //     // Optionally: show success message or reset form
  //   } catch (err) {
  //     setServerError(err.response?.data?.message || "Change password failed");
  //   }
  // };

  const handleSubmit = async (formData) => {
    try {
      await account.updatePassword(formData.newPassword, formData.oldPassword);
      console.log("Password changed successfully");
      setServerError(null);
      setShowChangePassword(false);
    } catch (error) {
      console.error("Password change failed:", error);
      setServerError("Incorrect old password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row px-[16px] lg:px-[100px] pt-[80px] pb-[90%] lg:pb-[168px]">
      <Tabs
        defaultValue="profile"
        className="w-full flex flex-col lg:flex-row gap-0"
      >
        <div className="flex flex-col lg:flex-row w-full">
          {/* Sidebar / Top nav */}
          <div className="w-full lg:w-44 lg:border-r lg:pr-6 mb-6 lg:mb-0 shrink-0">
            <TabsList className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 overflow-x-auto bg-transparent p-0 h-auto w-full rounded-none">
              <TabsTrigger
                value="profile"
                className="block px-4 py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-bold w-full justify-start"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="block px-4 py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-bold w-full justify-start"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="block px-4 py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-bold w-full justify-start"
              >
                Wishlist
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="block px-4 py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-bold w-full justify-start"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Main content */}
          <div className="flex-1 lg:pl-8 w-full min-w-0">
            <TabsContent value="profile" className="mt-0 outline-none">
              <div>
                <ProfileInfo />
              </div>
            </TabsContent>
            <TabsContent value="orders" className="mt-0 outline-none">
              <div>{/* <Orders /> */}</div>
            </TabsContent>
            <TabsContent value="wishlist" className="mt-0 outline-none">
              <div>Your wishlist here</div>
            </TabsContent>
            <TabsContent value="settings" className="mt-0 outline-none">
              <div>
                {/* SETTINGS PANEL */}
                {!showChangePassword ? (
                  <div className="flex flex-col gap-4">
                    <Button
                      className="rounded bg-black px-4 py-2 text-sm text-white data-hover:bg-black/80 data-hover:data-active:bg-black/80 cursor-pointer w-full lg:w-60"
                      onClick={() => setShowChangePassword("password")}
                    >
                      Change Password
                    </Button>

                    <Button
                      className="rounded bg-black px-4 py-2 text-sm text-white data-hover:bg-black/80 data-hover:data-active:bg-black/80 cursor-pointer w-full lg:w-60"
                      onClick={() => setShowChangePassword("help")}
                    >
                      Help Center
                    </Button>
                  </div>
                ) : showChangePassword === "password" ? (
                  <div>
                    <ChangePassword
                      onSubmit={handleSubmit}
                      serverError={serverError}
                    />
                    <button
                      onClick={() => setShowChangePassword(false)}
                      className="mt-4 text-gray-600 hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Help Center</h2>
                    <p className="text-gray-700 mb-4">
                      For support, please contact us via email at{" "}
                      <a
                        href="mailto:support@example.com"
                        className="text-black underline"
                      >
                        support@example.com
                      </a>{" "}
                      or visit our FAQs.
                    </p>
                    <button
                      onClick={() => setShowChangePassword(false)}
                      className="mt-4 text-gray-600 hover:text-black"
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Profile;
