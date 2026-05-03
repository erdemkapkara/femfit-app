import { useState, useEffect } from 'react';

export type MembershipTier = 'free' | 'premium' | 'elite';

interface MembershipData {
  tier: MembershipTier;
  activatedAt: string | null;
  billingCycleEnd: string | null;
  autoRenew: boolean;
}

const DEFAULT_MEMBERSHIP: MembershipData = {
  tier: 'free',
  activatedAt: null,
  billingCycleEnd: null,
  autoRenew: false,
};

export function useMembership() {
  const [membership, setMembershipState] = useState<MembershipData>(DEFAULT_MEMBERSHIP);

  useEffect(() => {
    const saved = localStorage.getItem('femfit-membership');
    if (saved) {
      try {
        setMembershipState(JSON.parse(saved));
      } catch {
        setMembershipState(DEFAULT_MEMBERSHIP);
      }
    }
  }, []);

  const setMembership = (tier: MembershipTier) => {
    const newData: MembershipData = {
      tier,
      activatedAt: tier === 'free' ? null : new Date().toISOString(),
      billingCycleEnd: tier === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: tier !== 'free',
    };
    setMembershipState(newData);
    localStorage.setItem('femfit-membership', JSON.stringify(newData));
  };

  const upgrade = (to: 'premium' | 'elite') => setMembership(to);
  const downgrade = () => setMembership('free');

  return {
    tier: membership.tier,
    isPremium: membership.tier === 'premium' || membership.tier === 'elite',
    isElite: membership.tier === 'elite',
    billingCycleEnd: membership.billingCycleEnd,
    upgrade,
    downgrade,
    setMembership,
  };
}
