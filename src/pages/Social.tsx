import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Calendar, Plus, X, UserPlus, Send } from 'lucide-react';
import TabBar from '../components/TabBar';
import PremiumLockCard from '../components/PremiumLockCard';
import { useMembership } from '../hooks/useMembership';
import { filterText, containsPersonalInfo, hasProfanity } from '../utils/profanityFilter';

interface Club {
  id: string;
  name: string;
  location: string;
  members: number;
  description: string;
  nextMeetup: string;
  image: string;
}

interface ChallengeDef {
  id: string;
  title: string;
  description: string;
  goal: number;
  endsAt: string;
  badge: string;
  participants: number;
  category: string;
}

interface ChallengeProgress {
  joined: boolean;
  progress: number;
}

interface Message {
  sender: string;
  text: string;
  timestamp: string;
  anonymous: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiresPremium?: boolean;
}

const CLUB_MEMBERS = [
  { id: 'sarah', name: 'Sarah M.', avatar: '🌸' },
  { id: 'priya', name: 'Priya K.', avatar: '🌿' },
  { id: 'emma',  name: 'Emma L.',  avatar: '💪' },
  { id: 'lisa',  name: 'Lisa T.',  avatar: '🎵' },
];

const CHALLENGE_DEFS: ChallengeDef[] = [
  { id: '3', title: 'Week of Wellness',  description: 'Complete 1 workout every day for a week', goal: 7,  endsAt: '2025-12-31', badge: '🎯', participants: 1204, category: 'Wellness' },
  { id: '1', title: '30 Days of Yoga',   description: 'Complete at least 3 yoga sessions per week', goal: 30, endsAt: '2026-01-02', badge: '🧘', participants: 847,  category: 'Yoga'    },
  { id: '2', title: 'Dance Your Way',    description: 'Learn and complete 5 new dance routines', goal: 5,  endsAt: '2026-01-15', badge: '💃', participants: 523,  category: 'Dance'   },
  { id: '4', title: 'Cycle Sync Pro',    description: 'Track your cycle and do recommended workouts', goal: 28, endsAt: '2026-01-30', badge: '💜', participants: 389,  category: 'Cycle'   },
];

