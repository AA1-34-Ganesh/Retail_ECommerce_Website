import { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import ChatPanel from '../components/ChatPanel';
import NearbyStores from '../components/NearbyStores';

export default function Products() {
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showStores, setShowStores] = useState(false);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-surface-50">🛍️ Products</h1>
            <p className="text-surface-400 mt-1">Browse our curated collection or let AI find what you need</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowStores(!showStores); if (!showStores) setShowChat(false); }}
              className={`btn-secondary text-sm !px-4 !py-2 ${showStores ? '!bg-accent-500/20 !border-accent-500 !text-accent-300' : ''}`}
              id="toggle-stores"
            >
              📍 Nearby Stores
            </button>
            <button
              onClick={() => { setShowChat(!showChat); if (!showChat) setShowStores(false); }}
              className={`btn-secondary text-sm !px-4 !py-2 ${showChat ? '!bg-primary-500/20 !border-primary-500 !text-primary-300' : ''}`}
              id="toggle-chat"
            >
              🤖 AI Assistant
            </button>
            {filteredProducts && (
              <button
                onClick={() => setFilteredProducts(null)}
                className="btn-secondary text-sm !px-4 !py-2 !text-red-400 !border-red-500/50 hover:!bg-red-500/10"
                id="clear-filter"
              >
                ✕ Clear AI Filter
              </button>
            )}
          </div>
        </div>

        {/* Stores Panel */}
        {showStores && (
          <div className="mb-8 animate-slide-down">
            <NearbyStores />
          </div>
        )}

        {/* Split Layout */}
        <div className={`flex gap-6 ${showChat ? 'flex-col lg:flex-row' : ''}`}>
          {/* Chat Panel */}
          {showChat && (
            <div className="lg:w-[400px] shrink-0 animate-slide-down">
              <ChatPanel onProductsFiltered={setFilteredProducts} />
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid filteredProducts={filteredProducts} />
          </div>
        </div>
      </div>

      {/* Floating Chat Button (when chat is hidden) */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary
            shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50
            flex items-center justify-center text-2xl
            hover:scale-110 active:scale-95 transition-all duration-200 z-40 animate-glow"
          id="floating-chat-btn"
        >
          🤖
        </button>
      )}
    </div>
  );
}
