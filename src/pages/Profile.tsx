import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Heart, Settings, Shield, ChevronDown, ChevronUp } from 'lucide-react';
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

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${on ? 'bg-sage' : 'bg-gray-200'}`}
  >
    <span className={`inline-block h-5 w-5 transform bg-white rounded-full shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const Section = ({ title, icon, children, defaultOpen = true }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sage/10 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-bold text-charcoal flex items-center gap-2 text-sm">{icon}{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
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
      clubsJoined: (() => { const s = localStorage.getItem('femfit-userClubs'); try { return s ? JSON.parse(s).joined.length : 0; } catch { return 0; } })(),
    });
  }, [searchParams]);

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
    free:    { name: 'Free',    color: 'from-gray-500 to-gray-700',   price: 'Free Forever' },
    premium: { name: 'Premium', color: 'from-sage to-charcoal',       price: '$9.99/month' },
    elite:   { name: 'Elite',   color: 'from-charcoal to-gray-900',   price: '$19.99/month' },
  };
  const currentTier = tierInfo[tier as keyof typeof tierInfo];

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen">

      {/* Header */}
      <div className="bg-sage px-4 pt-5 pb-6 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <User size={30} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">{profile.name}</h1>
              <p className="text-white/70 text-xs truncate">{profile.email}</p>
              {showcaseBadge && (
                <span className="text-lg mt-0.5 inline-block">
                  {BADGE_DEFS.find(b => b.id === showcaseBadge)?.icon}
                  <span className="text-xs text-white/80 ml-1">{BADGE_DEFS.find(b => b.id === showcaseBadge)?.name}</span>
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { label: 'Workouts', value: stats.workoutsCompleted },
              { label: 'Moves', value: stats.comfortMovesCompleted },
              { label: 'Dances', value: stats.dancesLearned },
              { label: 'Clubs', value: stats.clubsJoined },
            ].map(s => (
              <div key={s.label} className="bg-white/20 rounded-xl py-2 text-center">
                <p className="text-lg font-bold text-white leading-none">{s.value}</p>
                <p className="text-[10px] text-white/70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 space-y-3">

        {/* Membership Card */}
        <div className={`bg-gradient-to-br ${currentTier.color} rounded-2xl p-5 text-white shadow-sm`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs opacity-70 mb-0.5">Current Plan</p>
              <p className="text-xl font-bold">FemFit {currentTier.name}</p>
            </div>
            <p className="text-sm font-bold opacity-90">{currentTier.price}</p>
          </div>
          {tier !== 'free' && billingCycleEnd && (
            <p className="text-xs opacity-60 mb-3">Next billing: {new Date(billingCycleEnd).toLocaleDateString()}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            {tier === 'free' && (
              <>
                <button onClick={() => upgrade('premium')} className="bg-peach hover:bg-orange active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition">
                  Upgrade to Premium
                </button>
                <button onClick={() => upgrade('elite')} className="bg-white/20 hover:bg-white/30 active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition">
                  Try Elite
                </button>
              </>
            )}
            {(tier === 'premium' || tier === 'elite') && (
              <button className="bg-white/20 hover:bg-white/30 active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition">
                Manage Subscription
              </button>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <Section title="Personal Information" icon={<User size={16} className="text-sage" />}>
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
                    value={profile[f.name as keyof UserProfile] as string}
                    onChange={e => saveProfile({ ...profile, [f.name]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                    className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm focus:border-sage outline-none"
                  />
                </div>
              ))}
              <button onClick={() => setIsEditing(false)} className="w-full bg-sage text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition">
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Name', value: profile.name },
                  { label: 'Email', value: profile.email },
                  { label: 'Age', value: `${profile.age} years` },
                  { label: 'Cycle Length', value: `${profile.cycleLength} days` },
                ].map(r => (
                  <div key={r.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">{r.label}</p>
                    <p className="text-charcoal font-medium text-sm truncate">{r.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsEditing(true)} className="w-full border-2 border-sage/30 text-sage py-2.5 rounded-xl font-bold text-sm hover:bg-sage/5 active:scale-95 transition">
                Edit Profile
              </button>
            </div>
          )}
        </Section>

        {/* Health & Goals */}
        <Section title="Health & Goals" icon={<Heart size={16} className="text-peach" />}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Height (cm)</label>
              <input
                type="number"
                value={profile.height}
                onChange={e => saveProfile({ ...profile, height: parseInt(e.target.value) || 0 })}
                className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm focus:border-sage outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Weight (kg)</label>
              <input
                type="number"
                value={profile.weight}
                onChange={e => saveProfile({ ...profile, weight: parseInt(e.target.value) || 0 })}
                className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm focus:border-sage outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Goal Weight (kg)</label>
              <input
                type="number"
                value={profile.goalWeight}
                onChange={e => saveProfile({ ...profile, goalWeight: parseInt(e.target.value) || 0 })}
                className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm focus:border-sage outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Diet Type</label>
              <select
                value={profile.dietType}
                onChange={e => saveProfile({ ...profile, dietType: e.target.value as UserProfile['dietType'] })}
                className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm focus:border-sage outline-none bg-white"
              >
                {Object.entries(DIET_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-charcoal mb-1">Activity Level</label>
              <select
                value={profile.activityLevel}
                onChange={e => saveProfile({ ...profile, activityLevel: e.target.value as UserProfile['activityLevel'] })}
                className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm focus:border-sage outline-none bg-white"
              >
                {Object.entries(ACTIVITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-charcoal mb-1">Primary Goal</label>
              <select
                value={profile.goal}
                onChange={e => saveProfile({ ...profile, goal: e.target.value as UserProfile['goal'] })}
                className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm focus:border-sage outline-none bg-white"
              >
                {Object.entries(GOAL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-charcoal mb-1">Allergies / Food Notes</label>
              <input
                type="text"
                value={profile.allergies}
                onChange={e => saveProfile({ ...profile, allergies: e.target.value })}
                placeholder="e.g., nuts, soy"
                className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm focus:border-sage outline-none"
              />
            </div>
          </div>
        </Section>

        {/* Privacy & Display */}
        <Section title="Privacy & Display" icon={<Shield size={16} className="text-sage" />}>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-4">
            <div>
              <p className="font-medium text-charcoal text-sm">Post Anonymously</p>
              <p className="text-xs text-gray-400 mt-0.5">Shows as "Anonymous Member" in Social</p>
            </div>
            <Toggle
              on={profile.isAnonymous}
              onToggle={() => saveProfile({ ...profile, isAnonymous: !profile.isAnonymous })}
            />
          </div>

          <p className="text-sm font-bold text-charcoal mb-1">Showcase Badge</p>
          <p className="text-xs text-gray-400 mb-3">Tap a badge to display on your profile</p>
          {unlockedBadges.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-4">Complete activities to unlock badges</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {unlockedBadges.map(b => (
                <button
                  key={b.id}
                  onClick={() => setShowcase(b.id)}
                  className={`flex flex-col items-center p-2.5 rounded-xl border-2 transition active:scale-95 text-center ${
                    showcaseBadge === b.id ? 'border-sage bg-sage/10' : 'border-gray-100 hover:border-sage/40'
                  }`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-[10px] text-gray-500 mt-1 leading-tight">{b.name}</span>
                </button>
              ))}
            </div>
          )}
        </Section>

        {/* Preferences */}
        <Section title="Preferences" icon={<Settings size={16} className="text-sage" />} defaultOpen={false}>
          <div className="space-y-2">
            {[
              { key: 'notifications', label: 'Push Notifications', desc: 'Get alerts and reminders', icon: <Bell size={16} className="text-sage" /> },
              { key: 'dailyReminder',  label: 'Daily Reminder',     desc: 'Reminder to log mood daily', icon: <Heart size={16} className="text-peach" /> },
              { key: 'weeklyReport',   label: 'Weekly Report',      desc: 'Get weekly progress summary', icon: <Bell size={16} className="text-sage" /> },
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
        </Section>

        {/* Security */}
        <Section title="Security" icon={<Lock size={16} className="text-sage" />} defaultOpen={false}>
          <div className="space-y-2">
            <button className="w-full bg-sage/10 text-sage py-3 rounded-xl font-bold text-sm hover:bg-sage/20 active:scale-95 transition">
              Change Password
            </button>
            <button className="w-full bg-sage/10 text-sage py-3 rounded-xl font-bold text-sm hover:bg-sage/20 active:scale-95 transition">
              Two-Factor Authentication
            </button>
          </div>
        </Section>

        <div className="h-2" />
      </div>
    </div>
  );
};

export default Profile;
