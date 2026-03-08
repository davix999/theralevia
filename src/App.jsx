import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: '#FAF7F2', bgCard: '#FFFFFF', primary: '#1B4F4A', primaryLight: '#2D7068',
  accent: '#C4724A', accentLight: '#E8906E', sage: '#8BAF8D',
  text: '#2C2C2C', textLight: '#6B6B6B', textMuted: '#9B9B9B',
  border: '#E8E2D9', success: '#4CAF7D', warning: '#E8A838',
};

const LESSONS = [
  { id: 1, title: "Understanding Your Pain", category: "Foundation", duration: "15 min",
    description: "Learn how fibromyalgia affects your nervous system and why traditional pain models don't apply.",
    content: [
      { type: "text", text: "Fibromyalgia isn't 'imaginary pain' — it's a real condition involving how your central nervous system processes pain signals. Think of it as your pain volume knob being turned up too high." },
      { type: "exercise", title: "Body Scan", instructions: "Close your eyes. Starting from your feet, slowly notice each part of your body without judgment. Just observe — don't try to change anything. Spend about 5 minutes here." },
      { type: "text", text: "Acceptance and Commitment Therapy (ACT) doesn't ask you to pretend the pain isn't there. It asks: what can you do even with the pain? That's the shift we're building toward." },
    ]
  },
  { id: 2, title: "Values Compass", category: "ACT Core", duration: "20 min",
    description: "Identify what matters most to you — and use that as your guide rather than letting pain lead.",
    content: [
      { type: "text", text: "Pain often shrinks our world. We stop doing things we love to avoid discomfort. ACT asks us to move toward what we value — even when it's hard." },
      { type: "exercise", title: "Values Clarification", instructions: "Think of three areas of life that matter to you — family, creativity, connection, health, work. For each one, ask: what would I be doing if pain weren't calling all the shots? Write it down." },
      { type: "text", text: "Values aren't goals — they're directions. You can never 'finish' being a caring partner, but you can take one step in that direction today." },
    ]
  },
  { id: 3, title: "Defusing From Difficult Thoughts", category: "ACT Core", duration: "15 min",
    description: "Learn to step back from the thoughts that make pain worse.",
    content: [
      { type: "text", text: "When we're in pain, our minds generate stories: 'This will never get better.' 'I'm a burden.' 'I've lost who I used to be.' These thoughts feel true — ACT calls this fusion." },
      { type: "exercise", title: "Leaves on a Stream", instructions: "Imagine a gentle stream. Each thought that arises — place it on a leaf and watch it float away. You don't need to engage with it. Just notice, and let it go. Try this for 3 minutes." },
      { type: "text", text: "You are not your thoughts. You are the observer having the thoughts. That distinction is everything." },
    ]
  },
  { id: 4, title: "Breaking the Boom-Bust Cycle", category: "Skills", duration: "18 min",
    description: "Stop the pattern of overdoing it on good days and crashing hard on bad ones.",
    content: [
      { type: "text", text: "Many people with chronic pain fall into a pattern: feel okay → overdo it → crash → rest too long → feel okay again. This cycle can actually worsen pain sensitivity over time." },
      { type: "exercise", title: "Activity Baseline", instructions: "Think of one activity you love but have been avoiding. What is the smallest version of that activity you could do today — something you are 80% confident you could complete without a crash afterward?" },
      { type: "text", text: "The goal is not to push through. It is to do a little, consistently. Small wins compound into real change over weeks." },
    ]
  },
  { id: 5, title: "Sleep & The Pain Cycle", category: "Skills", duration: "15 min",
    description: "Understand the sleep-pain connection and practical tools to improve your nights.",
    content: [
      { type: "text", text: "Poor sleep and chronic pain are locked in a vicious cycle. Pain disrupts sleep; poor sleep amplifies pain signals. Breaking this cycle is one of the highest-leverage changes you can make." },
      { type: "exercise", title: "Sleep Audit", instructions: "Review your last three nights. What time did you go to bed? What were you doing in the hour before? What thoughts were most active? No judgment — just notice the patterns." },
      { type: "text", text: "Your bed should be for sleep, not for worrying or doomscrolling. Your nervous system needs to learn that bed means safety — that association takes time to rebuild, but it can be rebuilt." },
    ]
  },
  { id: 6, title: "Mindfulness for Pain", category: "Advanced", duration: "20 min",
    description: "Use present-moment awareness to change your relationship with physical sensations.",
    content: [
      { type: "text", text: "Mindfulness is not about relaxing or making pain go away. It is about noticing what is actually happening right now, without the layer of story, judgment, or catastrophizing on top." },
      { type: "exercise", title: "5-4-3-2-1 Grounding", instructions: "Name 5 things you can see, 4 you can physically feel right now, 3 you can hear, 2 you can smell, 1 you can taste. This pulls your attention into the present and out of anticipatory pain spirals." },
      { type: "text", text: "Pain plus suffering equals pain multiplied by resistance. Mindfulness chips away at the resistance." },
    ]
  },
];

