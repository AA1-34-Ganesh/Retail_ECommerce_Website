import { useState, useEffect } from 'react';
import { getTopSearches, getUserStats } from '../services/api';

export default function AnalyticsDashboard() {
  const [topSearches, setTopSearches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [searchData, statsData] = await Promise.all([
        getTopSearches(),
        getUserStats()
      ]);
      setTopSearches(searchData.topSearches || []);
      setStats(statsData.stats || null);
    } catch {
      setTopSearches([]);
      setStats(null);
    }
    setLoading(false);
  }

  const maxCount = Math.max(...topSearches.map(s => s.count), 1);

  const statCards = stats ? [
    { icon: '🔍', label: 'Searches', value: stats.totalSearches, color: 'primary' },
    { icon: '💬', label: 'AI Chats', value: stats.totalChats, color: 'accent' },
    { icon: '👁️', label: 'Products Viewed', value: stats.totalViews, color: 'primary' },
    { icon: '📷', label: 'Image Searches', value: stats.totalImageSearches, color: 'accent' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl"></div>
          ))}
        </div>
        <div className="skeleton h-80 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className="card text-center animate-scale-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-black ${stat.color === 'primary' ? 'text-primary-400' : 'text-accent-400'}`}>
              {stat.value}
            </div>
            <div className="text-sm text-surface-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Top Searches Chart */}
      <div className="card">
        <h3 className="text-lg font-bold text-surface-100 mb-6">🔥 Top Searched Products</h3>
        <div className="space-y-3">
          {topSearches.map((item, i) => (
            <div key={item.term} className="flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <span className="text-sm text-surface-500 w-6 text-right">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-surface-200 capitalize">{item.term}</span>
                  <span className="text-xs text-surface-500">{item.count} searches</span>
                </div>
                <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      {stats?.recentActivity?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-surface-100 mb-4">📋 Recent Activity</h3>
          <div className="space-y-2">
            {stats.recentActivity.slice(0, 5).map(activity => (
              <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-surface-700/30 last:border-0">
                <span className="text-lg">
                  {activity.type === 'search' && '🔍'}
                  {activity.type === 'chat' && '💬'}
                  {activity.type === 'view' && '👁️'}
                  {activity.type === 'image_search' && '📷'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-200 truncate">{activity.query || activity.type}</p>
                  <p className="text-xs text-surface-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
