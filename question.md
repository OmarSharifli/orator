# Questions for the Public Speaking App

Please answer all the questions below so I can write a perfect `plan.md` for your app.
Leave your answer directly after each question.

---

## 🎯 General & Scope

1. **What is the name of the app?**
   > Your answer: Orator

2. **What platforms should the app be on?** (Web browser, iOS, Android, or all of them?)
   > Your answer: web app

3. **Is this a solo project or do you have a team/developers who will build it?** (This affects how technical the plan gets.)
   > Your answer: solo

4. **Do you have a budget for backend services** (e.g., cloud speech-to-text APIs, database hosting, auth)?
   > Your answer: supabase for the database/auth but for speech-to-text I want you to find an free api that doesn't remove anything that you said(umm, uhh, and useless lines).

---

## 🎰 Topic & Lever Mechanic

5. **How many topics should the app have at launch?** (e.g., 20, 50, 100?)
   > Your answer: 100

6. **What categories of topics do you want?** For example:
   - Personal stories (e.g., "Tell us about a challenge you overcame")
   - Impromptu/random (e.g., "Why is breakfast the most important meal?")
   - Business/professional (e.g., "Pitch a product you love")
   - Debate-style (e.g., "Argue for or against remote work")
   > Your answer: I want something like 1-2 word topics like analysis paralysis, luck, inside voice, etc.

7. **Should topics have a difficulty level?** (Beginner, Intermediate, Advanced) And should the difficulty affect XP earned?
   > Your answer: When you reach higher divisions, the topics get harder and you earn a bit more xp

8. **Should the lever be purely random, or should it avoid repeating recent topics for the same user?**
   > Your answer: no repeating topics

9. **Can users re-pull the lever to get a new topic, or are they locked in once a topic is shown?** If they can re-pull, is there a limit?
   > Your answer: they can re-pull as many times as they want

---

## 💡 Tips & Professional Speakers

10. **Do you have a list of specific public speaking coaches/experts whose tips you want to use?** (e.g., Vinh Giang, Simon Sinek, Chris Anderson, Vanessa Van Edwards, etc.) Please list all the experts you want included.
    > Your answer: Simon Sinek, Tony Robbins, James Clear, Vinh Giang and much more. 

11. **Should each topic always show the same tip, or should the tip be randomly selected from a pool for that topic every time?**
    > Your answer: you get a tip per lever

12. **Should users be able to see all available tips in a "tips library" section of the app?**
    > Your answer: no the users shouldn't know te future

---

## 🎤 Speech Recording & Rating

13. **How should the app capture the user's speech?** Options:
    - Microphone only (audio recording)
    - Camera + microphone (video recording)
    > Your answer: Camera + mic

14. **What is the minimum and maximum speaking time allowed per session?** (e.g., min 1 minute, max 5 minutes?)
    > Your answer: minimum 1 minute and maximum 5 minutes

15. **For the AI rating, which specific factors do you want to score?** Here is a suggested list — please confirm, remove, or add to it:
    - [ nice ] Filler words (um, uh, like, you know)
    - [ don't rate it by many words per minute, rate it by the flow ] Pace (words per minute)
    - [ nice ] Pauses (effective vs. awkward)
    - [ more of if the storytelling is interesting but still look at the structure] Storytelling structure (did they use a beginning, middle, end?)
    - [ after a certain division yes ] Vocabulary variety
    - [ yep ] Clarity/articulation
    - [ for sure yes ] Tip usage (did they follow the given tip?)
    - [ yes ] Eye contact (if video is used)
    - [ yes ] Energy/Volume (if video is used)
    > Your answer:

16. **Should each factor have its own sub-score, or should there be one overall score** (e.g., out of 100)?
    > Your answer: each factor is rated from 100/? and the xp is calculated from that

17. **What speech-to-text/AI service do you prefer to use for analysis?** (e.g., Google Cloud Speech-to-Text, OpenAI Whisper, AssemblyAI) — or do you want me to recommend the best option?
    > Your answer: i don't know much about it so recommend me the best option for quality and free

18. **Should users be able to replay and listen to their own recording after the session?**
    > Your answer: of course

19. **Should users receive written feedback after each session?** (e.g., "You used 'um' 14 times. Try pausing instead.")
    > Your answer: yes for sure

---

## ⭐ XP System

20. **How much XP should each rating factor be worth?** For example:
    - Each factor scored = 10 XP base
    - Tip usage bonus = 25 XP
    - Streak bonus = multiplier (e.g., 1.5x on day 3, 2x on day 7)?
    > Your answer: yep

21. **What counts as a "streak"?** (e.g., completing at least one session per day)
    > Your answer: yep

22. **Should XP ever decrease or be lost** (e.g., if the user breaks a streak)?
    > Your answer: no

---

## 🏆 Divisions & Leaderboard

23. **How many divisions do you want, and what are their names?** For example:
    - Bronze → Silver → Gold → Platinum → Diamond → Master?
    - Or something thematic like Novice Speaker → Confident Speaker → Orator → Keynote Speaker → Legend?
    > Your answer: Novice Speaker → Confident Speaker → Orator → Keynote Speaker → Legend

24. **What are the XP thresholds for each division?** (e.g., 0–500 = Bronze, 501–1500 = Silver, etc.)
    > Your answer: you decide

25. **Is the leaderboard global (all users worldwide), or can users also see friends/local leaderboards?**
    > Your answer: global

26. **Should the leaderboard reset periodically** (e.g., weekly/monthly "seasons"), or is it all-time?
    > Your answer: all time

27. **Should users have public profiles visible on the leaderboard** (username, division badge, XP), or keep it more private?
    > Your answer: visible

---

## 👤 User Accounts & Auth

28. **Do users need to create an account to use the app?** Or can they try it without signing in, then create an account to save progress? 
    > Your answer: for sure create

29. **What sign-in methods do you want?** (Email/password, Google, Apple, etc.)
    > Your answer: email/password with sending a code and verifying, google

---

## 🎨 Design & Branding

30. **Do you have a preferred color scheme or visual style?** (e.g., dark mode, vibrant/neon, clean/minimal, premium/dark)
    > Your answer: clean/minimal

31. **Do you have a logo or brand name already?**
    > Your answer: I will create it

32. **Should the lever animation be a classic slot machine style (spinning reels), or something more modern/unique?**
    > Your answer: modern/unique

---

## 🗺️ Future Features (Optional)

33. **Are there any features you want in the future but NOT in the first version?** (e.g., AI coaching, social sharing, challenges with friends, course content)
    > Your answer: we'll decide later

34. **Do you want the plan to include a phased roadmap** (Phase 1 MVP → Phase 2 → Phase 3), or just focus on the full vision?
    > Your answer: phased roadmap

---

*Once you've answered these, I'll write a detailed `plan.md` covering every aspect of the app.*
