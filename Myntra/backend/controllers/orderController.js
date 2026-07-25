const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      couponApplied
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Verify coupon is not already used
    if (couponApplied) {
      const user = await User.findById(req.user._id);
      if (user && user.passport && user.passport.usedCoupons && user.passport.usedCoupons.includes(couponApplied.toUpperCase())) {
        return res.status(400).json({ success: false, message: 'This coupon has already been used on a previous order.' });
      }
    }

    // Verify stock and decrement
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.name}. Available: ${product.stock}, Requested: ${item.qty}`
        });
      }
    }

    // Decrement stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.qty;
      if (product.stock <= 0) {
        product.stock = 0;
        product.availability = 'Out of Stock';
      }
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      couponApplied
    });

    const createdOrder = await order.save();

    // Process Fashion Passport badge unlocks
    const newlyUnlockedStates = [];
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        if (!user.passport) {
          user.passport = {
            unlockedStates: [],
            collectedCrafts: [],
            earnedBadges: [],
            milestones: [],
            rewardsUnlocked: [],
            passportProgress: 0,
            totalStatesCollected: 0,
            totalCraftsCollected: 0,
            unlockHistory: [],
          };
        }

        const existingStateNames = (user.passport.unlockedStates || []).map((s) =>
          s.state.toLowerCase().trim()
        );

        for (const item of orderItems) {
          const prod = await Product.findById(item.product);
          if (prod && prod.state) {
            const cleanState = prod.state.toLowerCase().trim();
            const cleanCraft = prod.craft || 'Handicrafts';

            // Always record craft if not already added
            const craftExists = (user.passport.collectedCrafts || []).some(
              (c) => c.craftName.toLowerCase() === cleanCraft.toLowerCase() && c.state.toLowerCase() === cleanState
            );
            if (!craftExists) {
              user.passport.collectedCrafts.push({
                craftName: cleanCraft,
                state: cleanState,
                productPurchased: prod.name,
                purchaseDate: new Date(),
              });
            }

            // Check if state is newly unlocked
            if (!existingStateNames.includes(cleanState) && !newlyUnlockedStates.some((s) => s.state === cleanState)) {
              existingStateNames.push(cleanState);
              user.passport.unlockedStates.push({
                state: cleanState,
                craft: cleanCraft,
                unlockedAt: new Date(),
                productId: prod._id,
                productName: prod.name,
              });

              user.passport.earnedBadges.push({
                state: cleanState,
                craft: cleanCraft,
                unlockedAt: new Date(),
              });

              user.passport.unlockHistory.push({
                state: cleanState,
                craft: cleanCraft,
                productName: prod.name,
                date: new Date(),
              });

              newlyUnlockedStates.push({
                state: cleanState,
                craft: cleanCraft,
                productName: prod.name,
              });
            }
          }
        }

        // Recalculate stats
        const uniqueStatesCount = new Set(
          (user.passport.unlockedStates || []).map((s) => s.state.toLowerCase().trim())
        ).size;

        // Save the used coupon code
        if (couponApplied) {
          if (!user.passport.usedCoupons) {
            user.passport.usedCoupons = [];
          }
          if (!user.passport.usedCoupons.includes(couponApplied.toUpperCase())) {
            user.passport.usedCoupons.push(couponApplied.toUpperCase());
          }
        }

        user.passport.totalStatesCollected = uniqueStatesCount;
        user.passport.totalCraftsCollected = (user.passport.collectedCrafts || []).length;
        user.passport.passportProgress = Math.round((uniqueStatesCount / 28) * 100);

        await user.save();
      }
    } catch (passportErr) {
      console.error('Passport update error:', passportErr.message);
    }

    return res.status(201).json({
      success: true,
      data: createdOrder,
      newlyUnlockedStates,
    });
  } catch (error) {
    console.error(`Create order error: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error(`Get my orders error: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorize: check if admin or if the order belongs to the logged-in user
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error(`Get order by ID error: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById
};
