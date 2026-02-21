'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getDivision, getScoreLabel } from '@/lib/utils';

interface SessionData {
    id: string;
    topic: string;
    tip_speaker: string;
    duration_seconds: number;
    video_url: string;
    transcript: string;
    score_filler: number;
    score_pace: number;
    score_pauses: number;
    score_storytelling: number;
    score_clarity: number;
    score_tip: number;
    feedback_filler: string;
    feedback_pace: string;
    feedback_pauses: string;
    feedback_storytelling: string;
    feedback_clarity: string;
    feedback_tip: string;
    overall_feedback: string;
    tip_used: boolean;
    total_xp_earned: number;
    filler_count: number;
    created_at: string;
}

const FACTOR_LABELS: { key: keyof SessionData; label: string; emoji: string }[] = [
    { key: 'score_filler', label: 'Filler Words', emoji: '🤐' },
    { key: 'score_pace', label: 'Pace & Flow', emoji: '⏱️' },
    { key: 'score_pauses', label: 'Pauses', emoji: '⏸️' },
    { key: 'score_storytelling', label: 'Storytelling', emoji: '📖' },
    { key: 'score_clarity', label: 'Clarity', emoji: '🔊' },
    { key: 'score_tip', label: 'Tip Usage', emoji: '💡' },
];

const FEEDBACK_KEYS: { score: keyof SessionData; fb: keyof SessionData }[] = [
    { score: 'score_filler', fb: 'feedback_filler' },
    { score: 'score_pace', fb: 'feedback_pace' },
    { score: 'score_pauses', fb: 'feedback_pauses' },
    { score: 'score_storytelling', fb: 'feedback_storytelling' },
    { score: 'score_clarity', fb: 'feedback_clarity' },
    { score: 'score_tip', fb: 'feedback_tip' },
];

export default function ResultsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const supabase = createClient();
    const [session, setSession] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTranscript, setShowTranscript] = useState(false);
    const [userXp, setUserXp] = useState(0);

    useEffect(() => {
        async function load() {
            const { data: s } = await supabase.from('sessions').select('*').eq('id', id).single();
            if (!s) { router.push('/app/history'); return; }
            setSession(s);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: p } = await supabase.from('profiles').select('total_xp').eq('id', user.id).single();
                if (p) setUserXp(p.total_xp);
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
    if (!session) return null;

    const avgScore = Math.round(FACTOR_LABELS.reduce((s, f) => s + (session[f.key] as number), 0) / FACTOR_LABELS.length);
    const division = getDivision(userXp);
    const avgLabel = getScoreLabel(avgScore);

    return (
        <div className="page-content">
            <div className="container-md">
                {/* Header */}
                <div className="animate-fade-in" style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <Link href="/app/history" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← History</Link>
                    </div>
                    <h2>Session Results</h2>
                    <p style={{ marginTop: 4 }}>Topic: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{session.topic}</span></p>
                </div>

                {/* Score card */}
                <div className="card-gold animate-fade-in" style={{ marginBottom: 24, animationDelay: '60ms', textAlign: 'center', padding: '40px 24px' }}>
                    <div style={{ fontSize: '4rem', fontWeight: 900, color: avgLabel.color, lineHeight: 1 }}>{avgScore}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: avgLabel.color, marginTop: 8 }}>{avgLabel.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
                        <div style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid var(--border-gold)', padding: '8px 20px', borderRadius: 999, fontWeight: 700, color: 'var(--gold)' }}>
                            +{session.total_xp_earned} XP earned
                        </div>
                        {session.tip_used && (
                            <div style={{ background: 'rgba(76,175,130,0.12)', border: '1px solid rgba(76,175,130,0.3)', padding: '8px 20px', borderRadius: 999, fontWeight: 600, color: 'var(--success)', fontSize: '0.85rem' }}>
                                💡 Tip Bonus Earned
                            </div>
                        )}
                        {session.filler_count > 0 && (
                            <div style={{ background: 'rgba(232,164,74,0.1)', padding: '8px 20px', borderRadius: 999, fontSize: '0.85rem', color: 'var(--warning)' }}>
                                {session.filler_count} filler words
                            </div>
                        )}
                    </div>
                </div>

                {/* Factor scores */}
                <div className="card animate-fade-in" style={{ marginBottom: 24, animationDelay: '120ms' }}>
                    <h3 style={{ marginBottom: 20 }}>Scoring Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {FACTOR_LABELS.map((f, i) => {
                            const score = session[f.key] as number;
                            const label = getScoreLabel(score);
                            const fbKey = FEEDBACK_KEYS.find(x => x.score === f.key)?.fb;
                            const feedback = fbKey ? session[fbKey] as string : '';
                            return (
                                <div key={i}>
                                    <div className="score-bar-header" style={{ marginBottom: 6 }}>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{f.emoji} {f.label}</span>
                                        <span style={{ color: label.color, fontWeight: 700 }}>{score}/100 · {label.label}</span>
                                    </div>
                                    <div className="score-bar-track">
                                        <div className="score-bar-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${label.color}99, ${label.color})` }} />
                                    </div>
                                    {feedback && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>{feedback}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Overall feedback */}
                <div className="card-gold animate-fade-in" style={{ marginBottom: 24, animationDelay: '180ms' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎙️</span>
                        <div>
                            <h4 style={{ marginBottom: 8 }}>Coach Feedback</h4>
                            <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>{session.overall_feedback}</p>
                        </div>
                    </div>
                </div>

                {/* Video replay */}
                {session.video_url && (
                    <div className="card animate-fade-in" style={{ marginBottom: 24, animationDelay: '240ms' }}>
                        <h4 style={{ marginBottom: 16 }}>📼 Your Recording</h4>
                        <video src={session.video_url} controls style={{ width: '100%', borderRadius: 'var(--radius-md)', background: '#000' }} />
                    </div>
                )}

                {/* Transcript */}
                <div className="card animate-fade-in" style={{ marginBottom: 32, animationDelay: '300ms' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showTranscript ? 16 : 0 }}>
                        <h4>📝 Transcript</h4>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowTranscript(!showTranscript)}>
                            {showTranscript ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {showTranscript && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                            {session.transcript || '[No transcript available]'}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/app/lever" className="btn btn-primary btn-lg">🎰 Pull Again</Link>
                    <Link href="/app/leaderboard" className="btn btn-secondary btn-lg">🏆 Leaderboard</Link>
                </div>
            </div>
        </div>
    );
}