const Social: React.FC = () => {
  const { isPremium } = useMembership();
  const [activeTab, setActiveTab] = useState(0);

  // Profile / anonymity
  const [isAnonymous, setIsAnonymous] = useState(false);
  const myDisplayName = isAnonymous ? 'Anonymous Member' : 'You';

  // Clubs
  const [clubs, setClubs] = useState<Club[]>([
    { id: '1', name: 'Downtown Yoga Circle', location: 'Downtown District', members: 24, description: 'Weekly yoga sessions with like-minded women',  nextMeetup: '2026-05-15', image: '🧘' },
    { id: '2', name: 'Morning Runners',       location: 'City Park',         members: 31, description: 'Early morning running group, all levels welcome', nextMeetup: '2026-05-14', image: '🏃' },
    { id: '3', name: 'Strength & Sisters',    location: 'Gym on Main',       members: 18, description: 'Empowering strength training sessions',           nextMeetup: '2026-05-16', image: '💪' },
    { id: '4', name: 'Dance Fitness Crew',    location: 'Studio Central',    members: 27, description: 'Have fun while getting fit with dance',           nextMeetup: '2026-05-17', image: '💃' },
  ]);
  const [userClubs, setUserClubs] = useState<{ joined: string[] }>({ joined: [] });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', location: '', description: '' });
  const [personalInfoWarning, setPersonalInfoWarning] = useState(false);

  // Challenges
  const [challengeProgress, setChallengeProgress] = useState<Record<string, ChallengeProgress>>({});

  // Messages
  const [selectedContact, setSelectedContact] = useState<typeof CLUB_MEMBERS[0] | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [msgInput, setMsgInput] = useState('');
  const msgEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedClubs = localStorage.getItem('femfit-userClubs');
    if (savedClubs) setUserClubs(JSON.parse(savedClubs));

    const savedChallenges = localStorage.getItem('femfit-challenges');
    if (savedChallenges) setChallengeProgress(JSON.parse(savedChallenges));

    const savedMsgs = localStorage.getItem('femfit-messages');
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));

    const profile = localStorage.getItem('femfit-profile');
    if (profile) {
      const p = JSON.parse(profile);
      setIsAnonymous(p.isAnonymous || false);
    }
  }, []);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  // Badges computation
  const computeBadges = (): Badge[] => {
    const workoutCount = (() => { const s = localStorage.getItem('femfit-startedWorkouts'); return s ? JSON.parse(s).length : 0; })();
    const movesCount   = (() => { const s = localStorage.getItem('femfit-completedMoves');  return s ? JSON.parse(s).length : 0; })();
    const danceCount   = (() => { const s = localStorage.getItem('femfit-completedDances'); return s ? JSON.parse(s).length : 0; })();
    const moodCount    = (() => { const s = localStorage.getItem('femfit-moodHistory');     return s ? JSON.parse(s).length : 0; })();
    const clubCount    = (() => { const s = localStorage.getItem('femfit-userClubs');       return s ? JSON.parse(s).joined.length : 0; })();

    const base: Badge[] = [
      { id: '1', name: 'First Step',         description: 'Complete your first workout',   icon: '👣', unlocked: workoutCount >= 1 },
      { id: '2', name: 'Dance Debut',         description: 'Complete your first dance',     icon: '💃', unlocked: danceCount >= 1 },
      { id: '3', name: 'Comfort Seeker',      description: 'Complete 3 comfort moves',      icon: '🌿', unlocked: movesCount >= 3 },
      { id: '4', name: 'Mood Tracker',        description: 'Log your mood 7 times',         icon: '📊', unlocked: moodCount >= 7 },
      { id: '5', name: 'Club Creator',        description: 'Create or join a club',         icon: '🏘️', unlocked: clubCount >= 1 },
      { id: '6', name: 'Week Warrior',        description: 'Complete 7 workouts',           icon: '⚡', unlocked: workoutCount >= 7 },
      { id: '7', name: 'Dance Master',        description: 'Complete 5 different dances',   icon: '🎭', unlocked: danceCount >= 5 },
    ];
    const unlockedCount = base.filter(b => b.unlocked).length;
    base.push({ id: '8', name: 'Wellness Champion', description: 'Unlock 5 badges', icon: '👑', unlocked: unlockedCount >= 5 });

    const premiumBadges: Badge[] = [
      { id: 'p1', name: 'Premium Member', description: 'Active Premium subscription',      icon: '💎', unlocked: isPremium, requiresPremium: true },
      { id: 'p2', name: 'Streak Queen',   description: '30-day workout streak',            icon: '🔥', unlocked: isPremium && workoutCount >= 30, requiresPremium: true },
      { id: 'p3', name: 'Dance Diva',     description: 'Complete all dance styles',        icon: '💃', unlocked: isPremium && danceCount >= 8, requiresPremium: true },
      { id: 'p4', name: 'Wellness Guru',  description: 'Complete all badge categories',   icon: '🌟', unlocked: isPremium && unlockedCount >= 8, requiresPremium: true },
    ];

    return [...base, ...premiumBadges];
  };

  const badges = computeBadges();

  // Club handlers
  const handleJoinClub = (clubId: string) => {
    const updated = userClubs.joined.includes(clubId)
      ? userClubs.joined.filter(id => id !== clubId)
      : [...userClubs.joined, clubId];
    setUserClubs({ joined: updated });
    localStorage.setItem('femfit-userClubs', JSON.stringify({ joined: updated }));
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.name || !newClub.location) return;

    const filteredName = filterText(newClub.name);
    const filteredDesc = filterText(newClub.description);

    if (containsPersonalInfo(newClub.name) || containsPersonalInfo(newClub.description)) {
      setPersonalInfoWarning(true);
      return;
    }

    const club: Club = {
      id: Date.now().toString(),
      name: filteredName,
      location: newClub.location,
      description: filteredDesc,
      members: 1,
      nextMeetup: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      image: '✨',
    };
    const newClubs = [...clubs, club];
    setClubs(newClubs);
    const updatedJoined = [...userClubs.joined, club.id];
    setUserClubs({ joined: updatedJoined });
    localStorage.setItem('femfit-userClubs', JSON.stringify({ joined: updatedJoined }));
    setNewClub({ name: '', location: '', description: '' });
    setPersonalInfoWarning(false);
    setShowCreateForm(false);
  };

  // Challenge handlers
  const handleJoinChallenge = (challengeId: string) => {
    const updated = { ...challengeProgress, [challengeId]: { joined: true, progress: challengeProgress[challengeId]?.progress || 0 } };
    setChallengeProgress(updated);
    localStorage.setItem('femfit-challenges', JSON.stringify(updated));
  };

  // Message handlers
  const handleSendMessage = () => {
    if (!msgInput.trim() || !selectedContact) return;
    const text = filterText(msgInput.trim());
    const msg: Message = {
      sender: myDisplayName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      anonymous: isAnonymous,
    };
    const convId = selectedContact.id;
    const conv = [...(messages[convId] || []), msg];
    const updated = { ...messages, [convId]: conv };
    setMessages(updated);
    localStorage.setItem('femfit-messages', JSON.stringify(updated));
    setMsgInput('');
  };

  const joinedClubData = clubs.filter(c => userClubs.joined.includes(c.id));
  const availableClubs = clubs.filter(c => !userClubs.joined.includes(c.id));

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-charcoal mb-6">Social</h1>
          <PremiumLockCard tier="premium" style="banner" />
          <div className="text-center py-12 text-gray-500">Upgrade to Premium to access all social features!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-charcoal mb-6">Social</h1>

        <TabBar
          tabs={['Feed', 'Challenges', 'Clubs', 'Messages', 'Achievements']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* FEED TAB */}
        {activeTab === 0 && (
          <div className="space-y-3">
            {[
              { user: 'Sarah M.',  avatar: '🌸', action: 'completed HIIT Bootcamp',                       timestamp: '2 hours ago',  badge: null },
              { user: 'Priya K.',  avatar: '🌿', action: 'joined 30 Days of Yoga challenge',             timestamp: '4 hours ago',  badge: null },
              { user: 'Emma L.',   avatar: '💪', action: "unlocked 'Week Warrior' badge",               timestamp: '6 hours ago',  badge: '⚡' },
              { user: 'Lisa T.',   avatar: '🎵', action: 'completed 5 dance routines',                  timestamp: '8 hours ago',  badge: null },
              { user: 'Nina P.',   avatar: '🏃', action: 'joined Morning Runners club',                 timestamp: '10 hours ago', badge: null },
              { user: 'Alex J.',   avatar: '🧘', action: 'started Week of Wellness challenge',          timestamp: '12 hours ago', badge: null },
              { user: 'Maya R.',   avatar: '✨', action: "unlocked 'Dance Debut' badge",                timestamp: '14 hours ago', badge: '💃' },
              { user: 'Sophie D.', avatar: '🌺', action: 'completed Comfortable Moves routine',         timestamp: '16 hours ago', badge: null },
              { user: 'Jordan K.', avatar: '🎉', action: 'created Dance Fitness Crew club',             timestamp: '1 day ago',    badge: null },
              { user: 'Taylor M.', avatar: '💕', action: 'reached cycle awareness milestone',           timestamp: '1 day ago',    badge: null },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-4 border-l-4 border-sage">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{item.avatar}</div>
                  <div className="flex-1">
                    <p className="font-bold text-charcoal">
                      {isAnonymous && idx === 0 ? 'Anonymous Member' : item.user}
                    </p>
                    <p className="text-gray-600 text-sm">{item.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.timestamp}</p>
                  </div>
                  {item.badge && (
                    <div className="text-3xl" title="Badge unlocked">{item.badge}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CHALLENGES TAB */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CHALLENGE_DEFS.map((challenge) => {
              const prog = challengeProgress[challenge.id];
              const joined = prog?.joined || false;
              const progress = prog?.progress || 0;
              const pct = Math.min(100, (progress / challenge.goal) * 100);
              return (
                <div key={challenge.id} className="bg-white rounded-xl shadow p-5 relative">
                  {/* Participant count badge */}
                  <div className="absolute top-3 right-3 bg-peach/10 text-peach text-xs font-bold px-2 py-1 rounded-full">
                    🔥 {challenge.participants.toLocaleString()} joined
                  </div>

                  <div className="flex items-start gap-3 mb-3 pr-24">
                    <div className="text-3xl">{challenge.badge}</div>
                    <div>
                      <h3 className="font-bold text-charcoal">{challenge.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{challenge.description}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-bold text-charcoal">{progress} / {challenge.goal}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-sage h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-3">Ends: {challenge.endsAt}</p>

                  {joined ? (
                    <div className="w-full bg-sage/10 text-sage py-2 rounded-lg font-bold text-sm text-center">
                      ✓ Joined — keep going!
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="w-full bg-sage hover:opacity-90 text-white py-2 rounded-lg font-bold text-sm transition"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CLUBS TAB */}
        {activeTab === 2 && (
          <div>
            <div className="flex justify-end mb-5">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-sage text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition flex items-center gap-2"
              >
                <Plus size={16} />Create Club
              </button>
            </div>

            {showCreateForm && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-lg font-bold text-charcoal mb-4">Create a New Club</h2>

                {personalInfoWarning && (
                  <div className="bg-yellow/30 border border-yellow rounded-lg p-3 mb-4 text-sm text-charcoal flex items-start gap-2">
                    <span>⚠️</span>
                    <div>
                      <strong>Personal info detected.</strong> Please keep phone numbers and email addresses private.
                      <button
                        className="ml-2 underline text-xs"
                        onClick={() => setPersonalInfoWarning(false)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleCreateClub} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Club Name</label>
                    <input
                      type="text"
                      value={newClub.name}
                      onChange={e => setNewClub({ ...newClub, name: e.target.value })}
                      className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                      placeholder="e.g., Morning Yoga Warriors"
                      required
                    />
                    {hasProfanity(newClub.name) && (
                      <p className="text-xs text-coral mt-1">Inappropriate words will be filtered.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Location</label>
                    <input
                      type="text"
                      value={newClub.location}
                      onChange={e => setNewClub({ ...newClub, location: e.target.value })}
                      className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                      placeholder="e.g., Central Park"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Description</label>
                    <textarea
                      value={newClub.description}
                      onChange={e => setNewClub({ ...newClub, description: e.target.value })}
                      className="w-full border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                      placeholder="Describe your club…"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-sage text-white py-2 rounded-lg font-bold text-sm hover:opacity-90">
                      Create Club
                    </button>
                    <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 bg-gray-100 text-charcoal py-2 rounded-lg font-bold text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {joinedClubData.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-charcoal mb-3">My Clubs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {joinedClubData.map(club => (
                    <div key={club.id} className="bg-sage text-white rounded-xl p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-3xl">{club.image}</div>
                        <button onClick={() => handleJoinClub(club.id)}><X size={18} className="opacity-70" /></button>
                      </div>
                      <h3 className="font-bold mb-2">{club.name}</h3>
                      <div className="text-xs opacity-80 space-y-1">
                        <p className="flex items-center gap-1"><MapPin size={12} />{club.location}</p>
                        <p className="flex items-center gap-1"><Users size={12} />{club.members} members</p>
                        <p className="flex items-center gap-1"><Calendar size={12} />Next: {club.nextMeetup}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-lg font-bold text-charcoal mb-3">Available Clubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableClubs.map(club => (
                <div key={club.id} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
                  <div className="text-3xl mb-2">{club.image}</div>
                  <h3 className="font-bold text-charcoal mb-1">{club.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{club.description}</p>
                  <div className="text-xs text-gray-400 space-y-1 mb-4">
                    <p className="flex items-center gap-1"><MapPin size={11} />{club.location}</p>
                    <p className="flex items-center gap-1"><Users size={11} />{club.members} members</p>
                    <p className="flex items-center gap-1"><Calendar size={11} />Next: {club.nextMeetup}</p>
                  </div>
                  <button
                    onClick={() => handleJoinClub(club.id)}
                    className="w-full bg-sage/10 text-sage hover:bg-sage/20 py-2 rounded-lg font-bold text-sm transition flex items-center justify-center gap-1"
                  >
                    <UserPlus size={14} />Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 3 && (
          <div className="flex gap-4" style={{ minHeight: 400 }}>
            {/* Contact list */}
            <div className="w-48 flex-shrink-0 space-y-2">
              <p className="text-xs font-bold text-charcoal uppercase mb-3">Club Members</p>
              {CLUB_MEMBERS.map(member => (
                <button
                  key={member.id}
                  onClick={() => setSelectedContact(member)}
                  className={`w-full flex items-center gap-2 p-3 rounded-xl text-left transition ${
                    selectedContact?.id === member.id ? 'bg-sage text-white' : 'bg-white hover:bg-sage/10'
                  }`}
                >
                  <span className="text-xl">{member.avatar}</span>
                  <span className="text-sm font-medium">{member.name}</span>
                </button>
              ))}
            </div>

            {/* Conversation panel */}
            <div className="flex-1 bg-white rounded-xl shadow flex flex-col">
              {selectedContact ? (
                <>
                  <div className="flex items-center gap-3 p-4 border-b border-sage/20">
                    <span className="text-2xl">{selectedContact.avatar}</span>
                    <div>
                      <p className="font-bold text-charcoal text-sm">{selectedContact.name}</p>
                      <p className="text-xs text-gray-400">Club member</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 320 }}>
                    {(messages[selectedContact.id] || []).length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-8">Say hello to {selectedContact.name}!</p>
                    )}
                    {(messages[selectedContact.id] || []).map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === myDisplayName || msg.sender === 'You' || msg.sender === 'Anonymous Member' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                          msg.sender === myDisplayName || msg.sender === 'You' || msg.sender === 'Anonymous Member'
                            ? 'bg-sage text-white'
                            : 'bg-gray-100 text-charcoal'
                        }`}>
                          <p>{msg.text}</p>
                          <p className="text-xs opacity-60 mt-0.5">{msg.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={msgEndRef} />
                  </div>

                  <div className="p-4 border-t border-sage/20 flex gap-2">
                    <input
                      type="text"
                      value={msgInput}
                      onChange={e => setMsgInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder={`Message as ${myDisplayName}…`}
                      className="flex-1 border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-sage text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  Select a member to start messaging
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 4 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {badges.filter(b => b.unlocked && !b.requiresPremium).length} of {badges.filter(b => !b.requiresPremium).length} badges unlocked
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl text-center transition ${
                    badge.unlocked
                      ? badge.requiresPremium
                        ? 'bg-gradient-to-br from-charcoal to-gray-700 text-white shadow'
                        : 'bg-sage text-white shadow'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.unlocked ? badge.icon : '🔒'}</div>
                  <p className="font-bold text-sm">{badge.name}</p>
                  <p className="text-xs opacity-80 mt-0.5">{badge.description}</p>
                  {badge.requiresPremium && (
                    <p className="text-xs mt-1 opacity-60">💎 Premium</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Social;
