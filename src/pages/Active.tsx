import React, { useState, useEffect, useRef } from 'react';
import { Play, Heart, Clock, Music, Filter, Info, ChevronDown, ChevronUp, X, ArrowLeft } from 'lucide-react';
import TabBar from '../components/TabBar';
import PremiumLockCard from '../components/PremiumLockCard';
import { useMembership } from '../hooks/useMembership';

interface Workout { id: string; name: string; phase: string; type: string; difficulty: string; duration: number; description: string; }
interface Exercise { id: string; name: string; description: string; duration: number; benefits: string[]; steps: string[]; difficulty: string; }
interface Dance { id: string; name: string; style: string; duration: number; difficulty: string; bpm: number; calories: number; description: string; moves: string[]; }
interface Favorites { workouts: string[]; exercises: string[]; dances: string[]; }

const PHASE_BADGE: Record<string, string> = {
  Menstrual: 'bg-peach/20 text-peach', Follicular: 'bg-yellow/30 text-yellow-700',
  Ovulation: 'bg-orange/20 text-orange-600', Luteal: 'bg-sage/20 text-sage',
};

const workoutList: Workout[] = [
  { id:'1',  name:'Gentle Yoga Flow',      phase:'Menstrual',  type:'Yoga',     difficulty:'Easy',   duration:20, description:'Restorative yoga to ease cramps' },
  { id:'2',  name:'Yin Yoga',              phase:'Menstrual',  type:'Yoga',     difficulty:'Easy',   duration:30, description:'Deep stretching and relaxation' },
  { id:'3',  name:'Walking Meditation',    phase:'Menstrual',  type:'Cardio',   difficulty:'Easy',   duration:20, description:'Gentle walking with mindfulness' },
  { id:'4',  name:'HIIT Bootcamp',         phase:'Follicular', type:'Cardio',   difficulty:'Hard',   duration:30, description:'High intensity interval training' },
  { id:'5',  name:'Power Pilates',         phase:'Follicular', type:'Strength', difficulty:'Medium', duration:45, description:'Build core strength' },
  { id:'6',  name:'Dance Cardio',          phase:'Follicular', type:'Dance',    difficulty:'Medium', duration:30, description:'Fun dance moves with cardio' },
  { id:'7',  name:'Heavy Weight Training', phase:'Ovulation',  type:'Strength', difficulty:'Hard',   duration:60, description:'Peak strength phase, lift heavy' },
  { id:'8',  name:'Circuit Training',      phase:'Ovulation',  type:'Strength', difficulty:'Hard',   duration:45, description:'Full body circuits with intensity' },
  { id:'9',  name:'Running Interval',      phase:'Ovulation',  type:'Cardio',   difficulty:'Hard',   duration:30, description:'Speed and endurance running' },
  { id:'10', name:'Strength & Balance',    phase:'Luteal',     type:'Strength', difficulty:'Medium', duration:40, description:'Steady strength work' },
  { id:'11', name:'Pilates Core',          phase:'Luteal',     type:'Strength', difficulty:'Medium', duration:35, description:'Controlled core engagement' },
  { id:'12', name:'Yoga Flow',             phase:'Luteal',     type:'Yoga',     difficulty:'Medium', duration:45, description:'Balanced yoga practice' },
];

