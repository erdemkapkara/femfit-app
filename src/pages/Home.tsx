import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodEntry { date: string; mood: string; cycleDay: number; }

const MOODS = ['Happy 😊', 'Energetic 🔥', 'Calm 🧘', 'Tired 😴', 'Anxious 😰', 'Motivated 💪'];

const MOOD_RECS: Record<string, string> = {
  'Happy 😊':     'Group fitness class — social energy is high!',
  'Energetic 🔥': 'HIIT workout — burn that energy!',
  'Calm 🧘':      'Yoga or Pilates — maintain your zen',
  'Tired 😴':     'Gentle stretching or walk — listen to your body',
  'Anxious 😰':   'Meditation + light cardio — release tension',
  'Motivated 💪': 'Strength training — push those limits!',
};

const PHASE_INFO: Record<string, { energy: string; bg: string; border: string; dot: string }> = {
  Menstrual:  { energy: 'Rest & Recover', bg: 'bg-peach/20',  border: 'border-peach',  dot: 'bg-peach' },
  Follicular: { energy: 'High Energy',    bg: 'bg-yellow/30', border: 'border-yellow', dot: 'bg-yellow' },
  Ovulation:  { energy: 'Peak Energy',    bg: 'bg-orange/20', border: 'border-orange', dot: 'bg-orange' },
  Luteal:     { energy: 'Steady Energy',  bg: 'bg-sage/20',   border: 'border-sage',   dot: 'bg-sage' },
};

const Home: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState('Follicular');
  const [cycleDay, setCycleDay] = useState(1);
  const [cycleLength, setCycleLength] = useState(28);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [stats, setStats] = useState({ workouts: 0, moves: 0, dances: 0 });
  const [moodLogged, setMoodLogged] = useState(false);

  useEffect(() => {
    const cycle = localStorage.getItem('femfit-cycle');
    if (cycle) {
      const data = JSON.parse(cycle);
      const diff = Math.floor((Date.now() - new Date(data.startDate).getTime()) / 86400000);
      const day = (diff % data.cycleLength) + 1;
      setCycleDay(day);
      setCycleLength(data.cycleLength);
      if (day <= data.period) setCurrentPhase('Menstrual');
      else if (day <= data.period + 8) setCurrentPhase('Follicular');
      else if (day <= data.period + 13) setCurrentPhase('Ovulation');
      else setCurrentPhase('Luteal');
    }
    const mood = localStorage.getItem('femfit-moodHistory');
    if (mood) setMoodHistory(JSON.parse(mood));
    setStats({
      workouts: (() => { const s = localStorage.getItem('femfit-startedWorkouts'); return s ? JSON.parse(s).length : 0; })(),
      moves:    (() => { const s = localStorage.getItem('femfit-completedMoves');  return s ? JSON.parse(s).length : 0; })(),
      dances:   (() => { const s = localStorage.getItem('femfit-completedDances'); return s ? JSON.parse(s).length : 0; })(),
    });
  }, []);

  const handleMoodSubmit = () => {
    if (!selectedMood) return;
    const entry: MoodEntry = { date: new Date().toLocaleDateString(), mood: selectedMood, cycleDay };
    const updated = [...moodHistory, entry];
    setMoodHistory(updated);
    localStorage.setItem('femfit-moodHistory', JSON.stringify(updated));
    setMoodLogged(true);
    setTimeout(() => { setMoodLogged(false); setSelectedMood(''); }, 1500);
  };

  const phase = PHASE_INFO[currentPhase];
  const progressPct = Math.round((cycleDay / cycleLength) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen">

      {/* Hero Header */}
      <div className={`${phase.bg} px-4 pt-5 pb-6 sm:px-6`}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Today</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-3">Welcome to FemFit</h1>

          {/* Phase pill */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${phase.border} bg-white/60`}>
            <span className={`w-2.5 h-2.5 rounded-full ${phase.dot}`} />
            <span className="text-sm font-bold text-charcoal">Day {cycleDay} · {currentPhase} Phase</span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 bg-white/50 rounded-full h-1.5 max-w-xs">
            <div className={`h-1.5 rounded-full ${phase.dot} transition-all`} style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{cycleLength - cycleDay} days left in cycle</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Workouts', value: stats.workouts, color: 'from-peach to-orange', icon: '💪' },
            { label: 'Moves',    value: stats.moves,    color: 'from-sage to-femfit-mint', icon: '🧘' },
            { label: 'Dances',   value: stats.dances,   color: 'from-charcoal to-gray-600', icon: '💃' },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-3 sm:p-4 text-white shadow-sm`}>
              <p className="text-lg sm:text-2xl mb-0.5">{s.icon}</p>
              <p className="text-xl sm:text-3xl font-bold leading-none">{s.value}</p>
              <p className="text-[10px] sm:text-xs opacity-80 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mood Check-in */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
          <h2 className="text-base font-bold text-charcoal mb-3 flex items-center gap-2">
            <Zap size={18} className="text-peach" />
            How do you feel today?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {MOODS.map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                  selectedMood === mood
                    ? 'bg-sage text-white shadow-sm scale-105'
                    : 'bg-gray-50 text-charcoal hover:bg-sage/10 border border-gray-100'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>

          {selectedMood && !moodLogged && (
            <div className="mb-3 p-3 bg-cream rounded-xl text-sm text-charcoal flex items-start gap-2">
              <Zap size={15} className="text-peach mt-0.5 flex-shrink-0" />
              <span>{MOOD_RECS[selectedMood]}</span>
            </div>
          )}

          {moodLogged ? (
            <div className="w-full bg-sage/10 text-sage py-2.5 rounded-xl font-bold text-sm text-center">
              ✓ Mood logged!
            </div>
          ) : (
            <button
              onClick={handleMoodSubmit}
              disabled={!selectedMood}
              className="w-full bg-sage text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 active:scale-98 transition-all"
            >
              Log Mood
            </button>
          )}
        </div>

        {/* Cycle Phases */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
          <h2 className="text-base font-bold text-charcoal mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-sage" />
            Cycle at a Glance
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PHASE_INFO).map(([phase, info]) => (
              <div
                key={phase}
                className={`p-3 rounded-xl border-2 transition-all ${info.bg} ${
                  currentPhase === phase ? `${info.border} shadow-sm` : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${info.dot}`} />
                  <p className="font-bold text-sm text-charcoal">{phase}</p>
                </div>
                <p className="text-xs text-gray-500">{info.energy}</p>
                {currentPhase === phase && (
                  <p className="text-xs font-bold text-charcoal mt-1">← Day {cycleDay}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mood Chart */}
        {moodHistory.length > 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
            <h2 className="text-base font-bold text-charcoal mb-3">Mood Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={moodHistory.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="cycleDay" stroke="#8BA88F" strokeWidth={2.5} dot={{ fill: '#8BA88F', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
