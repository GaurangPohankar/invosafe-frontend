import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { LockIcon } from "@/icons/index";
import { userApi } from "@/library/userApi";

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

export default function ResetPasswordModal({ 
  open, 
  onClose, 
  user, 
  newPassword, 
  onSuccess 
}: { 
  open: boolean; 
  onClose: () => void; 
  user: User | null; 
  newPassword: string; 
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdatePassword = async () => {
    if (!user) return;
    
    setLoading(true);
    setError("");
    
    try {
      await userApi.updateUser(user.id, {
        name: user.name,
        email: user.email,
        password: newPassword,
        status: user.status,
      });
      
      // Close modal and trigger refresh
      onClose();
      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-md w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8 text-center">
        <LockIcon className="w-10 h-10 mx-auto mb-4 text-brand-500" />
        <h3 className="text-xl font-semibold mb-2">Reset Password</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-4">New password for <span className="font-semibold">{user?.name}</span>:</div>
        <div className="bg-gray-100 rounded px-4 py-2 font-mono text-lg mb-4 select-all">{newPassword}</div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 