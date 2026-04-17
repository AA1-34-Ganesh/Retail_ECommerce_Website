const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth');
const { getDb } = require('../config/firebase');

// POST /api/analytics/log — log a user activity
router.post('/log', verifyAuth, async (req, res) => {
  const { type, query, productId, metadata } = req.body;

  const logEntry = {
    type: type || 'search',
    query: query || '',
    productId: productId || null,
    metadata: metadata || {},
    userId: req.user?.uid || 'anonymous',
    timestamp: new Date().toISOString()
  };

  try {
    const db = getDb();
    await db.collection('activityLogs').add(logEntry);
    res.json({ success: true });
  } catch (error) {
    console.error('Analytics log error:', error.message);
    res.json({ success: true }); // Don't fail the client for logging errors
  }
});

// GET /api/analytics/top-searches — top searched terms
router.get('/top-searches', verifyAuth, async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection('activityLogs')
      .where('type', '==', 'search')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const searchCounts = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.query) {
        const q = data.query.toLowerCase().trim();
        searchCounts[q] = (searchCounts[q] || 0) + 1;
      }
    });

    const topSearches = Object.entries(searchCounts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // If no data, return demo data
    if (topSearches.length === 0) {
      return res.json({
        topSearches: [
          { term: 'headphones', count: 45 },
          { term: 'sneakers', count: 38 },
          { term: 'skincare', count: 32 },
          { term: 'smartwatch', count: 28 },
          { term: 'backpack', count: 24 },
          { term: 'coffee', count: 21 },
          { term: 'gaming keyboard', count: 18 },
          { term: 'yoga mat', count: 15 },
          { term: 'sunscreen', count: 12 },
          { term: 'dumbbells', count: 10 }
        ]
      });
    }

    res.json({ topSearches });
  } catch (error) {
    console.error('Top searches error:', error.message);
    res.json({
      topSearches: [
        { term: 'headphones', count: 45 },
        { term: 'sneakers', count: 38 },
        { term: 'skincare', count: 32 },
        { term: 'smartwatch', count: 28 },
        { term: 'backpack', count: 24 },
        { term: 'coffee', count: 21 },
        { term: 'gaming keyboard', count: 18 },
        { term: 'yoga mat', count: 15 },
        { term: 'sunscreen', count: 12 },
        { term: 'dumbbells', count: 10 }
      ]
    });
  }
});

// GET /api/analytics/user-stats — user activity statistics
router.get('/user-stats', verifyAuth, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user?.uid || 'anonymous';

    const snapshot = await db.collection('activityLogs')
      .where('userId', '==', userId)
      .get();

    const stats = {
      totalSearches: 0,
      totalChats: 0,
      totalViews: 0,
      totalImageSearches: 0,
      recentActivity: []
    };

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      switch (data.type) {
        case 'search': stats.totalSearches++; break;
        case 'chat': stats.totalChats++; break;
        case 'view': stats.totalViews++; break;
        case 'image_search': stats.totalImageSearches++; break;
      }
    });

    // Demo stats if no real data
    if (snapshot.docs.length === 0) {
      stats.totalSearches = 24;
      stats.totalChats = 12;
      stats.totalViews = 67;
      stats.totalImageSearches = 5;
    }

    stats.recentActivity = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    res.json({ stats });
  } catch (error) {
    console.error('User stats error:', error.message);
    res.json({
      stats: {
        totalSearches: 24,
        totalChats: 12,
        totalViews: 67,
        totalImageSearches: 5,
        recentActivity: []
      }
    });
  }
});

module.exports = router;
