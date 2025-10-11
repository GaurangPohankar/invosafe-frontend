"use client";
import React, { useState } from "react";
import RouteProtection from "../components/RouteProtection";
import LenderTable from "./LenderTable";
import AddLenderModal from "./AddLenderModal";

export default function LendersPage() {
  const [addLenderOpen, setAddLenderOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddLenderSuccess = () => {
    // Force table refresh by changing the key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <RouteProtection allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">Lenders</h2>
          <button
            className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-2.5 text-center font-medium text-white hover:bg-brand-600"
            onClick={() => setAddLenderOpen(true)}
          >
            +  Add Lender
          </button>
        </div>
        <LenderTable refreshTrigger={refreshKey} />
        <AddLenderModal 
          open={addLenderOpen} 
          onClose={() => setAddLenderOpen(false)} 
          onSuccess={handleAddLenderSuccess} 
        />
      </div>
    </RouteProtection>
  );
}

