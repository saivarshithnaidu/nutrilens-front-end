"use client";
import React from 'react';
import { Camera, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LensPreview() {
    const router = useRouter();

    const handleActivate = () => {
        // Redirect to Login with a callback to dashboard auto-scanning
        // Encoding the callback URL to ensure it passes through cleanly
        const target = encodeURIComponent('/dashboard?autoScan=true');
        router.push(`/login?callbackUrl=${target}`);
    };

    return (
        <div className="relative group cursor-pointer" onClick={handleActivate}>
            {/* Phone Frame UI */}
            <div className="w-64 h-96 mx-auto bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 relative transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-purple-500/20">

                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-b-2xl z-20"></div>

                {/* Screen Area */}
                <div className="w-full h-full bg-gray-900 rounded-[2.5rem] relative overflow-hidden">

                    {/* Blurred Mock BG representing camera feed */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50">
                        {/* Abstract shapes to look like a blurred room/food */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-900/40 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-900/40 rounded-full blur-3xl"></div>
                    </div>

                    {/* Overlay UI */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">

                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                            <Camera className="w-8 h-8 text-white opacity-80" />
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-lg tracking-tight">Scan Your Meal</h3>
                            <p className="text-gray-400 text-xs mt-1 font-medium">Identify foods & macros instantly</p>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full backdrop-blur-sm border border-white/10">
                            <Lock className="w-3 h-3 text-yellow-500" />
                            <span className="text-[10px] text-gray-300 uppercase tracking-wider font-bold">Login Required</span>
                        </div>

                    </div>

                    {/* Camera UI Elements (Decorations) */}
                    <div className="absolute bottom-8 inset-x-0 flex justify-center items-center gap-8 opacity-50">
                        <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                        <div className="w-16 h-16 rounded-full border-4 border-white"></div>
                        <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                    </div>

                    {/* Demo Label */}
                    <div className="absolute top-8 right-6 bg-purple-600 px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                        Demo
                    </div>
                </div>
            </div>

            {/* CTA specific to this section */}
            <div className="text-center mt-6">
                <button
                    onClick={(e) => { e.stopPropagation(); handleActivate(); }}
                    className="text-sm font-bold text-gray-400 hover:text-purple-600 transition flex items-center justify-center gap-1 mx-auto"
                >
                    Tap to Activate Lens
                </button>
            </div>
        </div>
    );
}
