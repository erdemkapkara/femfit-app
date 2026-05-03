import React, { useState, useEffect } from 'react';
import { Play, Heart, Clock, Music, Filter, Info, ChevronDown, ChevronUp, X } from 'lucide-react';
import TabBar from '../components/TabBar';
import PremiumLockCard from '../components/PremiumLockCard';
import { useMembership } from '../hooks/useMembership';

interface Workout {
  id: string;
  name: string;
  phase: string;
  type: string;
  difficulty: string;
  duration: number;
  description: string;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  benefits: string[];
  steps: string[];
  difficulty: string;
}

interface Dance {
  id: string;
  name: string;
  style: string;
  duration: number;
  difficulty: string;
  bpm: number;
  calories: number;
  description: string;
  moves: string[];
}

interface Favorites {
  workouts: string[];
  exercises: string[];
  dances: string[];
}

const PHASE_COLORS: Record<string, string> = {
  Menstrual: 'bg-peach/20 text-peach',
  Follicular: 'bg-yellow/30 text-yellow-700',
  Ovulation: 'bg-orange/20 text-orange-600',
  Luteal: 'bg-sage/20 text-sage',
};

const workoutList: Workout[] = [
  { id: '1',  name: 'Gentle Yoga Flow',      phase: 'Menstrual',  type: 'Yoga',     difficulty: 'Easy',   duration: 20, description: 'Restorative yoga to ease cramps' },
  { id: '2',  name: 'Yin Yoga',              phase: 'Menstrual',  type: 'Yoga',     difficulty: 'Easy',   duration: 30, description: 'Deep stretching and relaxation' },
  { id: '3',  name: 'Walking Meditation',    phase: 'Menstrual',  type: 'Cardio',   difficulty: 'Easy',   duration: 20, description: 'Gentle walking with mindfulness' },
  { id: '4',  name: 'HIIT Bootcamp',         phase: 'Follicular', type: 'Cardio',   difficulty: 'Hard',   duration: 30, description: 'High intensity interval training' },
  { id: '5',  name: 'Power Pilates',         phase: 'Follicular', type: 'Strength', difficulty: 'Medium', duration: 45, description: 'Build core strength' },
  { id: '6',  name: 'Dance Cardio',          phase: 'Follicular', type: 'Dance',    difficulty: 'Medium', duration: 30, description: 'Fun dance moves with cardio' },
  { id: '7',  name: 'Heavy Weight Training', phase: 'Ovulation',  type: 'Strength', difficulty: 'Hard',   duration: 60, description: 'Peak strength phase, lift heavy' },
  { id: '8',  name: 'Circuit Training',      phase: 'Ovulation',  type: 'Strength', difficulty: 'Hard',   duration: 45, description: 'Full body circuits with intensity' },
  { id: '9',  name: 'Running Interval',      phase: 'Ovulation',  type: 'Cardio',   difficulty: 'Hard',   duration: 30, description: 'Speed and endurance running' },
  { id: '10', name: 'Strength & Balance',    phase: 'Luteal',     type: 'Strength', difficulty: 'Medium', duration: 40, description: 'Steady strength work' },
  { id: '11', name: 'Pilates Core',          phase: 'Luteal',     type: 'Strength', difficulty: 'Medium', duration: 35, description: 'Controlled core engagement' },
  { id: '12', name: 'Yoga Flow',             phase: 'Luteal',     type: 'Yoga',     difficulty: 'Medium', duration: 45, description: 'Balanced yoga practice' },
];

