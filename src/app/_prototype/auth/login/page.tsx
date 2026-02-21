'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError(error.message); setLoading(false); return; }
        router.push('/app/home');
    }

    async function handleGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${location.origin}/auth/callback` },
        });
    }

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="bg-glow" />
            <div className="card animate-fade-in-scale" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" className="nav-logo" style={{ fontSize: '1.5rem' }}>Orat<span>or</span></Link>
                    <h2 style={{ marginTop: 16, marginBottom: 8 }}>Welcome back</h2>
                    <p style={{ fontSize: '0.875rem' }}>Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input id="login-email" className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input id="login-password" className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <button id="login-submit" className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? <span className="spinner" /> : 'Sign In'}
                    </button>
                </form>

                <div className="divider-text" style={{ margin: '20px 0' }}>or</div>

                <button id="login-google" className="btn btn-secondary w-full" onClick={handleGoogle}>
                    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" /><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" /><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" /><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" /></svg>
                    Continue with Google
                </button>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup" style={{ color: 'var(--gold)' }}>Sign up</Link>
                </p>
            </div>
        </main>
    );
}
