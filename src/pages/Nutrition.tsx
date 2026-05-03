import React, { useState, useEffect } from 'react';
import { Apple, Plus, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Meal { id: string; name: string; calories: number; phase: string; nutrients: string; dietTypes: string[]; }
interface LoggedMeal { id: string; name: string; calories: number; date: string; }

const MEALS: Meal[] = [
  { id:'1',  name:'Spinach & Lentil Bowl',       calories:380, phase:'Menstrual',  nutrients:'Iron, Protein',          dietTypes:['vegetarian','vegan','gluten_free'] },
  { id:'2',  name:'Red Meat & Sweet Potato',      calories:520, phase:'Menstrual',  nutrients:'Iron, B12',              dietTypes:[] },
  { id:'3',  name:'Dark Chocolate & Almonds',     calories:250, phase:'Menstrual',  nutrients:'Magnesium',              dietTypes:['vegetarian','vegan','gluten_free','dairy_free'] },
  { id:'4',  name:'Avocado Toast & Egg',          calories:350, phase:'Follicular', nutrients:'Healthy Fats',           dietTypes:['vegetarian'] },
  { id:'5',  name:'Quinoa Power Salad',           calories:420, phase:'Follicular', nutrients:'Protein, Fiber',         dietTypes:['vegetarian','vegan','gluten_free','dairy_free'] },
  { id:'6',  name:'Green Smoothie Bowl',          calories:320, phase:'Follicular', nutrients:'Vitamins, Antioxidants', dietTypes:['vegetarian','vegan','gluten_free','dairy_free'] },
  { id:'7',  name:'Grilled Chicken & Brown Rice', calories:580, phase:'Ovulation',  nutrients:'Protein',               dietTypes:['gluten_free','dairy_free'] },
  { id:'8',  name:'Salmon & Asparagus',           calories:550, phase:'Ovulation',  nutrients:'Omega-3, Protein',      dietTypes:['gluten_free','dairy_free'] },
  { id:'9',  name:'Turkey Meatballs & Pasta',     calories:520, phase:'Ovulation',  nutrients:'Lean Protein',          dietTypes:['dairy_free'] },
  { id:'10', name:'Sweet Potato & Bean Stew',     calories:480, phase:'Luteal',     nutrients:'Complex Carbs',         dietTypes:['vegetarian','vegan','gluten_free','dairy_free'] },
  { id:'11', name:'Whole Wheat Pasta & Veggies',  calories:450, phase:'Luteal',     nutrients:'Fiber',                 dietTypes:['vegetarian','vegan','dairy_free'] },
  { id:'12', name:'Oatmeal with Banana & Nuts',   calories:380, phase:'Luteal',     nutrients:'Complex Carbs',         dietTypes:['vegetarian','vegan','dairy_free'] },
  { id:'13', name:'Tofu Stir-Fry Bowl',           calories:380, phase:'Follicular', nutrients:'Plant Protein',         dietTypes:['vegetarian','vegan','gluten_free','dairy_free'] },
  { id:'14', name:'Chickpea Curry',               calories:420, phase:'Luteal',     nutrients:'Plant Protein, Iron',   dietTypes:['vegetarian','vegan','gluten_free','dairy_free'] },
  { id:'15', name:'Lentil Soup',                  calories:340, phase:'Menstrual',  nutrients:'Iron, Fiber',           dietTypes:['vegetarian','vegan','gluten_free','dairy_free'] },
  { id:'16', name:'Cauliflower Rice Bowl',         calories:310, phase:'Luteal',     nutrients:'Low Carb, Fiber',       dietTypes:['vegetarian','vegan','gluten_free','dairy_free','keto','paleo'] },
  { id:'17', name:'Zucchini Noodles & Pesto',     calories:360, phase:'Follicular', nutrients:'Healthy Fats',          dietTypes:['vegetarian','vegan','gluten_free','dairy_free'] },
  { id:'18', name:'Egg & Avocado Keto Bowl',      calories:490, phase:'Ovulation',  nutrients:'Healthy Fats, Protein', dietTypes:['vegetarian','gluten_free','keto','paleo'] },
];

const PHASE_STYLE: Record<string, { pill: string; card: string }> = {
  Menstrual:  { pill:'bg-peach text-white',          card:'bg-peach/10 border-peach/30' },
  Follicular: { pill:'bg-yellow text-charcoal',      card:'bg-yellow/10 border-yellow/30' },
  Ovulation:  { pill:'bg-orange text-white',         card:'bg-orange/10 border-orange/30' },
  Luteal:     { pill:'bg-sage text-white',           card:'bg-sage/10 border-sage/30' },
};

const DIET_LABELS: Record<string, string> = {
  none:'No restrictions', vegetarian:'Vegetarian', vegan:'Vegan',
  gluten_free:'Gluten-Free', dairy_free:'Dairy-Free', keto:'Keto', paleo:'Paleo',
};

const ACTIVITY_MULT: Record<string, number> = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very_active:1.9 };

