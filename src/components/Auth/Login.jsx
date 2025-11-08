import React from "react";
import { Button } from "@headlessui/react";
import { useForm } from "react-hook-form";

const Login = ({ onSubmit, serverError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Invalid email",
              },
            })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required",pattern:{message: "wrong password"} })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {serverError && (
          <p className="text-red-600 text-sm mt-2">{serverError}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
