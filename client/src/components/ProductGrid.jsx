import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '../services/api';
import { useGamification } from '../context/GamificationContext';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

export default function ProductGrid({ filteredProducts, externalSearch }) {
  const { recordSearch, recordPriceFilter } = useGamification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [hasRecordedSearch, setHasRecordedSearch] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (externalSearch !== undefined) {
      setSearch(externalSearch);
    }
  }, [externalSearch]);

  useEffect(() => {
    // Record search when user performs a search
    if (search && !hasRecordedSearch) {
      recordSearch();
      setHasRecordedSearch(true);
    } else if (!search) {
      setHasRecordedSearch(false);
    }
  }, [search, hasRecordedSearch, recordSearch]);

  useEffect(() => {
    // Record price filter when user sets price range
    if ((minPrice || maxPrice) && filteredProducts === null) {
      recordPriceFilter();
    }
  }, [minPrice, maxPrice, filteredProducts, recordPriceFilter]);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }

  // Use filtered products from AI or apply local filters
  const displayProducts = filteredProducts || products;

  const filtered = displayProducts.filter(p => {
    const matchCategory = category === 'All' || p.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags?.some(t => t.includes(q));
    const matchMinPrice = !minPrice || p.price >= parseFloat(minPrice);
    const matchMaxPrice = !maxPrice || p.price <= parseFloat(maxPrice);
    return matchCategory && matchSearch && matchMinPrice && matchMaxPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field !pl-10"
            id="product-search-input"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input-field !w-auto min-w-[160px] cursor-pointer"
          id="product-sort-select"
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-lg bg-surface-800/30 border border-surface-700/30">
        <div className="flex-1">
          <label className="text-xs text-surface-500 mb-1 block">Min Price</label>
          <input
            type="number"
            placeholder="$0"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="input-field !text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-surface-500 mb-1 block">Max Price</label>
          <input
            type="number"
            placeholder="$1000"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="input-field !text-sm"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`chip ${category === cat ? 'chip-active' : ''}`}
            id={`filter-${cat.toLowerCase()}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {filteredProducts && (
        <div className="flex items-center gap-2 text-sm text-accent-400">
          <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
          AI filtered: showing {sorted.length} matching products
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="skeleton aspect-square"></div>
              <div className="p-4 space-y-3 glass">
                <div className="skeleton h-4 w-3/4 rounded"></div>
                <div className="skeleton h-3 w-full rounded"></div>
                <div className="skeleton h-5 w-1/3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map((product, i) => (
            <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-surface-300 mb-2">No products found</h3>
          <p className="text-surface-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
