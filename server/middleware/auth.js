const { getAuth } = require('../config/firebase');

async function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Allow unauthenticated access in demo mode
    req.user = null;
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  const auth = getAuth();

  if (!auth) {
    // Demo mode — create mock user from token
    req.user = { uid: 'demo_user', email: 'demo@smartcart.ai' };
    return next();
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth verification failed:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = { verifyAuth };
