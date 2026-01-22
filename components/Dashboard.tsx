"use client";

import { useState, useEffect } from "react";
import ManualEntry from "./ManualEntry";
import { Settings, Scale, AlertOctagon, Camera } from "lucide-react";
import WaterTracker from "./WaterTracker";
import LiveStepTracker from "./LiveStepTracker";
import AdaptiveAdvice from "./AdaptiveAdvice";
import HealthAlert from "./HealthAlert";
import FoodScannerModal from "./FoodScannerModal";

interface Alert {
    id: number;
    type: string;
    severity: string;
    message: string;
    tests: string[];
}

interface UserProfile {
    diet_preset: string;
    medical_conditions: string[];
}

export default function Dashboard() {
    const [preset, setPreset] = useState<string>("maintenance");
    const [goal, setGoal] = useState<number>(2000);
    const [consumed, setConsumed] = useState<number>(0);
    const [burned, setBurned] = useState<number>(0);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [water, setWater] = useState<number>(0);
    const waterTarget = 2450;
    const waterAdvice = "Start sipping!";
    const [userProfile, setUserProfile] = useState<UserProfile>({
        diet_preset: preset,
        medical_conditions: ["diabetes"]
    });
    const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

    const PRESETS: Record<string, number> = {
        "weight_loss": 1500,
        "maintenance": 2000,
        "weight_gain": 2500,
        "diabetic": 1800,
        "high_protein": 2200
    };

    // Derive goal from preset to avoid setState in effect
    const currentGoal = PRESETS[preset] || 2000;
    useEffect(() => {
        setGoal(currentGoal);
    }, [currentGoal]);

    useEffect(() => {
        setUserProfile(prev => ({ ...prev, diet_preset: preset }));
    }, [preset]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/alerts`)
            .then(res => {
                if (!res.ok) throw new Error("Err");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setAlerts(data);
                else throw new Error("Not Array");
            })
            .catch(() => {
                setAlerts([{
                    id: 1, type: "low_intake", severity: "medium",
                    message: "Calorie intake has been very low (<1200 kcal) for 3 days.",
                    tests: ["Vitamin B12", "Vitamin D"]
                }]);
            });
    }, []);

    useEffect(() => {
        const pendingScan = localStorage.getItem('pending_autoscan');
        if (pendingScan === 'true') {
            setIsScannerOpen(true);
            localStorage.removeItem('pending_autoscan');
        }
    }, []);

    const handleLogAdd = (calories: number): void => {
        setConsumed(prev => prev + calories);
    };

    const handleScanSave = (calories: number, foodName: string): void => {
        setConsumed(prev => prev + calories);
        alert(`Added ${foodName} (${calories} kcal) to your daily intake.`);
    };

    const handleLiveUpdate = (steps: number, burnedVal: number): void => {
        setBurned(burnedVal);
    };

    const handleWaterAdd = (): void => {
        setWater(prev => prev + 250);
    };

    const handleWeightUpdate = async (): Promise<void> => {
        const w = prompt("Enter current weight (kg):");
        if (w) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/log/weight`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ weight_kg: parseFloat(w) })
                });
                alert("Weight updated. Safety checks running.");
                window.location.reload();
            } catch (e) { console.error(e); }
        }
    };

    const dismissAlert = (id: number): void => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/alerts/${id}/resolve`, { method: "POST" }).catch(e => console.error(e));
    };

    const remaining = (goal + burned) - consumed;
    const progress = Math.min((consumed / goal) * 100, 100);

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-8">
            <FoodScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onSave={handleScanSave}
            />

            <div className="bg-black/80 backdrop-blur-md text-white p-3 rounded-full flex items-center justify-between px-6 shadow-xl sticky top-4 z-50">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    NutriLens Active: Monitoring {userProfile.diet_preset.replace("_", " ")} signals...
                </div>
                <div className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    LIVE
                </div>
            </div>

            {alerts.length > 0 && (
                <div className="space-y-4">
                    {alerts.map(a => <HealthAlert key={a.id} alert={a} onDismiss={dismissAlert} />)}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg border-b-4 border-purple-500">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        <AlertOctagon className="w-8 h-8 text-purple-400" /> NUTRILENS AI
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">Intelligent Health Observation Lens</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-purple-900/50 border border-purple-400"
                    >
                        <Camera className="w-4 h-4" /> Scan Meal
                    </button>

                    <button
                        onClick={() => void handleWeightUpdate()}
                        className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-sm transition"
                    >
                        <Scale className="w-4 h-4" /> Log Body Signal (Weight)
                    </button>

                    <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                        <Settings className="w-5 h-5 text-gray-300" />
                        <select
                            value={preset}
                            onChange={(e) => setPreset(e.target.value)}
                            className="bg-transparent text-white md:text-sm font-semibold outline-none cursor-pointer uppercase"
                        >
                            <option value="weight_loss" className="text-black">Lens Focus: Weight Loss</option>
                            <option value="maintenance" className="text-black">Lens Focus: Maintenance</option>
                            <option value="weight_gain" className="text-black">Lens Focus: Weight Gain</option>
                            <option value="diabetic" className="text-black">Lens Focus: Diabetic</option>
                            <option value="high_protein" className="text-black">Lens Focus: High Protein</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <AdaptiveAdvice consumed={consumed} burned={burned} water={water} />

                    <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center relative overflow-hidden border border-gray-100 group">
                        <div className="absolute inset-0 bg-purple-50 opacity-30 z-0"></div>

                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="absolute top-4 right-4 p-3 bg-purple-100 rounded-full text-purple-600 hover:bg-purple-200 hover:scale-110 transition z-20"
                            title="Open Food Scanner"
                        >
                            <Camera className="w-6 h-6" />
                        </button>

                        <div className="z-10 text-center">
                            <span className="text-gray-500 font-bold tracking-widest uppercase text-xs mb-2 block">NutriLens View: Available Energy</span>
                            <div className={`text-6xl md:text-8xl font-black my-2 tracking-tighter ${remaining < 0 ? 'text-red-500' : 'text-purple-600'}`}>
                                {Math.round(remaining)}
                            </div>
                            <span className="text-gray-400 font-medium">calories remaining for today</span>
                        </div>

                        <div className="w-full max-w-md bg-gray-100 h-2 rounded-full mt-6 overflow-hidden relative">
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${remaining < 0 ? 'bg-red-500' : 'bg-purple-500'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between w-full max-w-md mt-2 text-xs text-gray-500 font-bold px-1 uppercase tracking-wide">
                            <span>Observed Intake: {consumed}</span>
                            <span className="text-green-600">Active Limit: {goal}</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <WaterTracker current={water} target={waterTarget} advice={waterAdvice} onAdd={handleWaterAdd} />
                        <LiveStepTracker onUpdate={handleLiveUpdate} />
                    </div>
                </div>

                <div className="space-y-6">
                    <ManualEntry userProfile={userProfile} onAdd={handleLogAdd} />

                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                        <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                            <AlertOctagon className="w-4 h-4" /> Lens Insight
                        </h4>
                        <p className="text-sm text-purple-800 leading-relaxed">
                            NutriLens is continuously analyzing your intake and activity signals to adjust your &quot;Safe To Eat&quot; limit. Stay active to unlock more food flexibility!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
