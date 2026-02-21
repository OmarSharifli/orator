'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatTime } from '@/lib/utils';

type Phase = 'countdown' | 'recording' | 'uploading' | 'error';

const MIN_DURATION = 60;
const MAX_DURATION = 300;

export default function SessionPage() {
    const router = useRouter();
    const supabase = createClient();

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const [phase, setPhase] = useState<Phase>('countdown');
    const [countdown, setCountdown] = useState(3);
    const [elapsed, setElapsed] = useState(0);
    const [error, setError] = useState('');
    const [topic, setTopic] = useState('');
    const [tip, setTip] = useState<{ text: string; speaker: string } | null>(null);

    useEffect(() => {
        const t = sessionStorage.getItem('orator_topic');
        const ti = sessionStorage.getItem('orator_tip');
        if (!t) { router.push('/app/lever'); return; }
        setTopic(JSON.parse(t).text);
        if (ti) setTip(JSON.parse(ti));

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.muted = true;
                videoRef.current.play();
            }
            startCountdown();
        }).catch(() => setError('Camera and microphone access is required. Please allow access and refresh.'));

        return () => streamRef.current?.getTracks().forEach(t => t.stop());
    }, []);

    function startCountdown() {
        let c = 3;
        const id = setInterval(() => {
            c--;
            setCountdown(c);
            if (c <= 0) { clearInterval(id); startRecording(); }
        }, 1000);
    }

    function startRecording() {
        const stream = streamRef.current;
        if (!stream) return;
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
        chunksRef.current = [];
        recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        recorder.start(1000);
        mediaRef.current = recorder;
        setPhase('recording');

        let e = 0;
        const id = setInterval(() => {
            e++;
            setElapsed(e);
            if (e >= MAX_DURATION) { clearInterval(id); stopRecording(); }
        }, 1000);
        (recorder as MediaRecorder & { _timerId?: ReturnType<typeof setInterval> })._timerId = id;
    }

    function stopRecording() {
        const recorder = mediaRef.current;
        if (!recorder || recorder.state === 'inactive') return;
        const r = recorder as MediaRecorder & { _timerId?: ReturnType<typeof setInterval> };
        if (r._timerId) clearInterval(r._timerId);
        recorder.stop();
        setPhase('uploading');
        recorder.onstop = () => uploadAndAnalyze();
    }

    async function uploadAndAnalyze() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const path = `${user.id}/${Date.now()}.webm`;

        // Upload video
        const { error: upErr } = await supabase.storage.from('recordings').upload(path, blob);
        if (upErr) { setError('Upload failed: ' + upErr.message); return; }

        const { data: { publicUrl } } = supabase.storage.from('recordings').getPublicUrl(path);
        const topicData = JSON.parse(sessionStorage.getItem('orator_topic') ?? '{}');
        const tipData = JSON.parse(sessionStorage.getItem('orator_tip') ?? '{}');

        // Call analysis API
        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                videoUrl: publicUrl,
                userId: user.id,
                topic: topicData,
                tip: tipData,
                duration: elapsed,
            }),
        });

        if (!res.ok) { setError('Analysis failed. Please try again.'); return; }
        const { sessionId } = await res.json();
        sessionStorage.removeItem('orator_topic');
        sessionStorage.removeItem('orator_tip');
        router.push(`/app/results/${sessionId}`);
    }

    const remaining = MAX_DURATION - elapsed;
    const progress = (elapsed / MAX_DURATION) * 100;

    return (
        <div className="page-content">
            <div className="container-sm">
                {/* Topic reminder */}
                <div className="card-gold animate-fade-in" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.5rem' }}>🎤</span>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Topic</div>
                        <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '1.1rem' }}>{topic}</div>
                    </div>
                </div>

                {/* Video */}
                <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--navy-3)', aspectRatio: '16/9', marginBottom: 20 }}>
                    <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} playsInline />

                    {phase === 'countdown' && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                            <div className="animate-fade-in-scale" style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--gold)' }}>
                                {countdown > 0 ? countdown : '🎤'}
                            </div>
                        </div>
                    )}

                    {phase === 'uploading' && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', gap: 16 }}>
                            <div className="spinner spinner-lg" />
                            <p style={{ color: 'var(--text-primary)' }}>Analyzing your speech with AI…</p>
                        </div>
                    )}

                    {phase === 'recording' && (
                        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(232,90,74,0.9)', padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse-gold 1s infinite' }} />
                            REC {formatTime(elapsed)}
                        </div>
                    )}
                </div>

                {/* Progress bar */}
                {phase === 'recording' && (
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                            <span>{elapsed < MIN_DURATION ? `Min: ${formatTime(MIN_DURATION - elapsed)} remaining` : '✓ Minimum reached'}</span>
                            <span>{formatTime(remaining)} left</span>
                        </div>
                        <div className="xp-bar-track">
                            <div className="xp-bar-fill" style={{ width: `${progress}%`, background: elapsed < MIN_DURATION ? 'linear-gradient(90deg, var(--text-muted), var(--warning))' : undefined }} />
                        </div>
                    </div>
                )}

                {/* Stop button */}
                {phase === 'recording' && (
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button
                            id="session-stop"
                            className="btn btn-primary btn-lg"
                            onClick={stopRecording}
                            disabled={elapsed < MIN_DURATION}
                        >
                            {elapsed < MIN_DURATION ? `Wait ${formatTime(MIN_DURATION - elapsed)}` : '⏹ Stop & Analyze'}
                        </button>
                    </div>
                )}

                {/* Tip reminder */}
                {phase === 'recording' && tip && (
                    <div className="card-gold" style={{ marginTop: 24 }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Tip from {tip.speaker}</div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{tip.text}</p>
                    </div>
                )}

                {/* Error */}
                {(phase === 'error' || error) && (
                    <div className="card" style={{ borderColor: 'var(--danger)', textAlign: 'center', marginTop: 20 }}>
                        <p className="text-danger">{error}</p>
                        <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => router.push('/app/lever')}>← Back to Lever</button>
                    </div>
                )}
            </div>
        </div>
    );
}
