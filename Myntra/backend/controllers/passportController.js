const User = require('../models/User');
const Product = require('../models/Product');

const TOTAL_INDIA_STATES = 28;

// Helper to define standard milestones
const MILESTONE_DEFINITIONS = [
  {
    milestoneId: 'm1',
    count: 1,
    title: 'First Step',
    reward: '5% Heritage Coupon',
    couponCode: 'HERITAGE5',
  },
  {
    milestoneId: 'm5',
    count: 5,
    title: 'Explorer',
    reward: 'Free Shipping',
    couponCode: 'FREESHIP5',
  },
  {
    milestoneId: 'm10',
    count: 10,
    title: 'Heritage Enthusiast',
    reward: 'Early Access to New Heritage Collections',
    couponCode: 'EARLY10',
  },
  {
    milestoneId: 'm15',
    count: 15,
    title: 'Craft Collector',
    reward: 'Exclusive Heritage Profile Frame',
    couponCode: 'FRAME15',
  },
  {
    milestoneId: 'm20',
    count: 20,
    title: 'Culture Ambassador',
    reward: '10% Heritage Discount Coupon',
    couponCode: 'HERITAGE10',
  },
  {
    milestoneId: 'm28',
    count: 28,
    title: 'Heritage Guardian',
    reward: 'Exclusive Heritage Collection Access & Digital Certificate',
    couponCode: 'GUARDIAN28',
  },
];

// Helper to define collection challenges
const CHALLENGE_DEFINITIONS = [
  {
    id: 'south_india',
    title: 'South India Collection',
    states: ['karnataka', 'kerala', 'tamil nadu', 'andhra pradesh'],
    reward: 'Free Shipping',
    couponCode: 'SOUTHSPEC',
  },
  {
    id: 'north_india',
    title: 'North India Collection',
    states: ['rajasthan', 'punjab', 'jammu & kashmir', 'uttar pradesh', 'himachal pradesh'],
    reward: '10% Heritage Coupon',
    couponCode: 'NORTH10',
  },
  {
    id: 'northeast_explorer',
    title: 'North East Explorer',
    states: ['assam', 'nagaland', 'meghalaya', 'manipur', 'mizoram', 'arunachal pradesh', 'tripura', 'sikkim'],
    reward: 'Exclusive Heritage Badge',
    couponCode: 'NORTHEAST',
  },
  {
    id: 'silk_collection',
    title: 'Silk Collection',
    crafts: ['Mysore Silk', 'Kanchipuram Silk', 'Muga Silk Weaving', 'Patan Patola'],
    reward: 'Craft Collector Badge',
    couponCode: 'SILKMASTER',
  },
];

// @desc    Get logged in user passport data
// @route   GET /api/passport
// @access  Private
const getUserPassport = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let passport = user.passport || {};
    const unlockedStates = passport.unlockedStates || [];
    const collectedCrafts = passport.collectedCrafts || [];
    const earnedBadges = passport.earnedBadges || [];
    const usedCoupons = (passport.usedCoupons || []).map((code) => code.toUpperCase());

    // Unique collected state names (lowercase)
    const collectedStateNames = Array.from(
      new Set(unlockedStates.map((s) => s.state.toLowerCase().trim()))
    );

    const totalStatesCollected = collectedStateNames.length;
    const totalCraftsCollected = collectedCrafts.length;
    const passportProgress = Math.round((totalStatesCollected / TOTAL_INDIA_STATES) * 100);

    // Calculate Milestones state
    const milestones = MILESTONE_DEFINITIONS.map((def) => {
      const isUnlocked = totalStatesCollected >= def.count;
      const existing = (passport.milestones || []).find((m) => m.milestoneId === def.milestoneId);
      const isUsed = usedCoupons.includes(def.couponCode.toUpperCase());
      return {
        milestoneId: def.milestoneId,
        title: def.title,
        reward: def.reward,
        count: def.count,
        couponCode: def.couponCode,
        unlocked: isUnlocked,
        unlockedAt: existing ? existing.unlockedAt : isUnlocked ? new Date() : null,
        isUsed,
      };
    });

    // Calculate Functional Rewards
    const rewardsUnlocked = [];
    milestones.forEach((m) => {
      if (m.unlocked) {
        rewardsUnlocked.push({
          rewardId: m.milestoneId,
          title: m.reward,
          description: `Unlocked by completing ${m.count} state badge${m.count > 1 ? 's' : ''}`,
          couponCode: m.couponCode,
          unlockedAt: m.unlockedAt || new Date(),
          isUsed: m.isUsed,
        });
      }
    });

    // Calculate Collection Challenges progress
    const challenges = CHALLENGE_DEFINITIONS.map((c) => {
      let isCompleted = false;
      let completedItems = 0;
      let totalItems = 0;

      if (c.states) {
        totalItems = c.states.length;
        completedItems = c.states.filter((st) => collectedStateNames.includes(st)).length;
        isCompleted = completedItems === totalItems;
      } else if (c.crafts) {
        totalItems = c.crafts.length;
        const userCraftNames = collectedCrafts.map((cr) => cr.craftName.toLowerCase());
        completedItems = c.crafts.filter((cr) =>
          userCraftNames.some((uc) => uc.includes(cr.toLowerCase()))
        ).length;
        isCompleted = completedItems === totalItems;
      }

      const isUsed = usedCoupons.includes(c.couponCode.toUpperCase());

      return {
        id: c.id,
        title: c.title,
        reward: c.reward,
        couponCode: c.couponCode,
        states: c.states || [],
        crafts: c.crafts || [],
        completedItems,
        totalItems,
        isCompleted,
        isUsed,
      };
    });

    const passportData = {
      unlockedStates,
      collectedCrafts,
      earnedBadges,
      milestones,
      rewardsUnlocked,
      passportProgress,
      totalStatesCollected,
      totalCraftsCollected,
      totalIndiaStates: TOTAL_INDIA_STATES,
      remainingStates: TOTAL_INDIA_STATES - totalStatesCollected,
      challenges,
      unlockHistory: passport.unlockHistory || [],
    };

    return res.json({ success: true, data: passportData });
  } catch (error) {
    console.error(`Get user passport error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error retrieving passport' });
  }
};

// @desc    Get recommendations for uncollected states ("Complete your Heritage Journey")
// @route   GET /api/passport/recommendations
// @access  Private
const getPassportRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const unlockedStates = user?.passport?.unlockedStates || [];
    const collectedStateNames = unlockedStates.map((s) => s.state.toLowerCase().trim());

    // Find products from states user hasn't collected yet
    let recommendedProducts = await Product.find({
      state: { $nin: collectedStateNames },
    }).limit(8);

    // Fallback if user has collected many or DB is small
    if (recommendedProducts.length === 0) {
      recommendedProducts = await Product.find().limit(8);
    }

    return res.json({
      success: true,
      data: recommendedProducts,
      uncollectedStatesCount: TOTAL_INDIA_STATES - collectedStateNames.length,
    });
  } catch (error) {
    console.error(`Get passport recommendations error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error retrieving recommendations' });
  }
};

module.exports = {
  getUserPassport,
  getPassportRecommendations,
};
