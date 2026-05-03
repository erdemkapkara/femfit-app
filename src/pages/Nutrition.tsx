import React, { useState, useEffect } from 'react';
import { Apple, Plus, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Meal {
  id: string;
  name: string;
  calories: number;
  phase: string;
  nutrients: string;
  dietTypes: string[];
}

interface LoggedMeal {
  id: string;
  mealId: string;
  name: string;
  calories: number;
  date: string;
}

const MEALS: Meal[] = [
  // Menstrual
  { id: '1',  name: 'Spinach & Lentil Bowl',       calories: 380, phase: 'Menstrual',  nutrients: 'Iron, Protein',          dietTypes: ['vegetarian','vegan','gluten_free'] },
  { id: '2',  name: 'Red Meat & Sweet Potato',      calories: 520, phase: 'Menstrual',  nutrients: 'Iron, B12',              dietTypes: [] },
  { id: '3',  name: 'Dark Chocolate & Almonds',     calories: 250, phase: 'Menstrual',  nutrients: 'Magnesium',              dietTypes: ['vegetarian','vegan','gluten_free','dairy_free'] },
  // Follicular
  { id: '4',  name: 'Avocado Toast & Egg',          calories: 350, phase: 'Follicular', nutrients: 'Healthy Fats',           dietTypes: ['vegetarian'] },
  { id: '5',  name: 'Quinoa Power Salad',           calories: 420, phase: 'Follicular', nutrients: 'Protein, Fiber',         dietTypes: ['vegetarian','vegan','gluten_free','dairy_free'] },
  { id: '6',  name: 'Green Smoothie Bowl',          calories: 320, phase: 'Follicular', nutrients: 'Vitamins, Antioxidants', dietTypes: ['vegetarian','vegan','gluten_free','dairy_free'] },
  // Ovulation
  { id: '7',  name: 'Grilled Chicken & Brown Rice', calories: 580, phase: 'Ovulation',  nutrients: 'Protein',               dietTypes: ['gluten_free','dairy_free'] },
  { id: '8',  name: 'Salmon & Asparagus',           calories: 550, phase: 'Ovulation',  nutrients: 'Omega-3, Protein',      dietTypes: ['gluten_free','dairy_free'] },
  { id: '9',  name: 'Turkey Meatballs & Pasta',     calories: 520, phase: 'Ovulation',  nutrients: 'Lean Protein',          dietTypes: ['dairy_free'] },
  // Luteal
  { id: '10', name: 'Sweet Potato & Bean Stew',     calories: 480, phase: 'Luteal',     nutrients: 'Complex Carbs',         dietTypes: ['vegetarian','vegan','gluten_free','dairy_free'] },
  { id: '11', name: 'Whole Wheat Pasta & Veggies',  calories: 450, phase: 'Luteal',     nutrients: 'Fiber',                 dietTypes: ['vegetarian','vegan','dairy_free'] },
  { id: '12', name: 'Oatmeal with Banana & Nuts',   calories: 380, phase: 'Luteal',     nutrients: 'Complex Carbs',         dietTypes: ['vegetarian','vegan','dairy_free'] },
  // Diet-specific extras
  { id: '13', name: 'Tofu Stir-Fry Bowl',           calories: 380, phase: 'Follicular', nutrients: 'Plant Protein',         dietTypes: ['vegetarian','vegan','gluten_free','dairy_free'] },
  { id: '14', name: 'Chickpea Curry',               calories: 420, phase: 'Luteal',     nutrients: 'Plant Protein, Iron',   dietTypes: ['vegetarian','vegan','gluten_free','dairy_free'] },
  { id: '15', name: 'Lentil Soup',                  calories: 340, phase: 'Menstrual',  nutrients: 'Iron, Fiber',           dietTypes: ['vegetarian','vegan','gluten_free','dairy_free'] },
  { id: '16', name: 'Cauliflower Rice Bowl',        calories: 310, phase: 'Luteal',     nutrients: 'Low Carb, Fiber',       dietTypes: ['vegetarian','vegan','gluten_free','dairy_free','keto','paleo'] },
  { id: '17', name: 'Zucchini Noodles & Pesto',    calories: 360, phase: 'Follicular', nutrients: 'Healthy Fats',          dietTypes: ['vegetarian','vegan','gluten_free','dairy_free'] },
  { id: '18', name: 'Egg & Avocado Keto Bowl',     calories: 490, phase: 'Ovulation',  nutrients: 'Healthy Fats, Protein', dietTypes: ['vegetarian','gluten_free','keto','paleo'] },
];

const PHASE_COLORS: Record<string, string> = {
  Menstrual:  'bg-peach text-white',
  Follicular: 'bg-yellow text-charcoal',
  Ovulation:  'bg-orange text-white',
  Luteal:     'bg-sage text-white',
};

const DIET_LABELS: Record<string, string> = {
  none: 'No restrictions', vegetarian: 'Vegetarian', vegan: 'Vegan',
  gluten_free: 'Gluten-Free', dairy_free: 'Dairy-Free', keto: 'Keto', paleo: 'Paleo',
};

// Mifflin-St Jeor BMR for women
const calcBMR = (weight: number, height: number, age: number): number => {
  if (!weight || !height || !age) return 2000;
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
};

const ACTIVITY_MULT: Record<string, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9,
};

