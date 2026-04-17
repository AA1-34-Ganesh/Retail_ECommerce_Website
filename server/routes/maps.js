const express = require('express');
const router = express.Router();

// GET /api/maps/nearby — nearby store suggestions
router.get('/nearby', async (req, res) => {
  const { lat, lng, query } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      const searchQuery = query || 'shopping mall retail store';
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=store&keyword=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      const stores = (data.results || []).slice(0, 8).map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        rating: place.rating || 0,
        totalRatings: place.user_ratings_total || 0,
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng,
        open: place.opening_hours?.open_now ?? null,
        types: place.types?.slice(0, 3) || []
      }));

      res.json({ stores, source: 'google' });
    } catch (error) {
      console.error('Maps API error:', error.message);
      res.json({ stores: getDemoStores(parseFloat(lat), parseFloat(lng)), source: 'demo' });
    }
  } else {
    res.json({ stores: getDemoStores(parseFloat(lat), parseFloat(lng)), source: 'demo' });
  }
});

// GET /api/maps/key — return Maps API key for frontend embed
router.get('/key', (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_API_KEY || null });
});

function getDemoStores(lat, lng) {
  return [
    {
      id: 'demo_1',
      name: 'SmartCart Flagship Store',
      address: '123 Main Street',
      rating: 4.7,
      totalRatings: 1250,
      lat: lat + 0.005,
      lng: lng + 0.003,
      open: true,
      types: ['store', 'electronics_store']
    },
    {
      id: 'demo_2',
      name: 'Fashion Hub Mall',
      address: '456 Fashion Ave',
      rating: 4.5,
      totalRatings: 890,
      lat: lat - 0.003,
      lng: lng + 0.007,
      open: true,
      types: ['shopping_mall', 'clothing_store']
    },
    {
      id: 'demo_3',
      name: 'TechZone Electronics',
      address: '789 Tech Boulevard',
      rating: 4.3,
      totalRatings: 567,
      lat: lat + 0.008,
      lng: lng - 0.004,
      open: false,
      types: ['electronics_store', 'store']
    },
    {
      id: 'demo_4',
      name: 'Green Living Home Store',
      address: '321 Eco Lane',
      rating: 4.6,
      totalRatings: 423,
      lat: lat - 0.006,
      lng: lng - 0.005,
      open: true,
      types: ['home_goods_store', 'store']
    },
    {
      id: 'demo_5',
      name: 'SportsPlex Outlet',
      address: '654 Athletic Way',
      rating: 4.4,
      totalRatings: 312,
      lat: lat + 0.002,
      lng: lng + 0.009,
      open: true,
      types: ['sporting_goods_store', 'store']
    }
  ];
}

module.exports = router;
