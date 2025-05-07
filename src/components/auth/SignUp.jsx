// src/components/auth/Signup.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GoogleSignIn from "../../components/auth/GoogleSignIn";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  username: z.string().min(3, "Username too short"),
});

export default function Signup() {
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      await signup(data.email, data.password, {
        username: data.username,
        displayName: data.username,
        // Add any additional fields here
      });

      // Redirect or show success message
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}

      <div>
        <label>Email</label>
        <input
          {...register("email")}
          type="email"
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label>Password</label>
        <input
          {...register("password")}
          type="password"
          className="w-full p-2 border rounded"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </div>

      <div>
        <label>Username</label>
        <input
          {...register("username")}
          className="w-full p-2 border rounded"
        />
        {errors.username && (
          <span className="text-red-500">{errors.username.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-blue-400"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
      <span className="mx-4 text-gray-500">or</span>

      <GoogleSignIn />

      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>

        <div className="flex-grow border-t border-gray-300"></div>
      </div>
    </form>
  );
}
