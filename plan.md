# 🎤 Orator — Full Product Plan

> A web app that trains people to become powerful public speakers through practice, real-time AI feedback, and a competitive XP league system.

---

## 1. App Overview

**Orator** challenges users to pull a lever, receive a surprise topic and a tip from a world-class public speaker, record themselves speaking about the topic (camera + mic), and then receive detailed AI-powered feedback across multiple scoring factors. Users earn XP per session and climb divisions on an all-time global leaderboard.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| **Frontend** | Next.js (React) | Web app with routing, media APIs, good DX |
| **Styling** | Vanilla CSS / CSS Modules | Clean/minimal aesthetic per user preference |
| **Auth** | Supabase Auth | Email/password (with OTP verification) + Google OAuth |
| **Database** | Supabase (PostgreSQL) | Stores users, sessions, XP, leaderboard |
| **File Storage** | Supabase Storage | Stores recorded video/audio blobs |
| **Speech-to-Text** | **Deepgram Nova-2** (free tier) | Only major API that *preserves* filler words (um, uh, etc.) by default with `filler_words=true`. Free tier includes $200 in credits — more than enough for MVP. |
| **AI Analysis** | Gemini 3 Pro | Analyzes transcript for storytelling, tip usage, vocabulary, clarity |
| **Video Analysis** | **MediaPipe / Hume AI** | Eye contact & energy/volume detection from video (explored in Phase 2) |
| **Deployment** | Vercel | Easy Next.js deployment, generous free tier |

---

## 3. Pages & Navigation

```
/                    → Landing page (hero, CTA to sign up)
/auth/signup         → Email/password signup with email OTP verification
/auth/login          → Login (email + Google)
/app/home            → Home dashboard (streak, division badge, recent sessions)
/app/lever           → The lever pull screen (core loop)
/app/session         → Recording screen (camera + mic)
/app/results         → Rating & feedback screen after a session
/app/history         → Past sessions, recordings, scores
/app/leaderboard     → Global leaderboard with divisions
/app/profile/:id     → Public user profile (username, division, XP, badges)
```

---

## 4. Core Loop (User Journey)

```
1. User opens /app/lever
2. Pulls the lever (animated) → topic spins and locks in
3. Tip from a professional speaker appears with their name
4. User clicks "Start Speaking" → goes to /app/session
5. 5-second countdown → recording begins (camera + mic, 1–5 min)
6. User clicks "Stop" or timer auto-stops at 5 min
7. Video is uploaded to Supabase Storage
8. Audio is sent to Deepgram → full transcript (filler words preserved)
9. Transcript + video metadata sent to Gemini 3 Pro → scoring
10. User sees results on /app/results
11. XP is calculated and added to user profile
12. Leaderboard rank updates
```

---

## 5. Topics Database (100 Topics at Launch)

Topics are 1–3 word prompts, difficulty-tiered. Higher divisions unlock harder topics.

### Tier 1 — Novice Speaker (Divisions 1–2)
Simple, relatable, everyday topics.

| # | Topic | # | Topic |
|---|---|---|---|
| 1 | Luck | 2 | Morning Routines |
| 3 | Inside Voice | 4 | Fear |
| 5 | First Impressions | 6 | Comfort Zone |
| 7 | Silence | 8 | Eye Contact |
| 9 | Body Language | 10 | Mistakes |
| 11 | Gratitude | 12 | Change |
| 13 | Time | 14 | Confidence |
| 15 | Listening | 16 | Failure |
| 17 | Focus | 18 | Boredom |
| 19 | Kindness | 20 | Trust |

### Tier 2 — Confident Speaker (Divisions 2–3)
Slightly deeper, opinion-based.

