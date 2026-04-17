const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth');
const { getDb } = require('../config/firebase');
const products = require('../data/products.json');

let groqClient = null;

function getGroqClient() {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      const Groq = require('groq-sdk');
      groqClient = new Groq({ apiKey });
    }
  }
  return groqClient;
}

// Outfit bundles: combinations of top + bottom + shoes
const OUTFIT_BUNDLES = {
  wedding: {
    name: '💍 Complete Wedding Look',
    items: ['p002', 'p009', 'p007'], // Blazer, Wallet, Running Shoes
    description: 'Elegant and sophisticated ensemble'
  },
  casual: {
    name: '😎 Casual Day Out',
    items: ['p004', 'p016', 'p007'], // T-Shirt, Denim Jacket, Shoes
    description: 'Comfortable and stylish everyday look'
  },
  workout: {
    name: '💪 Fitness Bundle',
    items: ['p007', 'p011', 'p020'], // Sneakers, Yoga Mat, Resistance Bands
    description: 'Everything you need for home workouts'
  },
  party: {
    name: '🎉 Party Ready',
    items: ['p002', 'p013', 'p001'], // Blazer, Speaker, Headphones
    description: 'Look sharp and bring the vibes'
  }
};

// Preloaded demo responses for reliable showcase
const DEMO_RESPONSES = {
  'wedding outfit': {
    reply: 'Perfect! 💍 For a wedding, I\'d recommend an elegant ensemble. Are you the guest, groom, or attending in a formal capacity? This helps me pick the right style and price range.',
    isFollowUpQuestion: true
  },
  'shoes under 100': {
    reply: 'Sure! 👟 For shoes under $100, I found some great options. Are these for running, casual wear, or specific activities?',
    isFollowUpQuestion: true
  },
  'fitness gear': {
    reply: 'Awesome! 💪 For fitness, I can help you build the perfect home gym. Are you focusing on cardio, strength training, or yoga?',
    isFollowUpQuestion: true
  }
};

const SYSTEM_PROMPT = `You are SmartCart AI, a friendly and knowledgeable shopping assistant with personality. You help users find the perfect products based on their preferences, budget, and needs.

Key behaviors:
1. ASK CLARIFYING QUESTIONS FIRST - Before recommending, ask about specifics (e.g., "Are these for running, gym, or casual use?")
2. DETECT OUTFITS - When users ask for complete looks (wedding, party, casual), recommend bundled products
3. Be conversational, enthusiastic, and use relevant emojis
4. Keep responses concise but friendly

When recommending specific products, include their IDs in this format: [PRODUCT:p001]

Available products:
${products.map(p => `- ${p.id}: ${p.title} ($${p.price}) [${p.category}] Rating: ${p.rating}`).join('\n')}`;

// POST /api/ai/chat — enhanced chat with follow-up questions
router.post('/chat', verifyAuth, async (req, res) => {
  const { message, preferences, history, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const groq = getGroqClient();
    
    // Check for outfit request
    const outfitKeywords = ['outfit', 'look', 'ensemble', 'dress me', 'style me', 'wedding', 'party', 'casual look'];
    const isOutfitRequest = outfitKeywords.some(kw => message.toLowerCase().includes(kw));

    // If demo mode or no API key
    if (!groq) {
      const mockResponse = generateSmartMockResponse(message, preferences, isOutfitRequest);
      return res.json(mockResponse);
    }

    // Build conversation context
    let systemContent = SYSTEM_PROMPT;

    let userContent = message;
    if (preferences) {
      userContent = `[User Preferences: Budget $${preferences.budget || 'Any'}, Category: ${preferences.category || 'Any'}, Occasion: ${preferences.occasion || 'Any'}]\n\n${userContent}`;
    }

    // Special system instruction for outfits
    if (isOutfitRequest) {
      systemContent += '\n\nIMPORTANT: User is asking for an outfit/complete look. If you recommend products, select items that work together (e.g., top + bottom + shoes).';
    }

    // Build conversation history for context
    let messages = [];
    if (history && history.length > 0) {
      messages = history.slice(-6).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
    }
    messages.push({ role: 'user', content: userContent });

    const response = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: messages,
      system: systemContent,
      temperature: 0.7,
      max_tokens: 1024
    });

    const responseText = response.choices[0].message.content;

    // Extract product IDs
    const productIds = [...responseText.matchAll(/\[PRODUCT:(p\d+)\]/g)].map(m => m[1]);
    let recommendedProducts = products.filter(p => productIds.includes(p.id));

    // If outfit request and no specific products, bundle some
    if (isOutfitRequest && recommendedProducts.length < 2) {
      const bundleKey = Object.keys(OUTFIT_BUNDLES).find(key => message.toLowerCase().includes(key)) || 'casual';
      const bundle = OUTFIT_BUNDLES[bundleKey];
      recommendedProducts = bundle.items.map(id => products.find(p => p.id === id)).filter(Boolean);
    }

    // Detect if this is a follow-up question
    const isFollowUp = responseText.includes('?') && !productIds.length;

    // Extract outfit info if applicable
    let outfitTitle = '';
    let isOutfit = false;
    if (isOutfitRequest && recommendedProducts.length > 0) {
      const bundleKey = Object.keys(OUTFIT_BUNDLES).find(key => message.toLowerCase().includes(key)) || 'casual';
      const bundle = OUTFIT_BUNDLES[bundleKey];
      outfitTitle = bundle.name;
      isOutfit = true;
    }

    res.json({
      reply: responseText.replace(/\[PRODUCT:p\d+\]/g, '').trim(),
      products: recommendedProducts,
      isFollowUpQuestion: isFollowUp,
      isOutfit,
      outfitTitle,
      context: { lastQuery: message, hasAskedFollow: isFollowUp }
    });
  } catch (error) {
    console.error('AI chat error:', error.message);
    // Graceful fallback to demo mode with smart responses
    const mockResponse = generateSmartMockResponse(message, preferences, false);
    res.json(mockResponse);
  }
});

