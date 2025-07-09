import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

export default function AddUserModal({ open, onClose, onAddUser }: { open: boolean; onClose: () => void; onAddUser: (user: { name: string; email: string; password: string }) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({ name, email, password });
    setName("");
    setEmail("");
    setPassword("");
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-md w-full rounded-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8">
        <h3 className="text-xl font-semibold mb-4">Add User</h3>
        <div className="space-y-4">
          <input className="w-full border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-full border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Unique Password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>+ Add User</Button>
        </div>
      </form>
    </Modal>
  );
} 