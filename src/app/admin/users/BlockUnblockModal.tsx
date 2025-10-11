import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons/index";
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

export default function BlockUnblockModal({ 
  open, 
  onClose, 
  user, 
  onSuccess 
}: { 
  open: boolean; 
  onClose: () => void; 
  user: User | null; 
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const isBlocked = user?.status === "blocked";

  const handleConfirm = async () => {
    if (!user) return;
    
    setLoading(true);
    setError("");
    
    try {
      const newStatus = isBlocked ? "active" : "blocked";
      await userApi.updateUserStatus(user.id, newStatus);
      
      // Close modal and trigger refresh
      onClose();
      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-md w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8 text-center">
        {isBlocked ? (
          <EyeIcon className="w-10 h-10 mx-auto mb-4 text-success-500" />
        ) : (
          <EyeCloseIcon className="w-10 h-10 mx-auto mb-4 text-error-500" />
        )}
        <h3 className="text-xl font-semibold mb-2">{isBlocked ? "Unblock User" : "Block User"}</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-4">Are you sure you want to {isBlocked ? "unblock" : "block"} <span className="font-semibold">{user?.name}</span>?</div>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button 
            className={isBlocked ? "bg-success-500 text-white" : "bg-error-500 text-white"} 
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (isBlocked ? "Unblocking..." : "Blocking...") : (isBlocked ? "Unblock" : "Block")}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 