const exerciseList: Exercise[] = [
  { id:'1', name:"Child's Pose",     description:'Gentle stretch for back and hips',     duration:5,  difficulty:'Easy',   benefits:['Relieves tension','Calms nervous system','Stretches hips'],    steps:['Kneel on the floor','Bring big toes together, knees wide','Fold forward, extending arms','Rest forehead on mat','Breathe deeply for 5 breaths'] },
  { id:'2', name:'Cat-Cow Stretch',  description:'Mobilize spine and relieve cramping',  duration:10, difficulty:'Easy',   benefits:['Eases cramps','Mobilizes spine','Improves circulation'],        steps:['Get on hands and knees','Inhale, drop belly (Cow)','Exhale, round back (Cat)','Flow between positions','Repeat 10-12 times'] },
  { id:'3', name:'Hip Circles',      description:'Release tension in hips and lower back',duration:8,  difficulty:'Easy',   benefits:['Releases hip tension','Improves mobility','Eases lower back pain'],steps:['Stand with hands on hips','Make large slow circles with hips','Go clockwise 10 times','Switch to counter-clockwise','Complete 10 circles'] },
  { id:'4', name:'Supported Pigeon', description:'Deep hip opening for pain relief',     duration:8,  difficulty:'Medium', benefits:['Deep hip stretch','Relieves cramping','Reduces pain'],           steps:['Sit on floor, one leg bent in front','Other leg extended behind','Fold forward gently','Use hands for support','Hold 30 seconds each side'] },
  { id:'5', name:'Downward Dog',     description:'Full body stretch and inversion',       duration:10, difficulty:'Medium', benefits:['Stretches full body','Increases blood flow','Calms mind'],        steps:['Start on hands and knees','Lift hips up and back','Form an inverted V','Hands shoulder-width apart','Hold for 5-10 breaths'] },
  { id:'6', name:'Supine Twist',     description:'Gentle spinal twist for relief',        duration:5,  difficulty:'Easy',   benefits:['Relieves tension','Aids digestion','Calms nervous system'],      steps:['Lie on your back','Bring one knee to chest','Cross over body','Keep shoulders grounded','Breathe 30 seconds each side'] },
  { id:'7', name:'Heat Pad Savasana',description:'Relaxation with heat therapy',          duration:15, difficulty:'Easy',   benefits:['Relieves cramping','Deep relaxation','Reduces pain'],             steps:['Lie down on back','Place heat pad on lower belly','Close your eyes','Focus on breathing','Rest for 10-15 minutes'] },
  { id:'8', name:'Legs Up The Wall', description:'Restorative inversion pose',            duration:12, difficulty:'Easy',   benefits:['Reduces bloating','Improves circulation','Promotes relaxation'],  steps:['Sit with side against wall','Swing legs up wall','Lie back with arms out','Stay for 10-15 minutes','Breathe naturally'] },
];

const danceList: Dance[] = [
  { id:'1', name:'Zumba Beginner Mix',    style:'Zumba',    duration:30, difficulty:'Beginner',     bpm:120, calories:150, description:'Fun Latin rhythms perfect for beginners',      moves:['Basic step','Hip motion','Side-to-side sway','Arm waves'] },
  { id:'2', name:'Zumba Intermediate',    style:'Zumba',    duration:45, difficulty:'Intermediate', bpm:130, calories:250, description:'More complex footwork and rhythm patterns',    moves:['Cumbia','Merengue','Reggaeton','Salsa basics'] },
  { id:'3', name:'Oriental Belly Basics', style:'Oriental', duration:25, difficulty:'Beginner',     bpm:100, calories:120, description:'Graceful belly dance for all levels',         moves:['Hip circles','Figure-8 movement','Shimmy','Arm waves'] },
  { id:'4', name:'Oriental Fusion',       style:'Oriental', duration:40, difficulty:'Intermediate', bpm:110, calories:200, description:'Modern fusion of traditional belly dance',    moves:['Advanced isolations','Spins','Floor work','Combinations'] },
  { id:'5', name:'Dance Cardio Blast',    style:'Modern',   duration:30, difficulty:'Intermediate', bpm:140, calories:280, description:'High-energy dance cardio workout',            moves:['High knees','Grapevines','Turns','Jumps'] },
  { id:'6', name:'Slow Grooving Flow',    style:'Modern',   duration:35, difficulty:'Beginner',     bpm:95,  calories:140, description:'Easy groovy movements to hip-hop beats',     moves:['Groove sway','Step touches','Body rolls','Shoulder pops'] },
  { id:'7', name:'K-Pop Dance Tutorial',  style:'K-Pop',    duration:20, difficulty:'Intermediate', bpm:125, calories:180, description:'Learn trending K-pop choreography',          moves:['Pop','Lock','Hitting','Groove'] },
  { id:'8', name:'Hip Hop Essentials',    style:'Hip Hop',  duration:40, difficulty:'Intermediate', bpm:100, calories:220, description:'Classic hip hop moves and freestyle basics', moves:['Popping','Locking','Body isolations','Freestyle'] },
];

