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
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!agreementAccepted) {
      setError("You must accept the data sharing agreement");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signup(data.email, data.password, {
        username: data.username,
        displayName: data.username,
      });

      // Redirect or show success message
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgreement = () => {
    setShowAgreement(!showAgreement);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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

        {/* Data Sharing Agreement */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={toggleAgreement}
          >
            <h3 className="font-medium">Data Sharing Agreement</h3>
          </div>

          {showAgreement && (
            <div className="mt-3 text-sm text-gray-600 max-h-60 overflow-y-auto">
              <h4 className="font-medium mt-2">1. Data Collection</h4>
              <p className="mt-1">
                We collect your email, username, and any content you post to
                provide and improve our services.
              </p>

              <h4 className="font-medium mt-3">2. Data Usage</h4>
              <p className="mt-1">
                Your data will be used to personalize your experience,
                communicate with you, and improve our platform.
              </p>

              <h4 className="font-medium mt-3">3. Data Sharing</h4>
              <p className="mt-1">
                We do not sell your personal data. We may share anonymized
                analytics with third parties to improve our services.
              </p>

              <h4 className="font-medium mt-3">4. Your Rights</h4>
              <p className="mt-1">
                You can request access to or deletion of your data at any time
                by contacting support.
              </p>

              <h4 className="font-medium mt-3">5. Changes to Agreement</h4>
              <p className="mt-1">
                We will notify you of any significant changes to this agreement.
              </p>
            </div>
          )}

          <div className="mt-3 flex items-center">
            <input
              type="checkbox"
              id="agreement-checkbox"
              checked={agreementAccepted}
              onChange={(e) => setAgreementAccepted(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="agreement-checkbox" className="ml-2 text-sm">
              I accept the Data Sharing Agreement
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !agreementAccepted}
          className={`w-full bg-blue-600 text-white p-2 rounded ${
            loading || !agreementAccepted ? "opacity-50 cursor-not-allowed" : ""
          }`}
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
    </div>
  );
}
