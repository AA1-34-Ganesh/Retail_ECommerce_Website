import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts({ sort: 'rating' })
      .then(data => setFeatured((data.products || []).slice(0, 8)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <HeroSection />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-50 mb-3">
            ⭐ Top Rated Products
          </h2>
          <p className="text-surface-400 max-w-lg mx-auto">
            Handpicked selections with the best ratings from our catalog
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product, i) => (
            <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
            View All Products <span>→</span>
          </Link>
        </div>
      </section>

      {/* AI CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span>🤖</span>
            <span className="text-sm text-surface-300">Powered by Gemini AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-50 mb-4">
            Can't decide? Let AI help you shop.
          </h2>
          <p className="text-surface-400 mb-8 max-w-xl mx-auto">
            Tell our AI your budget, style, and occasion — get instant personalized recommendations
            with smart product matching.
          </p>
          <Link to="/chat" className="btn-primary text-lg !px-8 !py-4 inline-flex items-center gap-2">
            <span>💬</span> Start a Conversation
          </Link>
        </div>
      </section>

      {/* Features Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '📷',
              title: 'Visual Product Search',
              desc: 'Upload a photo and find similar products instantly using Google Vision AI.',
              link: '/image-search',
              cta: 'Try Visual Search'
            },
            {
              icon: '📍',
              title: 'Find Nearby Stores',
              desc: 'Discover retail stores near your location with ratings and directions.',
              link: '/products',
              cta: 'Explore Stores'
            },
            {
              icon: '📊',
              title: 'Smart Analytics',
              desc: 'Track trending products and your shopping patterns over time.',
              link: '/dashboard',
              cta: 'View Dashboard'
            },
          ].map((feature, i) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="card-interactive text-center animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-surface-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-surface-400 mb-4">{feature.desc}</p>
              <span className="text-sm text-primary-400 font-medium">{feature.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
