'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Home, Mic2, History, Trophy, LogOut } from 'lucide-react';

const navItems = [
    { href: '/app/home', label: 'Home', icon: <Home size={18} /> },
    { href: '/app/lever', label: 'Speak', icon: <Mic2 size={18} /> },
    { href: '/app/history', label: 'History', icon: <History size={18} /> },
    { href: '/app/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push('/');
    }

    return (
        <>
            <nav className="nav">
                <div className="container nav-inner">
                    <Link href="/app/home" className="nav-logo">Orat<span>or</span></Link>
                    <div className="nav-links">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link${pathname.startsWith(item.href) ? ' active' : ''}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                        <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ marginLeft: 8, gap: 6 }}>
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>
            <div className="bg-glow" />
            <div className="page">{children}</div>
        </>
    );
}
