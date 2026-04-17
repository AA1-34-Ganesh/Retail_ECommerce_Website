import { useState } from 'react';
import ChatPanel from '../components/ChatPanel';
import OutfitBundle from '../components/OutfitBundle';
import ProductCard from '../components/ProductCard';

export default function Chat() {
  const [aiProducts, setAiProducts] = useState([]);
  const [isOutfitBundle, setIsOutfitBundle] = useState(false);
  const [bundleTitle, setBundleTitle] = useState('');

  const handleProductsFiltered = (products, metadata = {}) => {
    setAiProducts(products);
    setIsOutfitBundle(metadata.isOutfit || false);
    setBundleTitle(metadata.title || '');
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-surface-50">🤖 AI Shopping Assistant</h1>
          <p className="text-surface-400 mt-1">
            Chat with our AI to get personalized product recommendations
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chat Panel — Left */}
          <div className="lg:w-[480px] shrink-0">
            <ChatPanel
              onProductsFiltered={handleProductsFiltered}
              isFullPage={true}
            />
          </div>

          {/* Recommended Products — Right */}
          <div className="flex-1 min-w-0">
            <div className="sticky top-20">
              {aiProducts.length > 0 ? (
                <div className="animate-fade-in space-y-6">
                  {/* Display as outfit bundle if applicable */}
                  {isOutfitBundle ? (
                    <OutfitBundle
                      products={aiProducts}
                      title={bundleTitle || '💍 Complete Look'}
                      description="Perfectly curated items that work together"
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
                        <h3 className="text-lg font-semibold text-surface-200">
                          AI Recommendations ({aiProducts.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {aiProducts.map((product, i) => (
                          <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="card text-center py-20 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
                  <div className="text-6xl mb-4 animate-float">🛍️</div>
                  <h3 className="text-xl font-semibold text-surface-300 mb-2">
                    Products will appear here
                  </h3>
                  <p className="text-surface-500 max-w-sm mx-auto">
                    Start chatting with the AI assistant and recommended products will
                    show up in this panel automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
