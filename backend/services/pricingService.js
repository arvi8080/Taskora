const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

class PricingService {
  // Dynamic pricing calculation
  static calculateDynamicPrice(expertId, serviceCategory, demandLevel, timeOfDay) {
    return new Promise(async (resolve, reject) => {
      try {
        const expert = await Expert.findById(expertId);
        if (!expert) {
          throw new Error('Expert not found');
        }

        let basePrice = expert.pricing.baseRate;
        let surgeMultiplier = 1.0;

        // Demand-based surge pricing
        switch (demandLevel) {
          case 'low':
            surgeMultiplier = 0.8; // 20% discount
            break;
          case 'medium':
            surgeMultiplier = 1.0; // Normal price
            break;
          case 'high':
            surgeMultiplier = 1.3; // 30% surge
            break;
          case 'very_high':
            surgeMultiplier = 1.6; // 60% surge
            break;
          case 'emergency':
            surgeMultiplier = 2.0; // 100% surge for emergency
            break;
        }

        // Time-based pricing
        const currentHour = new Date().getHours();
        const peakHour = expert.pricing.peakHours.find(peak => {
          const start = parseInt(peak.start.split(':')[0]);
          const end = parseInt(peak.end.split(':')[0]);
          return currentHour >= start && currentHour <= end;
        });

        if (peakHour) {
          surgeMultiplier *= peakHour.multiplier;
        }

        // Weekend pricing
        const dayOfWeek = new Date().getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
          surgeMultiplier *= 1.2; // 20% weekend surcharge
        }

        const finalPrice = Math.round(basePrice * surgeMultiplier);

        resolve({
          basePrice,
          surgeMultiplier,
          finalPrice,
          factors: {
            demandLevel,
            timeOfDay,
            isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
            peakHour: !!peakHour
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Update dynamic pricing for all experts
  static async updateDynamicPricing() {
    try {
      const experts = await Expert.find({ isActive: true });
      const demandData = await this.getDemandData();

      for (const expert of experts) {
        const demandLevel = this.calculateDemandLevel(expert._id, demandData);
        expert.pricing.surgeMultiplier = this.getSurgeMultiplier(demandLevel);
        await expert.save();
      }

      console.log('✅ Dynamic pricing updated for all experts');
    } catch (error) {
      console.error('❌ Dynamic pricing update error:', error);
    }
  }

  // Get current demand data
  static async getDemandData() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      // Get recent booking requests
      const recentBookings = await Booking.find({
        createdAt: { $gte: oneHourAgo },
        status: { $in: ['pending', 'accepted'] }
      });

      // Calculate demand by category and location
      const demandByCategory = {};
      const demandByLocation = {};

      recentBookings.forEach(booking => {
        // By category
        if (!demandByCategory[booking.service.category]) {
          demandByCategory[booking.service.category] = 0;
        }
        demandByCategory[booking.service.category]++;

        // By location (city level)
        const city = booking.location.address.split(',')[1]?.trim();
        if (city) {
          if (!demandByLocation[city]) {
            demandByLocation[city] = 0;
          }
          demandByLocation[city]++;
        }
      });

      return {
        byCategory: demandByCategory,
        byLocation: demandByLocation,
        totalRequests: recentBookings.length,
        timestamp: now
      };
    } catch (error) {
      console.error('Get demand data error:', error);
      return { byCategory: {}, byLocation: {}, totalRequests: 0, timestamp: new Date() };
    }
  }

  // Calculate demand level for specific expert
  static calculateDemandLevel(expertId, demandData) {
    try {
      // This is a simplified calculation
      // In a real system, you'd use more sophisticated algorithms
      const totalRequests = demandData.totalRequests;
      
      if (totalRequests < 5) return 'low';
      if (totalRequests < 15) return 'medium';
      if (totalRequests < 30) return 'high';
      return 'very_high';
    } catch (error) {
      return 'medium';
    }
  }

  // Get surge multiplier based on demand level
  static getSurgeMultiplier(demandLevel) {
    const multipliers = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.3,
      'very_high': 1.6,
      'emergency': 2.0
    };
    return multipliers[demandLevel] || 1.0;
  }

  // Calculate subscription discount
  static calculateSubscriptionDiscount(userSubscription, basePrice) {
    const discounts = {
      'free': 0,
      'basic': 0.05, // 5% discount
      'premium': 0.15, // 15% discount
      'enterprise': 0.25 // 25% discount
    };

    const discountRate = discounts[userSubscription.plan] || 0;
    const discountAmount = basePrice * discountRate;
    
    return {
      discountRate,
      discountAmount: Math.round(discountAmount),
      finalPrice: Math.round(basePrice - discountAmount)
    };
  }

  // Calculate community service discount
  static calculateCommunityDiscount(isCommunityService, basePrice) {
    if (!isCommunityService) {
      return {
        discountRate: 0,
        discountAmount: 0,
        finalPrice: basePrice
      };
    }

    // 50% discount for community service
    const discountRate = 0.5;
    const discountAmount = basePrice * discountRate;
    
    return {
      discountRate,
      discountAmount: Math.round(discountAmount),
      finalPrice: Math.round(basePrice - discountAmount)
    };
  }

  // Calculate loyalty discount
  static calculateLoyaltyDiscount(userId, basePrice) {
    return new Promise(async (resolve, reject) => {
      try {
        // Get user's booking history
        const userBookings = await Booking.find({
          user: userId,
          status: 'completed'
        });

        const totalBookings = userBookings.length;
        let discountRate = 0;

        // Loyalty tiers
        if (totalBookings >= 50) {
          discountRate = 0.2; // 20% for 50+ bookings
        } else if (totalBookings >= 20) {
          discountRate = 0.15; // 15% for 20+ bookings
        } else if (totalBookings >= 10) {
          discountRate = 0.1; // 10% for 10+ bookings
        } else if (totalBookings >= 5) {
          discountRate = 0.05; // 5% for 5+ bookings
        }

        const discountAmount = basePrice * discountRate;
        
        resolve({
          discountRate,
          discountAmount: Math.round(discountAmount),
          finalPrice: Math.round(basePrice - discountAmount),
          loyaltyTier: this.getLoyaltyTier(totalBookings)
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get loyalty tier
  static getLoyaltyTier(totalBookings) {
    if (totalBookings >= 50) return 'platinum';
    if (totalBookings >= 20) return 'gold';
    if (totalBookings >= 10) return 'silver';
    if (totalBookings >= 5) return 'bronze';
    return 'new';
  }

  // Calculate total price with all discounts
  static async calculateTotalPrice(expertId, serviceCategory, userId, isCommunityService = false) {
    try {
      const demandData = await this.getDemandData();
      const demandLevel = this.calculateDemandLevel(expertId, demandData);
      
      // Get base dynamic price
      const dynamicPricing = await this.calculateDynamicPrice(
        expertId,
        serviceCategory,
        demandLevel,
        new Date().getHours()
      );

      let finalPrice = dynamicPricing.finalPrice;
      let appliedDiscounts = [];

      // Apply subscription discount
      const user = await require('../models/User').findById(userId);
      if (user && user.subscription) {
        const subDiscount = this.calculateSubscriptionDiscount(user.subscription, finalPrice);
        if (subDiscount.discountAmount > 0) {
          finalPrice = subDiscount.finalPrice;
          appliedDiscounts.push({
            type: 'subscription',
            amount: subDiscount.discountAmount,
            rate: subDiscount.discountRate
          });
        }
      }

      // Apply community service discount
      if (isCommunityService) {
        const communityDiscount = this.calculateCommunityDiscount(true, finalPrice);
        finalPrice = communityDiscount.finalPrice;
        appliedDiscounts.push({
          type: 'community',
          amount: communityDiscount.discountAmount,
          rate: communityDiscount.discountRate
        });
      }

      // Apply loyalty discount
      const loyaltyDiscount = await this.calculateLoyaltyDiscount(userId, finalPrice);
      if (loyaltyDiscount.discountAmount > 0) {
        finalPrice = loyaltyDiscount.finalPrice;
        appliedDiscounts.push({
          type: 'loyalty',
          amount: loyaltyDiscount.discountAmount,
          rate: loyaltyDiscount.discountRate,
          tier: loyaltyDiscount.loyaltyTier
        });
      }

      return {
        basePrice: dynamicPricing.basePrice,
        surgeMultiplier: dynamicPricing.surgeMultiplier,
        finalPrice,
        appliedDiscounts,
        pricingBreakdown: {
          demandLevel,
          factors: dynamicPricing.factors,
          totalDiscount: appliedDiscounts.reduce((sum, discount) => sum + discount.amount, 0)
        }
      };
    } catch (error) {
      console.error('Calculate total price error:', error);
      throw error;
    }
  }
}

module.exports = PricingService;

