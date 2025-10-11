"use client";
import React, { useState, useEffect } from "react";
import { MoreDotIcon, LockIcon, TrashBinIcon, EyeCloseIcon, EyeIcon, UserCircleIcon } from "@/icons/index";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { userApi } from "@/library/userApi";

const TABS = [
  { label: "All", color: "light" },
  { label: "Active", color: "success" },
  { label: "Blocked", color: "error" },
];

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lender_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}


export default function UserTable({
  onResetPassword,
  onBlockUnblock,
  onDelete,
  refreshTrigger,
}: {
  onResetPassword: (user: User) => void;
  onBlockUnblock: (user: User) => void;
  onDelete: (user: User) => void;
  refreshTrigger?: number;
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users based on active tab
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      let status: string | undefined;
      if (activeTab === "Active") {
        status = "active";
      } else if (activeTab === "Blocked") {
        status = "blocked";
      }
      
      const fetchedUsers = await userApi.getUsersByStatus(status);
      setUsers(fetchedUsers);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users for tab counts
  const fetchAllUsers = async () => {
    try {
      const allUsers = await userApi.getUsersByStatus();
      return allUsers;
    } catch (error: any) {
      console.error('Failed to fetch all users for counts:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  // Tab counts - fetch all users to get accurate counts
  const [tabCounts, setTabCounts] = useState({
    All: 0,
    Active: 0,
    Blocked: 0,
  });

  useEffect(() => {
    const updateTabCounts = async () => {
      const allUsers = await fetchAllUsers();
      setTabCounts({
        All: allUsers.length,
        Active: allUsers.filter(u => u.status === "active").length,
        Blocked: allUsers.filter(u => u.status === "blocked").length,
      });
    };
    updateTabCounts();
  }, []);

  // Refresh function to update both users and counts
  const refreshData = async () => {
    await fetchUsers();
    const allUsers = await fetchAllUsers();
    setTabCounts({
      All: allUsers.length,
      Active: allUsers.filter(u => u.status === "active").length,
      Blocked: allUsers.filter(u => u.status === "blocked").length,
    });
  };

  // Expose refresh function to parent
  useEffect(() => {
    // This will be called when the component mounts or when refreshTrigger changes
    refreshData();
  }, [refreshTrigger]);

  // Filter logic - for search functionality and exclude current user
  const currentUserEmail = localStorage.getItem('email');
  const filteredUsers = users.filter(u => {
    // Exclude current user
    if (u.email === currentUserEmail) return false;
    // Search filter
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const isEmpty = filteredUsers.length === 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-0 flex flex-col">
      {/* Search and Tabs */}
      <div className="px-6 pt-4 pb-4 border-b border-gray-100">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2">
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
      </div>
      
      {/* Table or Empty State */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="text-gray-700 text-center text-base font-medium">
            Loading users...
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="text-red-700 text-center text-base font-medium">
            {error}
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="text-gray-700 text-center text-base font-medium max-w-md">
            No users found in this tab.
          </div>
        </div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3"><UserCircleIcon className="w-8 h-8 text-gray-400" />{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {user.status === "active" ? "Active" : "Blocked"}
                  </span>
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
                    {user.status === "active" ? (
                      <DropdownItem onItemClick={() => onBlockUnblock(user)} className="flex items-center gap-2 text-gray-700 hover:text-error-600">
                        <EyeCloseIcon className="w-5 h-5" /> Block
                      </DropdownItem>
                    ) : (
                      <DropdownItem onItemClick={() => onBlockUnblock(user)} className="flex items-center gap-2 text-gray-700 hover:text-success-600">
                        <EyeIcon className="w-5 h-5" /> Unblock
                      </DropdownItem>
                    )}
                    {/* <DropdownItem onItemClick={() => onDelete(user)} className="flex items-center gap-2 text-gray-700 hover:text-error-600">
                      <TrashBinIcon className="w-5 h-5" /> Delete
                    </DropdownItem> */}
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