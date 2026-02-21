'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  Mail,
  ShieldCheck,
  Mic2,
  Zap,
  Trophy,
  Quote,
  Star,
  Users
} from 'lucide-react';

type Step = 'hero' | 'email' | 'code' | 'success';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<Step>('hero');
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
        // Track in waitlist table too for easy admin view
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <main className="landing-page">
      <div className="bg-glow" />

      {/* 1. Header/Nav */}
      <nav className="nav" style={{ background: 'transparent', border: 'none' }}>
        <div className="container nav-inner">
          <div className="nav-logo">Orat<span>or</span></div>
          <button className="btn btn-ghost btn-sm" onClick={() => setStep('email')}>Waitlist Login</button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="hero-section flex items-center justify-center">
        <div className="container-md text-center">
          <motion.div {...fadeInUp}>
            <div className="badge badge-orator mb-24 animate-pulse-gold">
              🎤 Private Beta Access
            </div>
            <h1 className="mb-24">
              Speak with <span className="text-gold">Authority.</span><br />
              Captivate any <span className="text-gold">Audience.</span>
            </h1>
            <p className="text-secondary mb-40 mx-auto" style={{ fontSize: '1.25rem', maxWidth: '600px' }}>
              Orator uses AI to analyze your speech in real-time, giving you the coaching of a world-class speaker at your fingertips.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => setStep('email')}>
              Join the Elite Waitlist <ChevronRight size={20} />
            </button>
            <p className="text-muted mt-16" style={{ fontSize: '0.85rem' }}>
              Confirmed members get <strong>1 month of Pro FREE</strong> ($19 value)
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="features-section py-80">
        <div className="container">
          <div className="text-center mb-56">
            <h2 className="mb-16">Train Like a Professional</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '500px' }}>Everything you need to move from "Um..." to "Wow."</p>
          </div>

          <div className="grid-3 gap-32">
            {[
              { icon: <Mic2 className="text-gold" />, title: "AI Analysis", desc: "Real-time tracking of filler words, pace, energy, and storytelling structure." },
              { icon: <Quote className="text-gold" />, title: "Expert Library", desc: "100+ proven tips from Simon Sinek, Tony Robbins, and world-class speakers." },
              { icon: <Zap className="text-gold" />, title: "XP System", desc: "Gamified progress. Level up your speaking and earn your place on the leaderboard." },
              { icon: <ShieldCheck className="text-gold" />, title: "Privacy First", desc: "Your recordings are encrypted and private. Only you (and your AI coach) see them." },
              { icon: <Users className="text-gold" />, title: "Global Board", desc: "See where you rank against speakers worldwide. Tiered divisions from Novice to Legend." },
              { icon: <Star className="text-gold" />, title: "Personal Roadmap", desc: "Custom coaching paths based on your specific speaking weaknesses." }
            ].map((f, i) => (
              <motion.div
                key={i}
                className="card-glass p-32"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ marginBottom: 16 }}>{f.icon}</div>
                <h4 className="mb-12">{f.title}</h4>
                <p style={{ fontSize: '0.9rem' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pricing / Plans Peek */}
      <section className="pricing-section py-80 bg-navy-2">
        <div className="container">
          <div className="text-center mb-48">
            <h2 className="mb-16 text-gold">Simple, Transparent Plans</h2>
          </div>
          <div className="flex gap-32 justify-center flex-wrap">
            <div className="card-glass p-32" style={{ width: '320px', border: '1px solid var(--border)' }}>
              <h3 className="mb-8">Free</h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>$0<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></div>
              <ul className="text-secondary" style={{ listStyle: 'none', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li>✓ Basic AI Feedback</li>
                <li>✓ 3 Sessions / Day</li>
                <li>✓ Tier 1 Topics</li>
                <li>✕ No Premium Tips</li>
              </ul>
            </div>
            <div className="card-gold p-32" style={{ width: '320px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 12, right: -30, background: 'var(--gold)', color: 'var(--navy)', fontSize: '0.7rem', fontWeight: 900, padding: '4px 40px', transform: 'rotate(45deg)' }}>BEST VALUE</div>
              <h3 className="mb-8">Pro</h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>$19<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li>✓ Advanced AI Insight</li>
                <li>✓ Unlimited Sessions</li>
                <li>✓ All 100+ Premium Tips</li>
                <li>✓ **Waitlist Bonus Month**</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="footer py-80 text-center">
        <div className="container">
          <div className="nav-logo mb-24">Orat<span>or</span></div>
          <p className="text-muted">© 2026 Orator AI. All rights reserved.</p>
        </div>
      </footer>

      {/* 6. Waitlist Modal Overlay */}
      <AnimatePresence>
        {step !== 'hero' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <div className="modal-content card-glass" style={{ maxWidth: '440px', width: '90%' }}>
              <button className="modal-close" onClick={() => { setStep('hero'); setError(''); }}>×</button>

              <AnimatePresence mode="wait">
                {step === 'email' ? (
                  <motion.div key="email" {...fadeInUp} className="text-center p-8">
                    <Mail className="mx-auto mb-16 text-gold" size={40} />
                    <h3 className="mb-12">Step 1: Secure Your Spot</h3>
                    <p className="text-secondary mb-24">We&apos;ll send a 6-digit confirmation code to your inbox.</p>
                    <form onSubmit={handleSendCode}>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="form-input mb-12"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                      />
                      {error && <p className="text-danger mb-12" style={{ fontSize: '0.85rem' }}>{error}</p>}
                      <button type="submit" className="btn btn-primary w-full h-56" disabled={loading}>
                        {loading ? <span className="spinner" /> : "Send Confirmation Code"}
                      </button>
                    </form>
                  </motion.div>
                ) : step === 'code' ? (
                  <motion.div key="code" {...fadeInUp} className="text-center p-8">
                    <ShieldCheck className="mx-auto mb-16 text-gold" size={40} />
                    <h3 className="mb-12">Confirm Your Identity</h3>
                    <p className="text-secondary mb-24">Enter the 6-digit code sent to <br /><strong>{email}</strong></p>
                    <form onSubmit={handleVerifyCode}>
                      <input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        className="form-input mb-12 text-center"
                        style={{ fontSize: '1.5rem', letterSpacing: '0.5em', fontWeight: 700 }}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        autoFocus
                      />
                      {error && <p className="text-danger mb-12" style={{ fontSize: '0.85rem' }}>{error}</p>}
                      <button type="submit" className="btn btn-primary w-full h-56" disabled={loading}>
                        {loading ? <span className="spinner" /> : "Complete Registration"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost mt-12 w-full"
                        onClick={() => setStep('email')}
                        style={{ fontSize: '0.8rem' }}
                      >
                        Back to email entry
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="success" {...fadeInUp} className="text-center p-8">
                    <CheckCircle2 className="mx-auto mb-16 text-success" size={64} />
                    <h3 className="mb-12">Welcome to the Inner Circle</h3>
                    <p className="text-secondary mb-24">
                      Your spot is verified. We&apos;ve reserved <strong>1 Month of Pro Access</strong> for you. Keep an eye on your inbox for the launch invite!
                    </p>
                    <button className="btn btn-secondary w-full" onClick={() => setStep('hero')}>Close</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .landing-page { min-height: 100vh; position: relative; }
        .hero-section { min-height: 80vh; padding: 120px 0 60px; }
        .py-80 { padding: 80px 0; }
        .mb-56 { margin-bottom: 56px; }
        
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          padding: 40px;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          color: var(--text-muted);
          font-size: 1.5rem;
        }
        .h-56 { height: 56px; }
      `}</style>
    </main>
  );
}
