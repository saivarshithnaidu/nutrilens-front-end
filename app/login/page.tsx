'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Login() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/proxy/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Login failed');

            login(data.access_token);
            // Check for callback URL or default to dashboard
            const params = new URLSearchParams(window.location.search);
            const callback = params.get('callbackUrl');
            if (callback) {
                // Determine if we need to auto-scan
                if (callback.includes("autoScan=true")) {
                    localStorage.setItem('pending_autoscan', 'true');
                }
                // If the user is being redirected to dashboard, AuthContext usually forces it.
                // But setting the local storage above handles the "action".
                // window.location.href = callback; // Let's avoid explicit redirect if login() handles it.
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

                {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email or Phone</label>
                        <input
                            required
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">Forgot?</Link>
                        </div>
                        <input
                            required
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    New to NutriLens? <Link href="/signup" className="text-green-600 font-bold hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
}
