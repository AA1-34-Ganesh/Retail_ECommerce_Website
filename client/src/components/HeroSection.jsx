import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/5 rounded-full blur-2xl animate-pulse-soft"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
          <span className="text-sm text-surface-300">Powered by Google Gemini AI</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 animate-slide-up text-balance">
          Shop Smarter with{' '}
          <span className="gradient-text">AI-Powered</span>{' '}
          Intelligence
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed"
          style={{ animationDelay: '0.15s' }}>
          Your personal shopping assistant that understands your style, budget, and preferences.
          Discover products through conversation, image search, and smart recommendations.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: '0.3s' }}>
          <Link to="/chat" className="btn-primary text-lg !px-8 !py-4 flex items-center gap-2" id="hero-cta-chat">
            <span>🤖</span> Chat with AI Assistant
          </Link>
          <Link to="/products" className="btn-secondary text-lg !px-8 !py-4 flex items-center gap-2" id="hero-cta-products">
            <span>🛍️</span> Browse Products
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 animate-slide-up" style={{ animationDelay: '0.45s' }}>
          {[
            { icon: '🤖', label: 'AI Chat', desc: 'Smart Recommendations' },
            { icon: '📷', label: 'Visual Search', desc: 'Upload & Find' },
            { icon: '📍', label: 'Nearby Stores', desc: 'Local Shopping' },
            { icon: '📊', label: 'Analytics', desc: 'Track Trends' },
          ].map((feature) => (
            <div key={feature.label} className="card text-center !p-4">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="font-semibold text-surface-100 text-sm">{feature.label}</div>
              <div className="text-xs text-surface-500 mt-1">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
