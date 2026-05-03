import React, { useState, useEffect } from 'react';
import { Play, Music, Clock, BarChart3 } from 'lucide-react';

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

const DanceLibrary: React.FC = () => {
  const [dances, setDances] = useState<Dance[]>([
    {
      id: '1',
      name: 'Zumba Beginner Mix',
      style: 'Zumba',
      duration: 30,
      difficulty: 'Beginner',
      bpm: 120,
      calories: 150,
      description: 'Fun Latin rhythms perfect for beginners',
      moves: ['Basic step', 'Hip motion', 'Side-to-side sway', 'Arm waves']
    },
    {
      id: '2',
      name: 'Zumba Intermediate',
      style: 'Zumba',
      duration: 45,
      difficulty: 'Intermediate',
      bpm: 130,
      calories: 250,
      description: 'More complex footwork and rhythm patterns',
      moves: ['Cumbia', 'Merengue', 'Reggaeton', 'Salsa basics']
    },
    {
      id: '3',
      name: 'Oriental Belly Dance Basics',
      style: 'Oriental',
      duration: 25,
      difficulty: 'Beginner',
      bpm: 100,
      calories: 120,
      description: 'Graceful belly dance movements for all levels',
      moves: ['Hip circles', 'Figure-8 movement', 'Shimmy', 'Arm waves']
    },
    {
      id: '4',
      name: 'Oriental Fusion',
      style: 'Oriental',
      duration: 40,
      difficulty: 'Intermediate',
      bpm: 110,
      calories: 200,
      description: 'Modern fusion of traditional belly dance',
      moves: ['Advanced isolations', 'Spins', 'Floor work', 'Combinations']
    },
    {
      id: '5',
      name: 'Dance Cardio Blast',
      style: 'Modern',
      duration: 30,
      difficulty: 'Intermediate',
      bpm: 140,
      calories: 280,
      description: 'High-energy dance cardio workout',
      moves: ['High knees', 'Grapevines', 'Turns', 'Jumps']
    },
    {
      id: '6',
      name: 'Slow Grooving Flow',
      style: 'Modern',
      duration: 35,
      difficulty: 'Beginner',
      bpm: 95,
      calories: 140,
      description: 'Easy and groovy movements to hip-hop beats',
      moves: ['Groove sway', 'Step touches', 'Body rolls', 'Shoulder pops']
    },
    {
      id: '7',
      name: 'K-Pop Dance Tutorial',
      style: 'K-Pop',
      duration: 20,
      difficulty: 'Intermediate',
      bpm: 125,
      calories: 180,
      description: 'Learn trending K-pop choreography',
      moves: ['Pop', 'Lock', 'Hitting', 'Groove']
    },
    {
      id: '8',
      name: 'Hip Hop Essentials',
      style: 'Hip Hop',
      duration: 40,
      difficulty: 'Intermediate',
      bpm: 100,
      calories: 220,
      description: 'Classic hip hop moves and freestyle basics',
      moves: ['Popping', 'Locking', 'Body isolations', 'Freestyle']
    },
  ]);

  const [selectedDance, setSelectedDance] = useState<Dance | null>(null);
  const [savedDances, setSavedDances] = useState<string[]>([]);
  const [completedDances, setCompletedDances] = useState<string[]>([]);
  const [filterStyle, setFilterStyle] = useState('All');
  const styles = ['All', ...Array.from(new Set(dances.map(d => d.style)))];

  useEffect(() => {
    const saved = localStorage.getItem('femfit-savedDances');
    if (saved) setSavedDances(JSON.parse(saved));
    const completed = localStorage.getItem('femfit-completedDances');
    if (completed) setCompletedDances(JSON.parse(completed));
  }, []);

  const handleSaveDance = (danceId: string) => {
    const updated = savedDances.includes(danceId)
      ? savedDances.filter(id => id !== danceId)
      : [...savedDances, danceId];
    setSavedDances(updated);
    localStorage.setItem('femfit-savedDances', JSON.stringify(updated));
  };

  const handleCompleteDance = (danceId: string) => {
    const updated = completedDances.includes(danceId)
      ? completedDances.filter(id => id !== danceId)
      : [...completedDances, danceId];
    setCompletedDances(updated);
    localStorage.setItem('femfit-completedDances', JSON.stringify(updated));
  };

  const filteredDances = filterStyle === 'All' ? dances : dances.filter(d => d.style === filterStyle);

  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-lavender to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-femfit-deep mb-2">Dance Library</h1>
        <p className="text-gray-600 mb-8">Learn and master amazing dance moves</p>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setFilterStyle(style)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStyle === style
                  ? 'bg-femfit-pink text-white'
                  : 'bg-white text-femfit-deep border-2 border-femfit-lavender hover:border-femfit-pink'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dance List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredDances.map((dance) => (
              <div
                key={dance.id}
                onClick={() => setSelectedDance(dance)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedDance?.id === dance.id
                    ? 'border-femfit-pink bg-femfit-lavender'
                    : 'border-gray-200 bg-white hover:border-femfit-pink'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Music size={18} className="text-femfit-pink" />
                      <h3 className="font-bold text-femfit-deep">{dance.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{dance.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {dance.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={14} />
                        {dance.calories} cal
                      </span>
                      <span className={`px-2 py-1 rounded ${difficultyColors[dance.difficulty as keyof typeof difficultyColors]}`}>
                        {dance.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveDance(dance.id);
                    }}
                    className={`text-2xl transition ${savedDances.includes(dance.id) ? 'text-femfit-pink' : 'text-gray-400'}`}
                  >
                    ♥
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dance Details */}
          <div className="lg:col-span-1">
            {selectedDance ? (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                <div className="mb-4 p-4 bg-gradient-to-r from-femfit-pink to-femfit-rose text-white rounded-lg">
                  <p className="text-sm opacity-90">BPM</p>
                  <p className="text-2xl font-bold">{selectedDance.bpm}</p>
                </div>

                <h2 className="text-2xl font-bold text-femfit-deep mb-4">{selectedDance.name}</h2>

                <div className="mb-6 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Duration</p>
                    <p className="text-lg text-gray-700">{selectedDance.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Calories Burned</p>
                    <p className="text-lg text-gray-700">{selectedDance.calories} cal</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Difficulty</p>
                    <p className={`inline-block px-3 py-1 rounded text-sm font-bold ${difficultyColors[selectedDance.difficulty as keyof typeof difficultyColors]}`}>
                      {selectedDance.difficulty}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-femfit-deep mb-3">Key Moves</h3>
                  <ul className="space-y-1">
                    {selectedDance.moves.map((move, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-femfit-pink mt-1">✓</span>
                        {move}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleCompleteDance(selectedDance.id)}
                    className="w-full bg-gradient-to-r from-femfit-purple to-femfit-pink text-white py-2 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Play size={16} />
                    {completedDances.includes(selectedDance.id) ? 'Completed' : 'Start Dancing'}
                  </button>
                  <button
                    onClick={() => handleSaveDance(selectedDance.id)}
                    className={`w-full py-2 rounded-lg font-bold transition ${
                      savedDances.includes(selectedDance.id)
                        ? 'bg-femfit-pink text-white'
                        : 'bg-femfit-lavender text-femfit-deep hover:bg-femfit-rose'
                    }`}
                  >
                    {savedDances.includes(selectedDance.id) ? '♥ Saved' : '♡ Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <Music size={48} className="mx-auto text-femfit-pink mb-3 opacity-50" />
                <p className="text-gray-600">Select a dance to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {(savedDances.length > 0 || completedDances.length > 0) && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedDances.length > 0 && (
              <div className="bg-gradient-to-br from-femfit-pink to-femfit-rose rounded-lg shadow-lg p-6 text-white">
                <p className="text-sm opacity-90">Saved Dances</p>
                <p className="text-4xl font-bold">{savedDances.length}</p>
              </div>
            )}
            {completedDances.length > 0 && (
              <div className="bg-gradient-to-br from-femfit-purple to-femfit-deep rounded-lg shadow-lg p-6 text-white">
                <p className="text-sm opacity-90">Dances Completed</p>
                <p className="text-4xl font-bold">{completedDances.length}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DanceLibrary;