const Active: React.FC = () => {
  const { tier, isPremium } = useMembership();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Follicular');
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [startedWorkouts, setStartedWorkouts] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedMoves, setCompletedMoves] = useState<string[]>([]);
  const [selectedDance, setSelectedDance] = useState<Dance | null>(null);
  const [completedDances, setCompletedDances] = useState<string[]>([]);
  const [filterStyle, setFilterStyle] = useState('All');
  const [copyrightOpen, setCopyrightOpen] = useState(false);
  const [musicUrls, setMusicUrls] = useState<Record<string, string>>({});
  const [musicInput, setMusicInput] = useState('');
  const [favorites, setFavorites] = useState<Favorites>({ workouts: [], exercises: [], dances: [] });
  const [showCollections, setShowCollections] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cycle = localStorage.getItem('femfit-cycle');
    if (cycle) {
      const data = JSON.parse(cycle);
      const diff = Math.floor((Date.now() - new Date(data.startDate).getTime()) / 86400000);
      const day = (diff % data.cycleLength) + 1;
      if (day <= data.period) setCurrentPhase('Menstrual');
      else if (day <= data.period + 8) setCurrentPhase('Follicular');
      else if (day <= data.period + 13) setCurrentPhase('Ovulation');
      else setCurrentPhase('Luteal');
    }
    const s = (key: string) => { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; };
    if (s('femfit-startedWorkouts')) setStartedWorkouts(s('femfit-startedWorkouts'));
    if (s('femfit-completedMoves'))  setCompletedMoves(s('femfit-completedMoves'));
    if (s('femfit-completedDances')) setCompletedDances(s('femfit-completedDances'));
    if (s('femfit-favorites'))       setFavorites(s('femfit-favorites'));
    if (s('femfit-dance-playlists')) setMusicUrls(s('femfit-dance-playlists'));
  }, []);

  const isWorkoutLocked = (w: Workout) => {
    if (isPremium || tier === 'elite') return false;
    return workoutList.filter(x => x.phase === w.phase).indexOf(w) > 0;
  };
  const isExerciseLocked = (e: Exercise) => !isPremium && e.difficulty !== 'Easy';
  const isDanceLocked = (d: Dance) => !isPremium && d.difficulty !== 'Beginner';

  const toggleFav = (type: keyof Favorites, id: string) => {
    const upd = { ...favorites, [type]: favorites[type].includes(id) ? favorites[type].filter(x => x !== id) : [...favorites[type], id] };
    setFavorites(upd);
    localStorage.setItem('femfit-favorites', JSON.stringify(upd));
  };

  const startWorkout = (id: string) => {
    const upd = startedWorkouts.includes(id) ? startedWorkouts.filter(x => x !== id) : [...startedWorkouts, id];
    setStartedWorkouts(upd);
    localStorage.setItem('femfit-startedWorkouts', JSON.stringify(upd));
    if (!startedWorkouts.includes(id)) {
      const cd: Record<string, { joined: boolean; progress: number }> = JSON.parse(localStorage.getItem('femfit-challenges') || '{}');
      const w = workoutList.find(x => x.id === id);
      if (cd['1']?.joined && w?.type === 'Yoga') cd['1'] = { ...cd['1'], progress: (cd['1'].progress || 0) + 1 };
      if (cd['3']?.joined) cd['3'] = { ...cd['3'], progress: (cd['3'].progress || 0) + 1 };
      localStorage.setItem('femfit-challenges', JSON.stringify(cd));
    }
  };

  const completeMoves = (id: string) => {
    const upd = completedMoves.includes(id) ? completedMoves.filter(x => x !== id) : [...completedMoves, id];
    setCompletedMoves(upd);
    localStorage.setItem('femfit-completedMoves', JSON.stringify(upd));
  };

  const completeDance = (id: string) => {
    const upd = completedDances.includes(id) ? completedDances.filter(x => x !== id) : [...completedDances, id];
    setCompletedDances(upd);
    localStorage.setItem('femfit-completedDances', JSON.stringify(upd));
    if (!completedDances.includes(id)) {
      const cd: Record<string, { joined: boolean; progress: number }> = JSON.parse(localStorage.getItem('femfit-challenges') || '{}');
      if (cd['2']?.joined) cd['2'] = { ...cd['2'], progress: (cd['2'].progress || 0) + 1 };
      if (cd['3']?.joined) cd['3'] = { ...cd['3'], progress: (cd['3'].progress || 0) + 1 };
      localStorage.setItem('femfit-challenges', JSON.stringify(cd));
    }
  };

  const saveMusicUrl = (danceId: string) => {
    if (!musicInput.trim()) return;
    const upd = { ...musicUrls, [danceId]: musicInput.trim() };
    setMusicUrls(upd);
    localStorage.setItem('femfit-dance-playlists', JSON.stringify(upd));
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
  const hasFavs = favorites.workouts.length + favorites.exercises.length + favorites.dances.length > 0;

  // On mobile: if detail selected, scroll to it
  const selectExercise = (e: Exercise) => {
    setSelectedExercise(e);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };
  const selectDance = (d: Dance) => {
    setSelectedDance(d);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen">
      {/* Header */}
      <div className="bg-sage px-4 pt-5 pb-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-0.5">Active</h1>
          <p className="text-white/70 text-sm">Phase: <span className="font-bold text-white">{currentPhase}</span></p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-4">

        {/* Favorites strip */}
        {hasFavs && (
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-sage/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-charcoal">My Favorites</p>
              <button onClick={() => setShowCollections(!showCollections)} className="text-xs text-sage font-medium">
                Collections
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {favorites.workouts.map(id => {
                const w = workoutList.find(x => x.id === id);
                if (!w) return null;
                return (
                  <button key={id} onClick={() => setActiveTab(0)} className="flex-shrink-0 bg-sage/10 border border-sage/20 rounded-xl px-3 py-2 text-left active:scale-95 transition">
                    <p className="text-xs font-bold text-charcoal whitespace-nowrap">{w.name}</p>
                    <p className="text-[10px] text-gray-400">{w.duration}m</p>
                  </button>
                );
              })}
              {favorites.exercises.map(id => {
                const e = exerciseList.find(x => x.id === id);
                if (!e) return null;
                return (
                  <button key={id} onClick={() => setActiveTab(1)} className="flex-shrink-0 bg-peach/10 border border-peach/20 rounded-xl px-3 py-2 text-left active:scale-95 transition">
                    <p className="text-xs font-bold text-charcoal whitespace-nowrap">{e.name}</p>
                    <p className="text-[10px] text-gray-400">{e.duration}m</p>
                  </button>
                );
              })}
              {favorites.dances.map(id => {
                const d = danceList.find(x => x.id === id);
                if (!d) return null;
                return (
                  <button key={id} onClick={() => setActiveTab(2)} className="flex-shrink-0 bg-orange/10 border border-orange/20 rounded-xl px-3 py-2 text-left active:scale-95 transition">
                    <p className="text-xs font-bold text-charcoal whitespace-nowrap">{d.name}</p>
                    <p className="text-[10px] text-gray-400">{d.duration}m</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <TabBar tabs={['Workouts', 'Comfort Moves', 'Dance Library']} activeTab={activeTab} onTabChange={t => { setActiveTab(t); setSelectedExercise(null); setSelectedDance(null); }} />

        {/* WORKOUTS */}
        {activeTab === 0 && (
          <div className="space-y-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-sage/10 text-sm font-medium text-charcoal w-full sm:w-auto active:scale-98 transition"
            >
              <Filter size={15} className="text-sage" />
              Filters
              {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showFilters && (
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-sage/10 grid grid-cols-3 gap-3">
                {[
                  { label: 'Phase', value: selectedPhase, set: setSelectedPhase, opts: ['All','Menstrual','Follicular','Ovulation','Luteal'] },
                  { label: 'Type',  value: selectedType,  set: setSelectedType,  opts: ['All','Yoga','Cardio','Strength','Dance'] },
                  { label: 'Level', value: selectedDifficulty, set: setSelectedDifficulty, opts: ['All','Easy','Medium','Hard'] },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{f.label}</label>
                    <select value={f.value} onChange={e => f.set(e.target.value)} className="w-full border border-sage/30 rounded-lg px-2 py-1.5 text-xs focus:border-sage outline-none">
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredWorkouts.map(workout => {
                const locked = isWorkoutLocked(workout);
                const started = startedWorkouts.includes(workout.id);
                const faved = favorites.workouts.includes(workout.id);
                return (
                  <div key={workout.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-sage/10 active:scale-98 transition">
                    <div className={`px-4 py-2 flex items-center justify-between ${PHASE_BADGE[workout.phase] || 'bg-gray-50'}`}>
                      <span className="text-xs font-bold">{workout.phase}</span>
                      <button onClick={() => toggleFav('workouts', workout.id)} className="p-1 active:scale-90 transition">
                        <Heart size={14} className={faved ? 'text-coral' : 'text-gray-300'} fill={faved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-charcoal mb-0.5">{workout.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{workout.description}</p>
                      <div className="flex gap-2 text-xs text-gray-400 mb-3 flex-wrap">
                        <span>{workout.type}</span><span>·</span>
                        <span>{workout.difficulty}</span><span>·</span>
                        <span className="flex items-center gap-0.5"><Clock size={10} />{workout.duration}m</span>
                      </div>
                      {locked ? (
                        <div className="relative" style={{ height: 76 }}>
                          <PremiumLockCard tier="premium" style="teaser" workoutName={workout.name} />
                        </div>
                      ) : (
                        <button
                          onClick={() => startWorkout(workout.id)}
                          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                            started ? 'bg-sage text-white' : 'bg-sage/10 text-sage hover:bg-sage/20'
                          }`}
                        >
                          <Play size={13} />{started ? 'In Progress' : 'Start'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COMFORT MOVES */}
        {activeTab === 1 && (
          <div className="space-y-3">
            {/* Detail panel on mobile: shows above list when selected */}
            {selectedExercise && (
              <div ref={detailRef} className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10 lg:hidden">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-charcoal">{selectedExercise.name}</h2>
                  <button onClick={() => setSelectedExercise(null)} className="p-1.5 rounded-lg bg-gray-100 active:scale-90">
                    <X size={16} className="text-charcoal" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-3">{selectedExercise.description}</p>
                <div className="mb-3">
                  <p className="text-xs font-bold text-charcoal uppercase mb-1.5">Benefits</p>
                  <ul className="space-y-1">
                    {selectedExercise.benefits.map((b, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-sage">•</span>{b}</li>)}
                  </ul>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-bold text-charcoal uppercase mb-1.5">Steps</p>
                  <ol className="space-y-1">
                    {selectedExercise.steps.map((s, i) => <li key={i} className="text-sm text-gray-600"><span className="font-bold text-sage">{i+1}.</span> {s}</li>)}
                  </ol>
                </div>
                {isExerciseLocked(selectedExercise) ? <PremiumLockCard tier="premium" style="banner" /> : (
                  <button onClick={() => completeMoves(selectedExercise.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${completedMoves.includes(selectedExercise.id) ? 'bg-sage text-white' : 'bg-sage/10 text-sage'}`}>
                    {completedMoves.includes(selectedExercise.id) ? 'Completed ✓' : 'Mark Complete'}
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-4">
              {/* List */}
              <div className="flex-1 space-y-2">
                {exerciseList.map(exercise => {
                  const locked = isExerciseLocked(exercise);
                  const completed = completedMoves.includes(exercise.id);
                  const faved = favorites.exercises.includes(exercise.id);
                  return (
                    <div key={exercise.id} onClick={() => selectExercise(exercise)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-98 ${
                        selectedExercise?.id === exercise.id ? 'border-sage bg-sage/5' : 'border-gray-100 bg-white hover:border-sage/30'
                      }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-charcoal text-sm truncate">{exercise.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{exercise.description}</p>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Clock size={11} />{exercise.duration}m · {exercise.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          <button onClick={e => { e.stopPropagation(); toggleFav('exercises', exercise.id); }} className="active:scale-90 transition">
                            <Heart size={15} className={faved ? 'text-coral' : 'text-gray-300'} fill={faved ? 'currentColor' : 'none'} />
                          </button>
                          {!locked && (
                            <button onClick={e => { e.stopPropagation(); completeMoves(exercise.id); }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition active:scale-90 ${completed ? 'bg-sage text-white' : 'bg-gray-100 text-gray-400'}`}>
                              ✓
                            </button>
                          )}
                          {locked && <span className="text-sm">🔒</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sticky detail panel — desktop only */}
              {selectedExercise && (
                <div className="hidden lg:block w-72 flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10 sticky top-20">
                    <h2 className="font-bold text-charcoal mb-1">{selectedExercise.name}</h2>
                    <p className="text-sm text-gray-500 mb-3">{selectedExercise.description}</p>
                    <div className="mb-3">
                      <p className="text-xs font-bold text-charcoal uppercase mb-1.5">Benefits</p>
                      <ul className="space-y-1">{selectedExercise.benefits.map((b,i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-sage">•</span>{b}</li>)}</ul>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-charcoal uppercase mb-1.5">Steps</p>
                      <ol className="space-y-1">{selectedExercise.steps.map((s,i) => <li key={i} className="text-sm text-gray-600"><span className="font-bold text-sage">{i+1}.</span> {s}</li>)}</ol>
                    </div>
                    {isExerciseLocked(selectedExercise) ? <PremiumLockCard tier="premium" style="banner" /> : (
                      <button onClick={() => completeMoves(selectedExercise.id)}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm active:scale-95 transition ${completedMoves.includes(selectedExercise.id) ? 'bg-sage text-white' : 'bg-sage/10 text-sage'}`}>
                        {completedMoves.includes(selectedExercise.id) ? 'Completed ✓' : 'Mark Complete'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DANCE LIBRARY */}
        {activeTab === 2 && (
          <div className="space-y-4">
            {/* Copyright notice */}
            <div className="bg-cream border border-yellow/50 rounded-2xl overflow-hidden">
              <button onClick={() => setCopyrightOpen(!copyrightOpen)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-charcoal">
                <span className="flex items-center gap-2"><Info size={15} className="text-yellow-600" />Copyright Notice</span>
                {copyrightOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              {copyrightOpen && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-yellow/30">
                  FemFit does not host or stream music. Dance routines are movement descriptions only. For music-synced workouts, connect your own Spotify or YouTube Music playlist (Premium feature).
                </div>
              )}
            </div>

            {/* Style filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {danceStyles.map(style => (
                <button key={style} onClick={() => setFilterStyle(style)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                    filterStyle === style ? 'bg-sage text-white shadow-sm' : 'bg-white text-charcoal border border-sage/20 hover:border-sage'
                  }`}>
                  {style}
                </button>
              ))}
            </div>

            {/* Detail on mobile */}
            {selectedDance && (
              <div ref={detailRef} className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10 lg:hidden">
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setSelectedDance(null)} className="p-1.5 rounded-lg bg-gray-100 active:scale-90 transition">
                    <ArrowLeft size={16} className="text-charcoal" />
                  </button>
                  <h2 className="font-bold text-charcoal flex-1">{selectedDance.name}</h2>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[{l:'BPM',v:selectedDance.bpm},{l:'Duration',v:`${selectedDance.duration}m`},{l:'Calories',v:`${selectedDance.calories}`}].map(i => (
                    <div key={i.l} className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <p className="text-[10px] text-gray-400 font-medium">{i.l}</p>
                      <p className="font-bold text-charcoal text-sm">{i.v}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <p className="text-xs font-bold text-charcoal uppercase mb-1.5">Key Moves</p>
                  <ul className="space-y-1">{selectedDance.moves.map((m,i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-sage">✓</span>{m}</li>)}</ul>
                </div>
                {isPremium ? (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-charcoal uppercase mb-2">Your Playlist</p>
                    {musicUrls[selectedDance.id] ? (
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                        <Music size={14} className="text-sage flex-shrink-0" />
                        <a href={musicUrls[selectedDance.id]} target="_blank" rel="noopener noreferrer" className="text-xs text-sage underline flex-1 truncate">{musicUrls[selectedDance.id]}</a>
                        <button onClick={() => { const u={...musicUrls}; delete u[selectedDance.id]; setMusicUrls(u); localStorage.setItem('femfit-dance-playlists',JSON.stringify(u)); }}><X size={13} className="text-gray-400" /></button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input type="url" placeholder="Spotify or YouTube URL…" value={musicInput} onChange={e=>setMusicInput(e.target.value)}
                          className="flex-1 border border-sage/30 rounded-xl px-3 py-2 text-xs focus:border-sage outline-none" />
                        <button onClick={() => saveMusicUrl(selectedDance.id)} className="bg-sage text-white px-3 rounded-xl text-xs font-bold active:scale-95">Add</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-cream rounded-xl text-xs text-gray-500 text-center">
                    <Music size={14} className="mx-auto mb-1 text-sage" />
                    <span className="font-bold text-charcoal">Premium:</span> Sync your playlist
                  </div>
                )}
                {isDanceLocked(selectedDance) ? (
                  <div className="relative" style={{height:90}}><PremiumLockCard tier="premium" style="teaser" workoutName={selectedDance.name} /></div>
                ) : (
                  <button onClick={() => completeDance(selectedDance.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${completedDances.includes(selectedDance.id) ? 'bg-sage text-white' : 'bg-sage/10 text-sage'}`}>
                    <Play size={13} />{completedDances.includes(selectedDance.id) ? 'Completed' : 'Start Dancing'}
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                {filteredDances.map(dance => {
                  const faved = favorites.dances.includes(dance.id);
                  return (
                    <div key={dance.id} onClick={() => selectDance(dance)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-98 ${
                        selectedDance?.id === dance.id ? 'border-sage bg-sage/5' : 'border-gray-100 bg-white hover:border-sage/30'
                      }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Music size={13} className="text-sage flex-shrink-0" />
                            <h3 className="font-bold text-charcoal text-sm truncate">{dance.name}</h3>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1">{dance.description}</p>
                          <div className="flex gap-2 text-xs text-gray-400 mt-1 flex-wrap">
                            <span className="flex items-center gap-0.5"><Clock size={10}/>{dance.duration}m</span>
                            <span>{dance.calories} cal</span>
                            <span className={`px-1.5 py-0.5 rounded-lg font-medium text-[10px] ${dance.difficulty==='Beginner'?'bg-sage/10 text-sage':'bg-peach/20 text-peach'}`}>{dance.difficulty}</span>
                          </div>
                        </div>
                        <button onClick={e=>{e.stopPropagation();toggleFav('dances',dance.id);}} className="ml-2 active:scale-90 transition">
                          <Heart size={16} className={faved?'text-coral':'text-gray-300'} fill={faved?'currentColor':'none'}/>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop detail panel */}
              {selectedDance && (
                <div className="hidden lg:block w-72 flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10 sticky top-20">
                    <div className="bg-charcoal text-white rounded-xl p-3 mb-4 flex justify-between items-center">
                      <div><p className="text-xs opacity-60">BPM</p><p className="text-2xl font-bold">{selectedDance.bpm}</p></div>
                      <Music size={20} className="opacity-40"/>
                    </div>
                    <h2 className="font-bold text-charcoal mb-3">{selectedDance.name}</h2>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-xl p-2"><p className="text-xs text-gray-400">Duration</p><p className="font-bold text-charcoal text-sm">{selectedDance.duration}m</p></div>
                      <div className="bg-gray-50 rounded-xl p-2"><p className="text-xs text-gray-400">Calories</p><p className="font-bold text-charcoal text-sm">{selectedDance.calories}</p></div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-charcoal uppercase mb-1.5">Key Moves</p>
                      <ul className="space-y-1">{selectedDance.moves.map((m,i)=><li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-sage">✓</span>{m}</li>)}</ul>
                    </div>
                    {isPremium ? (
                      <div className="mb-4">
                        {musicUrls[selectedDance.id] ? (
                          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                            <Music size={13} className="text-sage flex-shrink-0"/>
                            <a href={musicUrls[selectedDance.id]} target="_blank" rel="noopener noreferrer" className="text-xs text-sage underline flex-1 truncate">{musicUrls[selectedDance.id]}</a>
                            <button onClick={()=>{const u={...musicUrls};delete u[selectedDance.id];setMusicUrls(u);localStorage.setItem('femfit-dance-playlists',JSON.stringify(u));}}><X size={12} className="text-gray-400"/></button>
                          </div>
                        ) : (
                          <div className="flex gap-1.5">
                            <input type="url" placeholder="Playlist URL…" value={musicInput} onChange={e=>setMusicInput(e.target.value)} className="flex-1 border border-sage/30 rounded-xl px-2 py-1.5 text-xs outline-none"/>
                            <button onClick={()=>saveMusicUrl(selectedDance.id)} className="bg-sage text-white px-3 rounded-xl text-xs font-bold">Add</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4 p-2.5 bg-cream rounded-xl text-xs text-center text-gray-500"><Music size={13} className="mx-auto mb-1 text-sage"/><span className="font-bold text-charcoal">Premium:</span> Sync playlist</div>
                    )}
                    {isDanceLocked(selectedDance) ? (
                      <div className="relative" style={{height:90}}><PremiumLockCard tier="premium" style="teaser" workoutName={selectedDance.name}/></div>
                    ) : (
                      <button onClick={()=>completeDance(selectedDance.id)}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm active:scale-95 transition flex items-center justify-center gap-1.5 ${completedDances.includes(selectedDance.id)?'bg-sage text-white':'bg-sage/10 text-sage'}`}>
                        <Play size={13}/>{completedDances.includes(selectedDance.id)?'Completed':'Start Dancing'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Active;
