import type { Metadata } from "next";
import React from "react";
import BasicTableOne from "@/components/tables/BasicTableOne";

export const metadata: Metadata = {
  title: "Users | InvoSafe - Invoice Management System",
  description: "Manage and view all users in the system",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Users
        </h2>
        <button className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-2.5 text-center font-medium text-white hover:bg-brand-600">
          Add User
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <BasicTableOne />
      </div>
    </div>
  );
} 