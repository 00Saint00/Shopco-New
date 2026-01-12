import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { PencilIcon, Check, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/authSlice";
import { account, tables, storage, config, ID } from "../../lib/appwrite";
import {
  updateUserProfile,
  updateSellersProfile,
} from "../../services/authservice";

// const API_BASE = "https://api.escuelajs.co/api/v1";
const ProfileInfo = () => {
  // const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  // const [nameInput, setNameInput] = useState("");
  const [serverError, setServerError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    shopName: "",
    shopUrl: "",
    contactEmail: "",
    contactPhone: "",
    shopAddress: "",
    verified: false,
    applicationStatus: "",
  });
  const [show, setShow] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [showSellerForm, setShowSellerForm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  //get state from redux
  const user = useSelector((state) => state.auth.user);

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
    // const storedUser = localStorage.getItem("user");
    // if (!storedUser) {
    //   navigate("/login", { state: { from: location } });
    //   return;
    // }

    // const parsedUser = JSON.parse(storedUser);
    // // setUser(parsedUser);
    // dispatch(updateUser(parsedUser))
    // setFormData({
    //   name: parsedUser.name,
    //   email: parsedUser.email,
    //   avatar: parsedUser.avatar,
    // });

    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login", { state: { from: location } });
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      dispatch(updateUser(parsedUser));
      setFormData({
        name: mergeData.name,
        email: mergeData.email,
        avatar: mergeData.avatar,
        phone: mergeData.phone,
        address: mergeData.address,
        city: mergeData.city,
        state: mergeData.state,
        country: mergeData.country,
        shopName: mergeData.shopName,
        shopUrl: mergeData.shopUrl,
        contactEmail: mergeData.contactEmail,
        contactPhone: mergeData.contactPhone,
        shopAddress: mergeData.shopAddress,
        verified: mergeData.verified,
      });
      return;
    }

    const fetchUser = async () => {
      try {
        const accountUser = await account.get();

        // Fetch role from database table (usersTableId) - role is stored as enum in database
        let userRole = "customer"; // default
        try {
          const userRow = await tables.getRow({
            databaseId: config.databaseId,
            tableId: config.usersTableId,
            rowId: accountUser.$id,
          });
          userRole = userRow?.role || "customer";
        } catch (error) {
          console.error("Error fetching user role from database:", error);
          // Default to "customer" if row doesn't exist
        }

        // Fetch customer data for all users (sellers can also have phone/address)
        let customerRow = null;
        try {
          customerRow = await tables.getRow({
            databaseId: config.databaseId,
            tableId: config.customersTableId,
            rowId: accountUser.$id,
          });
        } catch (error) {
          // Customer row doesn't exist yet, that's okay
          customerRow = null;
        }
        // seller
        let sellerRow = null;
        // if (userRole === "seller") {
        try {
          sellerRow = await tables.getRow({
            databaseId: config.databaseId,
            tableId: config.sellersTableId,
            rowId: accountUser.$id,
          });
        } catch (error) {
          console.log("Seller row doesn't exist yet, using empty values");
          sellerRow = null;
        }

        let finalRole = userRole;

        if (
          sellerRow?.applicationStatus === "approved" &&
          userRole !== "seller"
        ) {
          try {
            // await account.updatePrefs({ role: "seller" });

            try {
              await tables.updateRow({
                databaseId: config.databaseId,
                tableId: config.usersTableId,
                rowId: accountUser.$id,
                data: { role: "seller" },
              });
              console.log("✅ Role updated in usersTable");
            } catch (updateError) {
              // If row doesn't exist, create it
              if (
                updateError.code === 404 ||
                updateError.message?.includes("not found")
              ) {
                console.log("Row doesn't exist, creating it...");
                await tables.createRow({
                  databaseId: config.databaseId,
                  tableId: config.usersTableId,
                  rowId: accountUser.$id,
                  data: {
                    name: accountUser.name,
                    email: accountUser.email,
                    role: "seller",
                  },
                });
                console.log("✅ Role created in usersTable");
              } else {
                console.error(
                  "Error updating role in usersTable:",
                  updateError
                );
              }
            }

            finalRole = "seller";
          } catch (error) {
            console.error("Error updating role to seller:", error);
          }
        }

        const mergeData = {
          uid: accountUser.$id,
          name: accountUser.name,
          email: accountUser.email,
          avatar: accountUser.prefs?.avatar || null,
          role: finalRole,
          phone: customerRow?.phone || "",
          address: customerRow?.address || "",
          city: customerRow?.city || "",
          state: customerRow?.state || "",
          country: customerRow?.country || "",
          applicationStatus: sellerRow?.applicationStatus || "",
          shopName: sellerRow?.shopName || "",
          shopUrl: sellerRow?.shopUrl || "",
          contactEmail: sellerRow?.contactEmail || "",
          contactPhone: sellerRow?.contactPhone || "",
          shopAddress: sellerRow?.shopAddress || "",
          verified: sellerRow?.verified || false,
        };
        dispatch(updateUser(mergeData));
        setFormData({
          name: mergeData.name,
          email: mergeData.email,
          avatar: mergeData.avatar,
          phone: mergeData.phone,
          address: mergeData.address,
          city: mergeData.city,
          state: mergeData.state,
          country: mergeData.country,
          applicationStatus: mergeData.applicationStatus,
          shopName: mergeData.shopName,
          shopUrl: mergeData.shopUrl,
          contactEmail: mergeData.contactEmail,
          contactPhone: mergeData.contactPhone,
          shopAddress: mergeData.shopAddress,
          verified: mergeData.verified,
        });

        localStorage.setItem("user", JSON.stringify(mergeData));
        window.dispatchEvent(new Event("storageUpdate"));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [navigate, location, dispatch]);

  // Cleanup avatar preview URL when component unmounts or avatar changes
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Optional: fetch fresh data from API to stay up-to-date
  //   axios
  //     .get(`${API_BASE}/users/${user.id || user._id}`)
  //     .then(({ data }) => {
  //       if (!data || typeof data !== "object") return;
  //       // Only update local state/storage when we received a valid user object
  //       // setUser(data);
  //       dispatch(updateUser(data));
  //       setFormData({
  //         name: data.name || "",
  //         email: data.email || "",
  //         avatar: data.avatar || "",
  //       });
  //       try {
  //         localStorage.setItem("user", JSON.stringify(data));
  //         window.dispatchEvent(new Event("storageUpdate"));
  //       } catch (e) {
  //         console.warn("Could not persist user to localStorage", e);
  //       }
  //     })
  //     .catch((err) => console.warn("Could not fetch fresh user data:", err));
  // }, [navigate, location, dispatch, user]);

  // const handleSave = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   try {
  //     const { data } = await axios.put(
  //       `${API_BASE}/users/${user.id || user._id}`,
  //       // { ...user, name: nameInput },
  //       { ...user, ...formData },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     // setUser(data);
  //     // localStorage.setItem("user", JSON.stringify(data));
  //     dispatch(updateUser(data));
  //     setIsEditing(false);
  //     setServerError(null);
  //   } catch (err) {
  //     setServerError(err.response?.data?.message || "Update failed");
  //   }
  // };

  const handleSellerSubmit = async () => {
    try {
      const result = await updateSellersProfile({
        shopName: formData.shopName,
        shopUrl: formData.shopUrl,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        shopAddress: formData.shopAddress,
        city: formData.city,
      });

      if (result.success) {
        // Close form
        setShowSellerForm(false);
        setServerError(null);

        //refresh user data
        const accountUser = await account.get();
        let sellerRow = null;
        try {
          sellerRow = await tables.getRow({
            databaseId: config.databaseId,
            tableId: config.sellersTableId,
            rowId: accountUser.$id,
          });
        } catch (error) {
          console.error("Error fetching seller data:", error);
        }
        const updatedData = {
          ...user,
          applicationStatus: sellerRow?.applicationStatus || "pending",
          shopName: sellerRow?.shopName || formData.shopName,
          shopUrl: sellerRow?.shopUrl || formData.shopUrl,
          contactEmail: sellerRow?.contactEmail || formData.contactEmail,
          contactPhone: sellerRow?.contactPhone || formData.contactPhone,
          shopAddress: sellerRow?.shopAddress || formData.shopAddress,
          city: sellerRow?.city || formData.city,
        };

        dispatch(updateUser(updatedData));
        localStorage.setItem("user", JSON.stringify(updatedData));
      } else {
        setServerError(result.error);
      }
    } catch (error) {
      setServerError("Failed to submit application");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      if (isEditing === "name") {
        await account.updateName(formData.name);
      }
      if (isEditing === "avatar") {
        let avatarUrl = formData.avatar;

        // If a file was selected, upload it to Appwrite Storage
        if (avatarFile) {
          try {
            const fileId = ID.unique();
            console.log("📤 Uploading avatar file...");

            // Upload file to Appwrite Storage
            await storage.createFile(config.storageId, fileId, avatarFile);

            // Get public URL for the uploaded file
            avatarUrl = `${config.endpoint}/storage/buckets/${config.storageId}/files/${fileId}/view?project=${config.projectId}`;

            console.log("✅ Avatar uploaded:", avatarUrl);
          } catch (uploadError) {
            console.error("❌ Avatar upload error:", uploadError);
            setServerError("Failed to upload avatar. Please try again.");
            return;
          }
        }

        // Update account preferences with the avatar URL
        await account.updatePrefs({ avatar: avatarUrl });
      }

      if (
        isEditing === "phone" ||
        isEditing === "address" ||
        isEditing === "city" ||
        isEditing === "state" ||
        isEditing === "country"
      ) {
        const result = await updateUserProfile({
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        });

        if (!result.success) {
          setServerError(result.error);
          return; // Stop here if update failed
        }
      }

      const updatedUser = await account.get();

      // Fetch customer row (with error handling)
      let customerRow = null;
      try {
        customerRow = await tables.getRow({
          databaseId: config.databaseId,
          tableId: config.customersTableId,
          rowId: updatedUser.$id,
        });
      } catch (error) {
        console.log("Customer row doesn't exist yet");
        customerRow = null;
      }

      // Fetch role from database table (usersTableId) - role is stored as enum in database
      let userRole = "customer"; // default
      try {
        const userRow = await tables.getRow({
          databaseId: config.databaseId,
          tableId: config.usersTableId,
          rowId: updatedUser.$id,
        });
        userRole = userRow?.role || "customer";
      } catch (error) {
        console.error("Error fetching user role from database:", error);
        // Default to "customer" if row doesn't exist
      }

      const userData = {
        uid: updatedUser.$id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.prefs?.avatar || null,
        role: userRole, // ✅ Get role from database table
        phone: customerRow?.phone || "",
        address: customerRow?.address || "",
        city: customerRow?.city || "",
        state: customerRow?.state || "",
        country: customerRow?.country || "",
      };

      // Update everything
      dispatch(updateUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      setFormData({
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        country: userData.country,
      });

      setIsEditing(null);
      setServerError(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
    });
    // Clear avatar preview and file
    setAvatarPreview("");
    setAvatarFile(null);
    setIsEditing(false);
    setServerError(null);
  };

  if (!user) return null;

  return (
    <div className="profile-info space-y-2">
      <div className="flex items-center space-x-2 pb-3">
        {isEditing === "avatar" ? (
          <div className="flex flex-col space-y-2">
            <input
              type="file"
              accept="image/*"
              className="border rounded px-2 py-1"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatarFile(file);
                  const previewURL = URL.createObjectURL(file);
                  setAvatarPreview(previewURL);
                }
              }}
            />
            {avatarPreview && (
              <div className="mt-2">
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
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
        <span className="text-[25px] font-semibold">{user.email}</span>
      </div>
      {/* PHONE */}
      <div className="flex items-center space-x-2 pb-3">
        {isEditing === "phone" ? (
          <>
            <input
              name="phone"
              className="border rounded px-2 py-2 text-[20px]"
              value={formData.phone}
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
            <span className="text-[25px] font-semibold">
              {user?.phone || "Enter Mobile Number"}
            </span>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing("phone")}
            >
              <PencilIcon className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      {/* PHONE end */}
      {/* Address */}
      <div className="flex items-center space-x-2 pb-3">
        {isEditing === "address" ? (
          <>
            <input
              name="address"
              className="border rounded px-2 py-2 text-[20px]"
              value={formData.address}
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
            <span className="text-[25px] font-semibold">
              {user.address || "Enter Home Address"}
            </span>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing("address")}
            >
              <PencilIcon className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      {/* City */}
      <div className="flex items-center space-x-2 pb-3">
        {isEditing === "city" ? (
          <>
            <input
              name="city"
              className="border rounded px-2 py-2 text-[20px]"
              value={formData.city}
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
            <span className="text-[25px] font-semibold">
              {user.city || "Enter City"}
            </span>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing("city")}
            >
              <PencilIcon className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      {/* City */}
      <div className="flex items-center space-x-2 pb-3">
        {isEditing === "state" ? (
          <>
            <input
              name="state"
              className="border rounded px-2 py-2 text-[20px]"
              value={formData.state}
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
            <span className="text-[25px] font-semibold">
              {user.state || "Enter State"}
            </span>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing("state")}
            >
              <PencilIcon className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      {showSellerForm && (
        <div className="mt-5 border p-5 rounded">
          <h3>Seller Application Form</h3>

          {/* Shop Name Input */}
          <input
            name="shopName"
            placeholder="Shop Name"
            value={formData.shopName}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="border rounded px-2 py-2 w-full mb-2"
          />

          {/* Shop URL Input */}
          <input
            name="shopUrl"
            placeholder="Shop URL"
            value={formData.shopUrl || ""}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="border rounded px-2 py-2 w-full mb-2"
          />

          {/* Contact Email Input */}
          <input
            name="contactEmail"
            type="email"
            placeholder="Contact Email"
            value={formData.contactEmail || ""}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="border rounded px-2 py-2 w-full mb-2"
          />

          {/* Contact Phone Input */}
          <input
            name="contactPhone"
            type="tel"
            placeholder="Contact Phone"
            value={formData.contactPhone || ""}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="border rounded px-2 py-2 w-full mb-2"
          />

          {/* Shop Address Input */}
          <input
            name="shopAddress"
            placeholder="Shop Address"
            value={formData.shopAddress || ""}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="border rounded px-2 py-2 w-full mb-2"
          />

          {/* City Input */}
          <input
            name="city"
            placeholder="City"
            value={formData.city || ""}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="border rounded px-2 py-2 w-full mb-2"
          />

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSellerSubmit}
              className="bg-black text-white px-[20px] lg:px-[40px] py-[15px] font-semibold hover:bg-gray-600 transition duration-300"
            >
              Submit Application
            </button>
            <button
              onClick={() => setShowSellerForm(false)}
              className="bg-gray-400 text-white px-[20px] lg:px-[40px] py-[15px] font-semibold hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* application status display */}
      {user.applicationStatus && (
        <div className="mt-5">
          <p className="text-lg font-semibold">
            Application Status:{" "}
            <span className="capitalize">{user.applicationStatus}</span>
          </p>
        </div>
      )}

      {/* Become a Seller Button - Only show if no application and form is not open */}
      {!showSellerForm && !user.applicationStatus && (
        <div className="mt-5">
          <button
            onClick={() => setShowSellerForm(true)}
            className="bg-black text-white px-[20px] lg:px-[40px] py-[15px] font-semibold hover:bg-gray-600 transition duration-300"
          >
            Become a seller
          </button>
        </div>
      )}
      {/* Pending Button - Disabled, shows when application is pending */}
      {!showSellerForm && user.applicationStatus === "pending" && (
        <div className="mt-5">
          <button
            disabled
            className="bg-gray-400 text-white px-[20px] lg:px-[40px] py-[15px] font-semibold cursor-not-allowed"
          >
            Pending Approval
          </button>
        </div>
      )}

      {/* Update Seller Profile Button - Only if approved */}
      {!showSellerForm && user.applicationStatus === "approved" && (
        <div className="mt-5">
          <button
            onClick={() => setShowSellerForm(true)}
            className="bg-black text-white px-[20px] lg:px-[40px] py-[15px] font-semibold hover:bg-gray-600 transition duration-300"
          >
            Update Seller Profile
          </button>
        </div>
      )}

      {serverError && <p className="text-red-500">{serverError}</p>}
    </div>
  );
};

export default ProfileInfo;
