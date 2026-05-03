import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, Plus, X, UserPlus } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  location: string;
  members: number;
  description: string;
  nextMeetup: string;
  image: string;
}

interface UserClubs {
  joined: string[];
}

const Clubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: '1',
      name: 'Downtown Yoga Circle',
      location: 'Downtown District',
      members: 24,
      description: 'Weekly yoga sessions with like-minded women',
      nextMeetup: '2024-12-15',
      image: '🧘'
    },
    {
      id: '2',
      name: 'Morning Runners',
      location: 'City Park',
      members: 31,
      description: 'Early morning running group, all levels welcome',
      nextMeetup: '2024-12-14',
      image: '🏃'
    },
    {
      id: '3',
      name: 'Strength & Sisters',
      location: 'Gym on Main',
      members: 18,
      description: 'Empowering strength training sessions',
      nextMeetup: '2024-12-16',
      image: '💪'
    },
    {
      id: '4',
      name: 'Dance Fitness Crew',
      location: 'Studio Central',
      members: 27,
      description: 'Have fun while getting fit with dance',
      nextMeetup: '2024-12-17',
      image: '💃'
    },
  ]);

  const [userClubs, setUserClubs] = useState<UserClubs>({ joined: [] });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', location: '', description: '' });

  useEffect(() => {
    const saved = localStorage.getItem('femfit-userClubs');
    if (saved) {
      setUserClubs(JSON.parse(saved));
    }
  }, []);

  const handleJoinClub = (clubId: string) => {
    const updated = userClubs.joined.includes(clubId)
      ? userClubs.joined.filter(id => id !== clubId)
      : [...userClubs.joined, clubId];
    setUserClubs({ joined: updated });
    localStorage.setItem('femfit-userClubs', JSON.stringify({ joined: updated }));
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClub.name && newClub.location) {
      const club: Club = {
        id: Date.now().toString(),
        name: newClub.name,
        location: newClub.location,
        description: newClub.description,
        members: 1,
        nextMeetup: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        image: '✨'
      };
      setClubs([...clubs, club]);
      setUserClubs({ joined: [...userClubs.joined, club.id] });
      localStorage.setItem('femfit-userClubs', JSON.stringify({ joined: [...userClubs.joined, club.id] }));
      setNewClub({ name: '', location: '', description: '' });
      setShowCreateForm(false);
    }
  };

  const joinedClubData = clubs.filter(c => userClubs.joined.includes(c.id));
  const availableClubs = clubs.filter(c => !userClubs.joined.includes(c.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-lavender to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-femfit-deep">Local Clubs</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-femfit-pink text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Create Club
          </button>
        </div>

        {/* Create Club Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-femfit-deep mb-4">Create a New Club</h2>
            <form onSubmit={handleCreateClub} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                <input
                  type="text"
                  value={newClub.name}
                  onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., Morning Yoga Warriors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newClub.location}
                  onChange={(e) => setNewClub({ ...newClub, location: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., Central Park"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newClub.description}
                  onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Describe your club..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-femfit-purple to-femfit-pink text-white py-2 rounded-lg font-bold hover:opacity-90 transition"
                >
                  Create Club
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:opacity-90 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Clubs */}
        {joinedClubData.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-femfit-deep mb-4">My Clubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {joinedClubData.map((club) => (
                <div key={club.id} className="bg-gradient-to-br from-femfit-pink to-femfit-rose rounded-lg shadow-lg p-6 text-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-4xl">{club.image}</div>
                    <button
                      onClick={() => handleJoinClub(club.id)}
                      className="text-white hover:text-femfit-lavender transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                  <div className="space-y-2 text-sm opacity-90 mb-4">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {club.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users size={16} />
                      {club.members} members
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={16} />
                      Next: {club.nextMeetup}
                    </p>
                  </div>
                  <button className="w-full bg-white text-femfit-pink py-2 rounded-lg font-bold hover:bg-gray-100 transition">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Clubs */}
        <div>
          <h2 className="text-2xl font-bold text-femfit-deep mb-4">
            {availableClubs.length > 0 ? 'Available Clubs' : 'No More Clubs Available'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableClubs.map((club) => (
              <div key={club.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="text-4xl mb-3">{club.image}</div>
                <h3 className="text-lg font-bold text-femfit-deep mb-2">{club.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{club.description}</p>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-femfit-pink" />
                    {club.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users size={16} className="text-femfit-pink" />
                    {club.members} members
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-femfit-pink" />
                    Next: {club.nextMeetup}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinClub(club.id)}
                  className="w-full bg-gradient-to-r from-femfit-purple to-femfit-pink text-white py-2 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} />
                  Join Club
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clubs;
