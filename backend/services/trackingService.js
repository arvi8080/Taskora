const Expert = require('../models/Expert');
const Booking = require('../models/Booking');
const { io } = require('../server');

class TrackingService {
  // Update expert location in real-time
  static async updateExpertLocation(expertId, locationData) {
    try {
      const expert = await Expert.findById(expertId);
      if (!expert) {
        throw new Error('Expert not found');
      }

      // Update expert's current location
      await expert.updateLocation(
        locationData.lat,
        locationData.lng,
        locationData.address
      );

      // Find active bookings for this expert
      const activeBookings = await Booking.find({
        expert: expertId,
        status: { $in: ['accepted', 'in_progress'] }
      }).populate('user', 'name phone');

      // Update tracking for each active booking
      for (const booking of activeBookings) {
        await booking.updateTracking(
          locationData.lat,
          locationData.lng,
          this.getTrackingStatus(booking.status)
        );

        // Emit real-time location update to user
        io.to(booking.user._id.toString()).emit('expert-location-update', {
          bookingId: booking._id,
          expertLocation: {
            lat: locationData.lat,
            lng: locationData.lng,
            address: locationData.address,
            timestamp: new Date()
          },
          estimatedArrival: await this.calculateETA(
            locationData,
            booking.location.coordinates,
            expert
          )
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Location update error:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate ETA based on current location and destination
  static async calculateETA(currentLocation, destination, expert) {
    try {
      // Simple distance-based ETA calculation
      const distance = this.calculateDistance(currentLocation, destination);
      
      // Assume average speed of 30 km/h in city traffic
      const averageSpeed = 30; // km/h
      const etaMinutes = Math.round((distance / averageSpeed) * 60);
      
      return new Date(Date.now() + etaMinutes * 60000);
    } catch (error) {
      console.error('ETA calculation error:', error);
      return new Date(Date.now() + 30 * 60000); // Default 30 minutes
    }
  }

  // Get tracking status based on booking status
  static getTrackingStatus(bookingStatus) {
    const statusMap = {
      'accepted': 'en_route',
      'in_progress': 'working',
      'completed': 'completed'
    };
    return statusMap[bookingStatus] || 'en_route';
  }

  // Calculate distance between two points
  static calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(point2.lat - point1.lat);
    const dLon = this.deg2rad(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Start tracking for a booking
  static async startTracking(bookingId) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate('expert', 'location')
        .populate('user', 'name phone');

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Initialize tracking data
      booking.tracking = {
        expertLocation: [],
        estimatedArrival: null,
        actualArrival: null
      };

      await booking.save();

      // Notify user that tracking has started
      io.to(booking.user._id.toString()).emit('tracking-started', {
        bookingId: booking._id,
        expertName: booking.expert.user.name,
        estimatedArrival: booking.tracking.estimatedArrival
      });

      return { success: true };
    } catch (error) {
      console.error('Start tracking error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get tracking history for a booking
  static async getTrackingHistory(bookingId) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate('expert', 'user')
        .populate('user', 'name');

      if (!booking) {
        throw new Error('Booking not found');
      }

      return {
        success: true,
        tracking: {
          history: booking.tracking.expertLocation,
          estimatedArrival: booking.tracking.estimatedArrival,
          actualArrival: booking.tracking.actualArrival,
          status: this.getTrackingStatus(booking.status)
        }
      };
    } catch (error) {
      console.error('Get tracking history error:', error);
      return { success: false, error: error.message };
    }
  }

  // Emergency location sharing
  static async shareEmergencyLocation(userId, locationData) {
    try {
      // Find nearby experts for emergency
      const nearbyExperts = await Expert.find({
        'location.current': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [locationData.lng, locationData.lat]
            },
            $maxDistance: 5000 // 5km radius for emergency
          }
        },
        'availability.emergencyAvailable': true,
        isOnline: true
      }).populate('user', 'name phone');

      // Send emergency alert to nearby experts
      const emergencyAlert = {
        userId,
        location: locationData,
        timestamp: new Date(),
        type: 'emergency'
      };

      nearbyExperts.forEach(expert => {
        io.to(expert.user._id.toString()).emit('emergency-alert', emergencyAlert);
      });

      return {
        success: true,
        expertsNotified: nearbyExperts.length,
        experts: nearbyExperts.map(e => ({
          id: e._id,
          name: e.user.name,
          phone: e.user.phone,
          distance: this.calculateDistance(
            locationData,
            e.location.current
          )
        }))
      };
    } catch (error) {
      console.error('Emergency location sharing error:', error);
      return { success: false, error: error.message };
    }
  }

  // Live location sharing for ongoing service
  static async shareLiveLocation(bookingId, locationData) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate('user', 'name')
        .populate('expert', 'user');

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Update expert location
      await this.updateExpertLocation(booking.expert._id, locationData);

      // Send live location to user
      io.to(booking.user._id.toString()).emit('live-location-update', {
        bookingId: booking._id,
        expertLocation: locationData,
        timestamp: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('Live location sharing error:', error);
      return { success: false, error: error.message };
    }
  }

  // Geofencing for arrival detection
  static async checkArrival(bookingId, expertLocation) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      const distance = this.calculateDistance(
        expertLocation,
        booking.location.coordinates
      );

      // If expert is within 100 meters of destination
      if (distance <= 0.1) {
        booking.tracking.actualArrival = new Date();
        booking.status = 'in_progress';
        await booking.save();

        // Notify user of arrival
        io.to(booking.user._id.toString()).emit('expert-arrived', {
          bookingId: booking._id,
          timestamp: new Date()
        });

        return { arrived: true, distance };
      }

      return { arrived: false, distance };
    } catch (error) {
      console.error('Arrival check error:', error);
      return { arrived: false, error: error.message };
    }
  }
}

module.exports = TrackingService;

