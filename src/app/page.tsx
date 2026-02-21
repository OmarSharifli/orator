'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Mail } from 'lucide-react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const supabase = createClient();

  useEffect(() => setMounted(true), []);

  async function handleSubmit(e: React.FormEvent) {
    if (e) e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      const { error: sbError } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (sbError) {
        if (sbError.code === '23505') {
          setError('This email is already on the waitlist.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <main
      className="waitlist-page"
      onClick={() => !showForm && setShowForm(true)}
      style={{ cursor: !showForm ? 'pointer' : 'default' }}
    >
      <div className="bg-glow" />

      <div className="container-sm flex flex-col items-center justify-center" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
        >
          <div className="nav-logo mb-32" style={{ fontSize: '2.5rem' }}>Orat<span>or</span></div>

          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="splash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="mb-16">
                  Silence speaks <span className="text-gold">louder.</span>
                </h1>
                <p className="text-secondary mb-32" style={{ fontSize: '1.2rem', letterSpacing: '0.05em' }}>
                  The future of public speaking is arriving.
                </p>
                <p className="text-muted animate-pulse" style={{ fontSize: '0.9rem', marginTop: 40 }}>
                  — Click anywhere to join the waitlist —
                </p>
              </motion.div>
            ) : !submitted ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                <h2 className="mb-8">Join the Orator Private Beta</h2>
                <p className="text-secondary mb-32" style={{ fontSize: '1.1rem' }}>
                  Waitlist members get **1 month of Pro** free.
                </p>

                <form
                  onSubmit={handleSubmit}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex-col gap-12"
                  style={{ maxWidth: '400px', margin: '0 auto' }}
                >
                  <div className="relative w-full">
                    <Mail className="absolute left-16 top-1/2 -translate-y-1/2 text-muted" size={20} />
                    <input
                      type="email"
                      placeholder="Your email address"
                      autoFocus
                      className="form-input"
                      style={{ paddingLeft: '48px', height: '56px', fontSize: '1rem' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {error && <p className="text-danger mt-12 text-center" style={{ fontSize: '0.9rem' }}>{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg w-full mt-12"
                    style={{ height: '56px' }}
                  >
                    {loading ? (
                      <span className="spinner" />
                    ) : (
                      <>
                        Reserve My Spot <ChevronRight size={20} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card-gold p-32 text-center"
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <CheckCircle2 className="text-success mx-auto mb-16" size={48} />
                <h3 className="mb-8">You&apos;re on the list!</h3>
                <p className="text-secondary">
                  We&apos;ve reserved your 1-month Pro trial. We&apos;ll notify you at <strong>{email}</strong> when we launch.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style jsx>{`
        .waitlist-page {
          min-height: 100vh;
          background-color: var(--navy);
          overflow: hidden;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </main>
  );
}
