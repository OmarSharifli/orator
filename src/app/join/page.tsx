'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ChevronRight,
    Mail,
    ShieldCheck,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

type Step = 'email' | 'code' | 'success';

export default function JoinWaitlistPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<Step>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    const supabase = createClient();

    useEffect(() => setMounted(true), []);

    async function handleSendCode(e: React.FormEvent) {
        if (e) e.preventDefault();
        if (!email) return;
        setLoading(true);
        setError('');

        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                },
            });

            if (otpError) {
                setError(otpError.message);
            } else {
                setStep('code');
            }
        } catch {
            setError('Connection failed. Please check your internet.');
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyCode(e: React.FormEvent) {
        if (e) e.preventDefault();
        if (!code) return;
        setLoading(true);
        setError('');

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: code,
                type: 'email',
            });

            if (verifyError) {
                setError('Invalid or expired code. Please try again.');
            } else {
                await supabase.from('waitlist').upsert([{ email }], { onConflict: 'email' });
                setStep('success');
            }
        } catch {
            setError('Verification failed.');
        } finally {
            setLoading(false);
        }
    }

    if (!mounted) return null;

    return (
        <main className="waitlist-flow-page">
            <div className="bg-glow" />

            <div className="container-sm flex flex-col items-center justify-center min-h-screen relative z-10">
                <div className="w-full" style={{ maxWidth: '440px' }}>
                    <Link href="/" className="btn btn-ghost btn-sm mb-32" style={{ alignSelf: 'flex-start' }}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    <AnimatePresence mode="wait">
                        {step === 'email' ? (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="card-glass p-40"
                            >
                                <div className="text-center mb-32">
                                    <div className="nav-logo mb-16" style={{ fontSize: '2rem' }}>Orat<span>or</span></div>
                                    <h2 className="mb-8">Join the Waitlist</h2>
                                    <p className="text-secondary">Get 1 month of Pro for free when we launch.</p>
                                </div>

                                <form onSubmit={handleSendCode} className="flex flex-col gap-16">
                                    <div className="relative">
                                        <Mail className="absolute left-16 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="form-input"
                                            style={{ paddingLeft: '48px', height: '56px' }}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    {error && <p className="text-danger text-center text-sm">{error}</p>}

                                    <button type="submit" className="btn btn-primary btn-lg w-full" style={{ height: '56px' }} disabled={loading}>
                                        {loading ? <span className="spinner" /> : "Receive Verification Code"}
                                    </button>

                                    <p className="text-muted text-center text-xs mt-8">
                                        By joining, you agree to receive launch updates.
                                    </p>
                                </form>
                            </motion.div>
                        ) : step === 'code' ? (
                            <motion.div
                                key="code"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="card-glass p-40"
                            >
                                <div className="text-center mb-32">
                                    <ShieldCheck className="mx-auto mb-16 text-gold" size={48} />
                                    <h2 className="mb-8">Check your Inbox</h2>
                                    <p className="text-secondary">Enter the confirmation code sent to <br /><strong>{email}</strong></p>
                                </div>

                                <form onSubmit={handleVerifyCode} className="flex flex-col gap-16">
                                    <input
                                        type="text"
                                        placeholder="········"
                                        maxLength={8}
                                        className="form-input text-center"
                                        style={{ fontSize: '1.75rem', letterSpacing: '0.25em', fontWeight: 800, height: '64px' }}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        autoFocus
                                    />

                                    {error && <p className="text-danger text-center text-sm">{error}</p>}

                                    <button type="submit" className="btn btn-primary btn-lg w-full" style={{ height: '56px' }} disabled={loading}>
                                        {loading ? <span className="spinner" /> : "Confirm & Apply"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-ghost w-full"
                                        onClick={() => setStep('email')}
                                    >
                                        Use a different email
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card-gold p-48 text-center"
                            >
                                <div className="flex justify-center mb-24">
                                    <div className="success-icon-wrap">
                                        <CheckCircle2 size={64} className="text-success" />
                                    </div>
                                </div>
                                <h2 className="mb-16">You&apos;re officially on the list!</h2>
                                <p className="text-secondary mb-32" style={{ fontSize: '1.1rem' }}>
                                    We&apos;ve reserved <strong>1 Month of Pro Access</strong> for you. We&apos;ll notify you at {email} as soon as we open the doors.
                                </p>
                                <Link href="/" className="btn btn-primary w-full">Back to Home</Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
        .waitlist-flow-page {
          min-height: 100vh;
          background: var(--navy);
          overflow: hidden;
        }
        .success-icon-wrap {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-20px);}
          60% {transform: translateY(-10px);}
        }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .min-h-screen { min-height: 100vh; }
      `}</style>
        </main>
    );
}
