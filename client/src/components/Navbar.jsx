import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/products', label: 'Products', icon: '🛍️' },
  { to: '/chat', label: 'AI Assistant', icon: '🤖' },
  { to: '/image-search', label: 'Visual Search', icon: '📷' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
];

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const { points, badges } = useGamification();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center
              shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow duration-300">
              <span className="text-white text-lg">🛒</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">SmartCart AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${location.pathname === link.to
                    ? 'bg-primary-500/20 text-primary-300 shadow-inner'
                    : 'text-surface-400 hover:text-surface-50 hover:bg-surface-800/60'
                  }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Gamification Stats + Auth + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Points & Badges Button */}
            <div className="relative">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-500/10 text-primary-300
                  hover:bg-primary-500/20 transition-all duration-200 flex items-center gap-2 group"
                id="stats-btn"
              >
                <span className="animate-pulse">⭐</span>
                <span className="font-bold text-amber-300">{points}</span>
                {badges.length > 0 && (
                  <span className="ml-1 text-xs bg-accent-500/80 px-2 py-0.5 rounded-full">
                    {badges.length} 🏆
                  </span>
                )}
              </button>

              {/* Stats Dropdown */}
              {showStats && (
                <div className="absolute right-0 top-12 bg-surface-800 rounded-xl border border-surface-700/50
                  shadow-xl p-4 w-72 z-50 animate-scale-in">
                  <div className="space-y-3">
                    <div className="text-center pb-3 border-b border-surface-700/30">
                      <p className="text-2xl font-bold text-amber-300">{points} Points</p>
                      <p className="text-xs text-surface-500 mt-1">Keep shopping to earn more!</p>
                    </div>
                    
                    {badges.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold text-surface-400 mb-2">Badges Earned:</p>
                        <div className="space-y-2">
                          {badges.map(badge => (
                            <div key={badge.id} className="flex items-start gap-2 p-2 rounded-lg bg-surface-700/30">
                              <span className="text-lg">{badge.name.split(' ')[0]}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-surface-200">{badge.name}</p>
                                <p className="text-xs text-surface-500">{badge.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-surface-500 text-center py-2">
                        No badges yet. Start shopping and interacting with AI!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=4f46e5&color=fff`}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full ring-2 ring-primary-500/50"
                  />
                  <span className="text-sm text-surface-300 max-w-[120px] truncate">{user.displayName}</span>
                </div>
                <button onClick={logout} className="px-3 py-1.5 rounded-lg text-sm text-surface-400
                  hover:text-red-400 hover:bg-red-500/10 transition-all duration-200" id="logout-btn">
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={login} className="btn-primary text-sm !px-4 !py-2" id="login-btn">
                <span className="mr-1.5">🔐</span> Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-800 transition-colors"
              id="mobile-menu-btn"
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`block h-0.5 bg-surface-300 transition-all duration-300
                  ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 bg-surface-300 transition-all duration-300
                  ${mobileOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 bg-surface-300 transition-all duration-300
                  ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out
        ${mobileOpen ? 'max-h-80 border-t border-surface-700/50' : 'max-h-0'}`}>
        <div className="px-4 py-3 space-y-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${location.pathname === link.to
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'text-surface-400 hover:text-surface-50 hover:bg-surface-800/60'
                }`}
              >
              <span className="mr-2">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

