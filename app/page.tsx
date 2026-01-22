import Link from 'next/link';
import StaticDemo from '@/components/StaticDemo';
import LensPreview from '@/components/LensPreview';
import { ArrowRight, ShieldCheck, Activity, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600 flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-green-600" />
          NUTRILENS AI
        </div>
        <div className="space-x-4">
          <Link href="/login" className="font-medium text-gray-600 hover:text-black transition">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition font-bold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4 border border-green-200">
            Intelligent Health Observation
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900">
            Smart Nutrition <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">Simplified</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            NutriLens observes food, activity, hydration, and health signals to guide smarter nutrition decisions.
            No manual overwhelm. Just intelligent insight.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/signup" className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-200">
              Activate Your Lens <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Dashboard Demo (STATIC PREVIEW) */}
        <div className="mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <StaticDemo />
            <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-widest font-medium">
              * Visual representation only. Login to connect live sensors.
            </p>
          </div>

          <div className="order-1 md:order-2 flex flex-col items-center">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center gap-2">
                Try The Lens
              </h2>
              <p className="text-gray-500 text-sm">See how NutriLens analyzes food instantly.</p>
            </div>
            <LensPreview />
          </div>
        </div>

      </main>

      {/* Features */}
      <section id="features" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Trust NutriLens?</h2>
            <p className="text-gray-500">Built for precision, privacy, and peace of mind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Activity className="w-8 h-8 text-blue-500" />,
                title: "Live Body Signals",
                desc: "Connects with sensors to track 7,500+ steps, hydration, and active burn in real-time."
              },
              {
                icon: <BrainCircuit className="w-8 h-8 text-purple-500" />,
                title: "Medical-Aware Engine",
                desc: "Context-aware advice. If you're diabetic or hypertensive, the lens adapts instantly."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
                title: "Privacy First",
                desc: "Your health data belongs to you. We analyze locally or ephemerally. No data selling."
              }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100 hover:-translate-y-1">
                <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 text-center text-sm">
        <p>&copy; 2026 NutriLens AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
