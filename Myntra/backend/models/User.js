const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    passport: {
      unlockedStates: [
        {
          state: { type: String, required: true },
          craft: { type: String },
          unlockedAt: { type: Date, default: Date.now },
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          productName: { type: String },
        },
      ],
      collectedCrafts: [
        {
          craftName: { type: String, required: true },
          state: { type: String, required: true },
          productPurchased: { type: String },
          purchaseDate: { type: Date, default: Date.now },
        },
      ],
      earnedBadges: [
        {
          state: String,
          craft: String,
          unlockedAt: { type: Date, default: Date.now },
        },
      ],
      milestones: [
        {
          milestoneId: String,
          title: String,
          reward: String,
          unlocked: Boolean,
          unlockedAt: Date,
        },
      ],
      rewardsUnlocked: [
        {
          rewardId: String,
          title: String,
          description: String,
          couponCode: String,
          unlockedAt: { type: Date, default: Date.now },
        },
      ],
      passportProgress: { type: Number, default: 0 },
      totalStatesCollected: { type: Number, default: 0 },
      totalCraftsCollected: { type: Number, default: 0 },
      unlockHistory: [
        {
          state: String,
          craft: String,
          productName: String,
          date: { type: Date, default: Date.now },
        },
      ],
      usedCoupons: [
        { type: String }
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
