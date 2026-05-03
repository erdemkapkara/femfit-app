import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Heart, Settings, Shield } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useMembership } from '../hooks/useMembership';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  cycleLength: number;
  cyclePhase: string;
  height: number;
  weight: number;
  goalWeight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietType: 'none' | 'vegetarian' | 'vegan' | 'gluten_free' | 'dairy_free' | 'keto' | 'paleo';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_fitness';
  allergies: string;
  isAnonymous: boolean;
}

const BADGE_DEFS = [
  { id: '1', icon: '👣', name: 'First Step' },
  { id: '2', icon: '💃', name: 'Dance Debut' },
  { id: '3', icon: '🌿', name: 'Comfort Seeker' },
  { id: '4', icon: '📊', name: 'Mood Tracker' },
  { id: '5', icon: '🏘️', name: 'Club Creator' },
  { id: '6', icon: '⚡', name: 'Week Warrior' },
  { id: '7', icon: '🎭', name: 'Dance Master' },
  { id: '8', icon: '👑', name: 'Wellness Champion' },
];

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentary (little/no exercise)',
  light: 'Light (1-3 days/week)',
  moderate: 'Moderate (3-5 days/week)',
  active: 'Active (6-7 days/week)',
  very_active: 'Very Active (hard daily exercise)',
};

const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Lose Weight',
  maintain: 'Maintain Weight',
  gain_muscle: 'Gain Muscle',
  improve_fitness: 'Improve Fitness',
};

const DIET_LABELS: Record<string, string> = {
  none: 'No restrictions',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  gluten_free: 'Gluten-Free',
  dairy_free: 'Dairy-Free',
  keto: 'Keto',
  paleo: 'Paleo',
};

const defaultProfile: UserProfile = {
  name: 'Your Name',
  email: 'your.email@example.com',
  age: 25,
  cycleLength: 28,
  cyclePhase: 'Follicular',
  height: 165,
  weight: 65,
  goalWeight: 60,
  activityLevel: 'moderate',
  dietType: 'none',
  goal: 'improve_fitness',
  allergies: '',
  isAnonymous: false,
};

