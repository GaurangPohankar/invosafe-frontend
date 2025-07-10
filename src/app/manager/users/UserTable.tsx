"use client";
import React, { useState } from "react";
import { MoreDotIcon, LockIcon, TrashBinIcon, EyeCloseIcon, EyeIcon, UserCircleIcon } from "@/icons/index";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

const TABS = [
  { label: "All", color: "light" },
  { label: "Active", color: "success" },
  { label: "Blocked", color: "error" },
];

const USERS = [
  { id: 1, name: "Lindsey Curtis", email: "lindsey@email.com", status: "Active" },
  { id: 2, name: "Kaiya George", email: "kaiya@email.com", status: "Blocked" },
  { id: 3, name: "Zain Geidt", email: "zain@email.com", status: "Active" },
];


export default function UserTable({
  onResetPassword,
  onBlockUnblock,
  onDelete,
}: {
  onResetPassword: (user: any) => void;
  onBlockUnblock: (user: any) => void;
  onDelete: (user: any) => void;
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Tab counts
  const tabCounts = {
    All: USERS.length,
    Active: USERS.filter(u => u.status === "Active").length,
    Blocked: USERS.filter(u => u.status === "Blocked").length,
  };

  // Filter logic
  const filteredUsers = USERS.filter(u => {
    if (activeTab !== "All" && u.status !== activeTab) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const isEmpty = filteredUsers.length === 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-0 flex flex-col">
      {/* Tabs */}
      <div className="flex gap-2 px-6 pt-4 pb-4 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`relative px-3 py-1.5 font-medium text-sm focus:outline-none transition-colors
              ${activeTab === tab.label
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900"}
            `}
            style={{ background: "none" }}
          >
            {tab.label}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                ${tab.color === "warning" ? "bg-yellow-100 text-yellow-700" : ""}
                ${tab.color === "success" ? "bg-green-100 text-green-700" : ""}
                ${tab.color === "error" ? "bg-red-100 text-red-700" : ""}
                ${tab.color === "light" ? "bg-gray-100 text-gray-600" : ""}
              `}
            >
              {tabCounts[tab.label as keyof typeof tabCounts]}
            </span>
            {activeTab === tab.label && (
              <span className="absolute left-0 -bottom-2 w-full h-1 bg-gray-900 rounded-t" />
            )}
          </button>
        ))}
      </div>
      
      {/* Table or Empty State */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="border-brand-300 rounded-lg p-8 bg-white mb-6 flex flex-col items-center">
            <UserCircleIcon className="mb-4 w-16 h-16 text-gray-200" />
          </div>
          <div className="text-gray-700 text-center text-base font-medium max-w-md">
            No users found in this tab.
          </div>
        </div>
      ) : (
        
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500"><input type="checkbox" /></th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-4"><input type="checkbox" /></td>
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3"><UserCircleIcon className="w-8 h-8 text-gray-400" />{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 dropdown-toggle"
                      onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                    >
                      <MoreDotIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <Dropdown
                      isOpen={openDropdown === idx}
                      onClose={() => setOpenDropdown(null)}
                      className="w-48 p-2 mt-2 -top-2"
                    >
                      <DropdownItem onItemClick={() => onResetPassword(user)} className="flex items-center gap-2 text-gray-700 hover:text-brand-600">
                        <LockIcon className="w-5 h-5" /> Reset Password
                      </DropdownItem>
                      {user.status === "Active" ? (
                        <DropdownItem onItemClick={() => onBlockUnblock(user)} className="flex items-center gap-2 text-gray-700 hover:text-error-600">
                          <EyeCloseIcon className="w-5 h-5" /> Block
                        </DropdownItem>
                      ) : (
                        <DropdownItem onItemClick={() => onBlockUnblock(user)} className="flex items-center gap-2 text-gray-700 hover:text-success-600">
                          <EyeIcon className="w-5 h-5" /> Unblock
                        </DropdownItem>
                      )}
                      <DropdownItem onItemClick={() => onDelete(user)} className="flex items-center gap-2 text-gray-700 hover:text-error-600">
                        <TrashBinIcon className="w-5 h-5" /> Delete
                      </DropdownItem>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        
      )}
    </div>
  );
} 