const exerciseList: Exercise[] = [
  { id: '1', name: "Child's Pose",        description: 'Gentle stretch for back and hips', duration: 5,  difficulty: 'Easy',   benefits: ['Relieves tension', 'Calms nervous system', 'Stretches hips'], steps: ['Kneel on the floor', 'Bring big toes together, knees wide', 'Fold forward, extending arms', 'Rest forehead on mat', 'Breathe deeply for 5 breaths'] },
  { id: '2', name: 'Cat-Cow Stretch',     description: 'Mobilize spine and relieve cramping', duration: 10, difficulty: 'Easy', benefits: ['Eases cramps', 'Mobilizes spine', 'Improves circulation'], steps: ['Get on hands and knees', 'Inhale, drop belly (Cow)', 'Exhale, round back (Cat)', 'Flow between positions', 'Repeat 10-12 times'] },
  { id: '3', name: 'Hip Circles',         description: 'Release tension in hips and lower back', duration: 8, difficulty: 'Easy', benefits: ['Releases hip tension', 'Improves mobility', 'Eases lower back pain'], steps: ['Stand with hands on hips', 'Make large slow circles with hips', 'Go clockwise 10 times', 'Switch to counter-clockwise', 'Complete 10 circles'] },
  { id: '4', name: 'Supported Pigeon',    description: 'Deep hip opening for pain relief', duration: 8, difficulty: 'Medium', benefits: ['Deep hip stretch', 'Relieves cramping', 'Reduces pain'], steps: ['Sit on floor, one leg bent in front', 'Other leg extended behind', 'Fold forward gently', 'Use hands for support', 'Hold 30 seconds each side'] },
  { id: '5', name: 'Downward Dog',        description: 'Full body stretch and inversion', duration: 10, difficulty: 'Medium', benefits: ['Stretches full body', 'Increases blood flow', 'Calms mind'], steps: ['Start on hands and knees', 'Lift hips up and back', 'Form an inverted V', 'Hands shoulder-width apart', 'Hold for 5-10 breaths'] },
  { id: '6', name: 'Supine Twist',        description: 'Gentle spinal twist for relief', duration: 5, difficulty: 'Easy',   benefits: ['Relieves tension', 'Aids digestion', 'Calms nervous system'], steps: ['Lie on your back', 'Bring one knee to chest', 'Cross over body', 'Keep shoulders grounded', 'Breathe 30 seconds each side'] },
  { id: '7', name: 'Heat Pad Savasana',   description: 'Relaxation with heat therapy', duration: 15, difficulty: 'Easy',   benefits: ['Relieves cramping', 'Deep relaxation', 'Reduces pain'], steps: ['Lie down on back', 'Place heat pad on lower belly', 'Close your eyes', 'Focus on breathing', 'Rest for 10-15 minutes'] },
  { id: '8', name: 'Legs Up The Wall',    description: 'Restorative inversion pose', duration: 12, difficulty: 'Easy',   benefits: ['Reduces bloating', 'Improves circulation', 'Promotes relaxation'], steps: ['Sit with side against wall', 'Swing legs up wall', 'Lie back with arms out', 'Stay for 10-15 minutes', 'Breathe naturally'] },
];

const danceList: Dance[] = [
  { id: '1', name: 'Zumba Beginner Mix',      style: 'Zumba',    duration: 30, difficulty: 'Beginner',     bpm: 120, calories: 150, description: 'Fun Latin rhythms perfect for beginners',          moves: ['Basic step', 'Hip motion', 'Side-to-side sway', 'Arm waves'] },
  { id: '2', name: 'Zumba Intermediate',      style: 'Zumba',    duration: 45, difficulty: 'Intermediate', bpm: 130, calories: 250, description: 'More complex footwork and rhythm patterns',         moves: ['Cumbia', 'Merengue', 'Reggaeton', 'Salsa basics'] },
  { id: '3', name: 'Oriental Belly Basics',   style: 'Oriental', duration: 25, difficulty: 'Beginner',     bpm: 100, calories: 120, description: 'Graceful belly dance movements for all levels',     moves: ['Hip circles', 'Figure-8 movement', 'Shimmy', 'Arm waves'] },
  { id: '4', name: 'Oriental Fusion',         style: 'Oriental', duration: 40, difficulty: 'Intermediate', bpm: 110, calories: 200, description: 'Modern fusion of traditional belly dance',          moves: ['Advanced isolations', 'Spins', 'Floor work', 'Combinations'] },
  { id: '5', name: 'Dance Cardio Blast',      style: 'Modern',   duration: 30, difficulty: 'Intermediate', bpm: 140, calories: 280, description: 'High-energy dance cardio workout',                 moves: ['High knees', 'Grapevines', 'Turns', 'Jumps'] },
  { id: '6', name: 'Slow Grooving Flow',      style: 'Modern',   duration: 35, difficulty: 'Beginner',     bpm: 95,  calories: 140, description: 'Easy groovy movements to hip-hop beats',           moves: ['Groove sway', 'Step touches', 'Body rolls', 'Shoulder pops'] },
  { id: '7', name: 'K-Pop Dance Tutorial',    style: 'K-Pop',    duration: 20, difficulty: 'Intermediate', bpm: 125, calories: 180, description: 'Learn trending K-pop choreography',               moves: ['Pop', 'Lock', 'Hitting', 'Groove'] },
  { id: '8', name: 'Hip Hop Essentials',      style: 'Hip Hop',  duration: 40, difficulty: 'Intermediate', bpm: 100, calories: 220, description: 'Classic hip hop moves and freestyle basics',       moves: ['Popping', 'Locking', 'Body isolations', 'Freestyle'] },
];