const Nutrition: React.FC = () => {
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [currentPhase, setCurrentPhase] = useState('Follicular');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dietType, setDietType] = useState('none');
  const [calorieGoal, setCalorieGoal] = useState(2000);

  useEffect(() => {
    const cycle = localStorage.getItem('femfit-cycle');
    if (cycle) {
      const data = JSON.parse(cycle);
      const diff = Math.floor((Date.now()-new Date(data.startDate).getTime())/86400000);
      const day = (diff % data.cycleLength) + 1;
      if (day <= data.period) setCurrentPhase('Menstrual');
      else if (day <= data.period+8) setCurrentPhase('Follicular');
      else if (day <= data.period+13) setCurrentPhase('Ovulation');
      else setCurrentPhase('Luteal');
    }
    const saved = localStorage.getItem('femfit-meals');
    if (saved) setLoggedMeals(JSON.parse(saved));
    const profile = localStorage.getItem('femfit-profile');
    if (profile) {
      const p = JSON.parse(profile);
      setDietType(p.dietType || 'none');
      if (p.weight && p.height && p.age) {
        const bmr = Math.round(10*p.weight + 6.25*p.height - 5*p.age - 161);
        setCalorieGoal(Math.round(bmr * (ACTIVITY_MULT[p.activityLevel||'moderate'])));
      }
    }
  }, []);

  const addMeal = () => {
    if (!selectedMeal) return;
    const meal = MEALS.find(m => m.id === selectedMeal);
    if (!meal) return;
    const entry: LoggedMeal = { id: Date.now().toString(), name: meal.name, calories: meal.calories, date: selectedDate };
    const upd = [...loggedMeals, entry];
    setLoggedMeals(upd);
    localStorage.setItem('femfit-meals', JSON.stringify(upd));
    setSelectedMeal('');
  };

  const deleteMeal = (id: string) => {
    const upd = loggedMeals.filter(m => m.id !== id);
    setLoggedMeals(upd);
    localStorage.setItem('femfit-meals', JSON.stringify(upd));
  };

  const meetsDiet = (meal: Meal) => dietType === 'none' || meal.dietTypes.includes(dietType);
  const recommended = MEALS.filter(m => m.phase === currentPhase && meetsDiet(m));
  const todaysMeals = loggedMeals.filter(m => m.date === selectedDate);
  const todaysCalories = todaysMeals.reduce((s, m) => s + m.calories, 0);
  const caloriePercent = Math.min(100, Math.round((todaysCalories / calorieGoal) * 100));
  const phaseStyle = PHASE_STYLE[currentPhase];

  const weekData = [
    { date:'Mon', cal:1800 }, { date:'Tue', cal:1950 },
    { date:'Wed', cal: todaysCalories > 0 ? todaysCalories : 2100 },
    { date:'Thu', cal:1850 }, { date:'Fri', cal:2200 },
    { date:'Sat', cal:2000 }, { date:'Sun', cal:1900 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen">
      {/* Header */}
      <div className="bg-sage px-4 pt-5 pb-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Nutrition</h1>
          <p className="text-white/70 text-sm">Phase-synced meal recommendations</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* Calorie summary card */}
        <div className={`rounded-2xl p-5 ${phaseStyle.pill}`}>
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs font-bold opacity-70 uppercase">Today's Calories</p>
              <p className="text-4xl font-bold leading-none">{todaysCalories}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">Goal</p>
              <p className="text-xl font-bold">{calorieGoal}</p>
            </div>
          </div>
          <div className="bg-white/30 rounded-full h-2.5">
            <div className="bg-white h-2.5 rounded-full transition-all" style={{ width:`${caloriePercent}%` }} />
          </div>
          <p className="text-xs opacity-70 mt-1">{caloriePercent}% of daily goal</p>
        </div>

        {/* Recommended meals */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-charcoal text-base">Recommended</h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${phaseStyle.pill}`}>{currentPhase}</span>
          </div>
          {dietType !== 'none' && (
            <p className="text-xs text-sage font-medium mb-3">Filtered: {DIET_LABELS[dietType]}</p>
          )}
          {recommended.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No meals match your diet preference for this phase.</p>
          ) : (
            <div className="space-y-2 mt-3">
              {recommended.map(meal => (
                <div key={meal.id} onClick={() => setSelectedMeal(meal.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all active:scale-98 ${
                    selectedMeal === meal.id ? 'border-sage bg-sage/5' : `border-gray-100 hover:border-sage/30`
                  }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-charcoal text-sm">{meal.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{meal.nutrients}</p>
                    </div>
                    <p className="font-bold text-sage text-sm ml-3 flex-shrink-0">{meal.calories} cal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick add */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
          <h3 className="font-bold text-charcoal text-sm mb-3">Quick Add</h3>
          <div className="flex gap-2">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="border border-sage/30 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage flex-shrink-0" />
            <button onClick={addMeal} disabled={!selectedMeal}
              className="flex-1 bg-sage hover:opacity-90 text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 active:scale-95 transition flex items-center justify-center gap-2">
              <Plus size={15} />Add
              {selectedMeal && <span className="hidden sm:inline text-white/80 font-normal text-xs">· {MEALS.find(m=>m.id===selectedMeal)?.name}</span>}
            </button>
          </div>
          {selectedMeal && (
            <p className="text-xs text-sage mt-2 font-medium">Selected: {MEALS.find(m=>m.id===selectedMeal)?.name}</p>
          )}
        </div>

        {/* Today's meals */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
          <h2 className="font-bold text-charcoal mb-3">Today's Meals</h2>
          {todaysMeals.length > 0 ? (
            <div className="space-y-2">
              {todaysMeals.map(meal => (
                <div key={meal.id} className="flex items-center justify-between p-3 bg-sage/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Apple size={16} className="text-sage flex-shrink-0" />
                    <div>
                      <p className="font-bold text-charcoal text-sm">{meal.name}</p>
                      <p className="text-xs text-gray-500">{meal.calories} cal</p>
                    </div>
                  </div>
                  <button onClick={() => deleteMeal(meal.id)} className="p-1.5 rounded-lg hover:bg-red-50 active:scale-90 transition">
                    <X size={15} className="text-coral" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">Select a meal above and tap Add</p>
          )}
        </div>

        {/* Weekly chart */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
          <h2 className="font-bold text-charcoal mb-4">Weekly Intake</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="cal" fill="#8BA88F" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