const JOURNAL_PROMPTS = [
  "What's one thing — however small — that felt manageable today?",
  "Describe a moment this week when you felt connected to something you value.",
  "What does your body need right now that it's not getting?",
  "If your condition weren't a factor, what would you do differently tomorrow?",
  "Write about someone who has helped you through this. What did they do?",
  "What has your condition taken from you that you grieve most?",
  "Describe a small act of self-compassion you could practice this week.",
  "What story does your mind tell you most often about your pain? Is it always true?",
  "What would you say to a friend going through exactly what you're going through?",
  "Where in your body do you feel tension right now? Can you breathe toward it?",
];

const BREATHING_PATTERNS = [
  { name: "4-7-8 Calm", inhale: 4, hold: 7, exhale: 8, description: "Deep relaxation and sleep preparation", color: '#2D7068' },
  { name: "Box Breath", inhale: 4, hold: 4, exhale: 4, description: "Stress reduction and nervous system reset", color: '#5B6FA6' },
  { name: "Gentle Flow", inhale: 3, hold: 0, exhale: 5, description: "Soft relief without strain", color: '#8BAF8D' },
];

const SEED_MESSAGES = [
  { id: 1, user: "Sarah M.", avatar: "SM", text: "Day 14 done! The breathing exercises are actually helping me fall asleep. First time in months I've slept more than 4 hours straight.", time: "2h ago", likes: 8 },
  { id: 2, user: "Denise K.", avatar: "DK", text: "Struggled with the values exercise today. Felt a lot of grief come up. But I think that's the point? Anyone else feel that?", time: "3h ago", likes: 12 },
  { id: 3, user: "Maria T.", avatar: "MT", text: "Anyone else find the boom-bust lesson was a lightbulb moment? I've been destroying myself for years doing exactly that and wondering why I never got better.", time: "5h ago", likes: 19 },
  { id: 4, user: "Paula R.", avatar: "PR", text: "Week 3 check-in: pain is about the same, but I feel less *defeated* by it. Something is shifting. Hard to explain but it's real.", time: "1d ago", likes: 24 },
  { id: 5, user: "Carla W.", avatar: "CW", text: "Reminder to everyone: bad days don't erase progress. I had a really hard week but I kept showing up. That matters.", time: "1d ago", likes: 31 },
];

const avatarColors = ['#2D7068','#C4724A','#8BAF8D','#5B6FA6','#A6735B','#6B8F71'];
const getAvatarColor = (name) => avatarColors[(name.charCodeAt(0) + name.length) % avatarColors.length];

