const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    category: {
      type: String,
      required: true,
      enum: ['plumber', 'electrician', 'carpenter', 'painter', 'cleaner', 'mechanic', 'technician', 'cook', 'gardener', 'other']
    },
    subcategories: [String],
    description: String,
    hourlyRate: { type: Number, required: true },
    experience: { type: Number, required: true }, // in years
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      expiry: Date
    }]
  }],
  availability: {
    schedule: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: String,
      endTime: String,
      isAvailable: { type: Boolean, default: true }
    }],
    emergencyAvailable: { type: Boolean, default: false },
    maxDistance: { type: Number, default: 10 } // in km
  },
  location: {
    current: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0]
      },
      address: String,
      lastUpdated: Date
    },
    serviceAreas: [{
      name: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      radius: Number
    }]
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 }
    }
  },
  gamification: {
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    badges: [{
      name: String,
      description: String,
      earnedAt: Date,
      icon: String
    }],
    streaks: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActivity: Date
    },
    achievements: [{
      title: String,
      description: String,
      earnedAt: Date,
      points: Number
    }]
  },
  pricing: {
    baseRate: { type: Number, required: true },
    surgeMultiplier: { type: Number, default: 1.0 },
    peakHours: [{
      start: String,
      end: String,
      multiplier: Number
    }]
  },
  documents: {
    aadhar: String,
    pan: String,
    bankDetails: {
      accountNumber: String,
      ifsc: String,
      bankName: String
    },
    insurance: {
      provider: String,
      policyNumber: String,
      expiry: Date
    }
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  totalJobs: {
    type: Number,
    default: 0
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  responseTime: {
    average: { type: Number, default: 0 }, // in minutes
    count: { type: Number, default: 0 }
  },
  communityService: {
    isParticipating: { type: Boolean, default: false },
    freeHoursPerMonth: { type: Number, default: 0 },
    usedHours: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Create 2dsphere index on location.current for geospatial queries
expertSchema.index({ 'location.current': '2dsphere' });

// Calculate dynamic pricing
expertSchema.methods.calculateDynamicPrice = function(demandLevel, timeOfDay) {
  let price = this.pricing.baseRate;
  
  // Apply surge pricing based on demand
  price *= this.pricing.surgeMultiplier;
  
  // Apply peak hours multiplier
  const currentHour = new Date().getHours();
  const peakHour = this.pricing.peakHours.find(peak => {
    const start = parseInt(peak.start.split(':')[0]);
    const end = parseInt(peak.end.split(':')[0]);
    return currentHour >= start && currentHour <= end;
  });
  
  if (peakHour) {
    price *= peakHour.multiplier;
  }
  
  return Math.round(price);
};

// Update location
expertSchema.methods.updateLocation = function(lat, lng, address) {
  this.location.current = {
    type: 'Point',
    coordinates: [lng, lat],
    address,
    lastUpdated: new Date()
  };
  return this.save();
};

// Add badge
expertSchema.methods.addBadge = function(badgeName, description, icon) {
  this.gamification.badges.push({
    name: badgeName,
    description,
    icon,
    earnedAt: new Date()
  });
  return this.save();
};

// Update rating
expertSchema.methods.updateRating = function(newRating) {
  const oldCount = this.rating.count;
  const oldAverage = this.rating.average;
  
  this.rating.count += 1;
  this.rating.average = ((oldAverage * oldCount) + newRating) / this.rating.count;
  
  // Update breakdown
  const ratingKey = newRating.toString();
  if (this.rating.breakdown[ratingKey] !== undefined) {
    this.rating.breakdown[ratingKey] += 1;
  }
  
  return this.save();
};

module.exports = mongoose.model('Expert', expertSchema);
