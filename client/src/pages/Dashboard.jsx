import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, login } = useAuth();

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-surface-50">📊 Analytics Dashboard</h1>
            <p className="text-surface-400 mt-1">Track trending products and your activity</p>
          </div>
          {user && (
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=4f46e5&color=fff`}
                alt=""
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-surface-300">{user.displayName}</span>
            </div>
          )}
        </div>

        {!user && (
          <div className="card text-center py-8 mb-8 animate-fade-in">
            <p className="text-surface-400 mb-4">Sign in to see your personal activity stats</p>
            <button onClick={login} className="btn-primary text-sm" id="dashboard-login">
              🔐 Sign In with Google
            </button>
          </div>
        )}

        <AnalyticsDashboard />
      </div>
    </div>
  );
}
