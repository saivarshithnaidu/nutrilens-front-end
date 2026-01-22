"use client";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface AlertProps {
    alert: {
        id: number;
        type: string;
        severity: string;
        message: string;
        tests: string[];
    };
    onDismiss: (id: number) => void;
}

export default function HealthAlert({ alert, onDismiss }: AlertProps) {
    const isHigh = alert.severity === "high";

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-sm mb-4 animate-in fade-in slide-in-from-top-2 ${isHigh ? "bg-orange-50 border-orange-500" : "bg-yellow-50 border-yellow-400"
            }`}>
            <div className="flex items-start gap-3">
                <AlertTriangle className={`w-6 h-6 shrink-0 ${isHigh ? "text-orange-600" : "text-yellow-600"}`} />

                <div className="flex-1">
                    <h4 className={`font-bold text-sm uppercase mb-1 ${isHigh ? "text-orange-800" : "text-yellow-800"}`}>
                        Health Pattern Detected
                    </h4>
                    <p className="text-gray-800 font-medium mb-3">
                        {alert.message}
                    </p>

                    {alert.tests.length > 0 && (
                        <div className="mb-3">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Suggested Tests to Consider:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {alert.tests.map(t => (
                                    <span key={t} className="bg-white border px-2 py-1 rounded text-xs text-gray-700 font-semibold shadow-sm">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-gray-500 bg-white/50 p-2 rounded flex gap-2 items-start mt-2">
                        <Info className="w-3 h-3 mt-0.5" />
                        <i>
                            Disclaimer: This is not a diagnosis. We detected a pattern based on your logs.
                            Please consult a qualified doctor before taking action.
                        </i>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => onDismiss(alert.id)}
                    className="text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1 px-3 py-1 bg-white border rounded shadow-sm hover:shadow transition"
                >
                    <CheckCircle className="w-4 h-4" /> I'll check with a doctor
                </button>
            </div>
        </div>
    );
}
