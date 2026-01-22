"use client";
import { useState } from "react";
import { Footprints, Check } from "lucide-react";

export default function StepTracker({ onSave }: { onSave: (steps: number, time: number) => void }) {
    const [mode, setMode] = useState<'steps' | 'time'>('steps');
    const [val, setVal] = useState("");
    const [burned, setBurned] = useState(0);

    const handleCalc = () => {
        const num = parseInt(val) || 0;
        let b = 0;
        if (mode === 'steps') {
            b = num * 0.04;
        } else {
            // Approx: 70kg * 3.5 MET * (min/60)
            b = 3.5 * 70 * (num / 60);
        }
        setBurned(Math.round(b));
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Footprints className="text-orange-500" /> Walking
            </h3>

            <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => { setMode('steps'); setVal(""); setBurned(0) }}
                    className={`flex-1 py-1 text-sm font-medium rounded-md transition ${mode === 'steps' ? 'bg-white shadow' : 'text-gray-500'}`}
                >
                    Steps
                </button>
                <button
                    onClick={() => { setMode('time'); setVal(""); setBurned(0) }}
                    className={`flex-1 py-1 text-sm font-medium rounded-md transition ${mode === 'time' ? 'bg-white shadow' : 'text-gray-500'}`}
                >
                    Duration
                </button>
            </div>

            <div className="flex gap-2">
                <input
                    type="number"
                    placeholder={mode === 'steps' ? "e.g. 5000" : "minutes"}
                    className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={val}
                    onChange={(e) => {
                        setVal(e.target.value);
                        // instant calc
                        const num = parseInt(e.target.value) || 0;
                        if (mode === 'steps') setBurned(Math.round(num * 0.04));
                        else setBurned(Math.round(3.5 * 70 * (num / 60)));
                    }}
                />
                <button
                    onClick={() => onSave(mode === 'steps' ? parseInt(val) : 0, mode === 'time' ? parseInt(val) : 0)}
                    className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 transition"
                >
                    <Check />
                </button>
            </div>

            <div className="mt-4 text-center">
                <div className="text-3xl font-black text-orange-500">{burned}</div>
                <div className="text-xs text-gray-400 uppercase font-bold">kcal burned</div>
            </div>
        </div>
    );
}
