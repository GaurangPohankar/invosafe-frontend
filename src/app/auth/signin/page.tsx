"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in to your InvoSafe account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">
            Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              defaultValue={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeCloseIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        

        <div>
          <button
            type="submit"
            className="w-full px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <button
            onClick={() => router.push("/auth/reset-password")}
            className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Forgot your password?
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Need help? Contact support at{" "}
          <a
            href="mailto:support@invoicesafe.com"
            className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            support@invoicesafe.com
          </a>
        </p>
      </div>
    </div>
  );
} 