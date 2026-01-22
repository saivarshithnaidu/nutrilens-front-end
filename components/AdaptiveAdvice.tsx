"use client";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface AdviceData {
    color: string;
    status: string;
    recommendation: string;
    limit: string;
    remaining: string;
}

interface AdviceProps {
    consumed: number;
    burned: number;
    water: number;
}

export default function AdaptiveAdvice({ consumed, burned, water }: AdviceProps) {
    const [advice, setAdvice] = useState<AdviceData | null>(null);

    useEffect(() => {
        // Debounce fetch
        const timer = setTimeout(() => {
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adaptive_advice`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ consumed, burned, water })
            })
                .then(res => res.json())
                .then(data => setAdvice(data))
                .catch(e => console.error("Advice fetch error", e));
        }, 1000);

        return () => clearTimeout(timer);
    }, [consumed, burned, water]);

    if (!advice) return (
        <div className="bg-gray-100 h-32 rounded-2xl animate-pulse"></div>
    );

    const colors = {
        green: "bg-green-50 border-green-200 text-green-800",
        orange: "bg-orange-50 border-orange-200 text-orange-800",
        red: "bg-red-50 border-red-200 text-red-800",
        gray: "bg-gray-50 border-gray-200 text-gray-800"
    };

    const theme = colors[advice.color as keyof typeof colors] || colors.gray;

    return (
        <div className={`p-6 rounded-2xl border ${theme} relative overflow-hidden transition-all duration-500`}>
            <div className="flex justify-between items-start mb-2 relative z-10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    NutriLens Suggests
                </h3>
                <span className="text-xs font-black uppercase tracking-wider opacity-70 border px-2 py-1 rounded-full">
                    {advice.status}
                </span>
            </div>

            <p className="font-medium text-lg leading-relaxed relative z-10">
                {advice.recommendation}
            </p>

            <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center text-sm font-bold opacity-80 relative z-10">
                <span>Limit: {advice.limit}</span>
                <span className="flex items-center gap-1">
                    Effective Remaining: {advice.remaining} <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </div>
    );
}
