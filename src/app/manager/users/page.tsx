"use client";
import React, { useState } from "react";
import UserTable from "./UserTable";
import AddUserModal from "./AddUserModal";
import ResetPasswordModal from "./ResetPasswordModal";
import BlockUnblockModal from "./BlockUnblockModal";
import DeleteUserModal from "./DeleteUserModal";

export default function UsersPage() {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Handlers for UserTable actions
  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setNewPassword(Math.random().toString(36).slice(-10));
    setResetPasswordOpen(true);
  };
  const handleBlockUnblock = (user: any) => {
    setSelectedUser(user);
    setBlockOpen(true);
  };
  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };
  const handleAddUser = (user: { name: string; email: string; password: string }) => {
    // Add user logic here
    setAddUserOpen(false);
  };

  return (
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
        onResetPassword={handleResetPassword}
        onBlockUnblock={handleBlockUnblock}
        onDelete={handleDelete}
      />
      <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onAddUser={handleAddUser} />
      <ResetPasswordModal open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)} user={selectedUser} newPassword={newPassword} onDone={() => setResetPasswordOpen(false)} />
      <BlockUnblockModal open={blockOpen} onClose={() => setBlockOpen(false)} user={selectedUser} onConfirm={() => setBlockOpen(false)} />
      <DeleteUserModal open={deleteOpen} onClose={() => setDeleteOpen(false)} user={selectedUser} onConfirm={() => setDeleteOpen(false)} />
    </div>
  );
} 