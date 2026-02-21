import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateXp } from '@/lib/utils';

const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { videoUrl, userId, topic, tip, duration } = await req.json();

        // ── 1. Fetch audio from video URL and transcribe with Deepgram ──
        const audioRes = await fetch(videoUrl);
        const audioBuffer = await audioRes.arrayBuffer();

        const dgRes = await fetch(
            'https://api.deepgram.com/v1/listen?model=nova-2&filler_words=true&punctuate=true&paragraphs=true',
            {
                method: 'POST',
                headers: {
                    Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
                    'Content-Type': 'audio/webm',
                },
                body: audioBuffer,
            }
        );

        if (!dgRes.ok) throw new Error('Deepgram transcription failed');
        const dgData = await dgRes.json();
        const transcript: string = dgData.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '';
        const words: { word: string; confidence: number }[] =
            dgData.results?.channels?.[0]?.alternatives?.[0]?.words ?? [];

        // Count filler words
        const fillerList = ['um', 'uh', 'like', 'you know', 'mhmm', 'uh-huh'];
        const fillerCount = words.filter(w => fillerList.includes(w.word.toLowerCase())).length;
        const avgConfidence = words.length > 0 ? words.reduce((s, w) => s + w.confidence, 0) / words.length : 0;

        // ── 2. Analyse with Gemini ──
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert public speaking coach. Analyze this speech transcript and return a JSON object with scores and feedback.

TOPIC: "${topic.text}"
TIP GIVEN: "${tip.text}" (by ${tip.speaker})
DURATION: ${duration} seconds
FILLER WORDS COUNT: ${fillerCount}
AVERAGE WORD CONFIDENCE: ${(avgConfidence * 100).toFixed(1)}%

TRANSCRIPT:
${transcript || '[No speech detected]'}

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "score_filler": <0-100, 100=no fillers, deduct ~5 per filler>,
  "score_pace": <0-100, rate the naturalness and flow of speech rhythm>,
  "score_pauses": <0-100, effective vs awkward silence usage>,
  "score_storytelling": <0-100, is it interesting with structure and hook?>,
  "score_clarity": <0-100, use ${(avgConfidence * 100).toFixed(0)} as a base>,
  "score_tip": <0-100, did they apply "${tip.text.substring(0, 80)}..."?>,
  "tip_used": <true/false>,
  "feedback_filler": "<1 sentence specific feedback on filler words>",
  "feedback_pace": "<1 sentence specific feedback on pace/flow>",
  "feedback_pauses": "<1 sentence specific feedback on pauses>",
  "feedback_storytelling": "<1 sentence specific feedback on storytelling>",
  "feedback_clarity": "<1 sentence specific feedback on clarity>",
  "feedback_tip": "<1 sentence specific feedback on tip usage>",
  "overall_feedback": "<2-3 sentence overall coaching summary with the most important thing to improve>"
}`;

        const geminiRes = await model.generateContent(prompt);
        const geminiText = geminiRes.response.text().trim().replace(/```json\n?/g, '').replace(/```/g, '');
        const analysis = JSON.parse(geminiText);

        // ── 3. Calculate XP ──
        const scores = {
            filler: analysis.score_filler,
            pace: analysis.score_pace,
            pauses: analysis.score_pauses,
            storytelling: analysis.score_storytelling,
            clarity: analysis.score_clarity,
            tip: analysis.score_tip,
        };

        // Get current streak
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('current_streak, total_xp, sessions_completed, last_session_date')
            .eq('id', userId)
            .single();

        const today = new Date().toISOString().split('T')[0];
        const lastDate = profile?.last_session_date;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak = lastDate === today ? (profile?.current_streak ?? 1)
            : lastDate === yesterday ? (profile?.current_streak ?? 0) + 1
                : 1;

        const xpEarned = calculateXp(scores, analysis.tip_used, newStreak);

        // ── 4. Save session ──
        const { data: session, error: sessErr } = await supabaseAdmin.from('sessions').insert({
            user_id: userId,
            topic: topic.text,
            topic_id: topic.id,
            tip_id: tip.id,
            tip_speaker: tip.speaker,
            duration_seconds: duration,
            video_url: videoUrl,
            transcript,
            score_filler: analysis.score_filler,
            score_pace: analysis.score_pace,
            score_pauses: analysis.score_pauses,
            score_storytelling: analysis.score_storytelling,
            score_clarity: analysis.score_clarity,
            score_tip: analysis.score_tip,
            feedback_filler: analysis.feedback_filler,
            feedback_pace: analysis.feedback_pace,
            feedback_pauses: analysis.feedback_pauses,
            feedback_storytelling: analysis.feedback_storytelling,
            feedback_clarity: analysis.feedback_clarity,
            feedback_tip: analysis.feedback_tip,
            overall_feedback: analysis.overall_feedback,
            tip_used: analysis.tip_used,
            total_xp_earned: xpEarned,
            filler_count: fillerCount,
        }).select('id').single();

        if (sessErr) throw new Error('Session save failed: ' + sessErr.message);

        // ── 5. Update profile ──
        const newXp = (profile?.total_xp ?? 0) + xpEarned;
        await supabaseAdmin.from('profiles').upsert({
            id: userId,
            total_xp: newXp,
            current_streak: newStreak,
            longest_streak: Math.max(profile?.current_streak ?? 0, newStreak),
            sessions_completed: (profile?.sessions_completed ?? 0) + 1,
            last_session_date: today,
        });

        // ── 6. Track topic seen ──
        await supabaseAdmin.from('user_topic_history').upsert({ user_id: userId, topic_id: topic.id, seen_at: new Date().toISOString() });

        return NextResponse.json({ sessionId: session.id, xpEarned });
    } catch (err) {
        console.error('analyze error', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
