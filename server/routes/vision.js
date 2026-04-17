const express = require('express');
const router = express.Router();
const multer = require('multer');
const products = require('../data/products.json');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

let visionClient = null;

function getVisionClient() {
  if (!visionClient && process.env.GOOGLE_VISION_API_KEY) {
    try {
      const vision = require('@google-cloud/vision');
      visionClient = new vision.ImageAnnotatorClient({
        credentials: { client_email: '', private_key: '' },
        apiKey: process.env.GOOGLE_VISION_API_KEY
      });
    } catch (e) {
      console.warn('Vision API client init failed:', e.message);
    }
  }
  return visionClient;
}

// POST /api/vision/search — image-based product search
router.post('/search', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  try {
    const client = getVisionClient();
    let labels = [];

    if (client) {
      // Real Vision API call
      const [result] = await client.labelDetection({
        image: { content: req.file.buffer.toString('base64') }
      });
      labels = result.labelAnnotations?.map(l => l.description.toLowerCase()) || [];
    } else {
      // Demo mode — extract labels from filename or use generic ones
      labels = extractDemoLabels(req.file.originalname);
    }

    // Match labels against product tags and categories
    const scored = products.map(product => {
      let score = 0;
      const productTerms = [
        ...product.tags,
        product.category.toLowerCase(),
        ...product.title.toLowerCase().split(' ')
      ];

      labels.forEach(label => {
        productTerms.forEach(term => {
          if (term.includes(label) || label.includes(term)) {
            score += 1;
          }
        });
      });

      return { ...product, matchScore: score };
    });

    const matches = scored
      .filter(p => p.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);

    // If no matches found, return top-rated products
    const results = matches.length > 0 ? matches : products.sort((a, b) => b.rating - a.rating).slice(0, 6);

    res.json({
      labels,
      products: results.map(({ matchScore, ...p }) => p)
    });
  } catch (error) {
    console.error('Vision search error:', error.message);
    res.json({
      labels: ['general'],
      products: products.slice(0, 6)
    });
  }
});

function extractDemoLabels(filename) {
  const name = (filename || '').toLowerCase().replace(/\.[^.]+$/, '');
  const commonLabels = {
    shoe: ['shoes', 'sneakers', 'athletic', 'footwear', 'running'],
    shirt: ['tshirt', 'fashion', 'clothing', 'cotton', 'casual'],
    watch: ['smartwatch', 'wearable', 'fitness', 'tracker'],
    camera: ['camera', 'security', 'surveillance', 'smart-home'],
    headphone: ['headphones', 'audio', 'wireless', 'bluetooth'],
    skin: ['skincare', 'beauty', 'serum', 'cream'],
    gym: ['fitness', 'workout', 'gym', 'exercise', 'weights'],
    kitchen: ['cookware', 'kitchen', 'cooking', 'ceramic'],
    bag: ['backpack', 'travel', 'canvas', 'laptop'],
    phone: ['wireless', 'charger', 'usb-c', 'accessories']
  };

  for (const [key, labels] of Object.entries(commonLabels)) {
    if (name.includes(key)) return labels;
  }

  return ['product', 'item', 'shopping', 'retail'];
}

module.exports = router;
