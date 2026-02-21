'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getDivision, getXpProgressInDivision } from '@/lib/utils';

interface Profile {
    username: string;
    total_xp: number;
    current_streak: number;
    longest_streak: number;
    sessions_completed: number;
}

interface Session {
    id: string;
    topic: string;
    total_xp_earned: number;
    created_at: string;
}

export default function HomePage() {
    const supabase = createClient();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (p) setProfile(p);
            const { data: s } = await supabase.from('sessions').select('id,topic,total_xp_earned,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
            if (s) setSessions(s);
            setLoading(false);
        }
        load();
    }, [supabase]);

    if (loading) return (
        <div className="page-content flex items-center justify-center" style={{ minHeight: '80vh' }}>
            <div className="spinner spinner-lg" />
        </div>
    );

    const xp = profile?.total_xp ?? 0;
    const division = getDivision(xp);
    const progress = getXpProgressInDivision(xp);
    const nextDiv = division.id < 5 ? division.id + 1 : null;

    return (
        <div className="page-content">
            <div className="container-md">
                {/* Greeting */}
                <div className="animate-fade-in" style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <h2>Welcome back, <span className="text-gold">{profile?.username ?? 'Speaker'}</span> 👋</h2>
                            <p style={{ marginTop: 4 }}>Ready to practice today?</p>
                        </div>
                        {(profile?.current_streak ?? 0) > 0 && (
                            <div className="streak-pill">🔥 {profile?.current_streak} day streak</div>
                        )}
                    </div>
                </div>

                {/* Division + XP card */}
                <div className="card-gold animate-fade-in" style={{ marginBottom: 24, animationDelay: '60ms' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '2.5rem' }}>{division.emoji}</div>
                        <div>
                            <div className={`badge ${division.badgeClass}`} style={{ marginBottom: 6 }}>{division.name}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{xp.toLocaleString()} XP</div>
                        </div>
                    </div>
                    <div className="xp-bar-wrap">
                        <div className="xp-bar-label">
                            <span>Division Progress</span>
                            {nextDiv && <span>{progress}%</span>}
                        </div>
                        <div className="xp-bar-track">
                            <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid-3 animate-fade-in" style={{ marginBottom: 32, animationDelay: '120ms' }}>
                    {[
                        { label: 'Sessions', value: profile?.sessions_completed ?? 0, emoji: '🎤' },
                        { label: 'Best Streak', value: `${profile?.longest_streak ?? 0}d`, emoji: '🔥' },
                        { label: 'Total XP', value: (profile?.total_xp ?? 0).toLocaleString(), emoji: '⭐' },
                    ].map((s, i) => (
                        <div key={i} className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.emoji}</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="card animate-fade-in" style={{ marginBottom: 32, animationDelay: '180ms', textAlign: 'center', padding: '40px 24px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎰</div>
                    <h3 style={{ marginBottom: 8 }}>Ready to speak?</h3>
                    <p style={{ marginBottom: 24 }}>Pull the lever for a random topic and a tip from the world&apos;s best speakers.</p>
                    <Link href="/app/lever" className="btn btn-primary btn-lg animate-pulse-gold">
                        Pull the Lever
                    </Link>
                </div>

                {/* Recent sessions */}
                {sessions.length > 0 && (
                    <div className="animate-fade-in" style={{ animationDelay: '240ms' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3>Recent Sessions</h3>
                            <Link href="/app/history" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>View all →</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {sessions.map(s => (
                                <Link key={s.id} href={`/app/results/${s.id}`} style={{ display: 'block' }}>
                                    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', transition: 'border-color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-gold)')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.topic}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ color: 'var(--gold)', fontWeight: 700 }}>+{s.total_xp_earned} XP</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
