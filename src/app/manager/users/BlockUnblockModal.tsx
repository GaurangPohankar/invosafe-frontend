import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons/index";

export default function BlockUnblockModal({ open, onClose, user, onConfirm }: { open: boolean; onClose: () => void; user: any; onConfirm: () => void }) {
  const isBlocked = user?.status !== "Active";
  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-md w-full rounded-2xl">
      <div className="bg-white rounded-2xl p-8 text-center">
        {isBlocked ? (
          <EyeIcon className="w-10 h-10 mx-auto mb-4 text-success-500" />
        ) : (
          <EyeCloseIcon className="w-10 h-10 mx-auto mb-4 text-error-500" />
        )}
        <h3 className="text-xl font-semibold mb-2">{isBlocked ? "Unblock User" : "Block User"}</h3>
        <div className="mb-4">Are you sure you want to {isBlocked ? "unblock" : "block"} <span className="font-semibold">{user?.name}</span>?</div>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className={isBlocked ? "bg-success-500 text-white" : "bg-error-500 text-white"} onClick={onConfirm}>
            {isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 