export default function EaseApp() {
  const [tab, setTab] = useState('dashboard');
  const [symptoms, setSymptoms] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [communityMessages, setCommunityMessages] = useState(SEED_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeBreathing, setActiveBreathing] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInData, setCheckInData] = useState({ pain: 5, fatigue: 5, mood: 5, sleep: 5 });
  const [journalText, setJournalText] = useState('');
  const [breathPhase, setBreathPhase] = useState('ready');
  const [breathCount, setBreathCount] = useState(0);
  const [breathProgress, setBreathProgress] = useState(0);
  const [todayPromptIdx] = useState(Math.floor(Math.random() * JOURNAL_PROMPTS.length));
  const breathTimerRef = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    async function load() {
      try { const r = await window.storage.get('ease-symptoms'); if (r) setSymptoms(JSON.parse(r.value)); } catch(e) {}
      try { const r = await window.storage.get('ease-journal'); if (r) setJournalEntries(JSON.parse(r.value)); } catch(e) {}
      try { const r = await window.storage.get('ease-lessons'); if (r) setCompletedLessons(JSON.parse(r.value)); } catch(e) {}
      try {
        const r = await window.storage.get('ease-community');
        if (r) {
          const userMsgs = JSON.parse(r.value);
          setCommunityMessages([...SEED_MESSAGES, ...userMsgs]);
        }
      } catch(e) {}
    }
    load();
  }, []);

  const save = async (key, data) => {
    try { await window.storage.set(key, JSON.stringify(data)); } catch(e) {}
  };

  const streak = (() => {
    if (!symptoms.length) return 0;
    const dates = [...new Set(symptoms.map(s => new Date(s.date).toDateString()))].sort((a,b) => new Date(b)-new Date(a));
    let count = 0, cur = new Date();
    for (const d of dates) {
      if (d === cur.toDateString()) { count++; cur.setDate(cur.getDate()-1); } else break;
    }
    return count;
  })();

  const todayCheckedIn = symptoms.some(s => new Date(s.date).toDateString() === new Date().toDateString());
  const recentSymptoms = symptoms.slice(-7);
  const avgPain = recentSymptoms.length ? (recentSymptoms.reduce((a,b) => a+b.pain, 0)/recentSymptoms.length).toFixed(1) : '--';
  const avgMood = recentSymptoms.length ? (recentSymptoms.reduce((a,b) => a+b.mood, 0)/recentSymptoms.length).toFixed(1) : '--';

  const submitCheckIn = async () => {
    const entry = { ...checkInData, date: new Date().toISOString() };
    const updated = [...symptoms, entry];
    setSymptoms(updated);
    await save('ease-symptoms', updated);
    setShowCheckIn(false);
  };

  const completeLesson = async (id) => {
    const updated = completedLessons.includes(id) ? completedLessons : [...completedLessons, id];
    setCompletedLessons(updated);
    await save('ease-lessons', updated);
    setActiveLesson(null);
  };

  const submitJournal = async () => {
    if (!journalText.trim()) return;
    const entry = { text: journalText, prompt: JOURNAL_PROMPTS[todayPromptIdx], date: new Date().toISOString() };
    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    await save('ease-journal', updated);
    setJournalText('');
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const msg = { id: Date.now(), user: "You", avatar: "YO", text: newMessage, time: "Just now", likes: 0, isOwn: true };
    const userMsgs = communityMessages.filter(m => m.isOwn);
    const allUserMsgs = [...userMsgs, msg];
    setCommunityMessages([...SEED_MESSAGES, ...allUserMsgs]);
    await save('ease-community', allUserMsgs);
    setNewMessage('');
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const startBreathing = (pattern) => {
    setActiveBreathing(pattern);
    setBreathPhase('ready');
    setBreathCount(0);
    setBreathProgress(0);
  };

  useEffect(() => {
    if (!activeBreathing || breathPhase === 'ready' || breathPhase === 'done') return;
    const hasHold = activeBreathing.hold > 0;
    const phases = ['inhale', ...(hasHold ? ['hold'] : []), 'exhale'];
    const durations = [activeBreathing.inhale * 1000, ...(hasHold ? [activeBreathing.hold * 1000] : []), activeBreathing.exhale * 1000];
    const phaseIdx = phases.indexOf(breathPhase);
    if (phaseIdx === -1) return;
    const duration = durations[phaseIdx];
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      setBreathProgress(Math.min(elapsed / duration, 1));
      if (elapsed < duration) {
        breathTimerRef.current = requestAnimationFrame(tick);
      } else {
        const nextIdx = phaseIdx + 1;
        if (nextIdx >= phases.length) {
          const nextCount = breathCount + 1;
          if (nextCount >= 4) { setBreathPhase('done'); setBreathCount(4); }
          else { setBreathCount(nextCount); setBreathPhase('inhale'); }
        } else {
          setBreathPhase(phases[nextIdx]);
        }
      }
    };
    breathTimerRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(breathTimerRef.current);
  }, [breathPhase, activeBreathing, breathCount]);

  const breathSize = (() => {
    if (!activeBreathing) return 80;
    if (breathPhase === 'inhale') return 80 + breathProgress * 80;
    if (breathPhase === 'hold') return 160;
    if (breathPhase === 'exhale') return 160 - breathProgress * 80;
    return 80;
  })();

  const breathLabel = { ready: 'Tap Begin', inhale: 'Breathe in...', hold: 'Hold...', exhale: 'Breathe out...', done: '✓ Complete' }[breathPhase] || '';
  const breathBgColor = activeBreathing?.color || COLORS.sage;

  const S = {
    app: { fontFamily: "'DM Sans', sans-serif", background: COLORS.bg, minHeight: '100vh', maxWidth: 430, margin: '0 auto', position: 'relative' },
    header: { background: COLORS.primary, color: 'white', padding: '16px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 },
    headerTitle: { fontSize: 22, fontFamily: "'Lora', serif", fontWeight: 700, letterSpacing: '-0.3px' },
    headerSub: { fontSize: 12, opacity: 0.65, marginTop: 1 },
    content: { padding: '16px 16px 80px' },
    card: { background: COLORS.bgCard, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: `1px solid ${COLORS.border}` },
    cardTitle: { fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 },
    bigNum: { fontSize: 40, fontWeight: 700, color: COLORS.primary, fontFamily: "'Lora', serif", lineHeight: 1 },
    btn: { background: COLORS.primary, color: 'white', border: 'none', borderRadius: 12, padding: '13px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 10 },
    btnAccent: { background: COLORS.accent, color: 'white', border: 'none', borderRadius: 12, padding: '13px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 10 },
    btnOutline: { background: 'transparent', color: COLORS.primary, border: `2px solid ${COLORS.primary}`, borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
    tag: (color, bg) => ({ display: 'inline-block', background: bg || `${COLORS.sage}25`, color: color || COLORS.primary, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.3px' }),
    navBar: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'white', borderTop: `1px solid ${COLORS.border}`, display: 'flex', zIndex: 100, paddingBottom: 'env(safe-area-inset-bottom)' },
    navItem: (a) => ({ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px 6px', cursor: 'pointer', color: a ? COLORS.primary : COLORS.textMuted, borderTop: `2px solid ${a ? COLORS.primary : 'transparent'}` }),
    overlay: { position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: '100vh', background: COLORS.bg, zIndex: 200, overflowY: 'auto', padding: '20px 16px 100px', boxSizing: 'border-box' },
    slider: { width: '100%', accentColor: COLORS.primary, margin: '6px 0 0', cursor: 'pointer' },
    textarea: { width: '100%', borderRadius: 12, border: `1.5px solid ${COLORS.border}`, padding: '12px', fontSize: 15, fontFamily: "'DM Sans', sans-serif", minHeight: 110, resize: 'none', outline: 'none', boxSizing: 'border-box', color: COLORS.text, background: COLORS.bg, lineHeight: 1.6 },
    chatRow: { display: 'flex', gap: 8, padding: '10px 16px', background: 'white', borderTop: `1px solid ${COLORS.border}`, position: 'fixed', bottom: 56, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, boxSizing: 'border-box', zIndex: 99 },
    avatar: (name) => ({ width: 38, height: 38, borderRadius: '50%', background: getAvatarColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0 }),
  };

  // Lesson Detail View
  if (activeLesson) {
    const lesson = LESSONS.find(l => l.id === activeLesson);
    const done = completedLessons.includes(lesson.id);
    return (
      <div style={S.app}>
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={S.overlay}>
          <button onClick={() => setActiveLesson(null)} style={{ ...S.btnOutline, marginBottom: 20 }}>← Back</button>
          <span style={S.tag()}>{lesson.category}</span>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 26, color: COLORS.primary, margin: '10px 0 4px', lineHeight: 1.25 }}>{lesson.title}</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 28 }}>⏱ {lesson.duration}</p>
          {lesson.content.map((block, i) => (
            <div key={i} style={{ marginBottom: 22 }}>
              {block.type === 'text' && (
                <p style={{ fontSize: 16, lineHeight: 1.75, color: COLORS.text, margin: 0 }}>{block.text}</p>
              )}
              {block.type === 'exercise' && (
                <div style={{ background: `${COLORS.sage}18`, border: `1.5px solid ${COLORS.sage}50`, borderRadius: 14, padding: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.primaryLight, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>✦ Practice: {block.title}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: COLORS.text, margin: 0 }}>{block.instructions}</p>
                </div>
              )}
            </div>
          ))}
          <button style={done ? { ...S.btn, background: COLORS.success } : S.btn} onClick={() => completeLesson(lesson.id)}>
            {done ? '✓ Marked Complete' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={S.header}>
        <div>
          <div style={S.headerTitle}>✦ Theralevia</div>
          <div style={S.headerSub}>Your Daily Companion</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24 }}>🔥 {streak}</div>
          <div style={{ fontSize: 11, opacity: 0.65 }}>day streak</div>
        </div>
      </div>

      <div style={S.content}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div>
            {!todayCheckedIn && !showCheckIn && (
              <div style={{ ...S.card, background: COLORS.primary, border: 'none', color: 'white' }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>How are you today?</div>
                <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>Daily check-ins help track your progress over time.</div>
                <button onClick={() => setShowCheckIn(true)} style={{ ...S.btn, background: 'white', color: COLORS.primary, marginTop: 0 }}>Start Check-In</button>
              </div>
            )}
            {todayCheckedIn && (
              <div style={{ ...S.card, background: `${COLORS.success}12`, border: `1px solid ${COLORS.success}35` }}>
                <div style={{ color: COLORS.success, fontWeight: 700, fontSize: 15 }}>✓ Checked in today</div>
                <div style={{ color: COLORS.textLight, fontSize: 13 }}>Great — consistency is what builds change.</div>
              </div>
            )}

            {showCheckIn && (
              <div style={{ ...S.card, border: `2px solid ${COLORS.primary}` }}>
                <div style={S.cardTitle}>Today's Check-In</div>
                {[['pain','😣 Pain Level'], ['fatigue','😴 Fatigue'], ['mood','💭 Mood'], ['sleep','🌙 Sleep Quality']].map(([key, label]) => (
                  <div key={key} style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{label}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.primary }}>{checkInData[key]}<span style={{ fontSize: 11, color: COLORS.textMuted }}>/10</span></span>
                    </div>
                    <input type="range" min={1} max={10} value={checkInData[key]} style={S.slider}
                      onChange={e => setCheckInData(d => ({ ...d, [key]: +e.target.value }))} />
                  </div>
                ))}
                <button style={S.btn} onClick={submitCheckIn}>Save Check-In</button>
                <button style={{ ...S.btnOutline, width: '100%', marginTop: 8 }} onClick={() => setShowCheckIn(false)}>Cancel</button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={S.card}>
                <div style={S.cardTitle}>Avg Pain (7d)</div>
                <div style={S.bigNum}>{avgPain}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>out of 10</div>
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>Avg Mood (7d)</div>
                <div style={S.bigNum}>{avgMood}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>out of 10</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={S.card}>
                <div style={S.cardTitle}>Lessons Done</div>
                <div style={S.bigNum}>{completedLessons.length}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>of {LESSONS.length} total</div>
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>Journal Entries</div>
                <div style={S.bigNum}>{journalEntries.length}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>total written</div>
              </div>
            </div>

            {recentSymptoms.length > 0 && (
              <div style={S.card}>
                <div style={S.cardTitle}>Pain — Last 7 Days</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
                  {recentSymptoms.map((s, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ height: `${s.pain * 5}px`, minHeight: 8, background: `hsl(${130 - s.pain * 11}, 55%, 58%)`, borderRadius: 4, marginBottom: 4, transition: 'height 0.4s' }} />
                      <div style={{ fontSize: 10, color: COLORS.textMuted }}>{new Date(s.date).toLocaleDateString('en',{weekday:'short'})}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={S.card}>
              <div style={S.cardTitle}>Today's Reflection Prompt</div>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: COLORS.text, fontStyle: 'italic', margin: '0 0 4px' }}>"{JOURNAL_PROMPTS[todayPromptIdx]}"</p>
              <button style={S.btnAccent} onClick={() => setTab('journal')}>Write in Journal →</button>
            </div>

            <div style={{ ...S.card, cursor: 'pointer' }} onClick={() => setTab('learn')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={S.cardTitle}>Your Program</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Continue Learning</div>
                  <div style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>{completedLessons.length}/{LESSONS.length} lessons complete</div>
                </div>
                <div style={{ fontSize: 28 }}>📖</div>
              </div>
              <div style={{ marginTop: 12, height: 6, background: COLORS.border, borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${(completedLessons.length/LESSONS.length)*100}%`, background: COLORS.primary, borderRadius: 3 }} />
              </div>
            </div>
          </div>
        )}

        {/* ── LEARN ── */}
        {tab === 'learn' && (
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: COLORS.primary, margin: '0 0 2px' }}>Your Program</h2>
            <p style={{ color: COLORS.textLight, fontSize: 14, marginBottom: 6 }}>ACT-based tools for living well with chronic conditions</p>
            <div style={{ height: 6, background: COLORS.border, borderRadius: 3, marginBottom: 18 }}>
              <div style={{ height: '100%', width: `${(completedLessons.length/LESSONS.length)*100}%`, background: COLORS.primary, borderRadius: 3, transition: 'width 0.5s ease' }} />
            </div>
            {LESSONS.map(lesson => {
              const done = completedLessons.includes(lesson.id);
              return (
                <div key={lesson.id} style={{ ...S.card, cursor: 'pointer' }} onClick={() => setActiveLesson(lesson.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, paddingRight: 8 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        <span style={S.tag()}>{lesson.category}</span>
                        {done && <span style={S.tag(COLORS.success, `${COLORS.success}18`)}>✓ Complete</span>}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{lesson.title}</div>
                      <div style={{ fontSize: 13, color: COLORS.textLight, lineHeight: 1.5 }}>{lesson.description}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 8 }}>⏱ {lesson.duration}</div>
                    </div>
                    <div style={{ fontSize: 22, color: done ? COLORS.success : COLORS.textMuted, flexShrink: 0 }}>{done ? '✓' : '›'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── BREATHE ── */}
        {tab === 'breathe' && (
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: COLORS.primary, margin: '0 0 2px' }}>Breathwork</h2>
            <p style={{ color: COLORS.textLight, fontSize: 14, marginBottom: 18 }}>Controlled breathing calms an overactive nervous system.</p>

            {!activeBreathing ? (
              BREATHING_PATTERNS.map((p, i) => (
                <div key={i} style={{ ...S.card, cursor: 'pointer' }} onClick={() => startBreathing(p)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${p.color}20`, border: `2px solid ${p.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: p.color, opacity: 0.7 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 3 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 5 }}>{p.description}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                        In {p.inhale}s {p.hold ? `· Hold ${p.hold}s ` : ''}· Out {p.exhale}s
                      </div>
                    </div>
                    <div style={{ color: COLORS.textMuted, fontSize: 20 }}>›</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', paddingTop: 10 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary, marginBottom: 2 }}>{activeBreathing.name}</div>
                <div style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 8 }}>
                  {breathPhase === 'done' ? 'Session complete' : `Round ${Math.min(breathCount + 1, 4)} of 4`}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 230, marginBottom: 20 }}>
                  <div style={{
                    width: breathSize, height: breathSize, borderRadius: '50%',
                    background: breathBgColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 ${breathSize * 0.4}px ${breathBgColor}55`,
                    transition: 'box-shadow 0.2s',
                  }}>
                    <span style={{ color: 'white', fontSize: 14, fontWeight: 600, textAlign: 'center', padding: '0 12px' }}>{breathLabel}</span>
                  </div>
                </div>

                {breathPhase === 'ready' && (
                  <button style={S.btn} onClick={() => setBreathPhase('inhale')}>Begin Session</button>
                )}
                {breathPhase === 'done' && (
                  <div>
                    <div style={{ fontSize: 15, color: COLORS.textLight, marginBottom: 12 }}>Four rounds complete. Well done.</div>
                    <button style={{ ...S.btn, background: COLORS.success }} onClick={() => setActiveBreathing(null)}>Finish</button>
                  </div>
                )}
                <button style={{ ...S.btnOutline, marginTop: 14 }} onClick={() => { cancelAnimationFrame(breathTimerRef.current); setActiveBreathing(null); }}>← Back</button>
              </div>
            )}
          </div>
        )}

        {/* ── JOURNAL ── */}
        {tab === 'journal' && (
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: COLORS.primary, margin: '0 0 2px' }}>Journal</h2>
            <p style={{ color: COLORS.textLight, fontSize: 14, marginBottom: 16 }}>Writing helps process what pain can't say out loud.</p>

            <div style={S.card}>
              <div style={S.cardTitle}>Today's Prompt</div>
              <p style={{ fontSize: 15, color: COLORS.text, fontStyle: 'italic', lineHeight: 1.65, margin: '0 0 14px' }}>"{JOURNAL_PROMPTS[todayPromptIdx]}"</p>
              <textarea style={S.textarea} placeholder="Write freely here — this is just for you..." value={journalText} onChange={e => setJournalText(e.target.value)} />
              <button style={{ ...S.btn, opacity: journalText.trim() ? 1 : 0.5 }} onClick={submitJournal}>Save Entry</button>
            </div>

            {journalEntries.length === 0 && (
              <div style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: 14, padding: '20px 0' }}>Your entries will appear here.</div>
            )}
            {journalEntries.map((entry, i) => (
              <div key={i} style={S.card}>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>
                  {new Date(entry.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ fontSize: 12, color: COLORS.accent, fontStyle: 'italic', marginBottom: 10, lineHeight: 1.5 }}>"{entry.prompt}"</div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: COLORS.text, margin: 0 }}>{entry.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── COMMUNITY ── */}
        {tab === 'community' && (
          <div style={{ paddingBottom: 100 }}>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: COLORS.primary, margin: '0 0 2px' }}>Community</h2>
            <p style={{ color: COLORS.textLight, fontSize: 14, marginBottom: 4 }}>Others who understand exactly what this is like.</p>
            <div style={{ ...S.tag(COLORS.textMuted, `${COLORS.textMuted}15`), marginBottom: 16, fontSize: 11 }}>🔒 This space is private and supportive</div>
            {communityMessages.map((msg) => (
              <div key={msg.id} style={{ ...S.card, display: 'flex', gap: 12 }}>
                <div style={S.avatar(msg.user)}>{msg.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: msg.isOwn ? COLORS.accent : COLORS.text }}>{msg.user}</span>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>{msg.time}</span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: COLORS.text, margin: '0 0 8px', wordBreak: 'break-word' }}>{msg.text}</p>
                  {!msg.isOwn && <div style={{ fontSize: 12, color: COLORS.textMuted }}>♥ {msg.likes}</div>}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
        )}

      </div>

      {/* COMMUNITY CHAT INPUT */}
      {tab === 'community' && (
        <div style={S.chatRow}>
          <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Share with the community..."
            style={{ flex: 1, borderRadius: 22, border: `1.5px solid ${COLORS.border}`, padding: '10px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif", background: COLORS.bg }} />
          <button onClick={sendMessage} style={{ background: COLORS.primary, color: 'white', border: 'none', borderRadius: 22, padding: '10px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Post</button>
        </div>
      )}

      {/* NAV BAR */}
      <div style={S.navBar}>
        {[['dashboard','🏠','Home'],['learn','📖','Learn'],['breathe','🌬️','Breathe'],['journal','✏️','Journal'],['community','💬','Community']].map(([id, icon, label]) => (
          <div key={id} style={S.navItem(tab === id)} onClick={() => { setTab(id); if (id !== 'breathe') setActiveBreathing(null); }}>
            <span style={{ fontSize: 19, marginBottom: 2 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === id ? 700 : 400 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