const Active: React.FC = () => {
  const { tier, isPremium } = useMembership();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Follicular');

  // Workout states
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [startedWorkouts, setStartedWorkouts] = useState<string[]>([]);

  // Exercise states
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedMoves, setCompletedMoves] = useState<string[]>([]);

  // Dance states
  const [selectedDance, setSelectedDance] = useState<Dance | null>(null);
  const [completedDances, setCompletedDances] = useState<string[]>([]);
  const [filterStyle, setFilterStyle] = useState('All');
  const [copyrightOpen, setCopyrightOpen] = useState(false);
  const [musicUrls, setMusicUrls] = useState<Record<string, string>>({});
  const [musicInput, setMusicInput] = useState('');

  // Favorites
  const [favorites, setFavorites] = useState<Favorites>({ workouts: [], exercises: [], dances: [] });
  const [showCollections, setShowCollections] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('femfit-cycle');
    if (saved) {
      const data = JSON.parse(saved);
      const start = new Date(data.startDate);
      const today = new Date();
      const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const day = (diff % data.cycleLength) + 1;
      if (day <= data.period) setCurrentPhase('Menstrual');
      else if (day <= data.period + 8) setCurrentPhase('Follicular');
      else if (day <= data.period + 13) setCurrentPhase('Ovulation');
      else setCurrentPhase('Luteal');
    }
    const started = localStorage.getItem('femfit-startedWorkouts');
    if (started) setStartedWorkouts(JSON.parse(started));
    const completed = localStorage.getItem('femfit-completedMoves');
    if (completed) setCompletedMoves(JSON.parse(completed));
    const compDances = localStorage.getItem('femfit-completedDances');
    if (compDances) setCompletedDances(JSON.parse(compDances));
    const favs = localStorage.getItem('femfit-favorites');
    if (favs) setFavorites(JSON.parse(favs));
    const urls = localStorage.getItem('femfit-dance-playlists');
    if (urls) setMusicUrls(JSON.parse(urls));
  }, []);

  // Freemium: only first workout per phase is free
  const isWorkoutLocked = (workout: Workout): boolean => {
    if (tier === 'elite' || tier === 'premium') return false;
    const phaseGroup = workoutList.filter(w => w.phase === workout.phase);
    return phaseGroup.indexOf(workout) > 0;
  };

  const isExerciseLocked = (exercise: Exercise): boolean => {
    if (tier === 'elite' || tier === 'premium') return false;
    return exercise.difficulty !== 'Easy';
  };

  const isDanceLocked = (dance: Dance): boolean => {
    if (tier === 'elite' || tier === 'premium') return false;
    return dance.difficulty !== 'Beginner';
  };

  const toggleFavorite = (type: keyof Favorites, id: string) => {
    const updated = { ...favorites };
    if (updated[type].includes(id)) {
      updated[type] = updated[type].filter(x => x !== id);
    } else {
      updated[type] = [...updated[type], id];
    }
    setFavorites(updated);
    localStorage.setItem('femfit-favorites', JSON.stringify(updated));
  };

  const handleStartWorkout = (workoutId: string) => {
    const updated = startedWorkouts.includes(workoutId)
      ? startedWorkouts.filter(id => id !== workoutId)
      : [...startedWorkouts, workoutId];
    setStartedWorkouts(updated);
    localStorage.setItem('femfit-startedWorkouts', JSON.stringify(updated));

    // Link to challenge progress
    if (!startedWorkouts.includes(workoutId)) {
      const cd: Record<string, { joined: boolean; progress: number }> =
        JSON.parse(localStorage.getItem('femfit-challenges') || '{}');
      const workout = workoutList.find(w => w.id === workoutId);
      if (cd['1']?.joined && workout?.type === 'Yoga')
        cd['1'] = { ...cd['1'], progress: (cd['1'].progress || 0) + 1 };
      if (cd['3']?.joined)
        cd['3'] = { ...cd['3'], progress: (cd['3'].progress || 0) + 1 };
      localStorage.setItem('femfit-challenges', JSON.stringify(cd));
    }
  };

  const handleCompleteMoves = (exerciseId: string) => {
    const updated = completedMoves.includes(exerciseId)
      ? completedMoves.filter(id => id !== exerciseId)
      : [...completedMoves, exerciseId];
    setCompletedMoves(updated);
    localStorage.setItem('femfit-completedMoves', JSON.stringify(updated));
  };

  const handleCompleteDance = (danceId: string) => {
    const updated = completedDances.includes(danceId)
      ? completedDances.filter(id => id !== danceId)
      : [...completedDances, danceId];
    setCompletedDances(updated);
    localStorage.setItem('femfit-completedDances', JSON.stringify(updated));

    if (!completedDances.includes(danceId)) {
      const cd: Record<string, { joined: boolean; progress: number }> =
        JSON.parse(localStorage.getItem('femfit-challenges') || '{}');
      if (cd['2']?.joined) cd['2'] = { ...cd['2'], progress: (cd['2'].progress || 0) + 1 };
      if (cd['3']?.joined) cd['3'] = { ...cd['3'], progress: (cd['3'].progress || 0) + 1 };
      localStorage.setItem('femfit-challenges', JSON.stringify(cd));
    }
  };

  const saveMusicUrl = (danceId: string) => {
    if (!musicInput.trim()) return;
    const updated = { ...musicUrls, [danceId]: musicInput.trim() };
    setMusicUrls(updated);
    localStorage.setItem('femfit-dance-playlists', JSON.stringify(updated));
    setMusicInput('');
  };

  const filteredWorkouts = workoutList.filter(w => {
    if (selectedPhase !== 'All' && w.phase !== selectedPhase) return false;
    if (selectedType !== 'All' && w.type !== selectedType) return false;
    if (selectedDifficulty !== 'All' && w.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const filteredDances = filterStyle === 'All' ? danceList : danceList.filter(d => d.style === filterStyle);
  const danceStyles = ['All', ...Array.from(new Set(danceList.map(d => d.style)))];

  const hasFavorites =
    favorites.workouts.length + favorites.exercises.length + favorites.dances.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-charcoal mb-1">Active</h1>
        <p className="text-gray-500 text-sm mb-5">
          Current phase: <span className="font-bold text-sage">{currentPhase}</span>
        </p>

        {/* Favorites Strip */}
        {hasFavorites && (
          <div className="bg-white rounded-xl shadow p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-charcoal">My Favorites</p>
              <button
                onClick={() => setShowCollections(!showCollections)}
                className="text-xs text-sage font-medium"
              >
                My Collections
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {favorites.workouts.map(id => {
                const w = workoutList.find(x => x.id === id);
                if (!w) return null;
                return (
                  <div
                    key={id}
                    onClick={() => setActiveTab(0)}
                    className="flex-shrink-0 bg-sage/10 border border-sage/30 rounded-lg px-3 py-2 cursor-pointer hover:bg-sage/20 transition"
                  >
                    <p className="text-xs font-bold text-charcoal whitespace-nowrap">{w.name}</p>
                    <p className="text-xs text-gray-400">{w.duration}m · Workout</p>
                  </div>
                );
              })}
              {favorites.exercises.map(id => {
                const e = exerciseList.find(x => x.id === id);
                if (!e) return null;
                return (
                  <div
                    key={id}
                    onClick={() => setActiveTab(1)}
                    className="flex-shrink-0 bg-peach/10 border border-peach/30 rounded-lg px-3 py-2 cursor-pointer hover:bg-peach/20 transition"
                  >
                    <p className="text-xs font-bold text-charcoal whitespace-nowrap">{e.name}</p>
                    <p className="text-xs text-gray-400">{e.duration}m · Exercise</p>
                  </div>
                );
              })}
              {favorites.dances.map(id => {
                const d = danceList.find(x => x.id === id);
                if (!d) return null;
                return (
                  <div
                    key={id}
                    onClick={() => setActiveTab(2)}
                    className="flex-shrink-0 bg-orange/10 border border-orange/30 rounded-lg px-3 py-2 cursor-pointer hover:bg-orange/20 transition"
                  >
                    <p className="text-xs font-bold text-charcoal whitespace-nowrap">{d.name}</p>
                    <p className="text-xs text-gray-400">{d.duration}m · Dance</p>
                  </div>
                );
              })}
            </div>

            {showCollections && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
                Collections coming soon — for now, all favorites are saved above.
              </div>
            )}
          </div>
        )}

        <TabBar
          tabs={['Workouts', 'Comfort Moves', 'Dance Library']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* WORKOUTS TAB */}
        {activeTab === 0 && (
          <div>
            {/* Filter bar */}
            <div className="bg-white rounded-xl shadow p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-sage" />
                <span className="text-sm font-bold text-charcoal">Filter</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'Phase', value: selectedPhase, set: setSelectedPhase, opts: ['All','Menstrual','Follicular','Ovulation','Luteal'] },
                  { label: 'Type',  value: selectedType,  set: setSelectedType,  opts: ['All','Yoga','Cardio','Strength','Dance'] },
                  { label: 'Level', value: selectedDifficulty, set: setSelectedDifficulty, opts: ['All','Easy','Medium','Hard'] },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                    <select
                      value={f.value}
                      onChange={e => f.set(e.target.value)}
                      className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                    >
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredWorkouts.map((workout) => {
                const locked = isWorkoutLocked(workout);
                const started = startedWorkouts.includes(workout.id);
                const faved = favorites.workouts.includes(workout.id);
                return (
                  <div key={workout.id} className="bg-white rounded-xl shadow overflow-hidden relative">
                    <div className={`px-4 py-2 flex items-center justify-between ${PHASE_COLORS[workout.phase] || 'bg-gray-100'}`}>
                      <span className="text-xs font-bold">{workout.phase}</span>
                      <button
                        onClick={() => toggleFavorite('workouts', workout.id)}
                        className="transition"
                      >
                        <Heart
                          size={16}
                          className={faved ? 'text-coral' : 'text-gray-400'}
                          fill={faved ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                    <div className="p-4 relative">
                      <h3 className="text-base font-bold text-charcoal mb-1">{workout.name}</h3>
                      <p className="text-xs text-gray-500 mb-3">{workout.description}</p>
                      <div className="flex gap-3 text-xs text-gray-400 mb-4">
                        <span>{workout.type}</span>
                        <span>·</span>
                        <span>{workout.difficulty}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><Clock size={11} />{workout.duration}m</span>
                      </div>

                      {locked ? (
                        <div className="relative" style={{ height: 80 }}>
                          <PremiumLockCard tier="premium" style="teaser" workoutName={workout.name} />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartWorkout(workout.id)}
                          className={`w-full py-2 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
                            started ? 'bg-sage text-white' : 'bg-sage/10 text-sage hover:bg-sage/20'
                          }`}
                        >
                          <Play size={14} />
                          {started ? 'In Progress' : 'Start'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COMFORT MOVES TAB */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {exerciseList.map((exercise) => {
                const locked = isExerciseLocked(exercise);
                const completed = completedMoves.includes(exercise.id);
                const faved = favorites.exercises.includes(exercise.id);
                return (
                  <div
                    key={exercise.id}
                    onClick={() => setSelectedExercise(exercise)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                      selectedExercise?.id === exercise.id
                        ? 'border-sage bg-sage/5'
                        : 'border-gray-100 bg-white hover:border-sage/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-charcoal mb-0.5">{exercise.name}</h3>
                        <p className="text-xs text-gray-500 mb-1">{exercise.description}</p>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} />{exercise.duration} min · {exercise.difficulty}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1 ml-3">
                        <button
                          onClick={e => { e.stopPropagation(); toggleFavorite('exercises', exercise.id); }}
                        >
                          <Heart size={16} className={faved ? 'text-coral' : 'text-gray-300'} fill={faved ? 'currentColor' : 'none'} />
                        </button>
                        {!locked && (
                          <button
                            onClick={e => { e.stopPropagation(); handleCompleteMoves(exercise.id); }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition ${
                              completed ? 'bg-sage text-white' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            ✓
                          </button>
                        )}
                        {locked && <span className="text-base">🔒</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              {selectedExercise ? (
                <div className="bg-white rounded-xl shadow p-6 sticky top-20">
                  <h2 className="text-xl font-bold text-charcoal mb-1">{selectedExercise.name}</h2>
                  <p className="text-sm text-gray-500 mb-4">{selectedExercise.description}</p>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-charcoal uppercase mb-2">Benefits</p>
                    <ul className="space-y-1">
                      {selectedExercise.benefits.map((b, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-sage">•</span>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-charcoal uppercase mb-2">Steps</p>
                    <ol className="space-y-1">
                      {selectedExercise.steps.map((s, i) => (
                        <li key={i} className="text-sm text-gray-600"><span className="font-bold text-sage">{i+1}.</span> {s}</li>
                      ))}
                    </ol>
                  </div>
                  {isExerciseLocked(selectedExercise) ? (
                    <PremiumLockCard tier="premium" style="banner" />
                  ) : (
                    <button
                      onClick={() => handleCompleteMoves(selectedExercise.id)}
                      className={`w-full py-2 rounded-lg font-bold text-sm transition ${
                        completedMoves.includes(selectedExercise.id)
                          ? 'bg-sage text-white'
                          : 'bg-sage/10 text-sage hover:bg-sage/20'
                      }`}
                    >
                      {completedMoves.includes(selectedExercise.id) ? 'Completed ✓' : 'Mark Complete'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
                  <Heart size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Select an exercise to see details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DANCE LIBRARY TAB */}
        {activeTab === 2 && (
          <div>
            {/* Copyright notice */}
            <div className="bg-cream border border-yellow rounded-xl mb-5">
              <button
                onClick={() => setCopyrightOpen(!copyrightOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-charcoal"
              >
                <span className="flex items-center gap-2"><Info size={16} className="text-yellow-600" />Copyright Notice</span>
                {copyrightOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {copyrightOpen && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed">
                  FemFit does not host or stream music. Dance routines are movement descriptions only.
                  For music-synced workouts, connect your own Spotify or YouTube Music playlist (Premium feature).
                  Users provide their own licensed playlist URLs — FemFit stores only the link.
                </div>
              )}
            </div>

            {/* Style filters */}
            <div className="flex flex-wrap gap-2 mb-5">
              {danceStyles.map(style => (
                <button
                  key={style}
                  onClick={() => setFilterStyle(style)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterStyle === style
                      ? 'bg-sage text-white'
                      : 'bg-white text-charcoal border border-sage/30 hover:border-sage'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {filteredDances.map((dance) => {
                  const faved = favorites.dances.includes(dance.id);
                  return (
                    <div
                      key={dance.id}
                      onClick={() => setSelectedDance(dance)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                        selectedDance?.id === dance.id
                          ? 'border-sage bg-sage/5'
                          : 'border-gray-100 bg-white hover:border-sage/40'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Music size={15} className="text-sage" />
                            <h3 className="font-bold text-charcoal text-sm">{dance.name}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{dance.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                            <span className="flex items-center gap-0.5"><Clock size={11} />{dance.duration}m</span>
                            <span>{dance.calories} cal</span>
                            <span className={`px-2 py-0.5 rounded font-medium ${
                              dance.difficulty === 'Beginner' ? 'bg-sage/10 text-sage' : 'bg-peach/20 text-peach'
                            }`}>{dance.difficulty}</span>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); toggleFavorite('dances', dance.id); }}
                          className="ml-2"
                        >
                          <Heart size={18} className={faved ? 'text-coral' : 'text-gray-300'} fill={faved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                {selectedDance ? (
                  <div className="bg-white rounded-xl shadow p-6 sticky top-20">
                    <div className="mb-4 p-3 bg-charcoal text-white rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-70">BPM</p>
                        <p className="text-2xl font-bold">{selectedDance.bpm}</p>
                      </div>
                      <Music size={24} className="opacity-50" />
                    </div>

                    <h2 className="text-lg font-bold text-charcoal mb-3">{selectedDance.name}</h2>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-gray-400">Duration</p>
                        <p className="font-bold text-charcoal">{selectedDance.duration} min</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-gray-400">Calories</p>
                        <p className="font-bold text-charcoal">{selectedDance.calories} cal</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-bold text-charcoal uppercase mb-2">Key Moves</p>
                      <ul className="space-y-1">
                        {selectedDance.moves.map((move, i) => (
                          <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-sage">✓</span>{move}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Music playlist */}
                    {isPremium ? (
                      <div className="mb-4">
                        <p className="text-xs font-bold text-charcoal uppercase mb-2">Your Playlist</p>
                        {musicUrls[selectedDance.id] ? (
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                            <Music size={16} className="text-sage flex-shrink-0" />
                            <a
                              href={musicUrls[selectedDance.id]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-sage underline flex-1 truncate"
                            >
                              {musicUrls[selectedDance.id]}
                            </a>
                            <button onClick={() => {
                              const u = { ...musicUrls };
                              delete u[selectedDance.id];
                              setMusicUrls(u);
                              localStorage.setItem('femfit-dance-playlists', JSON.stringify(u));
                            }}>
                              <X size={14} className="text-gray-400" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="Paste Spotify or YT URL…"
                              value={musicInput}
                              onChange={e => setMusicInput(e.target.value)}
                              className="flex-1 border border-sage/30 rounded-lg px-2 py-1.5 text-xs focus:border-sage outline-none"
                            />
                            <button
                              onClick={() => saveMusicUrl(selectedDance.id)}
                              className="bg-sage text-white px-3 rounded-lg text-xs font-bold"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4 p-3 bg-cream rounded-lg text-xs text-gray-500 text-center">
                        <Music size={16} className="mx-auto mb-1 text-sage" />
                        <span className="font-bold text-charcoal">Premium:</span> Sync your playlist with any dance routine
                      </div>
                    )}

                    {isDanceLocked(selectedDance) ? (
                      <div className="relative" style={{ height: 90 }}>
                        <PremiumLockCard tier="premium" style="teaser" workoutName={selectedDance.name} />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteDance(selectedDance.id)}
                        className={`w-full py-2 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
                          completedDances.includes(selectedDance.id)
                            ? 'bg-sage text-white'
                            : 'bg-sage/10 text-sage hover:bg-sage/20'
                        }`}
                      >
                        <Play size={14} />
                        {completedDances.includes(selectedDance.id) ? 'Completed' : 'Start Dancing'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
                    <Music size={40} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Select a dance to see details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Active;
