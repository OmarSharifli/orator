'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getDivision } from '@/lib/utils';

interface LeaderboardEntry {
    id: string;
    username: string;
    total_xp: number;
    sessions_completed: number;
    current_streak: number;
    current_division: number;
}

const DIVISION_NAMES = ['', '🟤 Novice', '🔵 Confident', '🟡 Orator', '💜 Keynote', '🔴 Legend'];

export default function LeaderboardPage() {
    const supabase = createClient();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [myId, setMyId] = useState<string>('');
    const [myRank, setMyRank] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setMyId(user.id);

            const { data } = await supabase
                .from('profiles')
                .select('id,username,total_xp,sessions_completed,current_streak')
                .order('total_xp', { ascending: false })
                .limit(100);

            if (data) {
                const withDiv = data.map(p => ({ ...p, current_division: getDivision(p.total_xp).id }));
                setEntries(withDiv);
                const rank = withDiv.findIndex(p => p.id === user?.id);
                setMyRank(rank + 1);
            }
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return (
        <div className="page-content flex items-center justify-center" style={{ minHeight: '80vh' }}>
            <div className="spinner spinner-lg" />
        </div>
    );

    return (
        <div className="page-content">
            <div className="container-md">
                <div className="animate-fade-in" style={{ marginBottom: 32 }}>
                    <h2>🏆 Global Leaderboard</h2>
                    <p style={{ marginTop: 4 }}>All-time rankings across all speakers worldwide.</p>
                </div>

                {/* My rank pill */}
                {myRank > 0 && (
                    <div className="card-gold animate-fade-in" style={{ marginBottom: 24, animationDelay: '60ms', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ fontWeight: 600 }}>Your rank</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)' }}>#{myRank}</div>
                    </div>
                )}

                {/* Table */}
                <div className="card animate-fade-in" style={{ padding: 0, animationDelay: '120ms', overflow: 'hidden' }}>
                    {entries.length === 0 ? (
                        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                            <p>No speakers yet. Be the first!</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {['#', 'Speaker', 'Division', 'XP', 'Sessions', 'Streak'].map(h => (
                                            <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry, i) => {
                                        const isMe = entry.id === myId;
                                        const rank = i + 1;
                                        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`;
                                        return (
                                            <tr
                                                key={entry.id}
                                                style={{
                                                    borderBottom: '1px solid var(--border)',
                                                    background: isMe ? 'var(--gold-dim-2)' : 'transparent',
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => { if (!isMe) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                                                onMouseLeave={e => { if (!isMe) e.currentTarget.style.background = 'transparent'; }}
                                            >
                                                <td style={{ padding: '14px 20px', fontWeight: 700, color: rank <= 3 ? 'var(--gold)' : 'var(--text-muted)', fontSize: rank <= 3 ? '1.1rem' : '0.9rem' }}>{medal}</td>
                                                <td style={{ padding: '14px 20px' }}>
                                                    <Link href={`/app/profile/${entry.id}`} style={{ fontWeight: isMe ? 700 : 500, color: isMe ? 'var(--gold)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        {entry.username ?? 'Anonymous'}
                                                        {isMe && <span style={{ fontSize: '0.7rem', background: 'var(--gold-dim)', color: 'var(--gold)', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>You</span>}
                                                    </Link>
                                                </td>
                                                <td style={{ padding: '14px 20px', fontSize: '0.825rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{DIVISION_NAMES[entry.current_division] ?? '🟤 Novice'}</td>
                                                <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--gold)' }}>{entry.total_xp.toLocaleString()}</td>
                                                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{entry.sessions_completed}</td>
                                                <td style={{ padding: '14px 20px', color: entry.current_streak > 0 ? 'var(--warning)' : 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                    {entry.current_streak > 0 ? `🔥 ${entry.current_streak}d` : '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
