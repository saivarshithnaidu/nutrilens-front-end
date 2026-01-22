"use client";
import { useState } from "react";
import { Droplet, Plus } from "lucide-react";

interface WaterProps {
    current: number;
    target: number;
    advice: string;
    onAdd: () => void;
}

export default function WaterTracker({ current, target, advice, onAdd }: WaterProps) {
    const percent = Math.min((current / target) * 100, 100);

    let signalStrength = "Weak";
    let signalColor = "text-red-600";
    if (percent > 40) { signalStrength = "Moderate"; signalColor = "text-orange-600"; }
    if (percent > 80) { signalStrength = "Optimal"; signalColor = "text-green-600"; }

    return (
        <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                        <Droplet className="fill-blue-600 text-blue-600" /> Hydration Signal
                    </h3>
                    <div className="text-right">
                        <span className={`block text-xs font-black uppercase tracking-wider ${signalColor}`}>
                            Signal: {signalStrength}
                        </span>
                        <span className="text-xs text-blue-400 font-medium">
                            {current} / {target} ml detected
                        </span>
                    </div>
                </div>

                {/* Visual Cups as Signal Bars */}
                <div className="flex gap-1 items-end h-8 mb-4">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-sm transition-all duration-500 ${i < (percent / 10) ? 'bg-blue-500' : 'bg-blue-200/50'
                                }`}
                            style={{ height: `${(i + 1) * 10}%` }}
                        ></div>
                    ))}
                </div>

                <p className="text-sm text-blue-800 mb-4 font-medium italic border-l-2 border-blue-400 pl-3">
                    "NutriLens detects: {advice}"
                </p>
            </div>

            <button
                onClick={onAdd}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition active:scale-95 shadow-blue-200 shadow-lg"
            >
                <Plus className="w-5 h-5" /> Boost Signal (+250ml)
            </button>
        </div>
    );
}
