import React, { useState } from "react";
import { Button } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = ({ onSubmit, serverError }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm();

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
        reset(); // Clear form on success
      })} className="space-y-4">
        <div className="space-x-2">
          <label className="block text-[23px] font-bold mb-1">
            Old Password
          </label>
          <div className="relative w-80">
            <input
              type={showOldPassword ? "text" : "password"}
              {...register("oldPassword", {
                required: "Old password is required",
              })}
              placeholder="Enter your old password"
              className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showOldPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
          )}
        </div>
        <div>
          <label className="block text-[23px] font-bold mb-1">
            New Password
          </label>
          <div className="relative w-80">
            <input
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Minimum length is 6" },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message: "Password must contain letters and numbers",
                },
              })}
              placeholder="Enter your new password"
              className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <label className="block text-[23px] font-bold mb-1">
            Confirm New Password
          </label>
          <div className="relative w-80">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmNewPassword", {
                required: "Confirm new password is required",
                validate: (value) =>
                  value === getValues("newPassword") || "Passwords do not match",
                
              })}
              placeholder="Confirm your new password"
              className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-red-600 text-sm mt-2">{serverError}</p>
        )}


        <Button className="mt-5 bg-white border border-black border-opacity-10 text-black px-20 py-3 rounded-full font-normal hover:bg-black hover:text-white transition duration-300"
      disabled={isSubmitting}
      type="submit">
          {isSubmitting ? "Changing Password..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
