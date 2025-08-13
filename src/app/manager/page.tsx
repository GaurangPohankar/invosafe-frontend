import type { Metadata } from "next";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/manager/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/manager/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/manager/StatisticsChart";

export const metadata: Metadata = {
  title: "Manager Dashboard | InvoSafe - Invoice Management System",
  description: "Manager dashboard for InvoSafe invoice management system",
};

export default function ManagerDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-7">
        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>



    </div>
  );
} 