| # | Topic | # | Topic |
|---|---|---|---|
| 21 | Analysis Paralysis | 22 | Social Media |
| 23 | Vulnerability | 24 | Discipline |
| 25 | Envy | 26 | Imposter Syndrome |
| 27 | Growth Mindset | 28 | Empathy |
| 29 | Overthinking | 30 | Peer Pressure |
| 31 | Identity | 32 | Success |
| 33 | Procrastination | 34 | Ego |
| 35 | Competition | 36 | Sacrifice |
| 37 | Addiction | 38 | Belonging |
| 39 | Risk | 40 | Rejection |

### Tier 3 — Orator (Division 3)
Nuanced, philosophical, abstract topics.

| # | Topic | # | Topic |
|---|---|---|---|
| 41 | Moral Courage | 42 | Echo Chambers |
| 43 | Authenticity | 44 | Luck vs. Skill |
| 45 | Power of Habit | 46 | Privilege |
| 47 | Meritocracy | 48 | Status |
| 49 | Empathy Gap | 50 | Tribe Mentality |
| 51 | Legacy | 52 | Purpose |
| 53 | Silence as Power | 54 | Narrative Bias |
| 55 | Illusion of Control | 56 | Scarcity Mindset |
| 57 | Death | 58 | Humility |
| 59 | Redemption | 60 | Forgiveness |

### Tier 4 — Keynote Speaker (Division 4)
Abstract, emotionally complex, intellectually demanding.

| # | Topic | # | Topic |
|---|---|---|---|
| 61 | Systems vs. Goals | 62 | Cognitive Dissonance |
| 63 | Collective Trauma | 64 | Power Dynamics |
| 65 | Truth | 66 | The Unknown |
| 67 | Free Will | 68 | Groupthink |
| 69 | Sunk Cost Fallacy | 70 | Moral Relativism |
| 71 | The Long Game | 72 | Uncertainty |
| 73 | Sacrifice vs. Compromise | 74 | Information Overload |
| 75 | Responsibility | 76 | Forgetting |
| 77 | Adaptation | 78 | Courage |
| 79 | The Narrative Self | 80 | Presence |

### Tier 5 — Legend (Division 5)
Elite-level, requires high command of language and thought.

| # | Topic | # | Topic |
|---|---|---|---|
| 81 | The Paradox of Choice | 82 | Infinite Games |
| 83 | Meaning | 84 | Transcendence |
| 85 | The Observer Effect | 86 | First Principles |
| 87 | Emergent Behavior | 88 | The Banality of Evil |
| 89 | Signal vs. Noise | 90 | Radical Honesty |
| 91 | Memento Mori | 92 | Amor Fati |
| 93 | The Hedonic Treadmill | 94 | Existential Risk |
| 95 | The Pale Blue Dot | 96 | Long-term Thinking |
| 97 | The Void | 98 | Interconnectedness |
| 99 | The Present Moment | 100 | What Is Enough |

---

## 6. Tips Database

Each topic maps to **one tip** from a real public speaking expert. The tip is randomly selected from the pool for that topic tier at the time of the lever pull. Users never see future tips (no library).

Below is the curated pool of verified tips with their sources. These will be stored in the database and matched to topics by difficulty tier.

### Tips Pool (Verified, from real experts)

