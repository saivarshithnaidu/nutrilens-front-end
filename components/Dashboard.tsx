"use client";

import { useState, useEffect } from "react";
import ManualEntry from "./ManualEntry";
import { Flame, Target, Settings, Activity, Scale, AlertOctagon, Camera } from "lucide-react";
import WaterTracker from "./WaterTracker";
import LiveStepTracker from "./LiveStepTracker"; // Changed from StepTracker
import AdaptiveAdvice from "./AdaptiveAdvice"; // Changed from DietPlan
import HealthAlert from "./HealthAlert";
import FoodScannerModal from "./FoodScannerModal"; // Added Import

export default function Dashboard() {
    const [preset, setPreset] = useState("maintenance");
    const [goal, setGoal] = useState(2000);
    const [consumed, setConsumed] = useState(0);
    const [burned, setBurned] = useState(0);

    const [alerts, setAlerts] = useState<any[]>([]);

    // Water State
    const [water, setWater] = useState(0);
    const [waterTarget, setWaterTarget] = useState(2450);
    const [waterAdvice, setWaterAdvice] = useState("Start sipping!");

    // Simulated User Profile
    const [userProfile, setUserProfile] = useState({
        diet_preset: "maintenance",
        medical_conditions: ["diabetes"]
    });

    const PRESETS: Record<string, number> = {
        "weight_loss": 1500,
        "maintenance": 2000,
        "weight_gain": 2500,
        "diabetic": 1800,
        "high_protein": 2200
    };

    useEffect(() => {
        setGoal(PRESETS[preset] || 2000);
        setUserProfile(prev => ({ ...prev, diet_preset: preset }));
    }, [preset]);

    useEffect(() => {
        // Create mock alert for Demo if API fails
        // In prod: fetch('/api/alerts')
        fetch('http://localhost:8000/api/alerts')
            .then(res => {
                if (!res.ok) throw new Error("Err");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setAlerts(data);
                else throw new Error("Not Array");
            })
            .catch(() => {
                // Mock Data for Viva Demo
                setAlerts([{
                    id: 1, type: "low_intake", severity: "medium",
                    message: "Calorie intake has been very low (<1200 kcal) for 3 days.",
                    tests: ["Vitamin B12", "Vitamin D"]
                }]);
            });
    }, []);

    const [isScannerOpen, setIsScannerOpen] = useState(false);

    useEffect(() => {
        // PCR Check: Auto-open scanner if requested from Home/Login flow
        const pendingScan = localStorage.getItem('pending_autoscan');
        if (pendingScan === 'true') {
            setIsScannerOpen(true);
            localStorage.removeItem('pending_autoscan');
        }
    }, []);

    const handleLogAdd = (calories: number) => {
        setConsumed(prev => prev + calories);
    };

    const handleScanSave = (calories: number, foodName: string) => {
        setConsumed(prev => prev + calories);
        // Optional: Add to alerts or history list if it existed
        alert(`Added ${foodName} (${calories} kcal) to your daily intake.`);
    };

    const handleLiveUpdate = (steps: number, burnedVal: number) => {
        setConsumed(prev => prev); // No-op, just to keep TS happy if needed or remove this line
        setBurned(burnedVal);
        // In real app, we might debouce POST this to DB
    };

    const handleWaterAdd = () => {
        setWater(prev => prev + 250);
    };

    const handleWeightUpdate = async () => {
        const w = prompt("Enter current weight (kg):");
        if (w) {
            try {
                await fetch("http://localhost:8000/api/log/weight", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ weight_kg: parseFloat(w) })
                });
                alert("Weight updated. Safety checks running.");
                // Refresh alerts
                window.location.reload();
            } catch (e) { console.error(e); }
        }
    };

    const dismissAlert = (id: number) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        // Call API
        fetch(`http://localhost:8000/api/alerts/${id}/resolve`, { method: "POST" }).catch(e => console.error(e));
    };

    const remaining = (goal + burned) - consumed; // Add burned back to budget
    const progress = Math.min((consumed / goal) * 100, 100);

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-8">
            <FoodScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onSave={handleScanSave}
            />

            {/* Insight Strip */}
            <div className="bg-black/80 backdrop-blur-md text-white p-3 rounded-full flex items-center justify-between px-6 shadow-xl sticky top-4 z-50">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    NutriLens Active: Monitoring {userProfile.diet_preset.replace("_", " ")} signals...
                </div>
                <div className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    LIVE
                </div>
            </div>

            {/* Safety Alerts Area */}
            {alerts.length > 0 && (
                <div className="space-y-4">
                    {alerts.map(a => <HealthAlert key={a.id} alert={a} onDismiss={dismissAlert} />)}
                </div>
            )}

            {/* Header / Preset Selector */}
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
                        onClick={handleWeightUpdate}
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
                {/* Main Stats Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Adaptive Advice Card (Dynamic) */}
                    <AdaptiveAdvice consumed={consumed} burned={burned} water={water} />

                    {/* Big Calorie Display */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center relative overflow-hidden border border-gray-100 group">
                        <div className="absolute inset-0 bg-purple-50 opacity-30 z-0"></div>

                        {/* Quick Camera Access in Card */}
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

                        {/* Progress Bar */}
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

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <ManualEntry userProfile={userProfile} onAdd={handleLogAdd} />

                    {/* Info Tips */}
                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                        <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                            <AlertOctagon className="w-4 h-4" /> Lens Insight
                        </h4>
                        <p className="text-sm text-purple-800 leading-relaxed">
                            NutriLens is continuously analyzing your intake and activity signals to adjust your "Safe To Eat" limit. Stay active to unlock more food flexibility!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
