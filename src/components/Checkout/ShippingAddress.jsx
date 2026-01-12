import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { account } from "../../lib/appwrite";
import { updateUserProfile } from "../../services/authservice";
import { updateUser } from "../../store/slices/authSlice";

const ShippingAddress = () => {
  const user = useSelector((state) => state.auth.user);
  const [serverError, setServerError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "",
  });

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      setFormData({
        fullName: parsedUser.name,
        email: parsedUser.email,
        phone: parsedUser.phone,
        address: parsedUser.address,
        city: parsedUser.city,
        state: parsedUser.state,
        country: parsedUser.country,
      });
    } else {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
      });
    }
  }, [user, dispatch, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: formData,
  });

  useEffect(() => {
    if (user) {
      const resetData = {
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
      };
      reset(resetData);
    }
  }, [user, reset]);

  const handleEditAddress = () => {
    setIsEditing("true");
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      reset({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
      });
    }
  };

  const formSubmit = async (data) => {
    // Save to Appwrite
    const result = await updateUserProfile({
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
    });

    if (result.success) {
      setIsEditing(false); // Exit edit mode
      // Update Redux so Checkout component can see the updated address
      const updatedUserData = {
        ...user,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
      };
      dispatch(updateUser(updatedUserData));
      // Also update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUserData));
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-1">Full Name</label>

      {isEditing ? (
        <div>
          <input
            type="text"
            placeholder="Enter your full name"
            {...register("fullName", { required: "Full name is required" })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>
      ) : (
        <p className="text-[20px] font-semibold capitalize">
          {formData.fullName || "Not Provided"}
        </p>
      )}

      <label className="text-sm font-medium mb-1">Email</label>
      {isEditing ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </>
      ) : (
        <p className="text-[20px] font-semibold capitalize">
          {formData.email || "Not Provided"}
        </p>
      )}

      <div className="mt-3">
        <label className="text-sm font-medium mb-1">Phone Number</label>
        {isEditing ? (
          <>
            <input
              type="phone"
              placeholder="Enter your Number"
              {...register("phone", { required: "Number is required" })}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </>
        ) : (
          <p className="text-[20px] font-semibold capitalize">
            {formData.phone || "Not Provided"}
          </p>
        )}
      </div>

      <div className="mt-3">
        <label className="text-sm font-medium mb-1">Address</label>
        {isEditing ? (
          <>
            <input
              type="address"
              placeholder="Enter your Number"
              {...register("address", { required: "Address is required" })}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </>
        ) : (
          <p className="text-[20px] font-semibold capitalize">
            {formData.address || "Not Provided"}
          </p>
        )}
      </div>

      <div className="mt-3">
        <label className="text-sm font-medium mb-1">City</label>
        {isEditing ? (
          <>
            <input
              type="city"
              placeholder="Enter your Number"
              {...register("city", { required: "Address is required" })}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </>
        ) : (
          <p className="text-[20px] font-semibold capitalize">
            {formData.city || "Not Provided"}
          </p>
        )}
      </div>

      <div className="mt-3">
        <label className="text-sm font-medium mb-1">State</label>
        {isEditing ? (
          <>
            <input
              type="address"
              placeholder="Enter your Number"
              {...register("state", { required: "AStateddress is required" })}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </>
        ) : (
          <p className="text-[20px] font-semibold capitalize">
            {formData.state || "Not Provided"}
          </p>
        )}
      </div>

      <div className="mt-3">
        {isEditing ? (
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleCancel}
              type="button"
              className="flex-1 border border-black text-black py-2 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(formSubmit)}
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <div className="mt-3 flex justify-between items-center gap-9">
            <button
              onClick={() => setIsEditing("address")}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60 mt-3"
            >
              Edit Address
            </button>
            {/* <button
              onClick={handleSubmit(formSubmit)}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60 mt-3"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingAddress;
