'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const ms = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(ms);
            if (videoRef.current) {
                videoRef.current.srcObject = ms;
            }
        } catch (err) {
            setError("Camera access denied or unavailable.");
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const captureAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setAnalyzing(true);
        setError('');

        // Capture frame
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx?.drawImage(videoRef.current, 0, 0);

        canvasRef.current.toBlob(async (blob) => {
            if (!blob) return;

            const userProfile = localStorage.getItem('userProfile');
            if (!userProfile) {
                router.push('/profile');
                return;
            }

            const formData = new FormData();
            formData.append('file', blob, 'meal.jpg');
            formData.append('user_data', userProfile);

            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    body: formData
                });

                if (!res.ok) throw new Error("Analysis failed");

                const data = await res.json();

                // Save to History (LocalStorage)
                const history = JSON.parse(localStorage.getItem('mealHistory') || '[]');
                const newEntry = {
                    timestamp: new Date().toISOString(),
                    food: data.food_items[0].name,
                    calories: data.total_nutrition.calories,
                    nutrition: data.total_nutrition
                };
                localStorage.setItem('mealHistory', JSON.stringify([newEntry, ...history]));

                setResult(data);
                stopCamera(); // Stop camera to show result static view
            } catch (e: any) {
                setError("Failed to analyze image. Please try again.");
            } finally {
                setAnalyzing(false);
            }
        }, 'image/jpeg');
    };

    const reset = () => {
        setResult(null);
        startCamera();
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
            <Navbar />
            <div className="max-w-md mx-auto px-4">

                {!result ? (
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                        {error ? (
                            <div className="p-10 text-center text-red-500">{error}</div>
                        ) : (
                            <div className="relative aspect-[3/4] bg-black">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Overlay */}
                                <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-xl pointer-events-none"></div>

                                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                                    <button
                                        onClick={captureAndAnalyze}
                                        disabled={analyzing}
                                        className="w-20 h-20 bg-white rounded-full border-4 border-gray-200 shadow-lg flex items-center justify-center disabled:opacity-50"
                                    >
                                        {analyzing ? (
                                            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <div className="w-16 h-16 bg-green-500 rounded-full"></div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="p-4 text-center">
                            <h2 className="font-bold text-gray-700">Scan Your Meal</h2>
                            <p className="text-xs text-gray-500">Center food within the frame</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in-up">
                        {/* Result Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold capitalize">{result.food_items[0].name}</h2>
                                    <p className="text-gray-500 text-sm">{result.food_items[0].portion_size} portion</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-extrabold text-green-600">{result.total_nutrition.calories}</div>
                                    <div className="text-xs text-gray-400 uppercase font-semibold">Calories</div>
                                </div>
                            </div>

                            {/* Macros */}
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {[
                                    { label: 'Prot', val: result.total_nutrition.protein_g, unit: 'g', color: 'bg-blue-100 text-blue-700' },
                                    { label: 'Carbs', val: result.total_nutrition.carbs_g, unit: 'g', color: 'bg-orange-100 text-orange-700' },
                                    { label: 'Fat', val: result.total_nutrition.fat_g, unit: 'g', color: 'bg-yellow-100 text-yellow-700' },
                                    { label: 'Sugar', val: result.total_nutrition.sugar_g, unit: 'g', color: 'bg-pink-100 text-pink-700' },
                                ].map((m, i) => (
                                    <div key={i} className={`p-2 rounded-xl text-center ${m.color}`}>
                                        <div className="font-bold text-lg">{m.val}</div>
                                        <div className="text-[10px] uppercase opacity-80">{m.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Medical Warnings */}
                            {result.health_warnings && result.health_warnings.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    {result.health_warnings.map((w: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                                            <span className="text-lg">⚠️</span>
                                            <span>{w}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* AI Advice */}
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <h4 className="font-bold text-green-800 text-sm mb-1">AI Nutritionist Advice</h4>
                                <p className="text-green-700 text-sm leading-relaxed">
                                    {result.dietary_advice}
                                </p>
                            </div>
                        </div>

                        <button onClick={reset} className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg">
                            Scan Another Meal
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
