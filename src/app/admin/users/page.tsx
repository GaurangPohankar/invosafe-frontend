"use client";
import React, { useState } from "react";
import RouteProtection from "../components/RouteProtection";
import UserTable from "./UserTable";
import AddUserModal from "./AddUserModal";
import ResetPasswordModal from "./ResetPasswordModal";
import BlockUnblockModal from "./BlockUnblockModal";
import DeleteUserModal from "./DeleteUserModal";

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

export default function UsersPage() {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Handlers for UserTable actions
  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword(Math.random().toString(36).slice(-10));
    setResetPasswordOpen(true);
  };
  
  const handleBlockUnblock = (user: User) => {
    setSelectedUser(user);
    setBlockOpen(true);
  };
  
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };
  
  const handleAddUserSuccess = () => {
    // Force table refresh by changing the key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <RouteProtection allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">Users</h2>
          <button
            className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-2.5 text-center font-medium text-white hover:bg-brand-600"
            onClick={() => setAddUserOpen(true)}
          >
            +  Add User
          </button>
        </div>
        <UserTable
          refreshTrigger={refreshKey}
          onResetPassword={handleResetPassword}
          onBlockUnblock={handleBlockUnblock}
          onDelete={handleDelete}
        />
        <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onSuccess={handleAddUserSuccess} />
        <ResetPasswordModal open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)} user={selectedUser} newPassword={newPassword} onSuccess={handleAddUserSuccess} />
        <BlockUnblockModal open={blockOpen} onClose={() => setBlockOpen(false)} user={selectedUser} onSuccess={handleAddUserSuccess} />
        <DeleteUserModal open={deleteOpen} onClose={() => setDeleteOpen(false)} user={selectedUser} onSuccess={handleAddUserSuccess} />
      </div>
    </RouteProtection>
  );
} 