const admin = require('firebase-admin');

let db = null;

function getDb() {
  if (!db) {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
          credential: admin.credential.cert({ projectId, clientEmail, privateKey })
        });
        db = admin.firestore();
        console.log('✅ Firebase Admin initialized');
      } else {
        console.warn('⚠️  Firebase credentials not found — running in demo mode');
        db = createMockDb();
      }
    } catch (error) {
      console.warn('⚠️  Firebase init failed — running in demo mode:', error.message);
      db = createMockDb();
    }
  }
  return db;
}

// Mock Firestore for demo mode (no real Firebase credentials)
function createMockDb() {
  const store = {};
  return {
    collection: (name) => {
      if (!store[name]) store[name] = [];
      return {
        add: async (doc) => {
          const id = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          store[name].push({ id, ...doc });
          return { id };
        },
        doc: (id) => ({
          get: async () => {
            const found = store[name].find(d => d.id === id);
            return { exists: !!found, data: () => found, id };
          },
          set: async (doc, opts) => {
            const idx = store[name].findIndex(d => d.id === id);
            if (idx >= 0) store[name][idx] = { ...store[name][idx], ...doc };
            else store[name].push({ id, ...doc });
          },
          update: async (doc) => {
            const idx = store[name].findIndex(d => d.id === id);
            if (idx >= 0) store[name][idx] = { ...store[name][idx], ...doc };
          }
        }),
        where: () => ({
          orderBy: () => ({
            limit: () => ({
              get: async () => ({ docs: store[name].slice(0, 10).map(d => ({ id: d.id, data: () => d })) })
            }),
            get: async () => ({ docs: store[name].map(d => ({ id: d.id, data: () => d })) })
          }),
          get: async () => ({ docs: store[name].map(d => ({ id: d.id, data: () => d })) })
        }),
        orderBy: (field, dir) => ({
          limit: (n) => ({
            get: async () => ({ docs: store[name].slice(0, n).map(d => ({ id: d.id, data: () => d })) })
          }),
          get: async () => ({ docs: store[name].map(d => ({ id: d.id, data: () => d })) })
        }),
        get: async () => ({ docs: store[name].map(d => ({ id: d.id, data: () => d })) })
      };
    }
  };
}

function getAuth() {
  try {
    return admin.auth();
  } catch {
    return null;
  }
}

module.exports = { getDb, getAuth };
