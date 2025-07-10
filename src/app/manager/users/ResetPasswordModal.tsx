import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { LockIcon } from "@/icons/index";

export default function ResetPasswordModal({ open, onClose, user, newPassword, onDone }: { open: boolean; onClose: () => void; user: any; newPassword: string; onDone: () => void }) {
  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-md w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8 text-center">
        <LockIcon className="w-10 h-10 mx-auto mb-4 text-brand-500" />
        <h3 className="text-xl font-semibold mb-2">Reset Password</h3>
        <div className="mb-4">New password for <span className="font-semibold">{user?.name}</span>:</div>
        <div className="bg-gray-100 rounded px-4 py-2 font-mono text-lg mb-4 select-all">{newPassword}</div>
        <Button className="w-full" onClick={onDone}>Done</Button>
      </div>
    </Modal>
  );
} 