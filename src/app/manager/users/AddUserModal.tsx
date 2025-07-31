import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { userApi } from "@/library/userApi";

export default function AddUserModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const lenderId = localStorage.getItem('lender_id');
      if (!lenderId) {
        throw new Error('No lender ID found');
      }

      await userApi.createUser({
        name,
        email,
        password,
        role: "USER",
        lender_id: parseInt(lenderId),
      });

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      
      // Close modal and refresh table
      onClose();
      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-md w-full rounded-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8">
        <h3 className="text-xl font-semibold mb-4">Add User</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <input 
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm" 
            placeholder="Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            disabled={loading}
          />
          <input 
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            disabled={loading}
          />
          <input 
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm" 
            placeholder="Unique Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>
        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button disabled={loading}>
            {loading ? 'Creating...' : '+ Add User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 