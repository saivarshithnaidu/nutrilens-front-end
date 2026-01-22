'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
    age: string;
    gender: string;
    height_cm: string;
    weight_kg: string;
    activity_level: string;
    medical_conditions: string[];
    daily_steps: string;
}

const getInitialFormData = (): FormData => {
    if (typeof window === 'undefined') {
        return {
            age: '',
            gender: 'male',
            height_cm: '',
            weight_kg: '',
            activity_level: 'moderate',
            medical_conditions: [],
            daily_steps: '0'
        };
    }

    try {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to parse saved profile:', e);
    }

    return {
        age: '',
        gender: 'male',
        height_cm: '',
        weight_kg: '',
        activity_level: 'moderate',
        medical_conditions: [],
        daily_steps: '0'
    };
};

export default function Profile() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>(getInitialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConditionChange = (condition: string): void => {
        setFormData(prev => {
            const current = prev.medical_conditions;
            if (current.includes(condition)) {
                return { ...prev, medical_conditions: current.filter(c => c !== condition) };
            } else {
                return { ...prev, medical_conditions: [...current, condition] };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        localStorage.setItem('userProfile', JSON.stringify(formData));
        router.push('/scan');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Health Profile</h1>
                <p className="text-gray-500 mb-6">We use this to personalize your nutrition advice.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Age</label>
                            <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                            <input required type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                            <input required type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                        <div className="space-y-2">
                            {['Diabetes', 'Hypertension', 'Thyroid', 'High Cholesterol'].map(c => (
                                <label key={c} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.medical_conditions.includes(c.toLowerCase())}
                                        onChange={() => handleConditionChange(c.toLowerCase())}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span>{c}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                        <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg">
                            <option value="sedentary">Sedentary (Little to no exercise)</option>
                            <option value="light">Lightly Active</option>
                            <option value="moderate">Moderately Active</option>
                            <option value="active">Very Active</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">
                        Save & Continue to Camera
                    </button>
                </form>
            </div>
        </div>
    );
}
