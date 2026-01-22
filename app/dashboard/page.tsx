
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading NutriLens...</p>
                </div>
            </div>
        );
    }

    if (!user) return null; // Redirecting...

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
                    NUTRILENS AI <span className="text-xs text-gray-400 ml-2 border border-gray-200 px-2 py-0.5 rounded-full font-medium">DASHBOARD</span>
                </div>
                <div className="space-x-4">
                    <span className="text-sm font-medium text-gray-600">
                        {user.email}
                    </span>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-6">
                <Dashboard />
            </main>
        </div>
    );
}
