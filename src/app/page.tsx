'use client';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  BrainCircuit,
  Zap,
  Quote,
  Check,
  Star,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <main className="landing-page">
      <div className="bg-glow" />

      {/* Navigation */}
      <nav className="nav sticky-nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">Orat<span>or</span></Link>
          <div className="nav-actions">
            <Link href="/join" className="btn btn-primary btn-sm">Join Waitlist</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge badge-orator mb-24 mx-auto">
              <Star size={14} className="mr-8" /> Private Beta Access
            </div>
            <h1 className="hero-title mb-24 text-center mx-auto">
              The AI Coach for <br />
              <span className="text-gold">Public Speaking</span>
            </h1>
            <p className="hero-subtitle mb-40 mx-auto text-center">
              Master the flow of your speech with real-time feedback and expert insights. Join the waitlist for 1 month of Pro access—on us.
            </p>
            <div className="flex justify-center items-center gap-16 mobile-column mx-auto">
              <Link href="/join" className="btn btn-primary btn-lg px-48">
                Reserve My Spot <ChevronRight size={20} />
              </Link>
              <Link href="/#features" className="btn btn-secondary btn-lg px-48">
                Explore Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-48 border-y bg-navy-2">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>1,200+</h3>
              <p>Waitlist Members</p>
            </div>
            <div className="stat-item">
              <h3>100+</h3>
              <p>Expert Tips</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>AI Feedback</p>
            </div>
            <div className="stat-item">
              <h3>5</h3>
              <p>Skill Divisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding">
        <div className="container">
          <div className="text-center mb-64">
            <h2 className="mb-16">Speak with Confidence</h2>
            <p className="text-secondary mx-auto text-center" style={{ maxWidth: '500px' }}>Our technology bridges the gap between practice and persistence.</p>
          </div>

          <div className="grid grid-cols-3 gap-32">
            {[
              {
                icon: <BrainCircuit className="text-gold" />,
                title: "Deep Analysis",
                desc: "We track filler words, pacing, and tone to give you a scientific breakdown of your performance."
              },
              {
                icon: <Quote className="text-gold" />,
                title: "Expert Library",
                desc: "Learn from the best. Curated tips from top-tier keynote speakers and storytelling masters."
              },
              {
                icon: <Zap className="text-gold" />,
                title: "Gamified Growth",
                desc: "Earn XP, climb the leaderboard, and unlock harder topics as your skills evolve."
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                className="card-glass p-32"
                {...fadeInUp}
              >
                <div className="mb-20 flex items-center justify-center" style={{ background: 'var(--gold-dim)', width: '48px', height: '48px', borderRadius: '12px' }}>
                  {f.icon}
                </div>
                <h3 className="mb-12" style={{ fontSize: '1.25rem' }}>{f.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.95rem' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="showcase-section py-120 bg-navy-3 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-2 gap-80 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="mb-24">Unlock Your <span className="text-gold">Daily Challenge</span></h2>
              <p className="text-secondary mb-32">
                Every day, Pull the Lever to receive a random topic and a curated tip. It&apos;s designed to help you think on your feet and master the art of impromptu speaking.
              </p>
              <div className="flex flex-col gap-16 mb-40">
                <div className="flex items-center gap-12">
                  <div className="check-icon"><Check size={14} /></div>
                  <span className="font-medium">100% Randomized Topics</span>
                </div>
                <div className="flex items-center gap-12">
                  <div className="check-icon"><Check size={14} /></div>
                  <span className="font-medium">Division-based Difficulty</span>
                </div>
                <div className="flex items-center gap-12">
                  <div className="check-icon"><Check size={14} /></div>
                  <span className="font-medium">XP Bonuses for Challenges</span>
                </div>
              </div>
              <Link href="/join" className="btn btn-secondary">Reserve Your Spot</Link>
            </motion.div>
            <div className="relative">
              <div className="dial-placeholder card-glass">
                <div className="dial-circle">
                  <div className="dial-content">
                    <span style={{ fontSize: '3rem' }}>🎰</span>
                    <p className="mt-8 font-bold text-gold">THE LEVER</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding">
        <div className="container">
          <div className="text-center mb-64">
            <h2 className="text-gold mb-16">Simple Pricing</h2>
            <p className="text-secondary">Join early and lock in exclusive benefits.</p>
          </div>
          <div className="flex justify-center gap-32 pricing-container">
            <div className="card-glass p-40 pricing-card">
              <h4 className="text-muted mb-8">Basic</h4>
              <div className="price-tag mb-32">$0<span>/mo</span></div>
              <ul className="feature-list mb-40">
                <li><Check size={16} /> 3 Sessions / Day</li>
                <li><Check size={16} /> Basic Feedback</li>
                <li className="disabled">Premium AI Analysis</li>
              </ul>
              <Link href="/join" className="btn btn-secondary w-full">Join Now</Link>
            </div>
            <div className="card-gold p-40 featured-card pricing-card">
              <div className="featured-badge">LAUNCH OFFER</div>
              <h4 className="text-gold mb-8">Pro</h4>
              <div className="price-tag mb-32">$19<span>/mo</span></div>
              <ul className="feature-list mb-40">
                <li><Check size={16} /> Unlimited Sessions</li>
                <li><Check size={16} /> Advanced AI Analysis</li>
                <li><Check size={16} /> 100+ Expert Tips</li>
                <li><Check size={16} /> **1 Month Free Bonus**</li>
              </ul>
              <Link href="/join" className="btn btn-primary w-full shadow-lg">Claim Offer</Link>
            </div>
            <div className="card-glass p-40 pricing-card">
              <h4 className="text-muted mb-8">Premium</h4>
              <div className="price-tag mb-32">$49<span>/mo</span></div>
              <ul className="feature-list mb-40">
                <li><Check size={16} /> Everything in Pro</li>
                <li><Check size={16} /> 1-on-1 AI Mentor</li>
                <li><Check size={16} /> Team Analytics</li>
                <li><Check size={16} /> Custom Learning Path</li>
              </ul>
              <Link href="/join" className="btn btn-secondary w-full">Go Premium</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section py-80 border-t">
        <div className="container text-center">
          <h2 className="mb-24">Ready to find your voice?</h2>
          <Link href="/join" className="btn btn-primary btn-lg">
            Join the Waitlist Now <ArrowRight size={20} className="ml-8" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-40 bg-navy-2">
        <div className="container text-center">
          <div className="nav-logo mb-16">Orat<span>or</span></div>
          <p className="text-muted text-sm">© 2026 Orator AI. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .landing-page { color: var(--text-primary); }
        .hero-section { padding: 160px 0 120px; }
        .hero-title { font-size: clamp(3rem, 7vw, 5rem); line-height: 1.1; letter-spacing: -0.04em; }
        .hero-subtitle { font-size: 1.25rem; max-width: 600px; color: var(--text-secondary); line-height: 1.6; }
        .section-padding { padding: 100px 0; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; }
        .stat-item h3 { font-size: 2.5rem; color: var(--gold); font-weight: 800; margin-bottom: 4px; }
        .stat-item p { font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
        
        .check-icon { background: var(--gold-dim); padding: 4px; border-radius: 6px; color: var(--gold); }
        .font-medium { font-weight: 500; }
        
        .dial-placeholder { padding: 40px; border-radius: 50%; width: 400px; height: 400px; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 2px solid var(--border-gold); }
        .dial-circle { width: 100%; height: 100%; border-radius: 50%; background: var(--navy-3); display: flex; align-items: center; justify-content: center; }
        
        .price-tag { font-size: 3.5rem; font-weight: 800; }
        .price-tag span { font-size: 1.25rem; color: var(--text-muted); font-weight: 400; }
        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 16px; }
        .feature-list li { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; }
        .feature-list li.disabled { color: var(--text-muted); text-decoration: line-through; }
        
        .featured-card { position: relative; border-width: 2px; transform: scale(1.05); z-index: 2; }
        .featured-badge { position: absolute; top: 16px; right: 16px; background: var(--gold); color: var(--navy); font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 4px; }
        
        .pricing-container { display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: center; align-items: stretch; gap: 32px; width: 100%; max-width: 1200px; margin: 0 auto; }
        .pricing-card { flex: 1; max-width: 360px; display: flex; flex-direction: column; }
        
        .mobile-column { }
        .mr-8 { margin-right: 8px; }
        .ml-8 { margin-left: 8px; }
        .border-y { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .border-t { border-top: 1px solid var(--border); }
        
        @media (max-width: 1200px) {
          .pricing-container { gap: 24px; padding: 0 20px; }
          .pricing-card { max-width: 320px; }
        }

        @media (max-width: 1024px) {
          .pricing-container { flex-wrap: wrap; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
          .grid-cols-2 { grid-template-columns: 1fr; gap: 64px; }
          .dial-placeholder { width: 300px; height: 300px; }
          .featured-card { transform: scale(1); }
        }
        @media (max-width: 768px) {
          .mobile-column { flex-direction: column; align-items: center; }
          .grid-cols-3 { grid-template-columns: 1fr; }
          .hero-section { padding: 120px 0 80px; }
          .pricing-container { flex-direction: column; align-items: center; flex-nowrap: wrap; }
          .pricing-card { max-width: 100%; width: 100%; }
        }
      `}</style>
    </main>
  );
}
