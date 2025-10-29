// app/dashboard/settings/page.tsx
"use client";

import { AlertCircle, CheckCircle, Copy, Loader2, LogOut, RefreshCw, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UserProfile {
    id_number: string;
    name: string;
    email: string;
    two_factor_enabled: boolean;
}

export default function ProfileSettingsPage() {
    const router = useRouter();

    // State
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // 2FA state
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [showBackupCodes, setShowBackupCodes] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Load user profile
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await fetch("/api/user/profile", {
                method: "GET",
                credentials: "include", // FIXED: Added credentials
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/auth/login");
                    return;
                }
                throw new Error("Failed to load profile");
            }

            const data = await response.json();
            setUser(data.user);
        } catch (err) {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    // Enable 2FA
    const handleEnable2FA = useCallback(async () => {
        setError("");
        setSuccess("");
        setActionLoading(true);

        try {
            const response = await fetch("/api/auth/2fa/setup", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to enable 2FA");
            }

            setBackupCodes(data.backup_codes || []);
            setShowBackupCodes(true);
            setSuccess("2FA enabled successfully! Save your backup codes.");

            // Refresh profile
            await loadProfile();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to enable 2FA");
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Disable 2FA
    const handleDisable2FA = useCallback(async () => {
        if (!confirm("Are you sure you want to disable 2FA? This will reduce your account security.")) {
            return;
        }

        setError("");
        setSuccess("");
        setActionLoading(true);

        try {
            const response = await fetch("/api/auth/2fa/setup", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    password: prompt("Enter your password to confirm:"),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to disable 2FA");
            }

            setSuccess("2FA disabled successfully");
            await loadProfile();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to disable 2FA");
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Refresh session
    const handleRefreshSession = useCallback(async () => {
        setError("");
        setSuccess("");
        setActionLoading(true);

        try {
            const response = await fetch("/api/auth/refresh-session", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to refresh session");
            }

            setSuccess(data.message || "Session refreshed successfully");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to refresh session");
        } finally {
            setActionLoading(false);
        }
    }, []);

    // Logout
    const handleLogout = useCallback(async () => {
        setActionLoading(true);

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            router.push("/auth/login");
        }
    }, [router]);

    // Copy backup code
    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
                    <p className="text-slate-600 mt-1">Manage your account and security settings</p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{success}</p>
                    </div>
                )}

                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-semibold text-slate-900">Profile Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">ID Number</label>
                            <input
                                type="text"
                                value={user?.id_number || ""}
                                disabled
                                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={user?.name || ""}
                                disabled
                                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-semibold text-slate-900">Security</h2>
                    </div>

                    {/* 2FA Status */}
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="font-semibold text-slate-900">Two-Factor Authentication</h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    Add an extra layer of security to your account
                                </p>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    user?.two_factor_enabled
                                        ? "bg-green-100 text-green-700"
                                        : "bg-slate-200 text-slate-700"
                                }`}
                            >
                                {user?.two_factor_enabled ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        {!user?.two_factor_enabled ? (
                            <button
                                onClick={handleEnable2FA}
                                disabled={actionLoading}
                                className="mt-3 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                {actionLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Shield className="w-4 h-4" />
                                )}
                                Enable 2FA
                            </button>
                        ) : (
                            <button
                                onClick={handleDisable2FA}
                                disabled={actionLoading}
                                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Disable 2FA
                            </button>
                        )}
                    </div>

                    {/* Backup Codes Modal */}
                    {showBackupCodes && backupCodes.length > 0 && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="font-semibold text-yellow-900 mb-2">Save Your Backup Codes</h3>
                            <p className="text-sm text-yellow-800 mb-4">
                                Store these codes in a safe place. Each code can only be used once.
                            </p>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {backupCodes.map((code, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 bg-white p-2 rounded border border-yellow-300"
                                    >
                                        <code className="flex-1 text-sm font-mono">{code}</code>
                                        <button
                                            onClick={() => copyToClipboard(code)}
                                            className="text-slate-600 hover:text-slate-900"
                                        >
                                            {copiedCode === code ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowBackupCodes(false)}
                                className="text-sm text-yellow-800 hover:text-yellow-900 font-medium"
                            >
                                I've saved my codes
                            </button>
                        </div>
                    )}

                    {/* Session Refresh */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900">Session Management</h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    Refresh your session token to extend login time
                                </p>
                            </div>
                            <button
                                onClick={handleRefreshSession}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-900 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                {actionLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                                Refresh Session
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                    <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-900">Logout</h3>
                            <p className="text-sm text-slate-600 mt-1">Sign out of your account on this device</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            {actionLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <LogOut className="w-4 h-4" />
                            )}
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