| # | Tip | Speaker | Source |
|---|---|---|---|
| T01 | **"Show up to give, not to take."** Don't approach a speech seeking approval, sales, or validation—show up to provide pure value. Audiences can immediately sense whether you're a giver or a taker. | **Simon Sinek** | simonsinek.com |
| T02 | **"Don't talk right away."** Walk out, take a breath, and pause for a few seconds before your first word. Silence at the start signals confidence and commands attention. | **Simon Sinek** | Entrepreneur.com |
| T03 | **"Make eye contact one person at a time."** Give each person one full sentence or thought with direct eye contact. This transforms a lecture into a conversation. | **Simon Sinek** | Entrepreneur.com |
| T04 | **"Speak unusually slowly."** Audiences are more patient than you think. Slowing down your pace shows control and makes every word land harder. | **Simon Sinek** | Entrepreneur.com |
| T05 | **"Be as big as the room."** Adjust your energy, volume, and presence to match the size of your audience. A whisper fails in an auditorium; a shout overwhelms a boardroom. | **Vinh Giang** | karpfucius.com |
| T06 | **"End on a lower pitch."** Finishing a sentence with a downward inflection signals certainty and authority. An upward pitch sounds like a question—even when it isn't. | **Vinh Giang** | artofpoets.com |
| T07 | **"Pause. Let them catch up."** A pause is not dead air—it is a gift to your audience. It gives them time to process, and it gives you time to think. | **Vinh Giang** | YouTube |
| T08 | **"You can still be shy. Just be louder."** Volume isn't about personality—it's about vitality. Injecting volume into your voice shows life, even if you feel nervous inside. | **Vinh Giang** | karpfucius.com |
| T09 | **"The meaning is beyond the words."** How you use your voice—pace, pitch, tone, silence—carries as much meaning as what you actually say. Master both. | **Vinh Giang** | artofpoets.com |
| T10 | **"Tap your audience's emotions."** Information without emotion is forgotten. To make your message stick, feel it yourself first—then the audience will feel it too. | **Tony Robbins** | inc.com |
| T11 | **"Add more value than anyone expects."** Go deeper, give more, be more passionate than required. The speaker who overdelivers is the one people remember. | **Tony Robbins** | inc.com |
| T12 | **"Know your audience before you open your mouth."** Research their fears, desires, and needs. A message that does not speak to the person in front of you is just noise. | **Tony Robbins** | tonyrobbins.com |
| T13 | **"Where focus goes, energy flows."** Before you speak, decide exactly what outcome you want for your audience—and anchor your entire talk to that single outcome. | **Tony Robbins** | tonyrobbins.com |
| T14 | **"Every action you take is a vote for the type of speaker you wish to become."** Every practice session, however small, is a deposit in your speaking identity. | **James Clear** | jamesclear.com |
| T15 | **"You do not rise to the level of your goals. You fall to the level of your systems."** Build a daily speaking practice—not just an ambition. | **James Clear** | Atomic Habits |
| T16 | **"Be willing to look foolish while you learn."** The fear of imperfection is the #1 enemy of improvement. The best speakers were once the worst in the room. | **James Clear** | jamesclear.com |
| T17 | **"Start with Why."** Before you explain WHAT you do or HOW you do it, tell us WHY. People don't buy what you do—they buy why you do it. | **Simon Sinek** | TED Talk / Start With Why |
| T18 | **"Use movement with purpose."** Every step you take on stage sends a signal. Move toward the audience when you want to connect; step back when you want them to reflect. | **Vinh Giang** | karpfucius.com |
| T19 | **"Call out the elephant in the room."** If there is obvious tension, nervousness, or discomfort in the room—name it. Acknowledging it immediately releases it and earns trust. | **Vinh Giang** | YouTube |
| T20 | **"Don't speak about what you don't truly care about."** Passion is not optional—it's the foundation of belief. If you don't believe it, they won't either. | **Tony Robbins** | inc.com |

> **Note for development:** This pool of 20 tips will be extended before launch to reach 100 topic–tip pairings. Tips can be reused across topics of the same tier. Each topic will be assigned 1 primary tip in the database.

---

## 7. Scoring System

After each session, the AI analyzes the transcript and video and rates the user across the following factors. Ratings not yet available at a user's division unlock gradually.

### Scoring Factors

| Factor | How It's Detected | Unlock Division |
|---|---|---|
| **Filler Words** | Deepgram `filler_words=true` → count of "um", "uh", "like", "you know" | Novice |
| **Pace / Flow** | GPT-4o analyzes transcript rhythm, sentence length variation, naturalness | Novice |
| **Pauses** | Deepgram silence detection + GPT analysis (effective vs. awkward) | Novice |
| **Storytelling** | GPT-4o: Is it interesting? Does it have a hook, middle, point? | Novice |
| **Clarity / Articulation** | Deepgram confidence scores per word | Novice |
| **Tip Usage** | GPT-4o: Did the user apply the specific tip given? | Novice |
| **Eye Contact** | Camera frame analysis (MediaPipe face + gaze) | Confident |
| **Energy / Volume** | Audio amplitude analysis + video facial expression | Confident |
| **Vocabulary Variety** | GPT-4o: Lexical diversity, avoidance of repetition | Orator+ |

