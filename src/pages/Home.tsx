import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodEntry {
  date: string;
  mood: string;
  cycleDay: number;
}

const MOODS = ['Happy 😊', 'Energetic 🔥', 'Calm 🧘', 'Tired 😴', 'Anxious 😰', 'Motivated 💪'];

const MOOD_RECS: Record<string, string> = {
  'Happy 😊': 'Group fitness class — social energy is high!',
  'Energetic 🔥': 'HIIT workout — burn that energy with intensity!',
  'Calm 🧘': 'Yoga or Pilates — maintain your zen',
  'Tired 😴': 'Gentle stretching or walk — listen to your body',
  'Anxious 😰': 'Meditation + light cardio — release tension',
  'Motivated 💪': 'Strength training — push those limits!',
};

const PHASE_INFO: Record<string, { energy: string; bg: string; active: string }> = {
  Menstrual:  { energy: 'Rest & Recover',  bg: 'bg-peach/20',   active: 'border-peach' },
  Follicular: { energy: 'High Energy',     bg: 'bg-yellow/30',  active: 'border-yellow' },
  Ovulation:  { energy: 'Peak Energy',     bg: 'bg-orange/20',  active: 'border-orange' },
  Luteal:     { energy: 'Steady Energy',   bg: 'bg-sage/20',    active: 'border-sage' },
};

const Home: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState('Follicular');
  const [cycleDay, setCycleDay] = useState(1);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [stats, setStats] = useState({ workouts: 0, moves: 0, dances: 0 });

  useEffect(() => {
    const cycle = localStorage.getItem('femfit-cycle');
    if (cycle) {
      const data = JSON.parse(cycle);
      const diff = Math.floor((Date.now() - new Date(data.startDate).getTime()) / 86400000);
      const day = (diff % data.cycleLength) + 1;
      setCycleDay(day);
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
    setSelectedMood('');
  };

  const quickStats = [
    { label: 'Workouts', value: stats.workouts, color: 'from-peach to-orange' },
    { label: 'Comfort Moves', value: stats.moves, color: 'from-sage to-femfit-mint' },
    { label: 'Dances Learned', value: stats.dances, color: 'from-charcoal to-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-charcoal mb-1">Welcome to FemFit</h1>
        <p className="text-gray-500 text-sm mb-6">Track your cycle, stay active, connect with others</p>

        {/* Mood Check-in */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 border-t-4 border-sage">
          <h2 className="text-lg font-bold text-charcoal mb-4">How do you feel today?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {MOODS.map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`p-3 rounded-xl text-sm font-medium transition ${
                  selectedMood === mood
                    ? 'bg-sage text-white'
                    : 'bg-sage/10 text-charcoal hover:bg-sage/20'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
          {selectedMood && (
            <div className="mb-4 p-3 bg-cream rounded-xl text-sm text-charcoal flex items-center gap-2">
              <Zap size={16} className="text-peach flex-shrink-0" />
              {MOOD_RECS[selectedMood]}
            </div>
          )}
          <button
            onClick={handleMoodSubmit}
            disabled={!selectedMood}
            className="w-full bg-sage text-white py-2 rounded-xl font-bold text-sm disabled:opacity-40 hover:opacity-90 transition"
          >
            Log Mood
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {quickStats.map((s, i) => (
            <div key={i} className={`p-5 rounded-xl shadow text-white bg-gradient-to-br ${s.color}`}>
              <p className="text-xs opacity-80 mb-1 uppercase font-bold">{s.label}</p>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Cycle Phase */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-charcoal mb-4">Your Cycle at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(PHASE_INFO).map(([phase, info]) => (
              <div
                key={phase}
                className={`p-4 rounded-xl border-2 transition ${info.bg} ${
                  currentPhase === phase ? info.active + ' shadow' : 'border-transparent'
                }`}
              >
                <p className="font-bold text-sm text-charcoal">{phase}</p>
                <p className="text-xs text-gray-500 mt-0.5">{info.energy}</p>
                {currentPhase === phase && (
                  <p className="text-xs font-bold text-charcoal mt-1">Day {cycleDay} ←</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mood chart */}
        {moodHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-charcoal mb-4">Your Mood Trend</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={moodHistory.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="cycleDay" stroke="#8BA88F" strokeWidth={2} dot={{ fill: '#8BA88F' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
