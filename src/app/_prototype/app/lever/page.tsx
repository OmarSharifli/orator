'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getDivision } from '@/lib/utils';
import { getRandomTopicForTier, getRandomTipForTier, TOPICS } from '@/lib/data';

interface Topic { id: number; text: string; tier: number; }
interface Tip { id: number; text: string; speaker: string; tier: number; }

type Phase = 'ready' | 'spinning' | 'result';

export default function LeverPage() {
    const router = useRouter();
    const supabase = createClient();

    const [phase, setPhase] = useState<Phase>('ready');
    const [topic, setTopic] = useState<Topic | null>(null);
    const [tip, setTip] = useState<Tip | null>(null);
    const [seenIds, setSeenIds] = useState<number[]>([]);
    const [tier, setTier] = useState(1);
    const [displayTopics, setDisplayTopics] = useState<string[]>([]);
    const [displayIndex, setDisplayIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        async function loadUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/auth/login'); return; }
            const { data: p } = await supabase.from('profiles').select('total_xp').eq('id', user.id).single();
            if (p) {
                const div = getDivision(p.total_xp);
                setTier(div.tier);
            }
            const { data: h } = await supabase.from('user_topic_history').select('topic_id').eq('user_id', user.id);
            if (h) setSeenIds(h.map((r: { topic_id: number }) => r.topic_id));
        }
        loadUser();
    }, []);

    function pullLever() {
        setPhase('spinning');
        const allForTier = TOPICS.filter(t => t.tier <= tier);
        const spinList = Array.from({ length: 20 }, () => allForTier[Math.floor(Math.random() * allForTier.length)].text);
        setDisplayTopics(spinList);
        setDisplayIndex(0);

        let i = 0;
        let delay = 60;
        function tick() {
            setDisplayIndex(prev => prev + 1);
            i++;
            if (i < spinList.length) {
                delay = Math.min(delay * 1.12, 400);
                intervalRef.current = setTimeout(tick, delay);
            } else {
                const chosen = getRandomTopicForTier(tier, seenIds);
                const chosenTip = getRandomTipForTier(tier);
                setTopic(chosen);
                setTip(chosenTip);
                setPhase('result');
            }
        }
        intervalRef.current = setTimeout(tick, delay);
    }

    useEffect(() => () => { if (intervalRef.current) clearTimeout(intervalRef.current); }, []);

    function handleStart() {
        if (!topic) return;
        sessionStorage.setItem('orator_topic', JSON.stringify(topic));
        sessionStorage.setItem('orator_tip', JSON.stringify(tip));
        router.push('/app/session');
    }

    const spinText = displayTopics[displayIndex] ?? '...';

    return (
        <div className="page-content">
            <div className="container-sm text-center">
                <div className="animate-fade-in" style={{ marginBottom: 40 }}>
                    <h2>Pull the Lever</h2>
                    <p style={{ marginTop: 8 }}>A random topic awaits. Are you ready?</p>
                </div>

                {/* Dial / Lever */}
                <div className="animate-fade-in" style={{ animationDelay: '80ms' }}>
                    <div style={{
                        position: 'relative',
                        width: 280,
                        height: 280,
                        margin: '0 auto 40px',
                        borderRadius: '50%',
                        background: 'var(--navy-3)',
                        border: '3px solid var(--border)',
                        boxShadow: phase === 'spinning'
                            ? '0 0 60px rgba(201,168,76,0.3), inset 0 0 40px rgba(201,168,76,0.05)'
                            : 'var(--shadow-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'box-shadow 0.4s ease',
                    }}>
                        {/* Ring */}
                        <div style={{
                            position: 'absolute',
                            inset: 8,
                            borderRadius: '50%',
                            border: '1px solid var(--border-gold)',
                            opacity: phase === 'spinning' ? 1 : 0.4,
                            transition: 'opacity 0.3s',
                        }} />

                        {/* Topic display */}
                        <div style={{ padding: 24, textAlign: 'center' }}>
                            {phase === 'ready' && (
                                <div>
                                    <div style={{ fontSize: '3rem' }}>🎰</div>
                                    <p style={{ marginTop: 12, fontSize: '0.875rem' }}>Click pull to spin</p>
                                </div>
                            )}
                            {phase === 'spinning' && (
                                <div style={{
                                    fontSize: spinText.length > 12 ? '1rem' : '1.3rem',
                                    fontWeight: 700,
                                    color: 'var(--gold)',
                                    transition: 'all 0.05s',
                                    lineHeight: 1.2,
                                }}>
                                    {spinText}
                                </div>
                            )}
                            {phase === 'result' && topic && (
                                <div className="animate-fade-in-scale">
                                    <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Your Topic</div>
                                    <div style={{
                                        fontSize: topic.text.length > 12 ? '1.1rem' : '1.4rem',
                                        fontWeight: 800,
                                        color: 'var(--gold)',
                                        lineHeight: 1.2,
                                    }}>{topic.text}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                {phase !== 'spinning' && (
                    <div className="animate-fade-in" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button id="lever-pull" className="btn btn-primary btn-lg animate-pulse-gold" onClick={pullLever}>
                            {phase === 'ready' ? '🎰 Pull the Lever' : '🔄 Re-Pull'}
                        </button>
                        {phase === 'result' && (
                            <button id="lever-start" className="btn btn-secondary btn-lg" onClick={handleStart}>
                                🎤 Start Speaking →
                            </button>
                        )}
                    </div>
                )}

                {/* Tip card */}
                {phase === 'result' && tip && (
                    <div className="card-gold animate-fade-in" style={{ marginTop: 40, textAlign: 'left', animationDelay: '200ms' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Today&apos;s Tip</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', background: 'var(--gold-dim)', padding: '2px 10px', borderRadius: '999px' }}>+25 XP bonus</span>
                        </div>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 12 }}>
                            &ldquo;{tip.text}&rdquo;
                        </p>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            — {tip.speaker}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
