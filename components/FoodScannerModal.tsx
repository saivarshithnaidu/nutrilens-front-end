"use client";
import { useState, useRef, useEffect } from "react";
import { X, Camera, RefreshCw, Check, AlertTriangle, ChevronRight, Edit2 } from "lucide-react";

interface AnalysisResult {
    calories: number;
    food_name: string;
    nutrition: Record<string, number>;
    foods: Array<{
        food_name: string;
        quantity: number;
        unit: string;
        confidence: number;
        nutrition_per_100g: {
            protein_g: number;
            carbs_g: number;
            fat_g: number;
        };
    }>;
}

interface FoodScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (calories: number, foodName: string) => void;
}

export default function FoodScannerModal({ isOpen, onClose, onSave }: FoodScannerModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // States: 'camera' | 'preview' | 'analyzing' | 'result'
    const [mode, setMode] = useState<'camera' | 'preview' | 'analyzing' | 'result'>('camera');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    // Editing State
    const [editedCalories, setEditedCalories] = useState<number>(0);
    const [editedName, setEditedName] = useState<string>("");

    useEffect(() => {
        if (isOpen && mode === 'camera') {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen, mode]);

    const startCamera = async (): Promise<void> => {
        try {
            setError('');
            const ms = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(ms);
            if (videoRef.current) {
                videoRef.current.srcObject = ms;
            }
        } catch (err) {
            setError("Camera access denied. Please check permissions.");
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleCapture = (): void => {
        if (!videoRef.current || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        // Draw video to canvas
        ctx.drawImage(videoRef.current, 0, 0);

        // Get Blob
        canvasRef.current.toBlob((blob) => {
            if (blob) {
                setImageBlob(blob);
                setPreviewUrl(URL.createObjectURL(blob));
                setMode('preview');
                stopCamera();
            }
        }, 'image/jpeg', 0.9);
    };

    const handleRetake = (): void => {
        setMode('camera');
        setAnalysisResult(null);
        setImageBlob(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    const handleAnalyze = async (): Promise<void> => {
        if (!imageBlob) return;
        setMode('analyzing');

        const formData = new FormData();
        formData.append('file', imageBlob, 'capture.jpg');
        // Retrieve simulated profile or real one
        // For now, mocking user data as expected by backend or simple string
        const userProfile = localStorage.getItem('userProfile') || JSON.stringify({ diet_preset: 'maintenance' });
        formData.append('user_data', userProfile);

        try {
            // Using full URL to backend
            const res = await fetch("http://localhost:8000/api/analyze", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Server analysis failed");

            const data = await res.json();

            // Set Initial Results
            if (data.foods && data.foods.length > 0) {
                const food = data.foods[0];
                setAnalysisResult(data);
                setEditedName(food.name);
                // Calculate total calories based on default portion
                const cals = (food.nutrition_per_100g.calories * (food.default_portion.weight_g / 100));
                setEditedCalories(Math.round(cals));
                setMode('result');
            } else {
                throw new Error("No food detected. Please try again.");
            }
        } catch (e: any) {
            setError(e.message || "Analysis Failed");
            setMode('preview'); // Go back to preview to retry
        }
    };

    const handleConfirm = () => {
        onSave(editedCalories, editedName);
        handleClose();
    };

    const handleClose = () => {
        stopCamera();
        setMode('camera');
        setAnalysisResult(null);
        setImageBlob(null);
        setPreviewUrl(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b bg-gray-50">
                    <h2 className="font-extrabold text-gray-800 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-purple-600" />
                        Scan Meal
                    </h2>
                    <button onClick={handleClose} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-100 relative min-h-[400px]">

                    {/* CAMERA MODE */}
                    {mode === 'camera' && (
                        <div className="absolute inset-0 bg-black flex flex-col justify-center items-center">
                            {error ? (
                                <div className="text-white text-center p-8">
                                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                    <p>{error}</p>
                                    <button onClick={startCamera} className="mt-4 px-4 py-2 bg-white text-black rounded-full">
                                        Retry Camera
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                    <div className="absolute bottom-6 w-full flex justify-center">
                                        <button
                                            onClick={handleCapture}
                                            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-lg flex items-center justify-center hover:scale-105 transition"
                                        >
                                            <div className="w-16 h-16 bg-purple-600 rounded-full border-2 border-white"></div>
                                        </button>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-xs backdrop-blur-md">
                                        Live Preview
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* PREVIEW MODE */}
                    {mode === 'preview' && previewUrl && (
                        <div className="absolute inset-0 bg-black flex flex-col">
                            <img src={previewUrl} className="w-full h-full object-contain bg-black" alt="Preview" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
                                <button onClick={handleRetake} className="text-white flex flex-col items-center gap-1">
                                    <div className="p-3 bg-gray-800 rounded-full"><RefreshCw className="w-5 h-5" /></div>
                                    <span className="text-xs">Retake</span>
                                </button>
                                <button
                                    onClick={handleAnalyze}
                                    className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-600 transition"
                                >
                                    Analyze Meal <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ANALYZING MODE */}
                    {mode === 'analyzing' && (
                        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white z-20">
                            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                            <h3 className="text-xl font-bold animate-pulse">Analyzing Food...</h3>
                            <p className="text-gray-400 text-sm mt-2">Identifying visual signal & macros</p>
                        </div>
                    )}

                    {/* RESULT MODE */}
                    {mode === 'result' && analysisResult && (
                        <div className="p-6 space-y-6">
                            {/* Image Header */}
                            <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                                <img src={previewUrl!} className="w-full h-full object-cover" alt="Analyzed Food" />
                                <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-white text-xs text-center backdrop-blur-sm">
                                    Confirmed Visual Match
                                </div>
                            </div>

                            {/* Food Details Field */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Food Name</label>
                                    <div className="flex items-center gap-2 border-b border-gray-200 py-2">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="w-full font-bold text-xl text-gray-800 bg-transparent outline-none capitalize"
                                        />
                                        <Edit2 className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Estimated Calories</label>
                                    <div className="flex items-center gap-2 border-b border-gray-200 py-2">
                                        <input
                                            type="number"
                                            value={editedCalories}
                                            onChange={(e) => setEditedCalories(Number(e.target.value))}
                                            className="w-full font-black text-4xl text-purple-600 bg-transparent outline-none"
                                        />
                                        <span className="text-sm font-bold text-gray-500">kcal</span>
                                        <Edit2 className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Macros (Read Only for now or simplistic) */}
                            {analysisResult.foods[0] && (
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-blue-50 p-3 rounded-xl text-center">
                                        <div className="text-lg font-bold text-blue-700">{analysisResult.foods[0].nutrition_per_100g.protein_g}g</div>
                                        <div className="text-[10px] uppercase text-blue-400 font-bold">Protein</div>
                                    </div>
                                    <div className="bg-orange-50 p-3 rounded-xl text-center">
                                        <div className="text-lg font-bold text-orange-700">{analysisResult.foods[0].nutrition_per_100g.carbs_g}g</div>
                                        <div className="text-[10px] uppercase text-orange-400 font-bold">Carbs</div>
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded-xl text-center">
                                        <div className="text-lg font-bold text-yellow-700">{analysisResult.foods[0].nutrition_per_100g.fat_g}g</div>
                                        <div className="text-[10px] uppercase text-yellow-400 font-bold">Fat</div>
                                    </div>
                                </div>
                            )}

                            {/* Confidence Note */}
                            <div className="text-center text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                                Prediction Confidence: <strong>{analysisResult.foods[0].confidence * 100}%</strong>. Estimation based on visual analysis.
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <button onClick={handleRetake} className="py-3 px-4 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50">
                                    Retake
                                </button>
                                <button onClick={handleConfirm} className="py-3 px-4 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 flex justify-center items-center gap-2">
                                    <Check className="w-5 h-5" /> Confirm
                                </button>
                            </div>

                            {/* DISCLAIMER */}
                            <p className="text-[10px] text-gray-400 text-center leading-tight mt-2">
                                This is not a medical diagnosis. Values are estimates. Consult a professional for medical advice.
                            </p>
                        </div>
                    )}

                </div>

                {/* Hidden Canvas */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
