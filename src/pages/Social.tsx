import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Calendar, Plus, X, UserPlus, Send, ArrowLeft } from 'lucide-react';
import TabBar from '../components/TabBar';
import PremiumLockCard from '../components/PremiumLockCard';
import { useMembership } from '../hooks/useMembership';
import { filterText, containsPersonalInfo, hasProfanity } from '../utils/profanityFilter';

interface Club { id: string; name: string; location: string; members: number; description: string; nextMeetup: string; image: string; }
interface ChallengeProgress { joined: boolean; progress: number; }
interface Message { sender: string; text: string; timestamp: string; anonymous: boolean; }
interface Badge { id: string; name: string; description: string; icon: string; unlocked: boolean; requiresPremium?: boolean; }

const CLUB_MEMBERS = [
  { id: 'sarah', name: 'Sarah M.', avatar: '🌸' },
  { id: 'priya', name: 'Priya K.', avatar: '🌿' },
  { id: 'emma',  name: 'Emma L.',  avatar: '💪' },
  { id: 'lisa',  name: 'Lisa T.',  avatar: '🎵' },
];

const CHALLENGE_DEFS = [
  { id: '3', title: 'Week of Wellness',  description: 'Complete 1 workout every day for a week', goal: 7,  endsAt: '2025-12-31', badge: '🎯', participants: 1204 },
  { id: '1', title: '30 Days of Yoga',   description: 'Complete at least 3 yoga sessions per week', goal: 30, endsAt: '2026-01-02', badge: '🧘', participants: 847  },
  { id: '2', title: 'Dance Your Way',    description: 'Learn and complete 5 new dance routines', goal: 5,  endsAt: '2026-01-15', badge: '💃', participants: 523  },
  { id: '4', title: 'Cycle Sync Pro',    description: 'Track your cycle and do recommended workouts', goal: 28, endsAt: '2026-01-30', badge: '💜', participants: 389  },
];

const FEED_ITEMS = [
  { user: 'Sarah M.',  avatar: '🌸', action: 'completed HIIT Bootcamp',              timestamp: '2h ago',  badge: null },
  { user: 'Priya K.',  avatar: '🌿', action: 'joined 30 Days of Yoga challenge',     timestamp: '4h ago',  badge: null },
  { user: 'Emma L.',   avatar: '💪', action: "unlocked 'Week Warrior' badge",        timestamp: '6h ago',  badge: '⚡' },
  { user: 'Lisa T.',   avatar: '🎵', action: 'completed 5 dance routines',           timestamp: '8h ago',  badge: null },
  { user: 'Nina P.',   avatar: '🏃', action: 'joined Morning Runners club',          timestamp: '10h ago', badge: null },
  { user: 'Alex J.',   avatar: '🧘', action: 'started Week of Wellness challenge',   timestamp: '12h ago', badge: null },
  { user: 'Maya R.',   avatar: '✨', action: "unlocked 'Dance Debut' badge",         timestamp: '14h ago', badge: '💃' },
  { user: 'Sophie D.', avatar: '🌺', action: 'completed Comfort Moves routine',      timestamp: '16h ago', badge: null },
  { user: 'Jordan K.', avatar: '🎉', action: 'created Dance Fitness Crew club',      timestamp: '1d ago',  badge: null },
  { user: 'Taylor M.', avatar: '💕', action: 'reached cycle awareness milestone',    timestamp: '1d ago',  badge: null },
];

