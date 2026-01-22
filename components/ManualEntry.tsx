"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, Activity } from "lucide-react";

interface Portion {
    id: number;
    name: string;
    weight_g: number;
}

interface FoodItem {
    id: number;
    name: string;
    portions: Portion[];
}

interface UserProfile {
    diet_preset: string;
    medical_conditions: string[];
}

interface CheckFoodResult {
    calories: number;
    recommendation: string;
    traffic_light: 'red' | 'yellow' | 'green';
    context_message: string;
    warnings: string[];
}

export default function ManualEntry({ userProfile, onAdd }: { userProfile: UserProfile, onAdd?: (calories: number) => void }) {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
    const [result, setResult] = useState<CheckFoodResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/foods`)
            .then((res) => res.json())
            .then((data) => setFoods(data))
            .catch((err) => console.error("Error loading foods:", err));
    }, []);

    const calculate = async (food: FoodItem, portion: Portion): Promise<void> => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check_food`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    food_id: food.id,
                    portion_weight_g: portion.weight_g,
                    user_profile: userProfile,
                }),
            });
            const data: CheckFoodResult = await res.json();
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFoodChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const foodId = parseInt(e.target.value, 10);
        const food = foods.find((f) => f.id === foodId);
        setSelectedFood(food || null);
        setSelectedPortion(null);
        setResult(null);
    };

    const handlePortionChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const pName = e.target.value;
        if (selectedFood) {
            const portion = selectedFood.portions.find((p) => p.name === pName);
            setSelectedPortion(portion || null);
            if (portion) void calculate(selectedFood, portion);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="text-purple-600" />
                Food Lens
            </h2>

            {/* Food Selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Food</label>
                <div className="relative">
                    <select
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                        onChange={handleFoodChange}
                        value={selectedFood?.id || ""}
                    >
                        <option value="">-- Choose Food --</option>
                        {foods.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
            </div>

            {/* Portion Selector */}
            {selectedFood && (
                <div className="mb-6 fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Portion Size</label>
                    <div className="relative">
                        <select
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={handlePortionChange}
                            value={selectedPortion?.name || ""}
                        >
                            <option value="">-- How much? --</option>
                            {selectedFood.portions.map((p) => (
                                <option key={p.id} value={p.name}>
                                    {p.name} ({p.weight_g}g)
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Result Card */}
            {result && (
                <div className={`p-4 rounded-xl border animate-in slide-in-from-bottom-2 ${result.traffic_light === 'red' ? 'bg-red-50 border-red-200' :
                    result.traffic_light === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-green-50 border-green-200'
                    }`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold">
                            {result.calories} <span className="text-sm font-normal text-gray-500">kcal</span>
                        </span>
                        {result.traffic_light === 'red' && <AlertTriangle className="text-red-500" />}
                        {result.traffic_light === 'yellow' && <Activity className="text-yellow-600" />}
                        {result.traffic_light === 'green' && <CheckCircle className="text-green-500" />}
                    </div>

                    <p className="text-sm text-gray-600 mb-2 italic">
                        "{result.context_message}"
                    </p>

                    {result.warnings.length > 0 && (
                        <div className="space-y-1">
                            {result.warnings.map((w: string, i: number) => (
                                <div key={i} className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded inline-block mr-1">
                                    {w}
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => onAdd && onAdd(result.calories)}
                        className="w-full mt-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition transform active:scale-95"
                    >
                        Add to Food Lens
                    </button>
                </div>
            )}
        </div>
    );
}
