'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getScoreLabel } from '@/lib/utils';

interface Session {
    id: string;
    topic: string;
    total_xp_earned: number;
    score_filler: number;
    score_pace: number;
    score_pauses: number;
    score_storytelling: number;
    score_clarity: number;
    score_tip: number;
    tip_speaker: string;
    tip_used: boolean;
    duration_seconds: number;
    created_at: string;
}

export default function HistoryPage() {
    const supabase = createClient();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from('sessions')
                .select('id,topic,total_xp_earned,score_filler,score_pace,score_pauses,score_storytelling,score_clarity,score_tip,tip_speaker,tip_used,duration_seconds,created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (data) setSessions(data);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return (
        <div className="page-content flex items-center justify-center" style={{ minHeight: '80vh' }}>
            <div className="spinner spinner-lg" />
        </div>
    );

    function avgScore(s: Session) {
        return Math.round((s.score_filler + s.score_pace + s.score_pauses + s.score_storytelling + s.score_clarity + s.score_tip) / 6);
    }

    function formatDuration(s: number) {
        return `${Math.floor(s / 60)}m ${s % 60}s`;
    }

    return (
        <div className="page-content">
            <div className="container-md">
                <div className="animate-fade-in" style={{ marginBottom: 32 }}>
                    <h2>Session History</h2>
                    <p style={{ marginTop: 4 }}>{sessions.length} session{sessions.length !== 1 ? 's' : ''} completed</p>
                </div>

                {sessions.length === 0 ? (
                    <div className="card text-center animate-fade-in" style={{ padding: '60px 24px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>📼</div>
                        <h3 style={{ marginBottom: 8 }}>No sessions yet</h3>
                        <p style={{ marginBottom: 24 }}>Pull the lever and record your first session!</p>
                        <Link href="/app/lever" className="btn btn-primary">🎰 Pull the Lever</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {sessions.map((s, i) => {
                            const avg = avgScore(s);
                            const label = getScoreLabel(avg);
                            return (
                                <Link key={s.id} href={`/app/results/${s.id}`} style={{ display: 'block' }}>
                                    <div
                                        className="card animate-fade-in"
                                        style={{ animationDelay: `${i * 40}ms`, transition: 'border-color 0.2s, transform 0.15s', cursor: 'pointer' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: 4 }}>{s.topic}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⏱ {formatDuration(s.duration_seconds)}</span>
                                                    {s.tip_used && <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>💡 Tip used</span>}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: label.color }}>{avg}</div>
                                                <div style={{ fontSize: '0.75rem', color: label.color, fontWeight: 500 }}>{label.label}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--gold)', marginTop: 2 }}>+{s.total_xp_earned} XP</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
