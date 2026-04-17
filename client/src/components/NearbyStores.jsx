import { useState, useEffect } from 'react';
import { getNearbyStores, getMapsKey } from '../services/api';

export default function NearbyStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [mapsKey, setMapsKey] = useState(null);

  useEffect(() => {
    getMapsKey().then(data => setMapsKey(data.key)).catch(() => {});
  }, []);

  function requestLocation() {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });

        try {
          const data = await getNearbyStores(latitude, longitude, 'shopping');
          setStores(data.stores || []);
        } catch {
          setStores([]);
        }
        setLoading(false);
      },
      (err) => {
        setError('Location access denied. Please allow location access and try again.');
        setLoading(false);
        // Use demo location
        loadDemoStores();
      }
    );
  }

  async function loadDemoStores() {
    try {
      const data = await getNearbyStores(28.6139, 77.2090, 'shopping');
      setStores(data.stores || []);
      setLocation({ lat: 28.6139, lng: 77.2090 });
    } catch {
      setStores([]);
    }
  }

  return (
    <div className="space-y-6">
      {!location ? (
        <div className="text-center py-16 card">
          <div className="text-6xl mb-4 animate-float">📍</div>
          <h3 className="text-xl font-bold text-surface-100 mb-2">Find Nearby Stores</h3>
          <p className="text-surface-400 mb-6 max-w-md mx-auto">
            Allow location access to discover retail stores near you with ratings and directions.
          </p>
          <button onClick={requestLocation} disabled={loading} className="btn-primary" id="location-btn">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Getting location...
              </span>
            ) : (
              '📍 Enable Location'
            )}
          </button>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>
      ) : (
        <>
          {/* Map Embed */}
          {mapsKey && (
            <div className="rounded-2xl overflow-hidden border border-surface-700/50 h-64">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/search?key=${mapsKey}&q=shopping+stores&center=${location.lat},${location.lng}&zoom=13`}
                title="Nearby stores map"
              ></iframe>
            </div>
          )}

          {/* Store Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map(store => (
              <div key={store.id} className="card hover:border-primary-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-surface-100">{store.name}</h4>
                  {store.open !== null && (
                    <span className={`badge text-xs ${store.open ? 'bg-accent-500/20 text-accent-300' : 'bg-red-500/20 text-red-300'}`}>
                      {store.open ? 'Open' : 'Closed'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-surface-400 mb-3">📍 {store.address}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">★</span>
                    <span className="text-sm font-medium text-surface-200">{store.rating}</span>
                    <span className="text-xs text-surface-500">({store.totalRatings})</span>
                  </div>
                  {store.lat && store.lng && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      Directions →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {stores.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-surface-400">No stores found nearby. Try expanding your search area.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
