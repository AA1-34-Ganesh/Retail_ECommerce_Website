import ProductCard from './ProductCard';

export default function OutfitBundle({ products, title = '💍 Complete Look', description = '' }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="group">
      <div className="relative">
        {/* Bundle header */}
        <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 backdrop-blur-sm">
          <h3 className="font-bold text-surface-100 flex items-center gap-2">
            <span className="text-xl animate-pulse">{title.split(' ')[0]}</span>
            {title}
          </h3>
          {description && (
            <p className="text-xs text-surface-400 mt-1">{description}</p>
          )}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="relative animate-scale-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Item badge */}
              <div className="absolute top-2 right-2 z-10 bg-primary-500/90 text-white px-2 py-1 rounded-full text-xs font-bold">
                Item {idx + 1}
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Bundle highlight effect */}
        <div className="absolute inset-0 rounded-xl border-2 border-primary-400/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}
