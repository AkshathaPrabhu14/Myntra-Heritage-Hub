const Product = require('../models/Product');

const EMPTY_SECTION_KEYWORDS = [
  'men', 'man', 'mens', "men's",
  'women', 'woman', 'womens', "women's",
  'kids', 'kid', 'children', 'child',
  'home', 'living', 'home & living', 'home and living', 'home decor',
  'beauty', 'cosmetics',
  'genz', 'gen-z'
];

const isEmptySectionQuery = (term) => {
  if (!term) return false;
  const normalized = term.trim().toLowerCase();
  return EMPTY_SECTION_KEYWORDS.some(
    (k) => normalized === k || normalized === `${k}s` || normalized === `${k}'s`
  );
};

// @desc    Get all products with dynamic filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      state,
      category,
      isGITagged,
      isEcoFriendly,
      maxPrice,
      rating,
      material,
      availability,
      search,
    } = req.query;

    // Check if searching for or filtering by empty sections (Men, Women, Kids, Home & Living, Beauty, GenZ)
    if ((search && isEmptySectionQuery(search)) || (category && isEmptySectionQuery(category))) {
      return res.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const query = {};

    // 1. State filter (case-insensitive, flexible space/hyphen/ampersand matching)
    if (state) {
      const rawState = state.toLowerCase().trim();
      const pattern = rawState
        .replace(/&|and/g, '(?:&|and)')
        .replace(/[-\s]+/g, '[-\\s]+');
      query.state = new RegExp(`^${pattern}$`, 'i');
    }

    // 2. Category filter (supports comma-separated multi-selection)
    if (category) {
      const categories = category.split(',').map((cat) => cat.trim());
      query.category = { $in: categories };
    }

    // 3. GI Tagged status
    if (isGITagged) {
      query.isGITagged = isGITagged === 'true';
    }

    // 4. Eco Friendly status
    if (isEcoFriendly) {
      query.isEcoFriendly = isEcoFriendly === 'true';
    }

    // 5. Maximum Price ceiling
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    // 6. Minimum Rating threshold
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 7. Material type (supports comma-separated items, matching case-insensitively)
    if (material) {
      const materials = material.split(',').map((mat) => mat.trim());
      query.material = { $in: materials.map((m) => new RegExp(`^${m}$`, 'i')) };
    }

    // 8. Stock availability
    if (availability) {
      query.availability = availability;
    }

    // 9. Keyword search across name, craft, state, description, material, category, artisanName, and giRegistryNumber
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { craft: searchRegex },
        { state: searchRegex },
        { description: searchRegex },
        { material: searchRegex },
        { category: searchRegex },
        { artisanName: searchRegex },
        { giRegistryNumber: searchRegex },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(`Get products query error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error retrieving products list' });
  }
};

// @desc    Get specific product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json({ success: true, data: product });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Get product details error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error retrieving product details' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const syncAvailability = (body) => {
  if (body.stock !== undefined) {
    body.availability = Number(body.stock) > 0 ? 'In Stock' : 'Out of Stock';
  }
  return body;
};

const parseProductPayload = (req) => {
  const body = { ...req.body };

  // Parse numeric fields
  if (body.price !== undefined && body.price !== '') body.price = Number(body.price);
  if (body.discount !== undefined && body.discount !== '') body.discount = Number(body.discount);
  if (body.stock !== undefined && body.stock !== '') body.stock = Number(body.stock);
  if (body.rating !== undefined && body.rating !== '') body.rating = Number(body.rating);

  // Parse boolean fields
  if (body.isGITagged !== undefined) {
    body.isGITagged = body.isGITagged === 'true' || body.isGITagged === true;
  }
  if (body.isEcoFriendly !== undefined) {
    body.isEcoFriendly = body.isEcoFriendly === 'true' || body.isEcoFriendly === true;
  }

  // Parse sizes field
  if (body.sizes) {
    if (typeof body.sizes === 'string') {
      try {
        const parsed = JSON.parse(body.sizes);
        if (Array.isArray(parsed)) {
          body.sizes = parsed;
        } else {
          body.sizes = body.sizes.split(',').map((s) => s.trim()).filter(Boolean);
        }
      } catch (e) {
        body.sizes = body.sizes.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
  }

  // Gather uploaded files from Multer (req.files)
  let uploadedFileUrls = [];
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    uploadedFileUrls = req.files.map((file) =>
      file.path && file.path.startsWith('http') ? file.path : `/uploads/${file.filename}`
    );
  }

  // Gather existing body images if present
  let bodyImages = [];
  if (body.images) {
    if (typeof body.images === 'string') {
      try {
        const parsed = JSON.parse(body.images);
        if (Array.isArray(parsed)) {
          bodyImages = parsed;
        } else {
          bodyImages = [body.images];
        }
      } catch (e) {
        bodyImages = body.images.split(',').map((s) => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(body.images)) {
      bodyImages = body.images;
    }
  }

  // Combine uploaded file URLs with existing body images
  let finalImages = [...uploadedFileUrls, ...bodyImages].filter(Boolean);
  finalImages = Array.from(new Set(finalImages));

  if (finalImages.length > 0) {
    body.images = finalImages;
    body.image = finalImages[0];
  } else if (body.image) {
    body.images = [body.image];
  }

  return syncAvailability(body);
};

const createProduct = async (req, res) => {
  try {
    const payload = parseProductPayload(req);
    const product = await Product.create(payload);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(`Create product error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const payload = parseProductPayload(req);
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (product) {
      return res.json({ success: true, data: product });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Update product error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      return res.json({ success: true, message: 'Product removed' });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Delete product error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
};

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = {
      userName: req.body.userName || req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };

    product.reviews.push(review);

    // Recalculate average rating
    const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;

    await product.save();
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(`Add review error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get product statistics for admin dashboard
// @route   GET /api/products/stats
// @access  Public (summary data)
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const giCertified = await Product.countDocuments({ isGITagged: true });
    const uniqueStates = await Product.distinct('state');
    const uniqueArtisans = await Product.distinct('artisanName');

    return res.json({
      success: true,
      data: {
        totalProducts,
        giCertified,
        statesOnboarded: uniqueStates.length,
        activeArtisans: uniqueArtisans.length,
      },
    });
  } catch (error) {
    console.error(`Stats error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};

// @desc    Get search suggestions for search-as-you-type autocomplete
// @route   GET /api/products/suggestions
// @access  Public
const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '' || isEmptySectionQuery(q)) {
      return res.json({ success: true, data: [] });
    }

    const searchRegex = new RegExp(q.trim(), 'i');

    // We project relevant fields to optimize speed
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { craft: searchRegex },
        { state: searchRegex },
        { material: searchRegex },
        { category: searchRegex },
        { artisanName: searchRegex }
      ]
    }).select('name craft state material category artisanName').limit(50);

    const suggestions = new Set();
    const queryLower = q.toLowerCase();

    products.forEach(p => {
      if (p.name && p.name.toLowerCase().includes(queryLower)) {
        suggestions.add(p.name);
      }
      if (p.craft && p.craft.toLowerCase().includes(queryLower)) {
        suggestions.add(p.craft);
      }
      if (p.state && p.state.toLowerCase().includes(queryLower)) {
        suggestions.add(p.state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      }
      if (p.material && p.material.toLowerCase().includes(queryLower)) {
        suggestions.add(p.material);
      }
      if (p.category && p.category.toLowerCase().includes(queryLower)) {
        suggestions.add(p.category);
      }
      if (p.artisanName && p.artisanName.toLowerCase().includes(queryLower)) {
        suggestions.add(p.artisanName);
      }
    });

    return res.json({
      success: true,
      data: Array.from(suggestions).slice(0, 10)
    });
  } catch (error) {
    console.error(`Suggestions error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error retrieving search suggestions' });
  }
};

// Helper to score product relevance for occasion and uncollected state priority
const scoreProductForOccasion = (p, occasion, uncollectedStates) => {
  let score = 0;
  const name = (p.name || '').toLowerCase();
  const craft = (p.craft || '').toLowerCase();
  const category = (p.category || '').toLowerCase();
  const material = (p.material || '').toLowerCase();
  const state = (p.state || '').toLowerCase().trim();

  // Priority boost for uncollected states
  if (uncollectedStates.includes(state)) {
    score += 20;
  }

  // Occasion specific keyword matching
  if (occasion === 'Wedding') {
    if (name.includes('kanchipuram') || name.includes('mysore') || name.includes('paithani') || name.includes('bridal')) score += 25;
    if (name.includes('tanjore') || name.includes('gold') || name.includes('aranmula') || category.includes('artifacts')) score += 20;
    if (name.includes('pashmina') || name.includes('jewellery') || name.includes('brocade')) score += 15;
  } else if (occasion === 'Festival') {
    if (name.includes('kasavu') || name.includes('muga') || name.includes('kantha') || name.includes('phulkari')) score += 25;
    if (name.includes('valkannadi') || name.includes('tanjore') || craft.includes('pottery')) score += 20;
    if (name.includes('dupatta') || craft.includes('embroidery')) score += 15;
  } else if (occasion === 'Office') {
    if (name.includes('kasavu') || name.includes('linen') || material.includes('cotton') || category.includes('handloom')) score += 25;
    if (name.includes('santiniketan') || name.includes('tote') || name.includes('leather')) score += 20;
    if (name.includes('pashmina') || name.includes('block print') || name.includes('walnut')) score += 15;
  } else if (occasion === 'Casual') {
    if (name.includes('sanganeri') || name.includes('dohar') || name.includes('phulkari') || name.includes('block print')) score += 25;
    if (name.includes('channapatna') || name.includes('blue pottery') || category.includes('handicrafts')) score += 20;
    if (name.includes('tote') || name.includes('pashmina')) score += 15;
  } else if (occasion === 'College') {
    if (name.includes('phulkari') || name.includes('kantha') || name.includes('dupatta') || name.includes('kasuti')) score += 25;
    if (name.includes('santiniketan') || name.includes('tote') || name.includes('walnut')) score += 20;
    if (name.includes('channapatna') || category.includes('accessories')) score += 15;
  } else if (occasion === 'Family Function') {
    if (name.includes('paithani') || name.includes('muga') || name.includes('mysore') || name.includes('brocade')) score += 25;
    if (name.includes('tanjore') || name.includes('aranmula') || name.includes('kantha')) score += 20;
    if (name.includes('pashmina') || name.includes('jewellery') || name.includes('kasavu')) score += 15;
  }

  return score;
};

// @desc    Generate dynamic Heritage Outfit based on occasion and user passport
// @route   GET /api/products/outfit-planner
// @access  Public (Optional auth for passport targeting)
const generateOutfit = async (req, res) => {
  try {
    const occasion = req.query.occasion || 'Wedding';
    const seed = Number(req.query.seed || 0);

    // Fetch all available products in stock
    let products = await Product.find({ availability: { $ne: 'Out of Stock' } });
    if (products.length === 0) {
      products = await Product.find();
    }

    // Check optional Authorization header for user passport uncollected states
    let uncollectedStateNames = [];
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer')) {
        const jwt = require('jsonwebtoken');
        const User = require('../models/User');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'myntraheritagesecretkey12345');
        const user = await User.findById(decoded.id);
        if (user && user.passport?.unlockedStates) {
          const collected = user.passport.unlockedStates.map((s) => s.state.toLowerCase().trim());
          const ALL_STATES = [
            'karnataka', 'kerala', 'tamil nadu', 'rajasthan', 'west bengal',
            'jammu & kashmir', 'punjab', 'gujarat', 'maharashtra', 'odisha',
            'assam', 'madhya pradesh', 'uttar pradesh', 'telangana', 'andhra pradesh',
            'bihar', 'chhattisgarh', 'goa', 'haryana', 'himachal pradesh',
            'jharkhand', 'manipur', 'meghalaya', 'mizoram', 'nagaland',
            'sikkim', 'tripura', 'uttarakhand', 'arunachal pradesh', 'ladakh'
          ];
          uncollectedStateNames = ALL_STATES.filter((st) => !collected.includes(st));
        }
      }
    } catch (e) {
      // ignore guest auth errors
    }

    const occasionMap = {
      Wedding: 0,
      Festival: 1,
      Office: 2,
      Casual: 3,
      College: 4,
      'Family Function': 5,
    };
    const occasionIndex = occasionMap[occasion] !== undefined ? occasionMap[occasion] : 0;

    // Helper to calculate discounted price
    const calcDisc = (p) => (p.discount && p.discount > 0 ? Math.round(p.price - (p.price * p.discount) / 100) : p.price);

    // Score and sort all available products for this occasion
    const scoredProducts = products.map((p) => ({
      product: p,
      score: scoreProductForOccasion(p, occasion, uncollectedStateNames),
    }));

    // Sort descending by score. Add seed variation for shuffles.
    scoredProducts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return 0.5 - Math.random();
    });

    // Apply seed rotation if user requested shuffle
    let pool = scoredProducts.map((sp) => sp.product);
    if (seed > 0) {
      const shift = seed % pool.length;
      pool = [...pool.slice(shift), ...pool.slice(0, shift)];
    }

    const outfit = [];
    const usedIds = new Set();

    // 1. Pick primary garment (Traditional Wear / Handloom / Textiles)
    for (const p of pool) {
      if (usedIds.has(p._id.toString())) continue;
      if (['Traditional Wear', 'Handloom', 'Textiles'].includes(p.category)) {
        outfit.push(p);
        usedIds.add(p._id.toString());
        break;
      }
    }

    // 2. Pick heritage adornment / artifact (Artifacts / Handicrafts / Jewellery)
    for (const p of pool) {
      if (usedIds.has(p._id.toString())) continue;
      if (['Artifacts', 'Handicrafts', 'Jewellery'].includes(p.category)) {
        outfit.push(p);
        usedIds.add(p._id.toString());
        break;
      }
    }

    // 3. Pick accessory (Accessories / Textiles / Home Decor)
    for (const p of pool) {
      if (usedIds.has(p._id.toString())) continue;
      if (['Accessories', 'Textiles', 'Home Decor'].includes(p.category)) {
        outfit.push(p);
        usedIds.add(p._id.toString());
        break;
      }
    }

    // 4. Fill up to 4 items from top remaining scored pool
    for (const p of pool) {
      if (outfit.length >= 4) break;
      if (!usedIds.has(p._id.toString())) {
        outfit.push(p);
        usedIds.add(p._id.toString());
      }
    }

    // Calculate dynamic totals
    const totalPrice = outfit.reduce((sum, item) => sum + calcDisc(item), 0);
    const originalTotalPrice = outfit.reduce((sum, item) => sum + item.price, 0);
    const totalSavings = originalTotalPrice - totalPrice;

    // Dynamic Heritage Summary
    const statesRepresented = Array.from(
      new Set(outfit.map((i) => i.state.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')))
    );

    const craftsIncluded = Array.from(
      new Set(outfit.map((i) => i.craft).filter(Boolean))
    );

    const uncollectedStatesFeatured = Array.from(
      new Set(
        outfit
          .map((i) => i.state.toLowerCase().trim())
          .filter((st) => uncollectedStateNames.includes(st))
          .map((st) => st.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      )
    );

    return res.json({
      success: true,
      occasion,
      data: outfit,
      summary: {
        totalPrice,
        originalTotalPrice,
        totalSavings,
        statesRepresented,
        craftsIncluded,
        uncollectedStatesFeatured,
      },
    });
  } catch (error) {
    console.error(`Generate outfit error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error generating outfit' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getProductStats,
  getSuggestions,
  generateOutfit,
};

