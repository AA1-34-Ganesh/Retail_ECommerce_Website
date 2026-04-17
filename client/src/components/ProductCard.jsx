import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { id, title, price, category, image, rating, description } = product;

  return (
    <Link
      to={`/product/${id}`}
      className="group card-interactive flex flex-col overflow-hidden !p-0"
      id={`product-card-${id}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-800">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="badge-primary backdrop-blur-sm">{category}</span>
        </div>
        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="btn-primary text-sm !px-4 !py-2 transform translate-y-4
            group-hover:translate-y-0 transition-transform duration-300">
            View Details →
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-surface-100 mb-1 line-clamp-2 group-hover:text-primary-300 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-surface-500 mb-3 line-clamp-2">{description}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-primary-400">${price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-sm">★</span>
            <span className="text-sm text-surface-400">{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