### Scoring Scale
Each factor is rated from **0–100** by the AI with a short written explanation.

```
90–100 = Excellent
70–89  = Good
50–69  = Average
30–49  = Needs Work
0–29   = Poor
```

### XP Calculation

```
Base XP per session = sum of (each factor score / 100 × 10)
  → Max base = 10 XP per factor × number of unlocked factors

Tip Usage Bonus = If tip score ≥ 70 → +25 XP

Streak Bonus (applied to total session XP):
  Day 2–3 streak   → +10%
  Day 4–6 streak   → +25%
  Day 7+ streak    → +50%
  Day 14+ streak   → +75%
  Day 30+ streak   → +100%

Example (Novice, 6 factors unlocked, all 80/100, tip used, no streak):
  6 × 8 = 48 XP base + 25 (tip) = 73 XP
```

---

## 8. Divisions & Leaderboard

### Division Structure

| Division | Name | XP Required | Topics Unlocked |
|---|---|---|---|
| 1 | 🟤 Novice Speaker | 0 | Tier 1 |
| 2 | 🔵 Confident Speaker | 500 | Tier 1–2 |
| 3 | 🟡 Orator | 1,500 | Tier 1–3 |
| 4 | 💜 Keynote Speaker | 4,000 | Tier 1–4 |
| 5 | 🔴 Legend | 10,000 | Tier 1–5 |

### Leaderboard Rules
- **All-time** (no resets)
- **Global** — all users visible
- Each user has a **public profile** with: username, division badge, total XP, number of sessions, longest streak
- XP never decreases

---

## 9. Lever Animation Design

The lever should feel **modern, unique, and satisfying** — not a classic slot machine.

**Concept: The "Spin Dial"**
- A large circular dial in the center of the screen with glowing ring
- User clicks/drags a lever handle on the side → dial spins with momentum
- Words fly through the dial window as it spins → slows → snaps to final topic
- The topic appears with a flash/bloom animation
- Below it, the tip fades in elegantly with the speaker's name and subtle avatar

**Animation stack:** CSS keyframes + Framer Motion (Next.js friendly)

---

## 10. Auth & User Flow

### Sign Up
1. User enters name, email, username, password
2. Supabase sends a 6-digit OTP to their email
3. User enters the OTP → account created
4. Redirected to home dashboard

### Login
- Email + password
- Google OAuth (one-click via Supabase)

### Profile Data (stored in Supabase)
```sql
users {
  id, username, email, avatar_url,
  total_xp, current_division, current_streak,
  longest_streak, sessions_completed,
  created_at
}

sessions {
  id, user_id, topic, tip_id, tip_speaker,
  duration_seconds, video_url, transcript,
  score_filler, score_pace, score_pauses,
  score_storytelling, score_clarity, score_tip,
  score_eye_contact, score_energy, score_vocab,
  total_xp_earned, created_at
}

topics { id, text, tier, category }
tips { id, text, speaker_name, topic_tier }

user_topic_history { user_id, topic_id, seen_at }
  -- Prevents topic repeats
```

---

## 11. Design System

**Style:** Clean, minimal, confident. Think Notion × Linear × a premium coaching app.

| Token | Value |
|---|---|
| Primary color | `#1A1A2E` (deep navy) |
| Accent | `#C9A84C` (warm gold — speaks to *excellence*) |
| Background | `#F8F8F6` (off-white) |
| Text | `#111111` |
| Font | **Inter** (Google Fonts) |
| Border radius | `12px` cards, `8px` buttons |
| Shadows | Subtle, soft — `box-shadow: 0 2px 12px rgba(0,0,0,0.06)` |

Animations are smooth but restrained — no flashy distractions. The lever/dial is the one "wow" moment.