// POST /api/ai/recommend — personalized recommendations
router.post('/recommend', verifyAuth, async (req, res) => {
  const { preferences } = req.body;
  let recommended = [...products];

  if (preferences?.category && preferences.category !== 'All') {
    recommended = recommended.filter(p => p.category === preferences.category);
  }

  if (preferences?.budget) {
    recommended = recommended.filter(p => p.price <= preferences.budget);
  }

  recommended.sort((a, b) => b.rating - a.rating);

  if (req.user) {
    const db = getDb();
    try {
      await db.collection('userPreferences').doc(req.user.uid).set({
        ...preferences,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) { /* best-effort */ }
  }

  res.json({ products: recommended.slice(0, 8) });
});

function generateSmartMockResponse(message, preferences, isOutfitRequest) {
  const msg = message.toLowerCase();

  // Check for preloaded demo responses (high priority)
  for (const [key, response] of Object.entries(DEMO_RESPONSES)) {
    if (msg.includes(key)) {
      return {
        reply: response.reply,
        products: [],
        isFollowUpQuestion: response.isFollowUpQuestion,
        isOutfit: false,
        outfitTitle: '',
        context: { demoMode: true }
      };
    }
  }

  // Outfit bundling
  if (isOutfitRequest) {
    let bundleKey = 'casual';
    if (msg.includes('wedding')) bundleKey = 'wedding';
    else if (msg.includes('party')) bundleKey = 'party';
    else if (msg.includes('workout') || msg.includes('fitness')) bundleKey = 'workout';

    const bundle = OUTFIT_BUNDLES[bundleKey];
    const bundleProducts = bundle.items
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);

    const reply = `✨ ${bundle.name}\n${bundle.description}\n\nI've curated this complete look just for you! Would you like me to suggest alternatives or adjust the style?`;
    return {
      reply,
      products: bundleProducts,
      isFollowUpQuestion: true,
      isOutfit: true,
      outfitTitle: bundle.name,
      context: { outfit: bundleKey }
    };
  }

  // Smart category filtering
  let filtered = [...products];

  if (msg.includes('headphone') || msg.includes('audio') || msg.includes('music') || msg.includes('speaker')) {
    filtered = filtered.filter(p => p.tags.some(t => ['headphones', 'speaker', 'audio'].includes(t)));
  } else if (msg.includes('fashion') || msg.includes('cloth') || msg.includes('wear') || msg.includes('jacket')) {
    filtered = filtered.filter(p => p.category === 'Fashion');
  } else if (msg.includes('fitness') || msg.includes('sport') || msg.includes('workout') || msg.includes('gym') || msg.includes('yoga')) {
    filtered = filtered.filter(p => p.category === 'Sports');
  } else if (msg.includes('skin') || msg.includes('beauty') || msg.includes('cream') || msg.includes('serum')) {
    filtered = filtered.filter(p => p.category === 'Beauty');
  } else if (msg.includes('home') || msg.includes('kitchen') || msg.includes('decor') || msg.includes('lamp')) {
    filtered = filtered.filter(p => p.category === 'Home');
  } else if (msg.includes('tech') || msg.includes('gadget') || msg.includes('electronic') || msg.includes('keyboard')) {
    filtered = filtered.filter(p => p.category === 'Electronics');
  }

  if (preferences?.budget) {
    filtered = filtered.filter(p => p.price <= preferences.budget);
  }

  if (filtered.length === 0) filtered = products.slice(0, 4);
  const picks = filtered.sort((a, b) => b.rating - a.rating).slice(0, 3);

  // Add follow-up question if vague
  const needsFollowUp = msg.length < 30 || !preferences?.budget;
  const followUpQuestion = needsFollowUp ? '\n\nQuick question: What\'s your budget range, and are you looking for anything specific?' : '';

  const reply = `Great! 🛍️ Based on what you're looking for, here are my top picks:\n\n${picks.map((p, i) => `${i + 1}. **${p.title}** — $${p.price} ⭐ ${p.rating}\n   ${p.description}`).join('\n\n')}${followUpQuestion}`;

  return {
    reply,
    products: picks,
    isFollowUpQuestion: needsFollowUp,
    isOutfit: false,
    outfitTitle: '',
    context: { category: filtered[0]?.category }
  };
}

module.exports = router;

