const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true
  },
  service: {
    category: {
      type: String,
      required: true,
      enum: ['plumber', 'electrician', 'carpenter', 'painter', 'cleaner', 'mechanic', 'technician', 'cook', 'gardener', 'other']
    },
    subcategory: String,
    description: {
      type: String,
      required: true
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium'
    },
    estimatedDuration: Number, // in hours
    materials: [{
      name: String,
      quantity: Number,
      cost: Number
    }]
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    landmark: String,
    accessInstructions: String
  },
  scheduling: {
    preferredDate: {
      type: Date,
      required: true
    },
    preferredTime: {
      start: String,
      end: String
    },
    flexible: { type: Boolean, default: false },
    actualStartTime: Date,
    actualEndTime: Date
  },
  pricing: {
    basePrice: { type: Number, required: true },
    surgeMultiplier: { type: Number, default: 1.0 },
    materialsCost: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  tracking: {
    expertLocation: [{
      lat: Number,
      lng: Number,
      timestamp: Date,
      status: String // 'en_route', 'arrived', 'working', 'completed'
    }],
    estimatedArrival: Date,
    actualArrival: Date
  },
  communication: {
    chatMessages: [{
      sender: {
        type: String,
        enum: ['user', 'expert', 'system']
      },
      message: String,
      timestamp: Date,
      type: {
        type: String,
        enum: ['text', 'image', 'voice', 'video']
      }
    }],
    videoCalls: [{
      startTime: Date,
      endTime: Date,
      duration: Number,
      quality: String
    }]
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'upi', 'wallet', 'cash'],
      default: 'upi'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'disputed'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundAmount: Number,
    refundReason: String
  },
  rating: {
    userRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      ratedAt: Date
    },
    expertRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      ratedAt: Date
    }
  },
  warranty: {
    isEligible: { type: Boolean, default: true },
    duration: { type: Number, default: 30 }, // in days
    startDate: Date,
    endDate: Date,
    claims: [{
      description: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected']
      },
      submittedAt: Date,
      resolvedAt: Date
    }]
  },
  emergency: {
    isEmergency: { type: Boolean, default: false },
    emergencyType: String,
    alertSent: { type: Boolean, default: false },
    responseTime: Number // in minutes
  },
  community: {
    isCommunityService: { type: Boolean, default: false },
    discountApplied: { type: Number, default: 0 },
    communityHours: { type: Number, default: 0 }
  },
  aiMatch: {
    confidence: { type: Number, default: 0 },
    factors: [String],
    suggestedAt: Date
  }
}, {
  timestamps: true
});

// Calculate total price
bookingSchema.methods.calculateTotalPrice = function() {
  const basePrice = this.pricing.basePrice * this.pricing.surgeMultiplier;
  const materialsCost = this.pricing.materialsCost;
  const discount = this.pricing.discount;
  
  this.pricing.totalPrice = basePrice + materialsCost;
  this.pricing.finalPrice = this.pricing.totalPrice - discount;
  
  return this.pricing.finalPrice;
};

// Update tracking
bookingSchema.methods.updateTracking = function(lat, lng, status) {
  this.tracking.expertLocation.push({
    lat,
    lng,
    timestamp: new Date(),
    status
  });
  return this.save();
};

// Add chat message
bookingSchema.methods.addMessage = function(sender, message, type = 'text') {
  this.communication.chatMessages.push({
    sender,
    message,
    timestamp: new Date(),
    type
  });
  return this.save();
};

// Start video call
bookingSchema.methods.startVideoCall = function() {
  this.communication.videoCalls.push({
    startTime: new Date(),
    endTime: null,
    duration: 0,
    quality: 'good'
  });
  return this.save();
};

// End video call
bookingSchema.methods.endVideoCall = function() {
  const activeCall = this.communication.videoCalls.find(call => !call.endTime);
  if (activeCall) {
    activeCall.endTime = new Date();
    activeCall.duration = Math.round((activeCall.endTime - activeCall.startTime) / 1000 / 60); // in minutes
  }
  return this.save();
};

// Add warranty claim
bookingSchema.methods.addWarrantyClaim = function(description) {
  this.warranty.claims.push({
    description,
    status: 'pending',
    submittedAt: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('Booking', bookingSchema);
