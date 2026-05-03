import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumLockCardProps {
  tier: 'premium' | 'elite';
  style?: 'overlay' | 'banner' | 'teaser';
  workoutName?: string;
}

const PremiumLockCard: React.FC<PremiumLockCardProps> = ({ tier, style = 'overlay', workoutName }) => {
  const navigate = useNavigate();

  const tierInfo = {
    premium: {
      name: 'Premium',
      price: '$9.99/mo',
      description: 'Unlock full exercise library and social features',
    },
    elite: {
      name: 'Elite',
      price: '$19.99/mo',
      description: 'Everything + nutrition coaching + priority support',
    },
  };

  const info = tierInfo[tier];

  if (style === 'teaser') {
    return (
      <div className="absolute inset-0 rounded-xl overflow-hidden z-10 flex flex-col items-center justify-center">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(139,168,143,0.6) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite linear',
          }}
        />
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <Lock size={28} className="mx-auto text-sage mb-2" />
          {workoutName && (
            <p className="text-charcoal font-bold text-sm mb-1">{workoutName}</p>
          )}
          <p className="text-gray-500 text-xs mb-3">Unlock to see full workout</p>
          <button
            onClick={() => navigate('/profile?upgrade=true')}
            className="bg-sage hover:opacity-90 text-white px-5 py-2 rounded-lg font-bold text-sm transition"
          >
            ✨ Go Premium
          </button>
          <p className="text-gray-400 text-xs mt-2">Join 2,400+ women already on Premium</p>
        </div>
      </div>
    );
  }

  if (style === 'banner') {
    return (
      <div className="w-full bg-gradient-to-r from-femfit-umber to-femfit-mauve text-white p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock size={20} />
            <div>
              <p className="font-bold">Upgrade to {info.name}</p>
              <p className="text-sm opacity-90">{info.description}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/profile?upgrade=true')}
            className="bg-femfit-blush hover:opacity-90 text-white px-4 py-2 rounded-lg font-bold whitespace-nowrap"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  // Overlay style
  return (
    <div className="absolute inset-0 bg-femfit-umber/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-xl p-6 text-center max-w-sm">
        <Lock size={40} className="mx-auto text-femfit-blush mb-3" />
        <h3 className="text-xl font-bold text-femfit-umber mb-2">
          {info.name} Feature
        </h3>
        <p className="text-gray-600 mb-4">{info.description}</p>
        <p className="text-2xl font-bold text-femfit-blush mb-4">{info.price}</p>
        <button
          onClick={() => navigate('/profile?upgrade=true')}
          className="w-full bg-gradient-to-r from-femfit-blush to-femfit-rose text-white py-2 rounded-lg font-bold hover:opacity-90 transition"
        >
          Upgrade to {info.name}
        </button>
        <p className="text-xs text-gray-500 mt-3">
          Cancel anytime. No credit card required for free trial.
        </p>
      </div>
    </div>
  );
};

export default PremiumLockCard;
