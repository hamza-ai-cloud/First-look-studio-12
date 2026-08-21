"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  UserCheck,
  UserX,
  X,
  KeyRound,
} from "lucide-react";

type AdminRecord = {
  id: string;
  email: string;
  role: "admin" | "super_admin" | string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string | null;
  last_login_at?: string | null;
};

export default function AdminManagementView() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/admins", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to load administrators");
      }

      setAdmins(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load administrators"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdmins();
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRole("admin");
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to create administrator");
      }

      setAdmins((current) => [result.data, ...current]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create administrator"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateAdmin = async (
    id: string,
    updates: Record<string, unknown>
  ) => {
    try {
      setError("");

      const response = await fetch("/api/admin/admins", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...updates,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to update administrator");
      }

      setAdmins((current) =>
        current.map((admin) =>
          admin.id === id ? result.data : admin
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update administrator"
      );
    }
  };

  const handleDelete = async (admin: AdminRecord) => {
    if (
      !window.confirm(
        `Delete administrator ${admin.email}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `/api/admin/admins?id=${encodeURIComponent(admin.id)}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to delete administrator");
      }

      setAdmins((current) =>
        current.filter((item) => item.id !== admin.id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete administrator"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">
              Administrator Management
            </h1>
          </div>

          <p className="mt-1 text-xs text-[#8b949e]">
            Manage administrator accounts, roles and access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setError("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-purple-500"
        >
          <Plus className="h-4 w-4" />
          Add Administrator
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22]">
        <div className="border-b border-[#30363d] px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
            Administrators
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-[#8b949e]">
            Loading administrators...
          </div>
        ) : admins.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#8b949e]">
            No administrators found.
          </div>
        ) : (
          <div className="divide-y divide-[#30363d]">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#21262d]">
                    <ShieldCheck className="h-4 w-4 text-purple-400" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      {admin.email}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-300">
                        {admin.role}
                      </span>

                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          admin.is_active
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        {admin.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      void updateAdmin(admin.id, {
                        is_active: !admin.is_active,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#21262d]"
                  >
                    {admin.is_active ? (
                      <>
                        <UserX className="h-3.5 w-3.5" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3.5 w-3.5" />
                        Activate
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const nextRole =
                        admin.role === "super_admin"
                          ? "admin"
                          : "super_admin";

                      void updateAdmin(admin.id, {
                        role: nextRole,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#21262d]"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Toggle Role
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(admin)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-1.5 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-white">
                  Add Administrator
                </h2>
                <p className="mt-0.5 text-[10px] text-[#8b949e]">
                  Create a secure administrator account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#8b949e] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-[#8b949e]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-[#8b949e]">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-[#8b949e]">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value as
                        | "admin"
                        | "super_admin"
                    )
                  }
                  className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Administrator"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
