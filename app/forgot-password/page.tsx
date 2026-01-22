'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Request, 2: Reset
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/proxy/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_or_phone: emailOrPhone })
            });
            const data = await res.json();
            // Even if user not found, we show success to prevent enumeration
            setMessage("If an account exists, instructions have been sent. (Check Server Console for Demo Token)");
            setStep(2);
        } catch (err: any) {
            setError("Failed to process request");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/proxy/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Reset failed');

            setMessage("Password reset successful! You can now login.");
            setTimeout(() => window.location.href = '/login', 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

                {message && <div className="p-3 mb-4 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}
                {error && <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRequest} className="space-y-4">
                        <p className="text-gray-600 text-sm mb-4">Enter your email or phone to receive a reset token.</p>
                        <input
                            required
                            type="text"
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                            className="w-full p-3 border rounded-xl"
                            placeholder="Email or Phone"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white font-bold rounded-xl hover:opacity-80 transition"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <p className="text-gray-600 text-sm mb-4">Enter the token sent to you and your new password.</p>
                        <input
                            required
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full p-3 border rounded-xl"
                            placeholder="Reset Token"
                        />
                        <input
                            required
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border rounded-xl"
                            placeholder="New Password"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:opacity-80 transition"
                        >
                            {loading ? 'Resetting...' : 'Set New Password'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-gray-500 hover:underline text-sm">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
