const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60',
    },
    images: {
      type: [String],
      default: [],
    },
    state: {
      type: String,
      required: [true, 'Please specify the Indian State of origin'],
      lowercase: true,
      trim: true,
    },
    craft: {
      type: String,
      required: [true, 'Please specify the artisan craft tradition'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Handloom',
        'Traditional Wear',
        'Jewellery',
        'Handicrafts',
        'Artifacts',
        'Home Decor',
        'Accessories',
        'Textiles',
      ],
    },
    material: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    isGITagged: {
      type: Boolean,
      default: false,
    },
    isEcoFriendly: {
      type: Boolean,
      default: false,
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock'],
      default: 'In Stock',
    },
    // --- Phase 3 Fields ---
    artisanName: {
      type: String,
      trim: true,
      default: 'Local Artisan Cooperative',
    },
    giRegistryNumber: {
      type: String,
      trim: true,
      default: '',
    },
    story: {
      type: String,
      trim: true,
      default: 'This handcrafted product represents generations of artisan craftsmanship and preserves the cultural identity of its region.',
    },
    history: {
      type: String,
      trim: true,
      default: '',
    },
    preparationProcess: {
      type: String,
      trim: true,
      default: '',
    },
    craftingTime: {
      type: String,
      trim: true,
      default: '1-2 weeks',
    },
    careInstructions: {
      type: String,
      trim: true,
      default: 'Handle with care. Dry clean recommended.',
    },
    authenticityDetails: {
      type: String,
      trim: true,
      default: '',
    },
    giCertificateInfo: {
      type: String,
      trim: true,
      default: '',
    },
    rawMaterials: {
      type: String,
      trim: true,
      default: '',
    },
    artisanCommunity: {
      type: String,
      trim: true,
      default: '',
    },
    sizes: {
      type: [String],
      default: ['Free Size'],
    },
    stock: {
      type: Number,
      default: 10,
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
