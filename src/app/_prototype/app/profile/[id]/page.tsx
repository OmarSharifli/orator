'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getDivision, getXpProgressInDivision } from '@/lib/utils';

interface Profile {
    id: string;
    username: string;
    total_xp: number;
    sessions_completed: number;
    current_streak: number;
    longest_streak: number;
    created_at: string;
}

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const supabase = createClient();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [rank, setRank] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: p } = await supabase.from('profiles').select('*').eq('id', id).single();
            if (p) setProfile(p);

            const { data: allProfiles } = await supabase
                .from('profiles')
                .select('id,total_xp')
                .order('total_xp', { ascending: false });
            if (allProfiles) {
                const r = allProfiles.findIndex(x => x.id === id);
                setRank(r + 1);
            }
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return (
        <div className="page-content flex items-center justify-center" style={{ minHeight: '80vh' }}>
            <div className="spinner spinner-lg" />
        </div>
    );
    if (!profile) return (
        <div className="page-content container-sm text-center" style={{ paddingTop: 80 }}>
            <h3>User not found</h3>
            <Link href="/app/leaderboard" className="btn btn-secondary" style={{ marginTop: 16 }}>← Leaderboard</Link>
        </div>
    );

    const division = getDivision(profile.total_xp);
    const progress = getXpProgressInDivision(profile.total_xp);

    return (
        <div className="page-content">
            <div className="container-sm">
                <div style={{ marginBottom: 24 }}>
                    <Link href="/app/leaderboard" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Leaderboard</Link>
                </div>

                {/* Profile card */}
                <div className="card-gold animate-fade-in" style={{ marginBottom: 24, textAlign: 'center', padding: '40px 24px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 12 }}>{division.emoji}</div>
                    <h2 style={{ marginBottom: 4 }}>{profile.username}</h2>
                    <div className={`badge ${division.badgeClass}`} style={{ display: 'inline-flex', margin: '8px auto 0' }}>{division.name}</div>
                    {rank > 0 && (
                        <div style={{ marginTop: 16, fontSize: '1rem', color: 'var(--text-muted)' }}>
                            Global Rank: <span style={{ fontWeight: 700, color: 'var(--gold)' }}>#{rank}</span>
                        </div>
                    )}

                    <div style={{ marginTop: 24 }}>
                        <div className="xp-bar-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>Division Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="xp-bar-track">
                            <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid-2 animate-fade-in" style={{ marginBottom: 24, animationDelay: '80ms' }}>
                    {[
                        { label: 'Total XP', value: profile.total_xp.toLocaleString(), emoji: '⭐' },
                        { label: 'Sessions', value: profile.sessions_completed, emoji: '🎤' },
                        { label: 'Current Streak', value: `${profile.current_streak}d`, emoji: '🔥' },
                        { label: 'Best Streak', value: `${profile.longest_streak}d`, emoji: '🏅' },
                    ].map((s, i) => (
                        <div key={i} className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.emoji}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
            </div>
        </div>
    );
}
