import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { userApi } from "@/library/userApi";
import { lenderApi } from "@/library/lenderApi";

interface Lender {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AddUserModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MANAGER" | "USER">("USER");
  const [lenderId, setLenderId] = useState<string>("");
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [loadingLenders, setLoadingLenders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    // Generate a strong random password (12 characters: letters, numbers, special chars)
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setCopied(false); // Reset copied state when generating new password
  };

  // Generate password when modal opens
  useEffect(() => {
    if (open && !password) {
      generatePassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Fetch lenders when role is MANAGER or USER
  useEffect(() => {
    if (open && (role === "MANAGER" || role === "USER")) {
      fetchLenders();
    }
  }, [open, role]);

  const fetchLenders = async () => {
    setLoadingLenders(true);
    try {
      const fetchedLenders = await lenderApi.getLenders();
      setLenders(fetchedLenders.filter(l => l.status === "active"));
    } catch (error: any) {
      console.error('Failed to fetch lenders:', error);
      setError(error.message || 'Failed to fetch lenders');
    } finally {
      setLoadingLenders(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate lender selection for MANAGER and USER roles
      if ((role === "MANAGER" || role === "USER") && !lenderId) {
        throw new Error('Please select a lender');
      }

      // Determine lender_id based on role
      let finalLenderId = 0;
      if (role === "ADMIN") {
        finalLenderId = 0;
      } else if (role === "MANAGER" || role === "USER") {
        finalLenderId = parseInt(lenderId);
      }

      await userApi.createUser({
        name,
        email,
        password,
        role: role,
        lender_id: finalLenderId,
      });

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");
      setLenderId("");
      setCopied(false);
      
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
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              value={role}
              onChange={e => {
                setRole(e.target.value as "ADMIN" | "MANAGER" | "USER");
                setLenderId(""); // Reset lender selection when role changes
              }}
              required
              disabled={loading}
            >
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Lender Selection (only for MANAGER and USER) */}
          {(role === "MANAGER" || role === "USER") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lender
              </label>
              {loadingLenders ? (
                <div className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-500">
                  Loading lenders...
                </div>
              ) : (
                <select
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  value={lenderId}
                  onChange={e => setLenderId(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Select a lender</option>
                  {lenders.map(lender => (
                    <option key={lender.id} value={lender.id}>
                      {lender.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input 
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" 
              placeholder="Enter full name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" 
              placeholder="Enter email address" 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-xs text-gray-500">(auto-generated, can be shared with user)</span>
            </label>
            <div className="relative">
              <input 
                className="w-full border border-gray-200 rounded px-3 py-2 pr-32 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono" 
                placeholder="Generating..." 
                type="text"
                value={password} 
                readOnly
                required 
                disabled={loading}
              />
              {password && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    disabled={loading}
                    title="Generate new password"
                  >
                    Refresh
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="px-2 py-1 text-xs font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded transition-colors"
                    disabled={loading}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          </div>
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