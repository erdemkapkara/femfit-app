import React, { useState } from 'react';
import { Heart, Clock, Zap } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  benefits: string[];
  steps: string[];
  difficulty: string;
}

const ComfortMoves: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Child\'s Pose',
      description: 'Gentle stretch for back and hips',
      duration: 5,
      benefits: ['Relieves tension', 'Calms nervous system', 'Stretches hips'],
      steps: [
        'Kneel on the floor',
        'Bring big toes together, knees wide',
        'Fold forward, extending arms',
        'Rest forehead on mat',
        'Breathe deeply for 5 breaths'
      ],
      difficulty: 'Easy'
    },
    {
      id: '2',
      name: 'Cat-Cow Stretch',
      description: 'Mobilize spine and relieve cramping',
      duration: 10,
      benefits: ['Eases cramps', 'Mobilizes spine', 'Improves circulation'],
      steps: [
        'Get on hands and knees',
        'Inhale, drop belly (Cow)',
        'Exhale, round back (Cat)',
        'Flow between positions',
        'Repeat 10-12 times'
      ],
      difficulty: 'Easy'
    },
    {
      id: '3',
      name: 'Hip Circles',
      description: 'Release tension in hips and lower back',
      duration: 8,
      benefits: ['Releases hip tension', 'Improves mobility', 'Eases lower back pain'],
      steps: [
        'Stand with hands on hips',
        'Make large slow circles with hips',
        'Go clockwise 10 times',
        'Switch to counter-clockwise',
        'Complete 10 circles'
      ],
      difficulty: 'Easy'
    },
    {
      id: '4',
      name: 'Supported Pigeon Pose',
      description: 'Deep hip opening for pain relief',
      duration: 8,
      benefits: ['Deep hip stretch', 'Relieves cramping', 'Reduces pain'],
      steps: [
        'Sit on floor, one leg bent in front',
        'Other leg extended behind',
        'Fold forward gently',
        'Use hands for support',
        'Hold for 30 seconds each side'
      ],
      difficulty: 'Medium'
    },
    {
      id: '5',
      name: 'Downward Dog',
      description: 'Full body stretch and inversion',
      duration: 10,
      benefits: ['Stretches full body', 'Increases blood flow', 'Calms mind'],
      steps: [
        'Start on hands and knees',
        'Lift hips up and back',
        'Form an inverted V',
        'Hands shoulder-width apart',
        'Hold for 5-10 breaths'
      ],
      difficulty: 'Medium'
    },
    {
      id: '6',
      name: 'Supine Twist',
      description: 'Gentle spinal twist for relief',
      duration: 5,
      benefits: ['Relieves tension', 'Aids digestion', 'Calms nervous system'],
      steps: [
        'Lie on your back',
        'Bring one knee to chest',
        'Cross over body',
        'Keep shoulders grounded',
        'Breathe for 30 seconds each side'
      ],
      difficulty: 'Easy'
    },
    {
      id: '7',
      name: 'Heat Pad Savasana',
      description: 'Relaxation with heat therapy',
      duration: 15,
      benefits: ['Relieves cramping', 'Deep relaxation', 'Reduces pain'],
      steps: [
        'Lie down comfortably on back',
        'Place heat pad on lower belly',
        'Close your eyes',
        'Focus on breathing',
        'Rest for 10-15 minutes'
      ],
      difficulty: 'Easy'
    },
    {
      id: '8',
      name: 'Legs Up The Wall',
      description: 'Restorative inversion pose',
      duration: 12,
      benefits: ['Reduces bloating', 'Improves circulation', 'Promotes relaxation'],
      steps: [
        'Sit with side against wall',
        'Swing legs up wall',
        'Lie back with arms out',
        'Stay for 10-15 minutes',
        'Breathe naturally'
      ],
      difficulty: 'Easy'
    },
  ];

  const handleCompleteExercise = (exerciseId: string) => {
    const updated = completedExercises.includes(exerciseId)
      ? completedExercises.filter(id => id !== exerciseId)
      : [...completedExercises, exerciseId];
    setCompletedExercises(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-lavender to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-femfit-deep mb-2">Comfort Moves</h1>
        <p className="text-gray-600 mb-8">Pain relief exercises for menstrual discomfort</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exercise List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedExercise?.id === exercise.id
                      ? 'border-femfit-pink bg-femfit-lavender'
                      : 'border-gray-200 bg-white hover:border-femfit-pink'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-femfit-deep mb-1">{exercise.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {exercise.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap size={14} />
                          {exercise.difficulty}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteExercise(exercise.id);
                      }}
                      className={`p-2 rounded-full transition ${
                        completedExercises.includes(exercise.id)
                          ? 'bg-femfit-pink text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-femfit-rose'
                      }`}
                    >
                      <Heart size={16} fill={completedExercises.includes(exercise.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Details */}
          <div className="lg:col-span-1">
            {selectedExercise ? (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                <h2 className="text-2xl font-bold text-femfit-deep mb-4">{selectedExercise.name}</h2>

                <div className="mb-6 p-4 bg-femfit-lavender rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">{selectedExercise.description}</p>
                  <div className="flex gap-3 text-sm">
                    <span className="flex items-center gap-1 text-gray-700">
                      <Clock size={16} className="text-femfit-pink" />
                      {selectedExercise.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-gray-700">
                      <Zap size={16} className="text-femfit-pink" />
                      {selectedExercise.difficulty}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-femfit-deep mb-3 flex items-center gap-2">
                    <Heart size={18} className="text-femfit-pink" />
                    Benefits
                  </h3>
                  <ul className="space-y-1">
                    {selectedExercise.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-femfit-pink mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-femfit-deep mb-3">Steps</h3>
                  <ol className="space-y-2">
                    {selectedExercise.steps.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        <span className="font-bold text-femfit-pink">{idx + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <button
                  onClick={() => handleCompleteExercise(selectedExercise.id)}
                  className={`w-full py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    completedExercises.includes(selectedExercise.id)
                      ? 'bg-femfit-pink text-white'
                      : 'bg-femfit-lavender text-femfit-deep hover:bg-femfit-rose'
                  }`}
                >
                  <Heart size={16} />
                  {completedExercises.includes(selectedExercise.id) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <Heart size={48} className="mx-auto text-femfit-pink mb-3 opacity-50" />
                <p className="text-gray-600">Select an exercise to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Summary */}
        {completedExercises.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-femfit-pink to-femfit-rose rounded-lg shadow-lg p-6 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Great Work!</h3>
            <p className="text-lg opacity-90">You've completed {completedExercises.length} comfort moves today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComfortMoves;
