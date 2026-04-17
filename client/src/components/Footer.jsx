import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-surface-800 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-white text-lg">🛒</span>
              </div>
              <span className="text-xl font-bold gradient-text">SmartCart AI</span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed max-w-sm">
              Your AI-powered shopping assistant. Discover personalized recommendations, search by image,
              and find nearby stores — all powered by Google AI.
            </p>
            <div className="flex gap-3 mt-4">
              {['Gemini', 'Firebase', 'Vision', 'Maps'].map(service => (
                <span key={service} className="badge-primary text-[10px]">{service}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-surface-200 mb-3">Features</h4>
            <div className="space-y-2">
              {[
                { to: '/chat', label: 'AI Assistant' },
                { to: '/products', label: 'Products' },
                { to: '/image-search', label: 'Visual Search' },
                { to: '/dashboard', label: 'Analytics' },
              ].map(link => (
                <Link key={link.to} to={link.to}
                  className="block text-sm text-surface-500 hover:text-primary-400 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div>
            <h4 className="font-semibold text-surface-200 mb-3">Built With</h4>
            <div className="space-y-2 text-sm text-surface-500">
              <p>React + Vite</p>
              <p>Tailwind CSS</p>
              <p>Node.js + Express</p>
              <p>Firebase</p>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-600">
            © {new Date().getFullYear()} SmartCart AI. Built for AMD Hackathon.
          </p>
          <p className="text-xs text-surface-600">
            Powered by Google Cloud AI Services
          </p>
        </div>
      </div>
    </footer>
  );
}