const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { tier, upgrade, billingCycleEnd } = useMembership();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({ notifications: true, dailyReminder: true, weeklyReport: true });
  const [showcaseBadge, setShowcaseBadge] = useState<string>('');
  const [stats, setStats] = useState({ workoutsCompleted: 0, comfortMovesCompleted: 0, dancesLearned: 0, clubsJoined: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('femfit-profile');
    if (saved) setProfile({ ...defaultProfile, ...JSON.parse(saved) });

    const savedSettings = localStorage.getItem('femfit-settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const sb = localStorage.getItem('femfit-showcase-badge');
    if (sb) setShowcaseBadge(sb);

    setStats({
      workoutsCompleted: (() => { const s = localStorage.getItem('femfit-startedWorkouts'); return s ? JSON.parse(s).length : 0; })(),
      comfortMovesCompleted: (() => { const s = localStorage.getItem('femfit-completedMoves'); return s ? JSON.parse(s).length : 0; })(),
      dancesLearned: (() => { const s = localStorage.getItem('femfit-completedDances'); return s ? JSON.parse(s).length : 0; })(),
      clubsJoined: (() => { const s = localStorage.getItem('femfit-userClubs'); return s ? JSON.parse(s).joined.length : 0; })(),
    });
  }, [searchParams]);

  // Compute unlocked badges
  const unlockedBadges = BADGE_DEFS.filter(b => {
    if (b.id === '1') return stats.workoutsCompleted >= 1;
    if (b.id === '2') return stats.dancesLearned >= 1;
    if (b.id === '3') return stats.comfortMovesCompleted >= 3;
    if (b.id === '5') return stats.clubsJoined >= 1;
    if (b.id === '6') return stats.workoutsCompleted >= 7;
    if (b.id === '7') return stats.dancesLearned >= 5;
    return false;
  });

  const saveProfile = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('femfit-profile', JSON.stringify(p));
  };

  const handleSettingsChange = (key: string) => {
    const updated = { ...settings, [key]: !settings[key as keyof typeof settings] };
    setSettings(updated);
    localStorage.setItem('femfit-settings', JSON.stringify(updated));
  };

  const setShowcase = (id: string) => {
    const val = showcaseBadge === id ? '' : id;
    setShowcaseBadge(val);
    localStorage.setItem('femfit-showcase-badge', val);
  };

  const tierInfo = {
    free:    { name: 'Free',    color: 'from-gray-400 to-gray-600',         price: 'Free Forever' },
    premium: { name: 'Premium', color: 'from-sage to-charcoal',             price: '$9.99/month' },
    elite:   { name: 'Elite',   color: 'from-charcoal to-gray-900',         price: '$19.99/month' },
  };
  const currentTier = tierInfo[tier as keyof typeof tierInfo];

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${on ? 'bg-sage' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-5 w-5 transform bg-white rounded-full shadow transition ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-charcoal mb-6">Profile</h1>

        {/* Membership Card */}
        <div className={`bg-gradient-to-br ${currentTier.color} rounded-xl shadow p-7 text-white mb-6`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm opacity-80 mb-0.5">Current Plan</p>
              <h2 className="text-2xl font-bold">FemFit {currentTier.name}</h2>
              {showcaseBadge && (
                <span className="text-2xl mt-1 inline-block">
                  {BADGE_DEFS.find(b => b.id === showcaseBadge)?.icon}
                </span>
              )}
            </div>
            <p className="text-xl font-bold">{currentTier.price}</p>
          </div>
          {tier !== 'free' && billingCycleEnd && (
            <p className="text-xs opacity-70 mb-3">Next billing: {new Date(billingCycleEnd).toLocaleDateString()}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            {tier === 'free' && (
              <>
                <button onClick={() => upgrade('premium')} className="bg-peach hover:bg-orange text-white px-4 py-2 rounded-lg font-bold text-sm">Upgrade to Premium</button>
                <button onClick={() => upgrade('elite')} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold text-sm">Try Elite</button>
              </>
            )}
            {(tier === 'premium' || tier === 'elite') && (
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold text-sm">Manage Subscription</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: avatar + stats */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-sage text-white rounded-xl p-6">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <User size={28} />
              </div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-xs opacity-80">{profile.email}</p>
            </div>
            {[
              { label: 'Workouts', value: stats.workoutsCompleted },
              { label: 'Comfort Moves', value: stats.comfortMovesCompleted },
              { label: 'Dances', value: stats.dancesLearned },
              { label: 'Clubs', value: stats.clubsJoined },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl shadow p-3 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500 uppercase">{s.label}</p>
                <p className="text-2xl font-bold text-sage">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Right column: forms */}
          <div className="md:col-span-2 space-y-5">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
                  <User size={18} className="text-sage" />Personal Information
                </h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-sage font-bold text-sm">Edit</button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  {[
                    { label: 'Name', name: 'name', type: 'text' },
                    { label: 'Email', name: 'email', type: 'email' },
                    { label: 'Age', name: 'age', type: 'number' },
                    { label: 'Cycle Length (days)', name: 'cycleLength', type: 'number' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-xs font-bold text-charcoal mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        name={f.name}
                        value={profile[f.name as keyof UserProfile] as string}
                        onChange={e => saveProfile({ ...profile, [f.name]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                        className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                      />
                    </div>
                  ))}
                  <button onClick={() => setIsEditing(false)} className="w-full bg-sage text-white py-2 rounded-lg font-bold text-sm mt-1">
                    Done
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Name', value: profile.name },
                    { label: 'Email', value: profile.email },
                    { label: 'Age', value: `${profile.age} years` },
                    { label: 'Cycle Length', value: `${profile.cycleLength} days` },
                  ].map(r => (
                    <div key={r.label}>
                      <p className="text-xs text-gray-400 font-bold uppercase">{r.label}</p>
                      <p className="text-charcoal">{r.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Health & Goals */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-charcoal flex items-center gap-2 mb-4">
                <Heart size={18} className="text-peach" />Health & Goals
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={e => saveProfile({ ...profile, height: parseInt(e.target.value) || 0 })}
                    className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={e => saveProfile({ ...profile, weight: parseInt(e.target.value) || 0 })}
                    className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Goal Weight (kg)</label>
                  <input
                    type="number"
                    value={profile.goalWeight}
                    onChange={e => saveProfile({ ...profile, goalWeight: parseInt(e.target.value) || 0 })}
                    className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Diet Type</label>
                  <select
                    value={profile.dietType}
                    onChange={e => saveProfile({ ...profile, dietType: e.target.value as UserProfile['dietType'] })}
                    className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                  >
                    {Object.entries(DIET_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Activity Level</label>
                  <select
                    value={profile.activityLevel}
                    onChange={e => saveProfile({ ...profile, activityLevel: e.target.value as UserProfile['activityLevel'] })}
                    className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none col-span-2"
                  >
                    {Object.entries(ACTIVITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Primary Goal</label>
                  <select
                    value={profile.goal}
                    onChange={e => saveProfile({ ...profile, goal: e.target.value as UserProfile['goal'] })}
                    className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                  >
                    {Object.entries(GOAL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-bold text-charcoal mb-1">Allergies / Food Notes</label>
                <input
                  type="text"
                  value={profile.allergies}
                  onChange={e => saveProfile({ ...profile, allergies: e.target.value })}
                  placeholder="e.g., nuts, soy"
                  className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                />
              </div>
            </div>

            {/* Privacy & Display */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-charcoal flex items-center gap-2 mb-4">
                <Shield size={18} className="text-sage" />Privacy & Display
              </h2>

              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-medium text-charcoal text-sm">Post Anonymously</p>
                  <p className="text-xs text-gray-400">Your name shows as "Anonymous Member" in Social</p>
                </div>
                <Toggle
                  on={profile.isAnonymous}
                  onToggle={() => saveProfile({ ...profile, isAnonymous: !profile.isAnonymous })}
                />
              </div>

              {/* Badge Showcase */}
              <p className="text-sm font-bold text-charcoal mb-2">Showcase Badge</p>
              <p className="text-xs text-gray-400 mb-3">Select a badge to display on your profile card</p>
              {unlockedBadges.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Complete activities to unlock badges</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {unlockedBadges.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setShowcase(b.id)}
                      className={`flex flex-col items-center p-2 rounded-xl border-2 transition text-center ${
                        showcaseBadge === b.id ? 'border-sage bg-sage/10' : 'border-gray-100 hover:border-sage/40'
                      }`}
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <span className="text-xs text-gray-500 mt-0.5">{b.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-charcoal flex items-center gap-2 mb-4">
                <Settings size={18} className="text-sage" />Preferences
              </h2>
              <div className="space-y-3">
                {[
                  { key: 'notifications', label: 'Push Notifications', desc: 'Get alerts and reminders', icon: <Bell size={18} className="text-sage" /> },
                  { key: 'dailyReminder',  label: 'Daily Reminder',     desc: 'Reminder to log mood daily', icon: <Heart size={18} className="text-peach" /> },
                  { key: 'weeklyReport',   label: 'Weekly Report',      desc: 'Get weekly progress summary', icon: <Bell size={18} className="text-sage" /> },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {s.icon}
                      <div>
                        <p className="font-medium text-charcoal text-sm">{s.label}</p>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </div>
                    </div>
                    <Toggle on={settings[s.key as keyof typeof settings]} onToggle={() => handleSettingsChange(s.key)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-charcoal flex items-center gap-2 mb-4">
                <Lock size={18} className="text-sage" />Security
              </h2>
              <div className="space-y-2">
                <button className="w-full bg-sage/10 text-sage py-2.5 rounded-lg font-bold text-sm hover:bg-sage/20 transition">Change Password</button>
                <button className="w-full bg-sage/10 text-sage py-2.5 rounded-lg font-bold text-sm hover:bg-sage/20 transition">Two-Factor Authentication</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