const Nutrition: React.FC = () => {
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [currentPhase, setCurrentPhase] = useState('Follicular');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dietType, setDietType] = useState('none');
  const [calorieGoal, setCalorieGoal] = useState(2000);

  useEffect(() => {
    const cycle = localStorage.getItem('femfit-cycle');
    if (cycle) {
      const data = JSON.parse(cycle);
      const start = new Date(data.startDate);
      const today = new Date();
      const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const day = (diff % data.cycleLength) + 1;
      if (day <= data.period) setCurrentPhase('Menstrual');
      else if (day <= data.period + 8) setCurrentPhase('Follicular');
      else if (day <= data.period + 13) setCurrentPhase('Ovulation');
      else setCurrentPhase('Luteal');
    }

    const savedMeals = localStorage.getItem('femfit-meals');
    if (savedMeals) setLoggedMeals(JSON.parse(savedMeals));

    const profile = localStorage.getItem('femfit-profile');
    if (profile) {
      const p = JSON.parse(profile);
      setDietType(p.dietType || 'none');
      if (p.weight && p.height && p.age) {
        const bmr = calcBMR(p.weight, p.height, p.age);
        const mult = ACTIVITY_MULT[p.activityLevel || 'moderate'];
        setCalorieGoal(Math.round(bmr * mult));
      }
    }
  }, []);

  const handleAddMeal = () => {
    if (!selectedMeal) return;
    const meal = MEALS.find(m => m.id === selectedMeal);
    if (!meal) return;
    const entry: LoggedMeal = {
      id: Date.now().toString(),
      mealId: meal.id,
      name: meal.name,
      calories: meal.calories,
      date: selectedDate,
    };
    const updated = [...loggedMeals, entry];
    setLoggedMeals(updated);
    localStorage.setItem('femfit-meals', JSON.stringify(updated));
    setSelectedMeal('');
  };

  const handleDeleteMeal = (id: string) => {
    const updated = loggedMeals.filter(m => m.id !== id);
    setLoggedMeals(updated);
    localStorage.setItem('femfit-meals', JSON.stringify(updated));
  };

  const meetsDiet = (meal: Meal): boolean => {
    if (dietType === 'none') return true;
    return meal.dietTypes.includes(dietType);
  };

  const recommendedMeals = MEALS.filter(m => m.phase === currentPhase && meetsDict(m));
  function meetsDict(m: Meal) { return meetsDiet(m); }

  const todaysMeals = loggedMeals.filter(m => m.date === selectedDate);
  const todaysCalories = todaysMeals.reduce((sum, m) => sum + m.calories, 0);
  const caloriePercent = Math.min(100, Math.round((todaysCalories / calorieGoal) * 100));

  const phaseLabel = PHASE_COLORS[currentPhase] || 'bg-sage text-white';

  const weekData = [
    { date: 'Mon', calories: 1800 },
    { date: 'Tue', calories: 1950 },
    { date: 'Wed', calories: todaysCalories > 0 ? todaysCalories : 2100 },
    { date: 'Thu', calories: 1850 },
    { date: 'Fri', calories: 2200 },
    { date: 'Sat', calories: 2000 },
    { date: 'Sun', calories: 1900 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-charcoal mb-6">Nutrition Tracker</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recommended Meals */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-charcoal">
                Recommended for <span className={`px-2 py-0.5 rounded-lg text-sm ${phaseLabel}`}>{currentPhase}</span>
              </h2>
            </div>
            {dietType !== 'none' && (
              <p className="text-xs text-sage font-medium mb-3">Filtered for your diet: {DIET_LABELS[dietType]}</p>
            )}
            {recommendedMeals.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">No meals match your current diet preference for this phase.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {recommendedMeals.map(meal => (
                  <div
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                      selectedMeal === meal.id ? 'border-sage bg-sage/5' : 'border-gray-100 hover:border-sage/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-charcoal text-sm">{meal.name}</p>
                        <p className="text-xs text-gray-500">{meal.nutrients}</p>
                      </div>
                      <p className="text-sage font-bold text-sm">{meal.calories} cal</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Calorie summary */}
            <div className={`rounded-xl p-5 ${phaseLabel}`}>
              <p className="text-sm opacity-80">Today's Calories</p>
              <p className="text-4xl font-bold">{todaysCalories}</p>
              <div className="mt-2 bg-white/30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: `${caloriePercent}%` }} />
              </div>
              <p className="text-xs mt-1 opacity-75">Goal: {calorieGoal} cal ({caloriePercent}%)</p>
            </div>

            {/* Quick add */}
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-sm font-bold text-charcoal mb-3">Quick Add</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                  />
                </div>
                <button
                  onClick={handleAddMeal}
                  disabled={!selectedMeal}
                  className="w-full bg-sage hover:opacity-90 text-white py-2 rounded-lg font-bold text-sm disabled:opacity-40 transition flex items-center justify-center gap-2"
                >
                  <Plus size={16} />Add Meal
                </button>
                {selectedMeal && (
                  <p className="text-xs text-center text-sage">
                    Selected: {MEALS.find(m => m.id === selectedMeal)?.name}
                  </p>
                )}
              </div>
            </div>

            {/* BMR info */}
            <div className="bg-cream rounded-xl p-4 text-xs text-charcoal">
              <p className="font-bold mb-1">Daily Calorie Goal</p>
              <p className="text-gray-500">Based on your Mifflin-St Jeor BMR and activity level from your Profile.</p>
              <p className="mt-1 font-bold text-sage">{calorieGoal} kcal / day</p>
            </div>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-charcoal mb-4">Today's Meals</h2>
          {todaysMeals.length > 0 ? (
            <div className="space-y-3">
              {todaysMeals.map(meal => (
                <div key={meal.id} className="flex justify-between items-center p-3 bg-sage/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Apple className="text-sage" size={18} />
                    <div>
                      <p className="font-bold text-charcoal text-sm">{meal.name}</p>
                      <p className="text-xs text-gray-500">{meal.calories} cal</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteMeal(meal.id)} className="text-coral hover:text-red-700">
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6 text-sm">No meals logged today — select a meal above and click Add</p>
          )}
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-charcoal mb-4">Weekly Intake</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="calories" fill="#8BA88F" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
