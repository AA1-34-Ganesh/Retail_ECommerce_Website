import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(data => {
        setProduct(data.product || null);
        setRelated(data.related || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
            <div className="skeleton aspect-square rounded-2xl"></div>
            <div className="space-y-4">
              <div className="skeleton h-8 w-3/4 rounded-xl"></div>
              <div className="skeleton h-4 w-1/2 rounded"></div>
              <div className="skeleton h-6 w-1/4 rounded"></div>
              <div className="skeleton h-24 w-full rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-surface-200 mb-2">Product Not Found</h2>
          <Link to="/products" className="btn-primary mt-4 inline-block">← Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-surface-500 mb-8">
          <Link to="/products" className="hover:text-primary-400 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-surface-300">{product.category}</span>
          <span>/</span>
          <span className="text-surface-300 truncate">{product.title}</span>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-surface-800 border border-surface-700/50">
            <img
              src={product.image}
              alt={product.title}
              className="w-full aspect-square object-cover"
            />
            <span className="absolute top-4 left-4 badge-primary text-sm">{product.category}</span>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-surface-50 mb-3">{product.title}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-lg">★</span>
                <span className="text-lg font-semibold text-surface-200">{product.rating}</span>
              </div>
              <span className="text-surface-600">|</span>
              <span className="text-surface-400">{product.category}</span>
            </div>

            <div className="text-4xl font-black text-primary-400 mb-6">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-surface-300 leading-relaxed mb-6">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags?.map(tag => (
                <span key={tag} className="badge bg-surface-800 text-surface-400 text-xs">{tag}</span>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-3">
              <button className="btn-primary w-full text-lg !py-4" id="add-to-cart-btn">
                🛒 Add to Cart
              </button>
              <Link
                to={`/chat`}
                className="btn-secondary w-full text-center block"
                id="ask-ai-btn"
              >
                🤖 Ask AI About This Product
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-surface-50 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