---

## 12. Phased Roadmap

### ✅ Phase 1 — MVP (Weeks 1–6)

**Goal:** Core loop works end-to-end.

- [ ] Project setup: Next.js + Supabase + Vercel
- [ ] Auth: email/OTP + Google OAuth
- [ ] Home dashboard with division badge + streak counter
- [ ] Topics database (100 topics seeded)
- [ ] Tips database (20 tips seeded, mapped to topics)
- [ ] Lever screen with spin-dial animation
- [ ] Recording screen (camera + mic, 1–5 min, countdown)
- [ ] Deepgram integration (audio transcript with filler words)
- [ ] GPT-4o scoring for: filler words, pace, pauses, storytelling, clarity, tip usage
- [ ] Results screen with per-factor scores + written feedback
- [ ] XP calculation and storage
- [ ] Global leaderboard (read-only, scrollable)
- [ ] Public user profile page
- [ ] Session history with replay

---

### 🔄 Phase 2 — Polish & Engagement (Weeks 7–10)

**Goal:** Make users come back every day.

- [ ] Streak system with visual fire animations
- [ ] Division promotion/badge animation when user levels up
- [ ] Vocabulary variety scoring (Orator+ unlock)
- [ ] Eye contact scoring via MediaPipe (camera gaze detection)
- [ ] Energy/volume scoring via audio amplitude
- [ ] "Re-pull" UX polish (smooth re-spin on same screen)
- [ ] Notifications/reminder emails (Supabase SMTP)
- [ ] Profile avatars + customization
- [ ] Improve tip coverage to 100 tips (all topics mapped)

---

### 🚀 Phase 3 — Scale & Features (Weeks 11+)

**Goal:** Retain and grow the user base.

- [ ] Weekly/monthly challenges (special topics)
- [ ] Progress graphs per factor over time
- [ ] Social sharing (share your score card as an image)
- [ ] Mobile PWA optimization
- [ ] User-reported transcription corrections
- [ ] Explore AI coaching mode (chat with AI after session)
- [ ] Partnerships with speaking coaches for new tip content

---

## 13. Key Open Source / Free Tier Limits

| Service | Free Tier |
|---|---|
| Supabase | 500MB DB, 1GB storage, 50,000 MAU |
| Deepgram | $200 credit (~4,000 hrs at $0.0043/min Nova-2) |
| OpenAI GPT-4o | Pay-per-use (~$0.005/1K tokens — very cheap per session) |
| Vercel | Unlimited hobby deployments |

> **Recommendation:** For Phase 1, the entire stack costs **$0** unless you exceed Deepgram's $200 credit. At 5 minutes per session, that's ~48,000 free sessions. More than enough for MVP.

---

## 14. Subscription Plans

To ensure the long-term sustainability of Orator, we offer three tiers of access. Waitlist members receive **1 month of Pro access** for free instead of the standard 1 week.

| Feature | **Free (Novice)** | **Pro (Orator)** | **Enterprise (Legend)** |
|---|---|---|---|
| **Price** | $0/mo | $19/mo | Contact Us |
| **Topic Tiers** | Tier 1 & 2 only | All Tiers (1–5) | All Tiers + Custom |
| **Sessions** | 3 per day | Unlimited | Unlimited |
| **AI Feedback** | Basic (Filler, Pace) | Advanced (All factors) | All factors + AI Coaching |
| **Video Storage** | 7 days | Unlimited | Unlimited |
| **Leaderboard** | Standard | Highlighted Profile | Custom Team Boards |
| **Tips Pool** | 20 basic tips | 100+ Premium tips | Custom expert pool |

---

## 15. Waitlist Strategy

- **Incentive:** Join the waitlist now to unlock **1 month of Pro** ($19 value) as soon as we launch.
- **Goal:** Build a list of 1,000+ early adopters before opening the app features.
- **Conversion:** Simple, high-impact landing page with a single "Apply for Early Access" CTA.

---
