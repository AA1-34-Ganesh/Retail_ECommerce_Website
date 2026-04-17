import { createContext, useContext, useState, useEffect } from 'react';

const GamificationContext = createContext();

export function GamificationProvider({ children }) {
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('smartcart_points');
    return saved ? parseInt(saved) : 0;
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('smartcart_badges');
    return saved ? JSON.parse(saved) : [];
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('smartcart_stats');
    return saved ? JSON.parse(saved) : { searches: 0, aiInteractions: 0, priceFilters: 0 };
  });

  // Persist points
  useEffect(() => {
    localStorage.setItem('smartcart_points', points);
  }, [points]);

  // Persist badges
  useEffect(() => {
    localStorage.setItem('smartcart_badges', JSON.stringify(badges));
  }, [badges]);

  // Persist stats
  useEffect(() => {
    localStorage.setItem('smartcart_stats', JSON.stringify(stats));
  }, [stats]);

  const addPoints = (amount, reason = '') => {
    setPoints(p => p + amount);
  };

  const awardBadgeIfEarned = (badgeType) => {
    const badgesList = [
      {
        id: 'smart-shopper',
        name: '🧠 Smart Shopper',
        description: 'Completed your first search',
        condition: () => stats.searches >= 1
      },
      {
        id: 'budget-master',
        name: '💰 Budget Master',
        description: 'Used price filters',
        condition: () => stats.priceFilters >= 1
      },
      {
        id: 'ai-whisperer',
        name: '✨ AI Whisperer',
        description: '5 AI interactions',
        condition: () => stats.aiInteractions >= 5
      },
      {
        id: 'power-shopper',
        name: '⚡ Power Shopper',
        description: 'Earned 100+ points',
        condition: () => points >= 100
      }
    ];

    badgesList.forEach(badge => {
      if (!badges.find(b => b.id === badge.id) && badge.condition()) {
        setBadges(prev => [...prev, badge]);
      }
    });
  };

  const recordSearch = () => {
    setStats(s => ({ ...s, searches: s.searches + 1 }));
    addPoints(5, 'search');
    awardBadgeIfEarned('smart-shopper');
  };

  const recordAIInteraction = () => {
    setStats(s => ({ ...s, aiInteractions: s.aiInteractions + 1 }));
    addPoints(10, 'ai-interaction');
    awardBadgeIfEarned('ai-whisperer');
  };

  const recordPriceFilter = () => {
    setStats(s => ({ ...s, priceFilters: s.priceFilters + 1 }));
    awardBadgeIfEarned('budget-master');
  };

  const resetAll = () => {
    setPoints(0);
    setBadges([]);
    setStats({ searches: 0, aiInteractions: 0, priceFilters: 0 });
  };

  return (
    <GamificationContext.Provider
      value={{
        points,
        badges,
        stats,
        addPoints,
        recordSearch,
        recordAIInteraction,
        recordPriceFilter,
        awardBadgeIfEarned,
        resetAll
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
}