const Social: React.FC = () => {
  const { isPremium } = useMembership();
  const [activeTab, setActiveTab] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const myName = isAnonymous ? 'Anonymous Member' : 'You';

  const [clubs, setClubs] = useState<Club[]>([
    { id:'1', name:'Downtown Yoga Circle', location:'Downtown District', members:24, description:'Weekly yoga sessions with like-minded women',  nextMeetup:'2026-05-15', image:'🧘' },
    { id:'2', name:'Morning Runners',       location:'City Park',         members:31, description:'Early morning running group, all levels welcome', nextMeetup:'2026-05-14', image:'🏃' },
    { id:'3', name:'Strength & Sisters',    location:'Gym on Main',       members:18, description:'Empowering strength training sessions',           nextMeetup:'2026-05-16', image:'💪' },
    { id:'4', name:'Dance Fitness Crew',    location:'Studio Central',    members:27, description:'Have fun while getting fit with dance',           nextMeetup:'2026-05-17', image:'💃' },
  ]);
  const [userClubs, setUserClubs] = useState<{ joined: string[] }>({ joined: [] });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', location: '', description: '' });
  const [piWarning, setPiWarning] = useState(false);

  const [challengeProgress, setChallengeProgress] = useState<Record<string, ChallengeProgress>>({});

  // Messages — mobile: show contact list OR chat
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedContact, setSelectedContact] = useState<typeof CLUB_MEMBERS[0] | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const msgEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = (k: string) => { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; };
    if (s('femfit-userClubs')) setUserClubs(s('femfit-userClubs'));
    if (s('femfit-challenges')) setChallengeProgress(s('femfit-challenges'));
    if (s('femfit-messages')) setMessages(s('femfit-messages'));
    const p = s('femfit-profile');
    if (p) setIsAnonymous(p.isAnonymous || false);
  }, []);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  const computeBadges = (): Badge[] => {
    const workoutCount = (() => { const s = localStorage.getItem('femfit-startedWorkouts'); return s ? JSON.parse(s).length : 0; })();
    const movesCount   = (() => { const s = localStorage.getItem('femfit-completedMoves');  return s ? JSON.parse(s).length : 0; })();
    const danceCount   = (() => { const s = localStorage.getItem('femfit-completedDances'); return s ? JSON.parse(s).length : 0; })();
    const moodCount    = (() => { const s = localStorage.getItem('femfit-moodHistory');     return s ? JSON.parse(s).length : 0; })();
    const clubCount    = (() => { const s = localStorage.getItem('femfit-userClubs');       return s ? JSON.parse(s).joined?.length || 0 : 0; })();
    const base: Badge[] = [
      { id:'1', name:'First Step',       description:'Complete your first workout',  icon:'👣', unlocked: workoutCount >= 1 },
      { id:'2', name:'Dance Debut',       description:'Complete your first dance',    icon:'💃', unlocked: danceCount >= 1 },
      { id:'3', name:'Comfort Seeker',    description:'Complete 3 comfort moves',     icon:'🌿', unlocked: movesCount >= 3 },
      { id:'4', name:'Mood Tracker',      description:'Log your mood 7 times',        icon:'📊', unlocked: moodCount >= 7 },
      { id:'5', name:'Club Creator',      description:'Create or join a club',        icon:'🏘️', unlocked: clubCount >= 1 },
      { id:'6', name:'Week Warrior',      description:'Complete 7 workouts',          icon:'⚡', unlocked: workoutCount >= 7 },
      { id:'7', name:'Dance Master',      description:'Complete 5 different dances',  icon:'🎭', unlocked: danceCount >= 5 },
    ];
    const unlockedCount = base.filter(b => b.unlocked).length;
    base.push({ id:'8', name:'Wellness Champion', description:'Unlock 5 badges', icon:'👑', unlocked: unlockedCount >= 5 });
    return [...base,
      { id:'p1', name:'Premium Member', description:'Active Premium subscription',    icon:'💎', unlocked: isPremium, requiresPremium: true },
      { id:'p2', name:'Streak Queen',   description:'30-day workout streak',          icon:'🔥', unlocked: isPremium && workoutCount >= 30, requiresPremium: true },
      { id:'p3', name:'Dance Diva',     description:'Complete all dance styles',      icon:'💃', unlocked: isPremium && danceCount >= 8, requiresPremium: true },
      { id:'p4', name:'Wellness Guru',  description:'Complete all badge categories',  icon:'🌟', unlocked: isPremium && unlockedCount >= 8, requiresPremium: true },
    ];
  };

  const badges = computeBadges();

  const joinClub = (id: string) => {
    const upd = userClubs.joined.includes(id) ? userClubs.joined.filter(x=>x!==id) : [...userClubs.joined, id];
    setUserClubs({ joined: upd });
    localStorage.setItem('femfit-userClubs', JSON.stringify({ joined: upd }));
  };

  const createClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.name || !newClub.location) return;
    if (containsPersonalInfo(newClub.name) || containsPersonalInfo(newClub.description)) { setPiWarning(true); return; }
    const club: Club = { id: Date.now().toString(), name: filterText(newClub.name), location: newClub.location, description: filterText(newClub.description), members: 1, nextMeetup: new Date(Date.now()+7*86400000).toISOString().split('T')[0], image:'✨' };
    const upd = [...userClubs.joined, club.id];
    setClubs([...clubs, club]);
    setUserClubs({ joined: upd });
    localStorage.setItem('femfit-userClubs', JSON.stringify({ joined: upd }));
    setNewClub({ name:'', location:'', description:'' });
    setPiWarning(false);
    setShowCreateForm(false);
  };

  const joinChallenge = (id: string) => {
    const upd = { ...challengeProgress, [id]: { joined: true, progress: challengeProgress[id]?.progress || 0 } };
    setChallengeProgress(upd);
    localStorage.setItem('femfit-challenges', JSON.stringify(upd));
  };

  const sendMessage = () => {
    if (!msgInput.trim() || !selectedContact) return;
    const msg: Message = { sender: myName, text: filterText(msgInput.trim()), timestamp: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), anonymous: isAnonymous };
    const upd = { ...messages, [selectedContact.id]: [...(messages[selectedContact.id]||[]), msg] };
    setMessages(upd);
    localStorage.setItem('femfit-messages', JSON.stringify(upd));
    setMsgInput('');
  };

  const openChat = (member: typeof CLUB_MEMBERS[0]) => {
    setSelectedContact(member);
    setMobileChatOpen(true);
  };

  const joinedClubs = clubs.filter(c => userClubs.joined.includes(c.id));
  const availableClubs = clubs.filter(c => !userClubs.joined.includes(c.id));

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen">
        <div className="bg-sage px-4 pt-5 pb-5"><h1 className="text-2xl font-bold text-white">Social</h1></div>
        <div className="max-w-2xl mx-auto px-4 py-5">
          <PremiumLockCard tier="premium" style="banner" />
          <p className="text-center text-gray-500 text-sm mt-4">Upgrade to Premium to access all social features!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen">
      <div className="bg-sage px-4 pt-5 pb-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Social</h1>
          <p className="text-white/70 text-sm">Connect with your wellness community</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <TabBar tabs={['Feed','Challenges','Clubs','Messages','Achievements']} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* FEED */}
        {activeTab === 0 && (
          <div className="space-y-2.5">
            {FEED_ITEMS.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-sage flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{item.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-charcoal text-sm">{isAnonymous && i===0 ? 'Anonymous Member' : item.user}</p>
                  <p className="text-gray-600 text-sm leading-snug">{item.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.timestamp}</p>
                </div>
                {item.badge && <span className="text-2xl flex-shrink-0">{item.badge}</span>}
              </div>
            ))}
          </div>
        )}

        {/* CHALLENGES */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CHALLENGE_DEFS.map(c => {
              const prog = challengeProgress[c.id];
              const joined = prog?.joined || false;
              const progress = prog?.progress || 0;
              const pct = Math.min(100, (progress / c.goal) * 100);
              return (
                <div key={c.id} className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10 relative">
                  <div className="absolute top-4 right-4 bg-peach/10 text-peach text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                    🔥 {c.participants.toLocaleString()}
                  </div>
                  <div className="flex items-start gap-3 mb-3 pr-20">
                    <span className="text-3xl">{c.badge}</span>
                    <div>
                      <h3 className="font-bold text-charcoal text-sm">{c.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-bold text-charcoal">{progress} / {c.goal}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-sage h-2 rounded-full transition-all" style={{ width:`${pct}%` }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Ends: {c.endsAt}</p>
                  {joined ? (
                    <div className="w-full bg-sage/10 text-sage py-2.5 rounded-xl font-bold text-sm text-center">✓ Joined — keep going!</div>
                  ) : (
                    <button onClick={() => joinChallenge(c.id)} className="w-full bg-sage text-white py-2.5 rounded-xl font-bold text-sm active:scale-95 transition">Join Challenge</button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CLUBS */}
        {activeTab === 2 && (
          <div className="space-y-5">
            <div className="flex justify-end">
              <button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-sage text-white px-4 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition flex items-center gap-2">
                <Plus size={15} />Create Club
              </button>
            </div>

            {showCreateForm && (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
                <h2 className="font-bold text-charcoal mb-4">Create a New Club</h2>
                {piWarning && (
                  <div className="bg-yellow/20 border border-yellow/50 rounded-xl p-3 mb-4 text-sm text-charcoal flex gap-2">
                    <span>⚠️</span>
                    <div>Personal info detected. Keep phone/email private. <button className="underline text-xs ml-1" onClick={()=>setPiWarning(false)}>Dismiss</button></div>
                  </div>
                )}
                <form onSubmit={createClub} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Club Name</label>
                    <input type="text" value={newClub.name} onChange={e=>setNewClub({...newClub,name:e.target.value})} className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage" placeholder="e.g., Morning Yoga Warriors" required />
                    {hasProfanity(newClub.name) && <p className="text-xs text-coral mt-1">Inappropriate words will be filtered.</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Location</label>
                    <input type="text" value={newClub.location} onChange={e=>setNewClub({...newClub,location:e.target.value})} className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage" placeholder="e.g., Central Park" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Description</label>
                    <textarea value={newClub.description} onChange={e=>setNewClub({...newClub,description:e.target.value})} className="w-full border border-sage/30 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage" rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-sage text-white py-2.5 rounded-xl font-bold text-sm active:scale-95">Create</button>
                    <button type="button" onClick={()=>setShowCreateForm(false)} className="flex-1 bg-gray-100 text-charcoal py-2.5 rounded-xl font-bold text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {joinedClubs.length > 0 && (
              <div>
                <h2 className="font-bold text-charcoal mb-3">My Clubs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {joinedClubs.map(club => (
                    <div key={club.id} className="bg-sage text-white rounded-2xl p-5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-3xl">{club.image}</span>
                        <button onClick={()=>joinClub(club.id)} className="p-1 active:scale-90"><X size={16} className="opacity-70"/></button>
                      </div>
                      <h3 className="font-bold mb-2 text-sm">{club.name}</h3>
                      <div className="text-xs opacity-80 space-y-1">
                        <p className="flex items-center gap-1"><MapPin size={11}/>{club.location}</p>
                        <p className="flex items-center gap-1"><Users size={11}/>{club.members} members</p>
                        <p className="flex items-center gap-1"><Calendar size={11}/>Next: {club.nextMeetup}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-bold text-charcoal mb-3">Available Clubs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableClubs.map(club => (
                  <div key={club.id} className="bg-white rounded-2xl shadow-sm p-4 border border-sage/10">
                    <span className="text-3xl">{club.image}</span>
                    <h3 className="font-bold text-charcoal mt-2 mb-1 text-sm">{club.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{club.description}</p>
                    <div className="text-xs text-gray-400 space-y-1 mb-3">
                      <p className="flex items-center gap-1"><MapPin size={11}/>{club.location}</p>
                      <p className="flex items-center gap-1"><Users size={11}/>{club.members} members</p>
                    </div>
                    <button onClick={()=>joinClub(club.id)} className="w-full bg-sage/10 text-sage py-2.5 rounded-xl font-bold text-sm active:scale-95 transition flex items-center justify-center gap-1.5">
                      <UserPlus size={13}/>Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 3 && (
          <div>
            {/* Mobile: chat view */}
            {mobileChatOpen && selectedContact ? (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-sage/10 flex flex-col" style={{ height: '65vh' }}>
                <div className="flex items-center gap-3 p-4 border-b border-sage/20 bg-sage/5">
                  <button onClick={() => { setMobileChatOpen(false); }} className="p-1.5 rounded-lg bg-white shadow-sm active:scale-90 transition mr-1">
                    <ArrowLeft size={16} className="text-charcoal" />
                  </button>
                  <span className="text-2xl">{selectedContact.avatar}</span>
                  <div>
                    <p className="font-bold text-charcoal text-sm">{selectedContact.name}</p>
                    <p className="text-xs text-gray-400">Club member</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {(messages[selectedContact.id]||[]).length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-8">Say hello to {selectedContact.name}!</p>
                  )}
                  {(messages[selectedContact.id]||[]).map((msg,i) => {
                    const isMe = msg.sender === myName || msg.sender === 'You' || msg.sender === 'Anonymous Member';
                    return (
                      <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-sage text-white rounded-br-sm' : 'bg-gray-100 text-charcoal rounded-bl-sm'}`}>
                          <p>{msg.text}</p>
                          <p className="text-[10px] opacity-60 mt-0.5">{msg.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={msgEndRef} />
                </div>
                <div className="p-3 border-t border-sage/20 flex gap-2">
                  <input type="text" value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()}
                    placeholder={`Message as ${myName}…`}
                    className="flex-1 border border-sage/30 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage" />
                  <button onClick={sendMessage} className="bg-sage text-white px-4 rounded-xl active:scale-95 transition">
                    <Send size={16}/>
                  </button>
                </div>
              </div>
            ) : (
              /* Contact list */
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Club Members</p>
                {CLUB_MEMBERS.map(member => {
                  const lastMsg = (messages[member.id]||[]).slice(-1)[0];
                  return (
                    <button key={member.id} onClick={() => openChat(member)}
                      className="w-full bg-white rounded-2xl p-4 border border-sage/10 flex items-center gap-3 text-left active:scale-98 transition hover:border-sage/30 shadow-sm">
                      <span className="text-3xl">{member.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-charcoal text-sm">{member.name}</p>
                        <p className="text-xs text-gray-400 truncate">{lastMsg ? lastMsg.text : 'Tap to start a conversation'}</p>
                      </div>
                      {lastMsg && <span className="text-xs text-gray-300">{lastMsg.timestamp}</span>}
                    </button>
                  );
                })}

                {/* Desktop: show chat panel side by side */}
                {selectedContact && !mobileChatOpen && (
                  <div className="hidden md:flex gap-4 mt-4" style={{ height: '60vh' }}>
                    <div className="w-56 flex-shrink-0 space-y-2">
                      {CLUB_MEMBERS.map(member => (
                        <button key={member.id} onClick={() => setSelectedContact(member)}
                          className={`w-full flex items-center gap-2 p-3 rounded-xl text-left transition ${selectedContact?.id===member.id?'bg-sage text-white':'bg-white hover:bg-sage/10 border border-sage/10'}`}>
                          <span className="text-xl">{member.avatar}</span>
                          <span className="text-sm font-medium">{member.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col border border-sage/10 overflow-hidden">
                      <div className="flex items-center gap-3 p-4 border-b border-sage/20 bg-sage/5">
                        <span className="text-2xl">{selectedContact.avatar}</span>
                        <p className="font-bold text-charcoal text-sm">{selectedContact.name}</p>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {(messages[selectedContact.id]||[]).length===0 && <p className="text-center text-gray-400 text-sm py-8">Say hello!</p>}
                        {(messages[selectedContact.id]||[]).map((msg,i) => {
                          const isMe = msg.sender === myName || msg.sender === 'You' || msg.sender === 'Anonymous Member';
                          return (
                            <div key={i} className={`flex ${isMe?'justify-end':'justify-start'}`}>
                              <div className={`max-w-xs px-3.5 py-2.5 rounded-2xl text-sm ${isMe?'bg-sage text-white rounded-br-sm':'bg-gray-100 text-charcoal rounded-bl-sm'}`}>
                                <p>{msg.text}</p>
                                <p className="text-[10px] opacity-60 mt-0.5">{msg.timestamp}</p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={msgEndRef}/>
                      </div>
                      <div className="p-3 border-t border-sage/20 flex gap-2">
                        <input type="text" value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()}
                          placeholder={`Message as ${myName}…`} className="flex-1 border border-sage/30 rounded-xl px-3 py-2 text-sm outline-none focus:border-sage"/>
                        <button onClick={sendMessage} className="bg-sage text-white px-4 rounded-xl active:scale-95"><Send size={15}/></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === 4 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">{badges.filter(b=>b.unlocked&&!b.requiresPremium).length} of {badges.filter(b=>!b.requiresPremium).length} badges unlocked</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {badges.map(badge => (
                <div key={badge.id} className={`p-4 rounded-2xl text-center transition ${
                  badge.unlocked
                    ? badge.requiresPremium ? 'bg-gradient-to-br from-charcoal to-gray-700 text-white shadow' : 'bg-sage text-white shadow'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <div className="text-4xl mb-2">{badge.unlocked ? badge.icon : '🔒'}</div>
                  <p className="font-bold text-sm leading-tight">{badge.name}</p>
                  <p className="text-xs opacity-80 mt-0.5 leading-tight">{badge.description}</p>
                  {badge.requiresPremium && <p className="text-xs mt-1 opacity-60">💎 Premium</p>}
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
