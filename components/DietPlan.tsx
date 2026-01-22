"use client";
import { useEffect, useState } from "react";
import { Utensils, ChevronDown, ChevronUp } from "lucide-react";

interface Meal {
    food: string;
    target_calories: number;
    description: string;
}

interface DietPlanData {
    daily_calories: number;
    goal: string;
    meals: Record<string, Meal>;
}

export default function DietPlan() {
    const [plan, setPlan] = useState<DietPlanData | null>(null);
    const [expanded, setExpanded] = useState<boolean>(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/diet_plan")
            .then(res => {
                if (!res.ok) throw new Error("API Error");
                return res.json();
            })
            .then(data => {
                if (data && data.meals) {
                    setPlan(data);
                } else {
                    throw new Error("Invalid Format");
                }
            })
            .catch((e) => {
                // Fallback Mock for Demo if API fails (e.g. auth missing/profile missing)
                setPlan({
                    daily_calories: 2000,
                    goal: "maintenance",
                    meals: {
                        "Breakfast": { "food": "Oats + Fruit", "target_calories": 500, "description": "High Fiber" },
                        "Lunch": { "food": "Rice + Dhal + Veg", "target_calories": 700, "description": "Balanced" },
                        "Snack": { "food": "Green Tea + Nuts", "target_calories": 300, "description": "Light" },
                        "Dinner": { "food": "Roti + Paneer", "target_calories": 500, "description": "Light Carb" }
                    }
                });
            });
    }, []);

    if (!plan || !plan.meals) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div
                className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2 font-bold text-gray-700">
                    <Utensils className="w-5 h-5" /> Your Daily Plan
                </div>
                {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </div>

            {expanded && (
                <div className="p-4 space-y-4">
                    {Object.keys(plan.meals).map((meal) => (
                        <div key={meal} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">{meal}</h4>
                                <p className="font-medium text-gray-800">{plan.meals[meal].food}</p>
                                <p className="text-xs text-gray-500 mt-1">{plan.meals[meal].description}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-green-600 block">{plan.meals[meal].target_calories}</span>
                                <span className="text-xs text-gray-400">kcal</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
