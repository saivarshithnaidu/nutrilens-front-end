
import { useState, useEffect, useRef } from 'react';

export const usePedometer = () => {
    const [steps, setSteps] = useState(0);
    const [isSupported, setIsSupported] = useState(false);

    // Logic for peak detection
    const lastY = useRef(0);
    const lastZ = useRef(0);
    const threshold = 10; // Simple threshold logic

    useEffect(() => {
        if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
            setIsSupported(true);

            const handleMotion = (event: DeviceMotionEvent) => {
                const y = event.accelerationIncludingGravity?.y || 0;
                const z = event.accelerationIncludingGravity?.z || 0;

                const deltaY = Math.abs(y - lastY.current);
                const deltaZ = Math.abs(z - lastZ.current);

                // If acceleration change is significant = Step (Very basic for demo)
                if (deltaY + deltaZ > threshold) {
                    setSteps(prev => prev + 1);
                }

                lastY.current = y;
                lastZ.current = z;
            };

            window.addEventListener('devicemotion', handleMotion);
            return () => window.removeEventListener('devicemotion', handleMotion);
        }
    }, []);

    return { steps, isSupported, setSteps }; // Export setSteps for Demo Mode override
};
