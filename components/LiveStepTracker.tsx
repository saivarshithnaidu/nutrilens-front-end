"use client";
import { useEffect, useState } from "react";
import { usePedometer } from "../hooks/usePedometer";
import { Activity, Zap } from "lucide-react";

export default function LiveStepTracker({ onUpdate }: { onUpdate: (steps: number, burned: number) => void }) {
    const { steps, isSupported, setSteps } = usePedometer();
    const [demoMode, setDemoMode] = useState(false);

    // Burned Calc
    const burned = Math.round(steps * 0.04);

    useEffect(() => {
        onUpdate(steps, burned);
    }, [steps]);

    // Demo Loop
    useEffect(() => {
        let interval: any;
        if (demoMode) {
            interval = setInterval(() => {
                setSteps(prev => prev + Math.floor(Math.random() * 5) + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [demoMode]);

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden border border-white/10">
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <h3 className="text-blue-200 font-bold uppercase text-xs flex items-center gap-1 tracking-wider">
                        <Activity className="w-4 h-4" /> Activity Scan
                    </h3>
                    <div className="text-4xl font-black mt-1 tracking-tight">{steps.toLocaleString()}</div>
                    <div className="text-blue-200 text-sm font-medium">signals detected</div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold">{burned}</div>
                    <div className="text-xs font-bold uppercase text-blue-200">kcal burned</div>
                </div>
            </div>

            {/* Visual Pulse */}
            {(isSupported || demoMode) && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full animate-ping"></div>
            )}

            <div className="mt-4 text-xs font-mono text-blue-200/80">
                {steps > 0 ? "> NutriLens detecting movement..." : "> Waiting for activity signal..."}
            </div>

            {/* Demo Controls for Desktop */}
            <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                {!isSupported && (
                    <button
                        onClick={() => setDemoMode(!demoMode)}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full font-bold flex items-center gap-1 transition"
                    >
                        <Zap className="w-3 h-3" /> {demoMode ? "Stop Signal Sim" : "Simulate Signal"}
                    </button>
                )}
                <div className="text-xs flex items-center gap-1 opacity-70">
                    {isSupported ? (
                        <><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Sensor Active</>
                    ) : (
                        <><span className="w-2 h-2 bg-yellow-400 rounded-full"></span> Sensor Not Found</>
                    )}
                </div>
            </div>
        </div>
    );
}
