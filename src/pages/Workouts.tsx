import React, { useState, useEffect } from 'react';
import { Play, Filter } from 'lucide-react';

interface Workout {
  id: string;
  name: string;
  phase: string;
  type: string;
  difficulty: string;
  duration: number;
  description: string;
  rating?: number;
}

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([
    // Menstrual Phase
    { id: '1', name: 'Gentle Yoga Flow', phase: 'Menstrual', type: 'Yoga', difficulty: 'Easy', duration: 20, description: 'Restorative yoga to ease cramps' },
    { id: '2', name: 'Yin Yoga', phase: 'Menstrual', type: 'Yoga', difficulty: 'Easy', duration: 30, description: 'Deep stretching and relaxation' },
    { id: '3', name: 'Walking Meditation', phase: 'Menstrual', type: 'Cardio', difficulty: 'Easy', duration: 20, description: 'Gentle walking with mindfulness' },

    // Follicular Phase
    { id: '4', name: 'HIIT Bootcamp', phase: 'Follicular', type: 'Cardio', difficulty: 'Hard', duration: 30, description: 'High intensity interval training' },
    { id: '5', name: 'Power Pilates', phase: 'Follicular', type: 'Strength', difficulty: 'Medium', duration: 45, description: 'Build core strength' },
    { id: '6', name: 'Dance Cardio', phase: 'Follicular', type: 'Dance', difficulty: 'Medium', duration: 30, description: 'Fun dance moves with cardio' },

    // Ovulation Phase
    { id: '7', name: 'Heavy Weight Training', phase: 'Ovulation', type: 'Strength', difficulty: 'Hard', duration: 60, description: 'Peak strength phase, lift heavy' },
    { id: '8', name: 'Circuit Training', phase: 'Ovulation', type: 'Strength', difficulty: 'Hard', duration: 45, description: 'Full body circuits with intensity' },
    { id: '9', name: 'Running Interval', phase: 'Ovulation', type: 'Cardio', difficulty: 'Hard', duration: 30, description: 'Speed and endurance running' },

    // Luteal Phase
    { id: '10', name: 'Strength & Balance', phase: 'Luteal', type: 'Strength', difficulty: 'Medium', duration: 40, description: 'Steady strength work' },
    { id: '11', name: 'Pilates Core', phase: 'Luteal', type: 'Strength', difficulty: 'Medium', duration: 35, description: 'Controlled core engagement' },
    { id: '12', name: 'Yoga Flow', phase: 'Luteal', type: 'Yoga', difficulty: 'Medium', duration: 45, description: 'Balanced yoga practice' },
  ]);

  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>(workouts);
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [startedWorkouts, setStartedWorkouts] = useState<string[]>([]);
  const [currentPhase, setCurrentPhase] = useState('Follicular');

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
  }, []);

  useEffect(() => {
    let filtered = workouts;
    if (selectedPhase !== 'All') {
      filtered = filtered.filter(w => w.phase === selectedPhase);
    }
    if (selectedType !== 'All') {
      filtered = filtered.filter(w => w.type === selectedType);
    }
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(w => w.difficulty === selectedDifficulty);
    }
    setFilteredWorkouts(filtered);
  }, [selectedPhase, selectedType, selectedDifficulty, workouts]);

  const handleStartWorkout = (workoutId: string) => {
    const updated = startedWorkouts.includes(workoutId)
      ? startedWorkouts.filter(id => id !== workoutId)
      : [...startedWorkouts, workoutId];
    setStartedWorkouts(updated);
    localStorage.setItem('femfit-startedWorkouts', JSON.stringify(updated));
  };

  const phaseColors: { [key: string]: string } = {
    Menstrual: 'bg-red-100 text-red-800',
    Follicular: 'bg-green-100 text-green-800',
    Ovulation: 'bg-yellow-100 text-yellow-800',
    Luteal: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-lavender to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-femfit-deep mb-2">Workouts</h1>
        <p className="text-gray-600 mb-8">Current Phase: <span className="font-bold text-femfit-pink">{currentPhase}</span></p>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-femfit-pink" />
            <h2 className="text-xl font-bold text-femfit-deep">Filter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phase</label>
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>All</option>
                <option>Menstrual</option>
                <option>Follicular</option>
                <option>Ovulation</option>
                <option>Luteal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>All</option>
                <option>Yoga</option>
                <option>Cardio</option>
                <option>Strength</option>
                <option>Dance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>All</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Workouts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className={`p-4 ${phaseColors[workout.phase]}`}>
                <p className="text-sm font-bold">{workout.phase}</p>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-femfit-deep mb-2">{workout.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600"><strong>Type:</strong> {workout.type}</p>
                  <p className="text-sm text-gray-600"><strong>Difficulty:</strong> {workout.difficulty}</p>
                  <p className="text-sm text-gray-600"><strong>Duration:</strong> {workout.duration} min</p>
                </div>
                <p className="text-sm text-gray-700 mb-4">{workout.description}</p>
                <button
                  onClick={() => handleStartWorkout(workout.id)}
                  className={`w-full py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    startedWorkouts.includes(workout.id)
                      ? 'bg-femfit-pink text-white'
                      : 'bg-femfit-lavender text-femfit-deep hover:bg-femfit-rose'
                  }`}
                >
                  <Play size={16} />
                  {startedWorkouts.includes(workout.id) ? 'In Progress' : 'Start Workout'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workouts;
