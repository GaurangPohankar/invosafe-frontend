"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { authenticationApi } from "@/library/authenticationApi";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await authenticationApi.requestPasswordReset(email);
      setIsOtpSent(true);
      setSuccess("OTP sent successfully to your email");
    } catch (error: any) {
      // Show the specific error message (including blocked account message)
      setError(error.message || "Failed to send OTP. Please check your email and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await authenticationApi.verifyPasswordReset(email, otp, newPassword);
      setIsPasswordReset(true);
      setSuccess("Password reset successfully");
    } catch (error: any) {
      // Show the specific error message
      setError(error.message || "Invalid OTP or failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPasswordReset) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Password reset successfully
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your password has been reset. You can now sign in with your new password.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/auth/signin")}
            className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {!isOtpSent 
            ? "Enter your email address and we'll send you an OTP to reset your password."
            : "Enter the OTP sent to your email and your new password."
          }
        </p>
      </div>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!isOtpSent ? (
        <form onSubmit={handleRequestOtp} className="space-y-6">
          <div>
            <Label htmlFor="email">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <Label htmlFor="otp">
              OTP Code
            </Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              defaultValue={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="newPassword">
              New Password
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              defaultValue={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              defaultValue={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="mt-1"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}

      <div className="text-center">
        {!isOtpSent ? (
          <button
            onClick={() => router.push("/auth/signin")}
            className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Back to sign in
          </button>
        ) : (
          <button
            onClick={() => {
              setIsOtpSent(false);
              setOtp("");
              setNewPassword("");
              setConfirmPassword("");
              setError("");
              setSuccess("");
            }}
            className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Try different email
          </button>
        )}
      </div>
    </div>
  );
} 