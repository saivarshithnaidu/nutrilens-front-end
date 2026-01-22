
import { AlertOctagon, Scale, Activity, Droplets } from "lucide-react";

export default function StaticDemo() {
    return (
        <div className="max-w-4xl mx-auto p-4 opacity-90 pointer-events-none select-none relative">
            {/* Overlay Label */}
            <div className="absolute top-0 right-0 z-20 bg-yellow-400 text-black font-bold px-3 py-1 rounded-bl-xl shadow-md transform rotate-2">
                DEMO PREVIEW OF LENS
            </div>

            {/* Insight Strip (Static) */}
            <div className="bg-gray-900/80 backdrop-blur-md text-white p-3 rounded-full flex items-center justify-between px-6 shadow-xl mb-6">
                <div className="flex items-center gap-2 text-sm font-medium opacity-70">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    NutriLens Static: Observation Mode
                </div>
                <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-gray-400">
                    PREVIEW
                </div>
            </div>

            {/* Header (Static) */}
            <div className="flex justify-between items-center bg-gray-100 text-gray-400 p-6 rounded-2xl shadow-sm border border-gray-200 mb-6 grayscale opacity-80">
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <AlertOctagon className="w-6 h-6" /> NUTRILENS AI
                    </h1>
                </div>
                <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
                    <span>Sample Data</span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 opacity-80 grayscale-[30%]">
                {/* Main Stats Column */}
                <div className="md:col-span-2 space-y-6">
                    {/* Fake Advice */}
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                        <AlertOctagon className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                            <p className="font-bold text-blue-900 text-sm">Medical-Aware Suggestion (Example)</p>
                            <p className="text-sm text-blue-800">
                                "Based on detected activity ~7,500 steps, you can slightly increase carb intake for dinner."
                            </p>
                        </div>
                    </div>

                    {/* Big Calorie Display (Static) */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm flex flex-col justify-center items-center border border-gray-100">
                        <span className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-2 block">Energy Balance (Sample)</span>
                        <div className="text-6xl font-black my-2 tracking-tighter text-gray-300">
                            1,450
                        </div>
                        <span className="text-gray-400 font-medium">calories remaining</span>

                        {/* Progress Bar */}
                        <div className="w-full max-w-md bg-gray-100 h-2 rounded-full mt-6">
                            <div className="h-full bg-gray-300 w-[60%]"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-8">
                            <Droplets className="w-8 h-8 text-blue-200 mb-2" />
                            <span className="text-2xl font-bold text-gray-300">60%</span>
                            <span className="text-xs text-gray-400 uppercase font-bold">Hydration</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-8">
                            <Activity className="w-8 h-8 text-green-200 mb-2" />
                            <span className="text-2xl font-bold text-gray-300">7,521</span>
                            <span className="text-xs text-gray-400 uppercase font-bold">Steps</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-300 h-full flex items-center justify-center text-center">
                        <div>
                            <Scale className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Live Logging Locked</p>
                            <p className="text-xs text-gray-300 mt-1">Login to activate inputs</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
