import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                    NUTRILENS AI
                </Link>
                <div className="flex gap-4 text-sm font-semibold">
                    <Link href="/scan" className="hover:text-green-600">Scan Meal</Link>
                    <Link href="/profile" className="hover:text-green-600">Profile</Link>
                </div>
            </div>
        </nav>
    );
}
